<?php

namespace App\Http\Controllers\Evaluations\Asesores;

use App\Http\Controllers\Controller;

use Carbon\Carbon;
use App\Models\UserAnswer;
use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\ActionPlanParameter;
use App\Models\ActionPlanSignature;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;
use App\Services\Evaluations\Evaluation360\Test360Service;
use App\Services\Evaluations\Asesores\AsesoresService;

use App\Models\Process;
use App\Models\Status;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Test;
use App\Models\UserActionPlan;
use App\Models\UserCollaborator;
use App\Models\UserEvaluation;
use App\Models\UserTest;
use App\Models\UserTestModule;
use App\Models\TestModule;
use App\Models\Evaluation;
use App\Models\User;
use App\Models\FinishEvaluation;
use App\Services\Evaluations\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Ramsey\Uuid\Type\Integer;

class AsesoresController extends Controller
{

    private $prefix = 'asesores';
    public function index()
    {

        //
        try {
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $evaluations = Evaluation::all();



            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'evaluations' => $evaluations
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

            $user_test_module = UserTestModule::join('test_modules', 'user_test_modules.module_id', '=', 'test_modules.id')
                ->select('user_test_modules.*', 'test_modules.name', 'test_modules.max') // Selecciona todos los campos de user_test_modules y el campo module_name de test_modules
                ->where('user_test_modules.user_test_id', $id)
                ->get();


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle de la prueba del usuario consultado correctamente',
                'test' => $user_test_module,
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }
    public function saveAnswerAsesores(Request $request)
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
            $user_test = UserTest::whereIn('status_id', [1, 2, 3])->find($request->user_test_id);

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
            $question = Question::where('id', $request->question_id)->first();
            $test_modules = TestModule::where('id', $question->module_id)->first();
            $average = round(($request->score * $test_modules->max) / ($question->score));

            $user_test_module = UserTestModule::where([
                ['user_test_id', $request->user_test_id],
                ['module_id', $question->module_id]
            ])->first();

            if ($user_test_module) {

                $total_score = $total_score - $user_test_module->average;

                $user_test_module->update([
                    'average' => round($average)
                ]);
            } else {
                UserTestModule::create([
                    'user_test_id' => $request->user_test_id,
                    'module_id' => $question->module_id,
                    'average' => round($average)
                ]);
            }
            $total_score += $average;

            $user_test->update([
                'status_id' => $request->its_over == 'si' ? 3 : 2,
                'finish_date' => $request->its_over == 'si' ? Carbon::now()->format('Y-m-d') : null,
                'total_score' => round($total_score),
                'updated_by' => $request->user_id
            ]);
            if ($request->its_over == 'si') {
                /*  AsesoresService::sendTestMail([
                    "total_score" => $total_score,
                    "user_evaluation" => $user_test->user_evaluation,
                    "evaluation_name" => $user_test->user_evaluation->evaluation->name,
                    "test" => $user_test->test
                ]);*/
                $user_test_module = UserTestModule::join('test_modules', 'user_test_modules.module_id', '=', 'test_modules.id')
                    ->select('user_test_modules.*', 'test_modules.name', 'test_modules.max') // Selecciona todos los campos de user_test_modules y el campo module_name de test_modules
                    ->where('user_test_modules.user_test_id', $request->user_test_id)
                    ->get();
                $user_test->user_evaluation->update(
                    [
                        'status_id' => 2,
                        'process_id' => 8
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuesta guardada correctamente',
                'actual_score' => round($total_score),
                'modules' => $user_test_module

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


    public function assignAsesors(Request $request)
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);

            $userIds = collect($request->users);
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();;

            $usersData = User::whereIn('id', $userIdsMatch)->select('id', 'name', 'email')->get();
            $evaluationName = Evaluation::where('id', $request->evaluation_id)->value('name');

            // Enviar correos electrónicos a cada usuario
            foreach ($usersData as $user) {
                AsesoresService::sendEmail($user->name, $evaluationName, $user->email);
            }

            // Convertir para inserts en User_evaluations
            $InsertCollaborators = $userIds->map(function ($item) use ($request) {
                return [
                    'user_id' => $item['id'],
                    'responsable_id' => $request->responsable_id,
                    'evaluation_id' => $request->evaluation_id,
                    'process_id' => 6,
                    'status_id' => 1,
                    'finish_date' => null,
                    'actual_attempt' => 1,
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                    'deleted_by' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];
            });
            DB::beginTransaction();
            $newEvaluations = UserEvaluation::insert($InsertCollaborators->toArray());
            //consultar los id con  los que fueron creados
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();
            DB::commit();
            $user_evaluation_ids = UserEvaluation::whereIn('user_id', $userIdsMatch)
                ->where('evaluation_id', $request->evaluation_id)
                ->where('process_id', 6)
                ->get()
                ->pluck('id')
                ->toArray();

            $test = Test::where('evaluation_id', $request->evaluation_id)->first();

            // Map and create an array of values
            $InsertCollaboratorsTest = array_map(function ($item) use ($request, $test) {
                return [
                    'test_id' => $test->id,
                    'total_score' => 0,
                    'status_id' => 1,
                    'finish_date' => null,
                    'user_evaluation_id' => $item,
                    'attempts' => 1,
                    'strengths' => '',
                    'chance' => '',
                    'suggestions' => '',
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];
            }, $user_evaluation_ids);

            // Use createMany to insert multiple records
            DB::beginTransaction();
            // Use createMany to insert multiple records
            $newEvaluationsTest = UserTest::insert($InsertCollaboratorsTest);
            DB::commit();
            DB::beginTransaction();
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();

            $user_evaluations = UserEvaluation::whereIn('user_id', $userIdsMatch)
                ->where('evaluation_id', $request->evaluation_id)
                ->where('process_id', 6)
                ->get();

            $actionPlan = $user_evaluations->map(function ($item) use ($request) {

                return [
                    'user_id' => $item->user_id,
                    'action_plan_id' => 2,
                    'status_id' => 1,
                    'responsable_id' => $item->responsable_id,
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                    'deleted_by' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];
            });

            $newPlans = UserActionPlan::insert($actionPlan->toArray());
            DB::commit();
            DB::beginTransaction();
            $signature = [];
            $userIdsArray = $actionPlan->pluck('user_id')->toArray();
            $responsableIdsArray = $actionPlan->pluck('responsable_id')->toArray();
            $action_plan = UserActionPlan::whereIn('user_id', $userIdsArray)
                ->whereIn('responsable_id', $responsableIdsArray)
                ->where('action_plan_id', 2)
                ->get();

            foreach ($action_plan as $plan) {
                $signature[] =
                    [
                        'user_action_plan_id' => $plan->id,
                        'responsable_id' => $plan->responsable_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                        'deleted_at' => null,
                    ];
            }

            foreach ($signature as $item) {

                $signatureResponsable[] =
                    [
                        'user_action_plan_id' => $item['user_action_plan_id'],
                        'responsable_id' => 88,
                        'created_at' => now(),
                        'updated_at' => now(),
                        'deleted_at' => null,
                    ];
            }
            $Colaborador = [];

            foreach ($action_plan as $item) {
                $Colaborador[] = [
                    'user_action_plan_id' => $item->id,
                    'responsable_id' => $item->user_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];
            }

            // Filtrar duplicados por user_action_plan_id y responsable_id
            $uniqueColaborador = [];
            foreach ($Colaborador as $item) {
                $key = $item['user_action_plan_id'] . '_' . $item['responsable_id'];
                if (!array_key_exists($key, $uniqueColaborador)) {
                    $uniqueColaborador[$key] = $item;
                }
            }

            $uniqueColaborador = array_values($uniqueColaborador);

            // Insertar en la base de datos
            $newPlansActions = ActionPlanSignature::insert($signature);
            $newPlansActionsResponsable = ActionPlanSignature::insert($signatureResponsable);
            $PlansUser = ActionPlanSignature::insert($uniqueColaborador);



            DB::commit();
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Usuarios agregados correctamente',

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

    public function showTest(string $id)
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
}
