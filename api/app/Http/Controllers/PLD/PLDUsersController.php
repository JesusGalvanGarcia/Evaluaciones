<?php

namespace App\Http\Controllers\PLD;

use App\Http\Controllers\Controller;
use App\Models\UserEvaluation;
use App\Models\User;
use App\Models\Files;
use App\Models\Process;
use App\Models\Test;
use App\Models\UserAnswer;
use App\Models\UserTest;
use App\Models\UserTestModule;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;
use App\Services\Evaluations\UserService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Type\Integer;
class PLDUsersController extends Controller
{
    private $prefix = 'PLDUser';

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        try{
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $user_tests = UserEvaluation::select(
                'user_evaluations.id as user_evaluation_id',
                'user_evaluations.evaluation_id',
                'user_evaluations.user_id as collaborator_id',
                DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"),
                'evaluations.name as evaluation_name',
                'tests.name as test_name', 
                'tests.start_date as start_date', 
                'tests.end_date as end_date', 
                'user_evaluations.finish_date',
                'status.description as status',
                'user_tests.id as user_test_id',
                'user_tests.total_score',
                'user_tests.attempts'
            )
                ->from('user_evaluations')
                ->join('users', 'user_evaluations.user_id', '=', 'users.id')
                ->join('evaluations', 'user_evaluations.evaluation_id', '=', 'evaluations.id')
                ->join('tests', 'user_evaluations.evaluation_id', '=', 'tests.evaluation_id') 
                ->join('status', function ($join) {
                    $join->on('user_evaluations.status_id', '=', 'status.status_id')
                        ->where('status.table_name', '=', 'user_evaluations');
                })
                ->leftJoin('user_tests', 'user_evaluations.id', '=', 'user_tests.user_evaluation_id')
                ->where([
                ['user_evaluations.user_id', '=', request('user_id')],
                ['user_evaluations.evaluation_id', '=', 2],
                ['user_tests.attempts', '=', DB::raw('user_evaluations.actual_attempt')],
                ['user_tests.test_id', '=', DB::raw('tests.id')]] )// Agrega la nueva condición aquí
                ->get();
            
            

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',
              
                'test'=>$user_tests
            ]);

        }catch(Exception $e)
        {
           return $e;
        }
    }
    public function saveAnswerPLD(Request $request)
    {

        try {
     
            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P001'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_answer_id' => 'Nullable|Integer|NotIn:0|Min:0',
                'question_id' => 'Required|Integer|NotIn:0|Min:0',
                'answer_id' => 'Required|Integer|NotIn:0|Min:0',
                'score' => 'Required|Integer',
                'attempts'=>'Required|Integer',
                'its_over' => 'Required|In:si,no',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X602'
                ], 400);

            //Se valida el estado de la prueba
         
            $user_test = UserTest::whereIn('status_id', [1, 2,3])->find($request->user_test_id);
    
            if($user_test->finish_date != null)
            {
                return response()->json([
                    'title' => 'Este examen  ya fue contestado',
                    'message' => 'Este  examen ya fue contestado',
                    'code' => $this->prefix . 'X602PLD'
                ], 400);
            }

          //Aqui validar que el usuario este en la fecha indicada
          /*  if (!$$user_test)
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X603'
                ], 400);*/

            // Se iguala el score actual de la prueba
            $total_score = $user_test->total_score;
           
            DB::beginTransaction();
       
            // Se consulta la ultima pregunta respondida del usuario en caso de que se tenga
            $last_user_answer = UserAnswer::where([
                ['user_test_id', $request->user_test_id],
                ['question_id', $request->question_id],
                ['attempt', $request->attempts],
          
            ])->first();
         
            if ($last_user_answer) {

                if ($last_user_answer->answer_id != $request->answer_id) {

                    $last_user_answer->delete();
                    // Si  se tenia respuesta guardada de la pregunta se celimina y crea una nueva
                    $userAnswer = new UserAnswer();
                    $userAnswer->user_test_id = $request->user_test_id;
                    $userAnswer->question_id = $request->question_id;
                    $userAnswer->answer_id = $request->answer_id;
                    $userAnswer->attempt = (int)$request->attempts;
                    $userAnswer->save();
               
                }

                $total_score -= (int)$last_user_answer->answer->score;
            } else {
              
                // Si no se tenia respuesta guardada de la pregunta se crea
                
              /*  UserAnswer::create([
                    'user_test_id' => $request->user_test_id,
                    'question_id' => $request->question_id,
                    'answer_id' => $request->answer_id,
                    'attempt', (int)$request->attempts
                ])*/
                $userAnswer = new UserAnswer();
                $userAnswer->user_test_id = $request->user_test_id;
                $userAnswer->question_id = $request->question_id;
                $userAnswer->answer_id = $request->answer_id;
                $userAnswer->attempt = (int)$request->attempts;
                $userAnswer->save();
            }

            $total_score += (int)$request->score;
            $actual_status=2;
            $date =null;
            $idLid=0;
            $idTest=0;
            $attempt_evaluation=(int)$request->attempts;
            if($request->its_over == 'si')  //Si es la ultima pregunta de la evaluacion
            {
                $test= Test::find($user_test->test_id);
                 $idTest=$test->id;
                $user_evaluation  = UserEvaluation::find($user_test->user_evaluation_id);
                $idLid=$user_evaluation->responsable_id;
                if($total_score >=$test->min_score) //si el total score actual es mayor o igual al minimo para acreditar
                {
                 $date=Carbon::now()->format('Y-m-d') ; //Si acredito entonces preparar los datos para enviar
                 $actual_status=3;
                 $user = User::find($request->user_id);
                 $userLid= User::find($idLid);
                 $files = Files::where('user_id', $request->user_id)
                 ->where('test_id', $idTest)
                 ->first(); //Buscar el archivo del certificado para enviarlo 
                  //Enviar certificado
                 TestService::sendCertificateMail($user->name,$user->email,$userLid->email,$files->path,$files->name);
                }
             else{
                if($user_evaluation->actual_attempt==$test->max_attempts) // si  los intentos se acabaron (llegan al tope) se marca como terminada y no aunmentan intentos
                {
                    $actual_status=3;
                    $date=Carbon::now()->format('Y-m-d');
                }
                else{
                    $attempt_evaluation=$attempt_evaluation+1; // si no, se aumenta un intento
                    $actual_status=1;

                }
                 }
                $user_evaluation->update([
                    'status_id' =>  $actual_status,
                    'actual_attempt'=>$attempt_evaluation,
                    'finish_date' => $date,

                ]);
         
            }
            
            $user_test->update([
                'status_id' => $request->its_over == 'si' ? 3 : 2,
                'attempts'=>$request->attempts ,
                'finish_date' => $request->its_over == 'si' ? Carbon::now()->format('Y-m-d') : null,
                'total_score' => $total_score,
                'updated_by' => $request->user_id
            ]);
            
            $clasification = TestService::getClasification($total_score);

      
       
            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuesta guardada correctamente',
                'actual_score' => $total_score,
                'clasification' => $clasification
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X699'
            ], 500);
        }
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showExams(Request $request)
    {
      
        $user_test2 = UserEvaluation::select(
            'user_evaluations.id as user_evaluation_id',
            'user_evaluations.evaluation_id',
            'user_evaluations.user_id as collaborator_id',
            DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"),
            'evaluations.name as evaluation_name',
            'tests.name as test_name', 
            'tests.start_date as start_date', 
            'tests.end_date as end_date', 
            'user_evaluations.finish_date',
            'status.description as status',
            'user_tests.id as user_test_id',
            'user_tests.total_score',
            'user_tests.attempts'
        )
        ->from('user_evaluations')
        ->join('users', 'user_evaluations.user_id', '=', 'users.id')
        ->join('evaluations', 'user_evaluations.evaluation_id', '=', 'evaluations.id')
        ->join('tests', 'user_evaluations.evaluation_id', '=', 'tests.evaluation_id') 
        ->join('status', function ($join) {
            $join->on('user_evaluations.status_id', '=', 'status.status_id')
                ->where('status.table_name', '=', 'user_evaluations');
        })
        ->leftJoin('user_tests', 'user_evaluations.id', '=', 'user_tests.user_evaluation_id')
        ->where([
            ['user_evaluations.evaluation_id', '=', 2],
            ['user_tests.attempts', '=', DB::raw('user_evaluations.actual_attempt')],
            ['user_tests.test_id', '=', DB::raw('tests.id')],
            ['user_tests.test_id', '=', $request->test_id] // Nueva condición para filtrar cuando test_id sea 101
        ])
        ->get();
     
        $test = Test::find($request->test_id);

        if ($user_test2->count() == 0) {
            // Create a default UserTest instance with additional properties
            $user_test = new UserTest(); 
            $user_test->max_attempts = $test->max_attempts;
            $user_test->min_score = $test->min_score;
            $user_test->detalle = false; // Set detalle to false for the default case
            $user_test2->push($user_test);
        } else {
            // Set detalle to true and update max_attempts and min_score for each item in $user_test2
            $user_test2->each(function ($item) use ($test) {
                $item->detalle = true;
                $item->max_attempts = $test->max_attempts;
                $item->min_score = $test->min_score;
            });
        }
        
        
        

        return response()->json([
            'title' => 'Proceso terminado',
            'message' => 'Examenes consultados correctamente',
          
            'test'=>$user_test2
        ]);
    }
    public function show(string $user_evaluation_id)
    {
        //
        try{ //Traer los datos del detalle de examen
        
            $user_test2 = UserTest::select(
                'user_tests.*',
                'tests.max_attempts',
                'tests.max_score',
                'tests.min_score',
          
                DB::raw('(SELECT COUNT(*) FROM user_answers 
                INNER JOIN answers ON user_answers.answer_id = answers.id
                WHERE user_answers.user_test_id = user_tests.id 
                AND answers.score > 0 AND user_answers.deleted_at IS NULL) as correct_answers_count')
            )
            ->leftJoin('tests', 'user_tests.test_id', '=', 'tests.id')
            ->where('user_evaluation_id', $user_evaluation_id)
            ->whereNotNull('finish_date')
            ->get();
            if ($user_test2->count() == 0) {
                // Create a default UserTest instance with additional properties
                $userTest = UserTest::where('user_evaluation_id', $user_evaluation_id)->first();
                $test= Test::find($userTest->test_id);
               
                $user_test = new UserTest();
                $user_test->max_attempts = $test->max_attempts;
                $user_test->min_score = $test->min_score;
                $user_test->total_score = 0;
                $user_test->detalle = false;
                $user_test2->push($user_test);
            } else {
    
                $user_test2->each(function ($item) {
                    $item->detalle = true;
                });
                
            
            }
            
            
            return $user_test2;
    

        return response()->json([
            'title' => 'Proceso terminado',
            'message' => 'Examenes consultados correctamente',
          
            'test'=>$user_test2
        ]);

    }catch(Exception $e)
    {
       return $e;
    }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }
    public function getExam(string $id)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
