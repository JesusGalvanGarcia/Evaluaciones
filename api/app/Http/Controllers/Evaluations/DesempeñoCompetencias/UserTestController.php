<?php

namespace App\Http\Controllers\Evaluations\DesempeñoCompetencias;


use App\Http\Controllers\Controller;
use App\Models\UserAgreement;
use App\Models\User;
use App\Models\Files;
use App\Models\Process;
use App\Models\Test;
use App\Models\FinishEvaluation;
use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\ActionPlanParameter;
use App\Models\ActionPlanSignature;
use App\Models\UserActionPlan;
use App\Models\UserAnswer;
use App\Models\UserEvaluation;
use App\Models\UserTest;
use App\Models\Answer;
use App\Models\Question;
use App\Models\UserTestModule;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;
use App\Services\Evaluations\UserService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserTestController extends Controller
{
    private $prefix = 'UserTest';

    public function index()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
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
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X201'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);

            // Se valida si el usuario tiene asignada la prueba y si existe.
            $user_test = UserTest::find($id);

            if (!$user_test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X203'
                ], 400);

            // Se consulta la prueba que tiene asignada el usuario y se valida que exista

            $test = Test::select(
                'id',
                'evaluation_id',
                'name',
                'introduction_text',
                'max_score',
                'min_score',
                'modular'
            )
                ->with([
                    'test_modules' => function ($query) use ($id) {
                        $query->select(
                            'id',
                            'name',
                            'test_id',
                            DB::raw("(SELECT note FROM user_test_modules UTM WHERE UTM.user_test_id = $id AND UTM.module_id = test_modules.id AND deleted_at IS NULL) AS 'note'"),
                            DB::raw("(SELECT average FROM user_test_modules UTM WHERE UTM.user_test_id = $id AND UTM.module_id = test_modules.id AND deleted_at IS NULL) AS 'average'")

                        );

                        $query->with([
                            'questions' => function ($query) use ($id) {
                                $query->select('id', 'description', 'score', 'module_id');

                                $query->with([
                                    'answers' => function ($query) use ($id) {
                                        $query->select(
                                            'id',
                                            'description',
                                            'score',
                                            'question_id',

                                            DB::raw("(SELECT id from user_answers UA where user_test_id = $id AND UA.question_id = answers.question_id AND UA.answer_id = answers.id AND deleted_at is null) as 'user_answer_id'")
                                        )
                                            ->orderBy('score', 'desc');
                                    }
                                ]);
                            }
                        ]);
                    }
                ])
                ->find($user_test->test_id);
            //ir por permiso de andministradores
            $permisses = ['Acceso Administracion desempeno', 'Acceso Administracion 360'];
            $permisses = ['Acceso Administracion desempeno', 'Acceso Administracion 360'];
            $user_evaluation = UserEvaluation::where('id', $user_test->user_evaluation_id)->first();
            // revisar si el user_id recibido es de algun administrador
            $userPermission = UserService::checkUserPermisseArray($permisses, $user);

            $userPermission = UserService::checkUserPermisseArray($permisses, $user);

            // si no pertenece a ningun administrador, ni al responsable ni al evaluado no lo dejes pasarwq
            if (!$userPermission && $user_evaluation->responsable_id != request('user_id') && $user_evaluation->user_id != request('user_id'))
                return response()->json([
                    'title' => 'Consulta Cancelada ',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);
            if (!$userPermission && $user_evaluation->responsable_id != request('user_id') && $user_evaluation->user_id != request('user_id'))
                return response()->json([
                    'title' => 'Consulta Cancelada ',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);
            if ($user_evaluation->status_id == 1)
                $user_evaluation->update([
                    'status_id' => 2
                ]);

            $user_evaluated = $user_evaluation?->user;
            $evaluationType = '';

            switch ($user_evaluation?->type_evaluator_id) {
                case 1:
                    $evaluationType = "Lider";
                    break;
                case 2:
                    $evaluationType = "Autoevaluacion";
                    break;
                case 3:
                    $evaluationType = "Cliente";
                    break;
                case 4:
                    $evaluationType = "Lateral";
                    break;
                case 5:
                    $evaluationType = "Colaborador";
                    break;
                    // Puedes agregar más casos según tus necesidades
                default:
                    // Acción por defecto si el tipo no coincide con ningún caso
                    break;
            }
            if (!$test)
                return response()->json([
                    'title' => 'Prueba no encontrada',
                    'message' => 'Verifica la información.',
                    'code' => $this->prefix . 'X204'
                ], 400);

            $clasification = TestService::getClasification($user_test->total_score);

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba del usuario consultado correctamente',
                'evaluated_user_name' => $user_evaluated?->name . ' ' . $user_evaluated?->father_last_name . ' ' . $user_evaluated?->mother_last_name,
                'test' => $test,
                'score' => $user_test->total_score,
                'clasification' => $clasification,
                'user_test' => $user_test,
                'tipo' => $evaluationType,
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }
    public function saveAverage(Request $request)
    {

        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P007'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
                'module_id' => 'Nullable|Integer|NotIn:0|Min:0',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X701'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X702'
                ], 400);



            DB::beginTransaction();
            // Calculate average score
            $questions = Question::where('module_id',  $request->module_id)->get();
            $sum = 0;
            $count = 0;
            foreach ($questions as $question) {
                $userAnswer = UserAnswer::where([
                    ['user_test_id', $request->user_test_id],
                    ['question_id',  $question->id]
                ])->first();
                $answer = Answer::where('id', $userAnswer->answer_id)->first();
                $count++;
                $sum = $sum + $answer->score;
            }

            $average = round($sum / $count, 2);

            // Retrieve user test module
            $user_test_module = UserTestModule::where([
                ['user_test_id', $request->user_test_id],
                ['module_id',  $request->module_id]
            ])->first();

            if ($user_test_module) {
                $user_test_module->update([
                    'average' =>  $average
                ]);
            } else {
                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $request->module_id,
                    'average' =>  $average
                ]);
            }

            DB::commit();


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Promedio guardado correctamente',
                'average' =>  $average
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X799'
            ], 500);
        }
    }
    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }

    public function saveAnswers(Request $request)
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
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X501'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X502'
                ], 400);

            //Se valida el estado de la evaluación
            if (!UserTest::whereIn('status_id', [1, 2])->find($request->user_test_id))
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X503'
                ], 400);

            $total_score = 0;

            DB::beginTransaction();

            foreach ($request->modules as $module) {

                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $module['id'],
                    'note' => $module['note']
                ]);

                foreach ($module['answers'] as $answer) {

                    UserAnswer::create([
                        'user_test_id' => $request->user_test_id,
                        'question_id' => $answer['question_id'],
                        'answer_id' => $answer['id']
                    ]);

                    $total_score += $answer['score'];
                }
            }

            UserTest::find($request->user_test_id)->update([
                'status_id' => 3,
                'finish_date' => Carbon::now()->format('Y-m-d'),
                'total_score' => $total_score,
                'updated_by' => $request->user_id
            ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuestas guardadas correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X599'
            ], 500);
        }
    }

    public function saveAnswer(Request $request)
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
            $user_test = UserTest::whereIn('status_id', [1, 2])->find($request->user_test_id);

            if (!$user_test)
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no es valida o ya ha sido resuelta.',
                    'code' => $this->prefix . 'X603'
                ], 400);
            if ($user_test->user_evaluation->responsable_id != $request->user_id)
                return response()->json([
                    'title' => 'Prueba Invalida',
                    'message' => 'Está prueba no te corresponde contestarla.',
                    'code' => $this->prefix . 'X603'
                ], 400);
            // Se iguala el score actual de la prueba
            $total_score = $user_test->total_score;

            DB::beginTransaction();

            // Se consulta la ultima pregunta respondida del usuario en caso de que se tenga
            $last_user_answer = UserAnswer::where([
                ['user_test_id', $request->user_test_id],
                ['question_id', $request->question_id],
            ])->first();

            if ($last_user_answer) {

                if ($last_user_answer->answer_id != $request->answer_id) {

                    $last_user_answer->delete();

                    // Si no se tenia respuesta guardada de la pregunta se crea
                    UserAnswer::create([
                        'user_test_id' => $request->user_test_id,
                        'question_id' => $request->question_id,
                        'answer_id' => $request->answer_id
                    ]);
                }

                $total_score -= (int)$last_user_answer->answer->score;
            } else {

                // Si no se tenia respuesta guardada de la pregunta se crea
                UserAnswer::create([
                    'user_test_id' => $request->user_test_id,
                    'question_id' => $request->question_id,
                    'answer_id' => $request->answer_id
                ]);
            }

            $total_score += (int)$request->score;

            $user_test->update([
                'status_id' => $request->its_over == 'si' ? 3 : 2,
                'finish_date' => $request->its_over == 'si' ? Carbon::now()->format('Y-m-d') : null,
                'total_score' => $total_score,
                'updated_by' => $request->user_id
            ]);

            $clasification = TestService::getClasification($total_score);

            if ($request->its_over == 'si') {

                $user_evaluation  = UserTest::find($user_test->id)->user_evaluation;

                $user_evaluation->update(
                    [
                        'status_id' => 2,
                        'finish_date' => Carbon::now()->format('Y-m-d'),
                        'process_id' => $user_evaluation->process_id == 12 ? 13 : 14,
                    ]
                );
                $answers = [];
                // Traer los UserTestModules por el user_test_id, ordenarlos y tomar los primeros dos
                $user_test_modules = UserTestModule::select('user_test_modules.id', 'user_test_modules.average', 'user_test_modules.user_test_id','user_test_modules.module_id')
                    ->where('user_test_modules.user_test_id', $user_test->id)
                    ->orderBy('user_test_modules.average', 'asc')
                    ->take(2)
                    ->get();
             
                foreach ($user_test_modules as $item) {
                    //Traer las preguntas y respuestas cuyo score sea menor a 3
                    $answers = UserAnswer::join('questions as Q', 'Q.id', '=', 'user_answers.question_id')
                        ->join('answers as A', 'A.id', '=', 'user_answers.answer_id')
                        ->select('user_answers.id', 'user_answers.question_id', 'user_answers.answer_id', 'A.score as answer_score', 'Q.description')
                        ->where([['user_answers.user_test_id', $item->user_test_id], ['Q.module_id', $item->module_id], ['A.score', '<=', 3]])
                        ->take(2)
                        ->get();
                     
                    if (count($answers)>0) {
                        $item->answers = $answers;
                        //Buscar el plan de accion deacuerdo a la evaluacion y empezar a crear acuerdos de forma automagica
                        $action_plans = ActionPlan::where('evaluation_id', $user_evaluation->evaluation_id)->first();
                        $user_action_plan = UserActionPlan::where([['action_plan_id', $action_plans->id], ['user_id', $user_evaluation->user_id], ['responsable_id', $user_evaluation->responsable_id]])->first();

                        foreach ($answers as $item_answer) {
                            UserAgreement::create([
                                'user_action_plan_id' => $user_action_plan->id,
                                'opportunity_area' => $item_answer->description,
                                'goal' => '',
                                'developed_skill' => '',
                                'action' => '',
                                // 'established_date' => Carbon::now()->format('Y-m-d'),
                                'created_by' => $request->user_id,
                                'updated_by' => $request->user_id
                            ]);
                        }
                    }
                }


                /*  TestService::sendTestMail([
                    "clasification" => $clasification['clasification'],
                    "clasification_description" => $clasification['description'],
                    "total_score" => $total_score,
                    "user_evaluation" => $user_test->user_evaluation,
                    "evaluation_name" => $user_test->user_evaluation->evaluation->name,
                    "test" => $user_test->test
                ]);*/
            }

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

    public function saveModuleNote(Request $request)
    {

        try {

            // app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            // if (!$this->checkPermissions(request()->route()->getName())) {

            //     return response()->json([
            //         'title' => 'Proceso cancelado',
            //         'message' => 'No tienes permiso para hacer esto.',
            //         'code' => 'P007'
            //     ], 400);
            // }

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
                'module_id' => 'Nullable|Integer|NotIn:0|Min:0',
                'note' => 'Required|String',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X701'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X702'
                ], 400);


            DB::beginTransaction();

            $user_test_module = UserTestModule::where([
                ['user_test_id', $request->user_test_id],
                ['module_id', $request->module_id]
            ])->first();

            if ($user_test_module)
                $user_test_module->update([
                    'note' => $request->note
                ]);

            else
                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $request->module_id,
                    'note' => $request->note
                ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Nota guardada correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X799'
            ], 500);
        }
    }


    public function changeProcess(Request $request)
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
                'process_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_test_id' => 'Required|Integer|NotIn:0|Min:0',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X801'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X802'
                ], 400);

            // Se valida que el proceso sea correcto
            if (!Process::find($request->process_id))
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Id de Proceso no valido.',
                    'code' => $this->prefix . 'X803'
                ], 400);

            $user_evaluation  = UserTest::find($request->user_test_id)->user_evaluation;

            if (!$user_evaluation)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'La evaluación no es valida.',
                    'code' => $this->prefix . '804'
                ], 400);

            // if ($user_evaluation->process_id >= $request->process_id)
            //     return response()->json([
            //         'title' => 'No se puede regresar',
            //         'message' => 'Se debe continuar con el siguiente paso.',
            //         'code' => $this->prefix . '804'
            //     ], 400);
            if ($user_evaluation->process_id > $request->process_id)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Se debe continuar con el siguiente proceso.',
                    'code' => $this->prefix . '804'
                ], 400);

            DB::beginTransaction();

            $user_evaluation->update(
                [
                    'process_id' => $request->process_id
                ]
            );

            if ($request->process_id == 4) {
                UserTest::where([
                    ['user_evaluation_id', $user_evaluation->id],
                    ['test_id', 2],
                    ['status_id', '!=', 3]
                ])->update([
                    'status_id' => 3,
                    'finish_date' => Carbon::now()->format('Y-m-d')
                ]);
            }

            DB::commit();

            return response()->json([
                'title' => 'Proceso completo',
                'message' => 'Proceso actualizado correctamente.',
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X899'
            ], 500);
        }
    }
}
