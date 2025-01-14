<?php

namespace App\Http\Controllers\Evaluations\DesempeñoCompetencias;

use App\Http\Controllers\Controller;

use App\Models\ActionPlan;
use App\Models\ActionPlanSignature;
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
use Spatie\Permission\Models\Role;

use App\Models\UserTest;
use App\Models\UserTestModule;
use App\Models\TestModule;
use App\Models\Evaluation;


use App\Services\Evaluations\UserService;
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
            $role = Role::find(2);
            // Get users with the specified role
            $users = User::role($role->name)->pluck('id');
            $evaluations = UserEvaluation::select(
                'user_evaluations.id as user_evaluation_id',
                'user_evaluations.responsable_id',
                'user_evaluations.evaluation_id as evaluation_id',
                'user_evaluations.user_id as collaborator_id',
                'E.name as evaluation_name',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
                DB::raw("CONCAT(R.name, ' ', R.father_last_name, ' ', R.mother_last_name) as responsable_name"),
                'user_evaluations.process_id ',
                'P.description as actual_process',
                'P.phase',
                'E.start_date',
                'user_evaluations.finish_date',
                'S.description as status'
            )
                ->join('users as U', 'U.id', 'user_evaluations.user_id')
                ->join('users as R', 'R.id', 'user_evaluations.responsable_id')
                ->join('evaluations as E', function ($condition) {
                    return $condition->on('E.id', 'user_evaluations.evaluation_id')
                        ->where('E.status_id', 1);
                })
                ->join('processes as P', 'P.id', 'user_evaluations.process_id')
                ->join('status as S', function ($status_join) {
                    return $status_join->on('S.status_id', 'user_evaluations.status_id')
                        ->where('S.table_name', 'user_evaluations');
                })
                ->when(!in_array(request('user_id'), $users->toArray()), function ($query) {
                    return $query->where('user_evaluations.responsable_id', request('user_id'));
                })


                ->when(count($collaborators_id) > 0, function ($when) use ($collaborators_id) {

                    return $when->whereIn('user_evaluations.user_id', $collaborators_id);
                })
                ->when(count($evaluations_id) > 0, function ($when) use ($evaluations_id) {

                    return $when->whereIn('user_evaluations.evaluation_id', $evaluations_id);
                })
                ->where("user_evaluations.evaluation_id", "!=", 2)
                ->whereIn("user_evaluations.process_id", request('process_id'))

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
                ->where("user_evaluations.evaluation_id", "!=", 2)
                ->where("user_evaluations.status_id", 3)

                ->whereIn("user_evaluations.process_id", request('process_id'))

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
    public function createEvaluations(Request $request)
    {
        $validator = Validator::make(request()->all(), [
            'user_id' => 'Required|Integer|NotIn:0|Min:0',
            'responsable_id' => 'Required|Integer',
            'evaluation_id' => 'Required|Integer',
            'action_plan_id' => 'Required|Integer',
            'colaborators' => 'Required|Array', //Colaboradores que seran asignados al responsable
            'tests_id' => 'Required|Array', //Desempeño y Competencias o si se requiere mas, pues mas,
            'responsables' => 'Required|Array', //responsable de firmar en este caso es paco, ya automaticamente hace la firma de el colaborador y colaborador-lider solo falta DO
        ]);

        if ($validator->fails()) {

            return response()->json([
                'title' => 'Datos Faltantes',
                'message' => $validator->messages()->first(),
                'code' => $this->prefix . 'X101'
            ], 400);
        }
        try {
            DB::beginTransaction();
            foreach ($request->colaborators as $item) {
                //crear el user evaluation 
                $user_evaluation =  UserEvaluation::create([
                    'user_id' => $item,
                    'evaluation_id' => $request->evaluation_id,
                    'process_id' => 12,
                    'status_id' => 1,
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                    'responsable_id' => $request->responsable_id,
                    'actual_attempt' => 1
                ]);
                //crear user_test es decir desempeño o competencias
                foreach ($request->tests_id as $test) {
                    $user_tests =  UserTest::create([
                        'test_id' => $test,
                        'total_score' => 0,
                        'status_id' => 1,
                        'user_evaluation_id' => $user_evaluation->id,
                        'attempts' => 1,
                        'strengths' => '',
                        'chance' => '',
                        'suggestions' => '',
                        'calification' => null,
                        'created_by' => $request->user_id,
                        'updated_by' => $request->user_id,
                    ]);
                }
                //crear plan de accion
                $user_action_plan = UserActionPlan::create([
                    'user_id' => $item,
                    'action_plan_id' => $request->action_plan_id,
                    'status_id' => 1,
                    'responsable_id' => $request->responsable_id,
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                ]);
                //Añadir como responsables de firmar a los colaboradores que no son DO
                $action_plan_signature = ActionPlanSignature::create([
                    'user_action_plan_id' => $user_action_plan->id,
                    'status_id' => 1,
                    'responsable_id' => $item,
                ]);
                $action_plan_signature = ActionPlanSignature::create([
                    'user_action_plan_id' => $user_action_plan->id,
                    'status_id' => 1,
                    'responsable_id' => $request->responsable_id,
                ]);
                //crear firmas
                foreach ($request->responsables as $responsable) {
                    $action_plan_signature = ActionPlanSignature::create([
                        'user_action_plan_id' => $user_action_plan->id,
                        'responsable_id' => $responsable,
                        'status_id' => 1,

                    ]);
                }
            }
            DB::commit();
            return response()->json(['message' => 'Informacion insertada de forma correcta'], 201);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X199'
            ], 500);
        }
    }
    public function createQuestions(Request $request)
    {

        $validator = Validator::make(request()->all(), [
            'user_id' => 'Required|Integer|NotIn:0|Min:0',
            'modules' => 'Required|Array'
        ]);

        if ($validator->fails()) {

            return response()->json([
                'title' => 'Datos Faltantes',
                'message' => $validator->messages()->first(),
                'code' => $this->prefix . 'X101'
            ], 400);
        }
        try {
            $data = $request->validate([
                'user_id' => 'required|integer',
                'test_id' => 'required|integer',
                'modules' => 'required|array',
                'modules.*.name' => 'required|string',
                'modules.*.questions' => 'required|array',
                'modules.*.questions.*.description' => 'required|string',
                'modules.*.questions.*.score' => 'required|integer',
                'modules.*.questions.*.answers' => 'required|array',
                'modules.*.questions.*.answers.*.description' => 'required|string',
                'modules.*.questions.*.answers.*.score' => 'required|integer',
            ]);
            DB::beginTransaction();
            foreach ($data['modules'] as $module) {
                $testModule = TestModule::create([
                    'test_id' => $data['test_id'],
                    'name' => $module['name'],
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id
                ]);

                foreach ($module['questions'] as $question) {
                    $createdQuestion = Question::create([
                        'module_id' => $testModule->id,
                        'description' => $question['description'],
                        'score' => $question['score'],
                        'created_by' => $request->user_id,
                        'updated_by' => $request->user_id
                    ]);

                    foreach ($question['answers'] as $answer) {
                        Answer::create([
                            'question_id' => $createdQuestion->id,
                            'description' => $answer['description'],
                            'score' => $answer['score'],
                            'created_by' => $request->user_id,
                            'updated_by' => $request->user_id
                        ]);
                    }
                }
            }
            return response()->json(['message' => 'Informacion insertada de forma correcta'], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X199'
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
            // Se consulta la información de la evaluación del usuario
            $user_evaluation = UserEvaluation::find($id);

            $userPermission = UserService::checkUserPermisse('Acceso Administracion desempeno', $user);
            if (!$userPermission && $user_evaluation->responsable_id != request('user_id') && $user_evaluation->user_id != request('user_id'))
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
                'user_tests.calification',
                'user_tests.finish_date',
                'S.description as status',
                'UE.id as user_evaluation_id',
                DB::raw("(CASE WHEN T.modular = 1 THEN 1 ELSE 2 END) as 'order'"), // ordenar por los id test
                'UE.process_id',
                'C.name as clasificacion_name',
                'C.color',
                DB::raw("C.description as clasification_description"),
                DB::raw("1 as type")
            )
                ->join('user_evaluations as UE', function ($join) use ($id) {
                    $join->on('UE.id', 'user_tests.user_evaluation_id')
                        ->where('UE.id', $id);
                })
                ->join('tests as T', 'T.id', 'user_tests.test_id')
                ->leftJoin('status as S', function ($join) {
                    $join->on('S.status_id', 'user_tests.status_id')
                        ->where('S.table_name', 'user_tests');
                })
                ->leftJoin('clasification as C', function ($join) {
                    $join->on('user_tests.test_id', 'C.test_id')
                        ->on('user_tests.calification', '>=', 'C.start_range')
                        ->on('user_tests.calification', '<=', 'C.end_range');
                })
                ->orderby('order')
                ->get();


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
