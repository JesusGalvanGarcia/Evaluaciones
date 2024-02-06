<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\Process;
use App\Models\Status;
use App\Models\Test;
use App\Models\UserActionPlan;
use App\Models\UserCollaborator;
use App\Models\UserEvaluation;
use App\Models\User;
use App\Models\UserAnswer;
use App\Models\Question;
use App\Models\Answer;

use App\Models\UserTest;
use App\Models\UserTestModule;
use App\Models\TestModule;
use App\Models\Evaluation;


use App\Services\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Type\Integer;

class UserEvaluationController extends Controller
{

    private $prefix = 'UserEvaluation';

    public function index()
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
                'collaborators_id' => 'Array|Nullable',
                'collaborators_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'evaluations_id' => 'Array|Nullable',
                'evaluations_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X001'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X002'
                ], 400);

            // Se evalúa si en la petición colaboradores especificos, para filtrar información.
            $collaborators_id = request('collaborators_id') ? request('collaborators_id') : [];

            // Se evalúa si en la petición solicita una evaluación especifica, para filtrar información.
            $evaluations_id = request('evaluations_id') ? request('evaluations_id') : [];

            $evaluations = UserEvaluation::select(
                'user_evaluations.id as user_evaluation_id',
                'user_evaluations.evaluation_id as evaluation_id',
                'user_evaluations.user_id as collaborator_id',
                'E.name as evaluation_name',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
                DB::raw("CONCAT(R.name, ' ', R.father_last_name, ' ', R.mother_last_name) as responsable_name"),
                'user_evaluations.process_id',
                'P.description as actual_process',
                'P.phase',
                'E.start_date',
                'user_evaluations.finish_date',
                'S.description as status'
            )
                ->join('users as U', 'U.id', 'user_evaluations.user_id')
                ->join('users as R', 'R.id', 'user_evaluations.responsable_id')
                ->join('evaluations as E', 'E.id', 'user_evaluations.evaluation_id')
                ->join('processes as P', 'P.id', 'user_evaluations.process_id')
                ->join('status as S', function ($status_join) {
                    return $status_join->on('S.status_id', 'user_evaluations.status_id')
                        ->where('S.table_name', 'user_evaluations');
                })
                ->when(request('user_id') != 88 && request('user_id') != 19 && request('user_id') != 12, function ($when) use ($collaborators_id) {

                    return $when->where([
                        ['responsable_id', request('user_id')]
                    ]);
                })
                ->when(count($collaborators_id) > 0, function ($when) use ($collaborators_id) {

                    return $when->whereIn('user_evaluations.user_id', $collaborators_id);
                })
                ->when(count($evaluations_id) > 0, function ($when) use ($evaluations_id) {

                    return $when->whereIn('user_evaluations.evaluation_id', $evaluations_id);
                })
                ->where("user_evaluations.evaluation_id","!=",2)
                ->get();

            $personal_evaluations = UserEvaluation::select(
                'user_evaluations.id as user_evaluation_id',
                'user_evaluations.evaluation_id as evaluation_id',
                'user_evaluations.user_id as collaborator_id',
                'E.name as evaluation_name',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
                DB::raw("CONCAT(R.name, ' ', R.father_last_name, ' ', R.mother_last_name) as responsable_name"),
                'user_evaluations.process_id',
                'P.description as actual_process',
                'P.phase',
                'E.start_date',
                'user_evaluations.finish_date',
                'S.description as status'
            )
                ->join('users as U', 'U.id', 'user_evaluations.user_id')
                ->join('users as R', 'R.id', 'user_evaluations.responsable_id')
                ->join('evaluations as E', 'E.id', 'user_evaluations.evaluation_id')
                ->join('processes as P', 'P.id', 'user_evaluations.process_id')
                ->join('status as S', function ($status_join) {
                    return $status_join->on('S.status_id', 'user_evaluations.status_id')
                        ->where('S.table_name', 'user_evaluations');
                })
                ->where([
                    ['user_id', request('user_id')],
                ])
     
                ->get();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Evaluaciones del usuario consultadas correctamente',
                'personal_evaluations' => $personal_evaluations,
                'collaborators_evaluations' => $evaluations
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X099'
            ], 500);
        }
    }

    public function getAverages(Request $request)
    {
        try{
        $validator = Validator::make(request()->all(), [
            'user_id' => 'Required|Integer|NotIn:0|Min:0',
            'evaluation_id' => 'Required|Integer|NotIn:0|Min:0',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'title' => 'Datos Faltantes',
                'message' => $validator->messages()->first(),
                'code' => $this->prefix . 'X001'
            ], 400);
        }
        $evaluation = Evaluation::where('id', $request->evaluation_id)->first();
        $users = User::select(DB::raw("CONCAT(name, ' ', father_last_name, ' ', mother_last_name) as collaborator_name"), 'email')
        ->where('id', $request->user_id)
        ->first();
    

        $user = UserService::checkUser(request('user_id'));

        if (!$user)
            return response()->json([
                'title' => 'Consulta Cancelada',
                'message' => 'Usuario invalido, no tienes acceso.',
                'code' => $this->prefix . 'X002'
            ], 400);
          
            $user_evaluations = UserEvaluation::select(
                'user_evaluations.type_evaluator_id', 
                'evaluator_type.description',
                'user_tests.total_score',
                'user_tests.id AS test_id'
            )
            ->join('evaluator_type', 'user_evaluations.type_evaluator_id', '=', 'evaluator_type.id')
            ->leftJoin('user_tests', 'user_evaluations.id', '=', 'user_tests.user_evaluation_id')
            ->where('user_evaluations.evaluation_id', $request->evaluation_id)
            ->where('user_evaluations.user_id', $request->user_id)
            ->get();
           // $users_test=UserTest::where('')
            $sums = [
                'Lider' => 0,
                'Colaborador' => 0,
                'Cliente' => 0,
                'Lateral' => 0,
                'Autoevaluacion'=>0,
                'SinAutoevaluacion'=>0
            ];
            $user_test_module_sums = [];
            $evaluator_type_sums = [];
            $Lideres = [];
            $Colaboradores = [];
            $AutoEvaluacion = [];
            $Cliente = [];
            $Lateral = [];
            foreach ($user_evaluations as $element) {
                $description = $element->description;
            
                $filteredEvaluations = $user_evaluations->where('description', $description);
            
                if (array_key_exists($description, $sums)) {
                    $user_test_modules = UserTestModule::where('user_test_id', $element->test_id)->get();
                    if (!isset($evaluator_type_sums[$description])) {
                        $evaluator_type_sums[$description] = [];
                    }
                    $sumsModule = [
                        'Lider' => 0,
                        'Colaborador' => 0,
                        'Cliente' => 0,
                        'Lateral' => 0,
                        'Autoevaluacion' => 0,
                        
                    ];

                    $answers = UserTest::select('suggestions', 'chance', 'strengths')
                        ->where('id', $element->test_id)
                        ->first(); // Assuming only one row is expected

                    switch ($element->description) {
                        case 'Lider':
                            $Lideres[] = $answers;
                         
                            break;
                        case 'Colaborador':
                            $Colaboradores[] = $answers;
                            break;
                        case 'Autoevaluacion':
                            $AutoEvaluacion[] = $answers;
                            break;
                        case 'Cliente':
                            $Cliente[] = $answers;
                            break;
                        case 'Lateral':
                            $Lateral[] = $answers;
                            break;
                     
                    }
                    foreach ($user_test_modules as $element_module) {
                        $name = TestModule::where('id', $element_module->module_id)->first();
            
                         // Initialize sumsModule for the current module if not exists
            if (!isset($user_test_module_sums[$name->name])) {
                $user_test_module_sums[$name->name] = [
                    'Lider' => 0,
                    'Colaborador' => 0,
                    'Cliente' => 0,
                    'Lateral' => 0,
                    'Autoevaluacion' => 0,
                    
                ];
            }

           
            $countFilteredEvaluations = count($filteredEvaluations);
            $user_test_module_sums[$name->name][$description] += ($countFilteredEvaluations > 0 ? round($element_module->average / $countFilteredEvaluations,2) : 0);
            if (!isset($evaluator_type_sums[$description][$name->name])) {
                $evaluator_type_sums[$description][$name->name] = [];
            }
    
            $evaluator_type_sums[$description][$name->name][] = round($element_module->average,2);
         // Fetch questions related to the current module
            // Fetch questions related to the current module
            $questions = Question::where('module_id', $element_module->module_id)->get();

            // Fetch answers from UserAnswer based on the current test and module
            $answers = UserAnswer::select('answers.score', 'user_answers.question_id')
                ->join('answers', 'user_answers.answer_id', '=', 'answers.id')
                ->where('user_test_id', $element->test_id)
                ->whereIn('user_answers.question_id', $questions->pluck('id'))
                ->get();

            foreach ($answers as $answer) {
                // Fetch the question text based on the question_id
                $questionText = $questions->where('id', $answer->question_id)->first()->description;

                // Calculate the average of answers
                $answersAverage = $answers->count() > 0 ? round($answers->avg('score'), 2) : 0;

                // Store the average for each question
                if (!isset($question_averages[$name->name])) {
                    $question_averages[$name->name][$questionText][$element->description] = [];
                }

                $question_averages[$name->name][$questionText][$element->description] =$answersAverage;
            }
        }
                }
            }
            $overall_module_averages = [];
            foreach ($user_test_module_sums as $module => $averages) {
                $overall_module_averages[$module] = count($averages) > 0 ? round(array_sum($averages) / count($averages),2) : 0;
            }     
            $overall_evaluator_type_averages = [];
            foreach ($evaluator_type_sums as $evaluator => $moduleData) {
                $totalAverage = 0;
                $moduleCount = 0;
            
                foreach ($moduleData as $module => $data) {
                    // Assuming $data is an array, adjust the code accordingly
                    if (is_array($data)) {
                        $totalAverage += count($data) > 0 ? round(array_sum($data) / count($data) ,2): 0;
                        $moduleCount++;
                    }
                }
            
                $overall_evaluator_type_averages[$evaluator] = $moduleCount > 0 ? round($totalAverage / $moduleCount,2) : 0;
            }
            $overall_average_all_evaluators = 0;
            $overall_count_all_evaluators = 0;
            
            foreach ($evaluator_type_sums as $evaluator => $moduleData) {
                foreach ($moduleData as $module => $data) {
                    // Assuming $data is an array, adjust the code accordingly
                    if (is_array($data)) {
                        $overall_average_all_evaluators += count($data) > 0 ? array_sum($data) : 0;
                        $overall_count_all_evaluators += count($data);
                    }
                }
            }
            
            $overall_average_all_evaluators = $overall_count_all_evaluators > 0 ?
                round($overall_average_all_evaluators / $overall_count_all_evaluators, 2) : 0;

        return response()->json([
            'title' => 'Proceso terminado',
            'message' => 'Evaluaciones del usuario consultadas correctamente',
            'general'=>$user_test_module_sums,
            'promedio'=>$overall_module_averages,
            'evaluator'=>$overall_evaluator_type_averages,
            'evaluation'=>$evaluation,
            'user'=>$users,
            'general_average' => $overall_average_all_evaluators,
            'question_averages' => $question_averages,
            'Lideres'=>$Lideres,
            'Colaboradores'=>$Colaboradores,
            'Autoevaluacion'=>$AutoEvaluacion,
            'Cliente'=>$Cliente,
            'Lateral'=>$Lateral



        
        ]);
    } catch (Exception $e) {

        return response()->json([
            'title' => 'Ocurrio un error en el servidor',
            'message' => $e->getMessage() . ' -L:' . $e->getLine(),
            'code' => $this->prefix . 'X099'
        ], 500);
    }
    }
    public function store(Request $request)
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
                    'code' => $this->prefix . 'X101'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X102'
                ], 400);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X199'
            ], 500);
        }
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

            // Se consultan las pruebas de la evaluación asignadas.
            $user_tests = UserTest::select(
                'user_tests.id',
                'T.name',
                'user_tests.total_score',
                'user_tests.finish_date',
                'S.description as status',
                DB::raw("(CASE WHEN user_tests.status_id != 3 THEN 'Sin clasificación' ELSE (CASE when user_tests.total_score < 70 THEN 'En Riesgo' WHEN user_tests.total_score >= 70 AND user_tests.total_score < 80 THEN 'Baja' WHEN user_tests.total_score >= 80 AND user_tests.total_score < 90 THEN 'Regular' WHEN user_tests.total_score >= 90 AND user_tests.total_score < 100 THEN 'Buena' WHEN user_tests.total_score >= 100 AND user_tests.total_score < 120 THEN 'Excelente' WHEN user_tests.total_score = 120 THEN 'Máxima' END) END) as 'rank'"),
                DB::raw("1 as type")
            )
                ->join('user_evaluations as UE', function ($join) use ($id) {
                    return $join->on('UE.id', 'user_tests.user_evaluation_id')
                        ->where('UE.id', $id);
                })
                ->join('tests as T', 'T.id', 'user_tests.test_id')
                ->join('status as S', function ($join) use ($id) {
                    return $join->on('S.status_id', 'user_tests.status_id')
                        ->where('S.table_name', 'user_tests');
                })
                ->get();

            // Se consulta la información de la evaluación del usuario
            $user_evaluation = UserEvaluation::find($id);

            // Evalua si la evaluación tiene relacionado un plan de acción
            $action_plan = ActionPlan::where('evaluation_id', $user_evaluation?->evaluation_id)->first();

            if ($action_plan) {

                // Se consulta el plan de acción que tenga el usuario asignado
                $user_action_plans = $action_plan->user_action_plans;

                if (count($user_action_plans) > 0) {

                    $user_action_plan = $user_action_plans->where('user_id', $user_evaluation->user_id)->where('responsable_id',  $user_evaluation->responsable_id)->first();

                    if ($user_action_plan)
                        $user_tests->push([
                            "id" => $user_action_plan->id,
                            "name" => $action_plan->name,
                            "total_score" => "",
                            "finish_date" => $user_action_plan->finish_date,
                            "status" => Status::where([['status_id', $user_action_plan->status_id], ['table_name', 'user_action_plans']])->first()->description,
                            "rank" => "",
                            "type" => 2
                        ]);
                }
            }

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la evaluación del usuario consultado correctamente',
                'tests' => $user_tests
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
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
}
