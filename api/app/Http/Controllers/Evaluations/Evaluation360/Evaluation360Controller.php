<?php

namespace App\Http\Controllers\Evaluations\Evaluation360;

use App\Http\Controllers\Controller;

use Carbon\Carbon;
use App\Models\UserAnswer;
use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\ActionPlanParameter;
use App\Models\ActionPlanSignature;
use App\Services\Evaluations\DesempeñoCompetencias\TestService;
use App\Services\Evaluations\Evaluation360\Test360Service;

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

class Evaluation360Controller extends Controller
{

    private $prefix = 'evaluation360';

    public function index()
    {

        //
        try {
    
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $evaluations = Evaluation::select('id','process_id','status_id','name','start_date','end_date')->get();
            


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
    public function saveAnswer360(Request $request)
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

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Respuesta guardada correctamente',
                'actual_score' => $total_score,

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
    public function Users360(Request $request)
    {
        try {
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $users = User::selectRaw("id, CONCAT(name, ' ', father_last_name, ' ', mother_last_name) as collaborator_name")
                ->where('status_id', 1)
                ->get();



            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'evaluations' => $users
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
    public function Users(Request $request)
    {
        try {
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $users = User::select('users.id', DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"))
                ->join('Finish_evaluations', 'Finish_evaluations.user_id', '=', 'users.id')
                ->groupBy('users.id', 'users.name', 'users.father_last_name', 'users.mother_last_name')
                ->get();



            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'evaluations' => $users
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
    public function assignUsers(Request $request)
    {
        try {

            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);
            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }
            $existingRecords = DB::table('user_evaluations')
                ->join('users', 'user_evaluations.responsable_id', '=', 'users.id')
                ->select(
                    'user_evaluations.responsable_id as id',
                    DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"),
                )
                ->where([
                    ['user_evaluations.user_id', $request->responsable_id],
                    ['user_evaluations.evaluation_id', $request->evaluation_id],
                    ['user_evaluations.type_evaluator_id', 3],
                ])
                ->get();



            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Usuarios agregados correctamente',
                'existingRecords' => $existingRecords
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
    public function saveSuggetions(Request $request)
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
                'suggestions' => 'Required|String',
                'strengths' => 'Required|String',
                'chance' => 'Required|String',
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


            $user_test = UserTest::find($request->user_test_id);


            $user_test->update([
                'suggestions' => $request->suggestions,
                'strengths' => $request->strengths,
                'chance' => $request->chance,
                'status_id' => 3
            ]);

            $user_evaluation  = UserTest::find($request->user_test_id)->user_evaluation;
            if ($user_evaluation->type_evaluator_id > 2) {
                $user_evaluation->update(
                    [
                        'status_id' => 3,
                        'finish_date' => Carbon::now()->format('Y-m-d'),
                        'process_id' => 7
                    ]
                );
            } else {
                $user_evaluation->update(
                    [
                        'status_id' => $user_evaluation->type_evaluator_id==1?2:3,
                        'process_id' => $user_evaluation->type_evaluator_id==1?10:7
                    ]
                );
            }
            Test360Service::sendTestMail([
                "total_score" => 0,
                "user_evaluation" => $user_test->user_evaluation,
                "evaluation_name" => $user_test->user_evaluation->evaluation->name,
                "test" => $user_test->test
            ]);
            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Campos guardados correctamente',

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
            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }
            $userIds = collect($request->users);
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();;

            $usersData = User::whereIn('id', $userIdsMatch)->select('id', 'name', 'email')->get();
            $evaluationName = Evaluation::where('id', $request->evaluation_id)->value('name');

            // Enviar correos electrónicos a cada usuario
            foreach ($usersData as $user) {
                Test360Service::sendEmail360($user->name, $evaluationName, $user->email);
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


    public function assign360(Request $request)
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);
            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }

            $userIds = collect($request->users)->pluck('id')->toArray();

            foreach ($userIds as $key => $user) {
                // Check if the user already has a FinishEvaluation record for the specified evaluation
                $existingFinishEvaluation = FinishEvaluation::where('user_id', $user)
                    ->where('evaluation_id', $request->evaluation_id)
                    ->first();

                if ($existingFinishEvaluation === null) {
                    // Create a new FinishEvaluation record
                    FinishEvaluation::create([
                        'user_id' => $user,
                        'evaluation_id' => $request->evaluation_id,
                        'status' => false,
                        'created_by' => $request->user_id,
                        'updated_by' => $request->user_id,
                        'created_at' => now(),
                        'updated_at' => now(),
                        'deleted_at' => null,
                    ]);
                } else {
                    // Remove the user ID from both arrays
                    unset($userIds[$key]);

                    // If $request->users is a collection, remove the item from the collection
                    $request->users = collect($request->users)->reject(function ($item) use ($user) {
                        return $item['id'] == $user;
                    })->values();
                }
            }


            //Autoevaluacion
            $userAutoevaluation = collect($userIds)->map(function ($item) {
                return [
                    'user_id' => $item,
                    'responsable_id' => $item,
                    'type' => 2,
                ];
            });

            $userCollaboratorIds = UserCollaborator::whereIn('user_id', $userIds)
                ->select('user_id', 'collaborator_id as responsable_id')
                ->addSelect(DB::raw('5 as type')) // Add the new 'type' column with a numeric value of 5
                ->get();

            //consulta para traer lider
            $userCollaboratorLiderIds = UserCollaborator::whereIn('collaborator_id', $userIds)
                ->select('user_id as responsable_id', 'collaborator_id as user_id')
                ->addSelect(DB::raw('1 as type')) // Add the new 'type' column with a numeric value of 1
                ->get();

            //consulta para traer laterales
            $userLiderIds = collect($userCollaboratorLiderIds)->pluck('responsable_id')->toArray();

            $userCollaboratorLiderIds2 = UserCollaborator::whereIn('user_id', $userLiderIds)
                ->select('collaborator_id as responsable_id', 'user_id')
                ->whereNotIn('collaborator_id', $userIds)
                ->get();

            // Assigning identifier type and user_id
            $userCollaboratorLiderIds2 = $userCollaboratorLiderIds2->map(function ($item) use ($userCollaboratorLiderIds) {
                // Add the new property with the desired value
                $item['type'] = 4;

                // Find the matching item in $userCollaboratorLiderIds based on responsable_id
                $matchingItem = $userCollaboratorLiderIds->firstWhere('responsable_id', $item['user_id']);

                // Set user_id based on the matching item
                $item['user_id'] = $matchingItem ? $matchingItem['user_id'] : null;

                return $item;
            })->toArray();


            $evaluationsTotal =  array_merge(
                $userCollaboratorIds->toArray(),
                $userCollaboratorLiderIds->toArray(),
                $userCollaboratorLiderIds2, //son laterales pero me equivoque en el nombre
                $userAutoevaluation->toArray(),
            );
            $userIdsTotal = collect($evaluationsTotal)->pluck('user_id')->toArray();
            $userRespTotal = collect($evaluationsTotal)->pluck('responsable_id')->toArray();

            //convertir para inserts en User_evaluations
            // Convert to a collection
            $evaluationsCollection = collect($evaluationsTotal);

            // Convertir para inserts en User_evaluations
            $InsertCollaborators = $evaluationsCollection->map(function ($item) use ($request) {
                return [
                    'user_id' => $item['user_id'],
                    'responsable_id' => $item['responsable_id'],
                    'evaluation_id' => $request->evaluation_id,
                    'process_id' => 7,
                    'status_id' => 1,
                    'finish_date' => null,
                    'actual_attempt' => 1,
                    'type_evaluator_id' => $item['type'],
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
            $user_evaluation_ids = UserEvaluation::whereIn('user_id', $userIdsTotal)
                ->whereIn('responsable_id', $userRespTotal)
                ->where('process_id', 7)
                ->where('evaluation_id', $request->evaluation_id)
                ->pluck('id')
                ->toArray();
            //hacer un  pluck pero  de los responsable_id
            $responsables_ds = UserEvaluation::whereIn('user_id', $userIdsTotal)
                ->whereIn('responsable_id', $userRespTotal)
                ->where('process_id', 7)
                ->where('evaluation_id', $request->evaluation_id)
                ->pluck('responsable_id');

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
            $newEvaluationsTest = UserTest::insert($InsertCollaboratorsTest);
            DB::commit();
            DB::beginTransaction();
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();
            //para enviar  correo
            $usersData = User::whereIn('id', $responsables_ds)->select('id', 'name', 'email')->get();
            $evaluationName = Evaluation::where('id', $request->evaluation_id)->value('name');

            // Enviar correos electrónicos a cada usuario
            foreach ($usersData as $user) {
                Test360Service::sendEmail360($user->name, $evaluationName, $user->email);
            }

            $user_evaluations = UserEvaluation::whereIn('user_id', $userIdsMatch)
                ->where('evaluation_id', $request->evaluation_id)
                ->where('process_id', 7)
                ->where('type_evaluator_id', 1)
                ->get();


            $actionPlan = $user_evaluations->map(function ($item) use ($request) {

                return [

                    'user_id' => $item->user_id,
                    'action_plan_id' => 3,
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
            $signatureResponsable = [];
            $userIdsArray = $actionPlan->pluck('user_id')->toArray();
            $responsableIdsArray = $actionPlan->pluck('responsable_id')->toArray();
            $action_plan = UserActionPlan::whereIn('user_id', $userIdsArray)
                ->whereIn('responsable_id', $responsableIdsArray)
                ->where('action_plan_id', 3)
                ->get();

            $Colaborador = [];

            foreach ($action_plan as $plan) {
                $signature[] = [
                    'user_action_plan_id' => $plan->id,
                    'responsable_id' => $plan->responsable_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];

                $signatureResponsable[] = [
                    'user_action_plan_id' => $plan->id,
                    'responsable_id' => 88,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];

                $ColaboradorKey = $plan->id . '_' . $plan->user_id;
                $Colaborador[$ColaboradorKey] = [
                    'user_action_plan_id' => $plan->id,
                    'responsable_id' => $plan->user_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ];
            }

            // Insertar en la base de datos
            $newPlansActions = ActionPlanSignature::insert($signature);
            $newPlansActionsResponsable = ActionPlanSignature::insert($signatureResponsable);
            $PlansUser = ActionPlanSignature::insert(array_values($Colaborador));


            DB::commit();
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Usuarios agregados correctamente',
                'test' => $InsertCollaboratorsTest,
                'user_evaluations' => $InsertCollaborators,
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
    public function assign(Request $request)
    {
        try {

            $idEvaluation = $request->evaluation_id;
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);
            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X601'
                ], 400);
            }
            $existingRecords = DB::table('user_evaluations')
                ->where([
                    ['user_id', $request->responsable_id],
                    ['evaluation_id', $request->evaluation_id],
                    ['type_evaluator_id', 3],

                ])
                ->count();

            if ($existingRecords > 0) {
                // Si hay registros, entonces eliminar
                DB::table('user_evaluations')
                    ->where([
                        ['user_id', $request->responsable_id],
                        ['evaluation_id', $request->evaluation_id],
                        ['type_evaluator_id', 3],
                    ])
                    ->delete();
            }
            $userIdsMatch = collect($request->users)->pluck('id')->toArray();

            $usersData = User::whereIn('id', $userIdsMatch)->select('id', 'name', 'email')->get();
            $evaluationName = Evaluation::where('id', $request->evaluation_id)->value('name');

            // Enviar correos electrónicos a cada usuario
            foreach ($usersData as $user) {
                Test360Service::sendEmail360($user->name, $evaluationName, $user->email);
            }

            foreach ($request->users as $user) {
                $userId = isset($user['id']) ? $user['id'] : null;
                $evaluationId = $request->evaluation_id;
                $responsableId = $request->responsable_id;

                $newuser = UserEvaluation::create([
                    'user_id' => $responsableId,
                    'evaluation_id' => $evaluationId,
                    'process_id' => 7,
                    'status_id' => 1,
                    'responsable_id' => $userId,
                    'finish_date' => null,
                    'actual_attempt' => 1,
                    'type_evaluator_id' => 3,
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                    'deleted_by' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ]);
                $test = Test::where('evaluation_id', $evaluationId)->first();
                UserTest::create([
                    'test_id' => $test->id,
                    'total_score' => 0,
                    'status_id' => 1,
                    'finish_date' => null,
                    'user_evaluation_id' => $newuser->id,
                    'attempts' => 1,
                    'strengths' => '',
                    'chance' => '',
                    'suggestions' => '',
                    'created_by' => $request->user_id,
                    'updated_by' => $request->user_id,
                    'deleted_by' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'deleted_at' => null,
                ]);
            }

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
                'code' => $this->prefix . 'X699'
            ], 500);
        }
    }
    public function changeStatus(Request $request)
    {
        try {
            $user_finish  = FinishEvaluation::where([
                ['user_id', $request->user_id],
                ['evaluation_id', $request->evaluation_id],
            ])->first();

            $user_finish->update(
                [
                    'status' => true
                ]
            );
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $user_finish
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
    public function  actionPlan(Request $request)
    {
        try {

            $user_action_plan = UserActionPlan::join('users as R', 'R.id', '=', 'user_action_plans.responsable_id')
                ->select('user_action_plans.*', DB::raw("CONCAT(R.name, ' ', R.father_last_name, ' ', R.mother_last_name) as responsable_name"))
                ->where([
                    ['user_action_plans.user_id', $request->user_id],
                    ['user_action_plans.status_id', 3],
                    ['user_action_plans.action_plan_id', 3]
                ])
                ->get();
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'user_action_plan' => $user_action_plan
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X699'
            ], 500);
        }
    }
    public function get360(Request $request)
    {
        try {

            // Se evalúa si en la petición colaboradores especificos, para filtrar información.
            $collaborators_id = request('collaborators_id') ? request('collaborators_id') : [];

            // Se evalúa si en la petición solicita una evaluación especifica, para filtrar información.
            $evaluations_id = request('evaluations_id') ? request('evaluations_id') : [];

            $personal_evaluations =  UserEvaluation::select(
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
                'S.description as status',
                'user_evaluations.responsable_id',
                DB::raw(
                    "
            COALESCE(
                CASE
                    WHEN user_evaluations.type_evaluator_id = 1 THEN 'Lider'
                    WHEN user_evaluations.type_evaluator_id = 2 THEN 'Autoevaluacion'
                    WHEN user_evaluations.type_evaluator_id = 3 THEN 'Cliente'
                    WHEN user_evaluations.type_evaluator_id = 4 THEN 'Lateral'
                    WHEN user_evaluations.type_evaluator_id = 5 THEN 'Colaborador'

                    ELSE 'unknown'  
                END,
                'unknown'
            ) as evaluator_type"
                )
            )
                ->join('users as U', 'U.id', 'user_evaluations.user_id')
                ->join('users as R', 'R.id', 'user_evaluations.responsable_id')
                ->join('evaluations as E', 'E.id', 'user_evaluations.evaluation_id')
                ->join('processes as P', 'P.id', 'user_evaluations.process_id')
                ->join('status as S', function ($status_join) {
                    return $status_join->on('S.status_id', 'user_evaluations.status_id')
                        ->where('S.table_name', 'user_evaluations');
                })

                ->when(count($collaborators_id) > 0, function ($when) use ($collaborators_id) {
                    return $when->whereIn('user_evaluations.user_id', $collaborators_id);
                })
                ->when(count($evaluations_id) > 0, function ($when) use ($evaluations_id) {
                    return $when->whereIn('user_evaluations.evaluation_id', $evaluations_id);
                })
                ->where(function ($query) use ($request) {
                    $query->where([
                        ['user_evaluations.process_id', 7],
                        ['user_evaluations.user_id', $request->user_id],
                    ])->orWhere(function ($query) {
                        $query->whereIn('user_evaluations.process_id', [10, 11]);
                    });
                })
                ->where('user_evaluations.user_id', $request->user_id)
                ->get();


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $personal_evaluations
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
    public function getPersonal360(Request $request)
    {
        try {

            // Se evalúa si en la petición colaboradores especificos, para filtrar información.
            $collaborators_id = request('collaborators_id') ? request('collaborators_id') : [];

            // Se evalúa si en la petición solicita una evaluación especifica, para filtrar información.
            $evaluations_id = request('evaluations_id') ? request('evaluations_id') : [];

            $personal_evaluations =  UserEvaluation::select(
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
                'S.description as status',
                'user_evaluations.responsable_id',
                DB::raw(
                    "
            COALESCE(
                CASE
                    WHEN user_evaluations.type_evaluator_id = 1 THEN 'Lider'
                    WHEN user_evaluations.type_evaluator_id = 2 THEN 'Autoevaluacion'
                    WHEN user_evaluations.type_evaluator_id = 3 THEN 'Cliente'
                    WHEN user_evaluations.type_evaluator_id = 4 THEN 'Lateral'
                    WHEN user_evaluations.type_evaluator_id = 5 THEN 'Colaborador'

                    ELSE 'unknown'  
                END,
                'unknown'
            ) as evaluator_type"
                )
            )
                ->join('users as U', 'U.id', 'user_evaluations.user_id')
                ->join('users as R', 'R.id', 'user_evaluations.responsable_id')
                ->join('evaluations as E', 'E.id', 'user_evaluations.evaluation_id')
                ->join('processes as P', 'P.id', 'user_evaluations.process_id')
                ->join('status as S', function ($status_join) {
                    return $status_join->on('S.status_id', 'user_evaluations.status_id')
                        ->where('S.table_name', 'user_evaluations');
                })
                /*   ->when(count($collaborators_id) > 0, function ($when) use ($collaborators_id) {
            return $when->whereIn('user_evaluations.user_id', $collaborators_id);
        })*/
                ->when(count($evaluations_id) > 0, function ($when) use ($evaluations_id) {
                    return $when->whereIn('user_evaluations.evaluation_id', $evaluations_id);
                })
                ->when(request('user_id') != 88 && request('user_id') != 19 && request('user_id') != 12, function ($when) use ($collaborators_id) {

                    return $when->where([
                        ['responsable_id', request('user_id')]
                    ]);
                })
                ->where(function ($query) use ($request) {
                    $query->where([
                        ['user_evaluations.process_id', 7]
                    ])->orWhere(function ($query) {
                        $query->whereIn('user_evaluations.process_id', [10, 11]);
                    });
                })
                // ->where('user_evaluations.responsable_id', $request->user_id)
                ->get();


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $personal_evaluations
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
    public function getFinish360(Request $request)
    {
        try {
            $user_finish = FinishEvaluation::where([
                ['finish_evaluations.user_id', $request->user_id],
                ['finish_evaluations.status', true]
            ])
                ->join('evaluations', 'finish_evaluations.evaluation_id', '=', 'evaluations.id')
                ->join('users', 'finish_evaluations.user_id', '=', 'users.id')
                ->select(
                    'finish_evaluations.*',
                    'evaluations.name as evaluation_name',
                    'evaluations.start_date as evaluation_start',
                    'evaluations.end_date as evaluation_end',
                    DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name")
                )
                ->get();


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $user_finish
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
    public function getUsersAdmin360(Request $request)
    {
        try {
            $finishEvaluations = FinishEvaluation::select(
                'finish_evaluations.user_id as id',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
            )
                ->join('users as U', 'U.id', 'finish_evaluations.user_id')
                ->where("finish_evaluations.evaluation_id", $request->evaluation_id)
                ->get();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $finishEvaluations
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
    public function getAssingUsers(Request $request)
    {
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

            foreach ($user_tests as $user_test) {
                $user_test_id = $user_test->id;

                $user_test_modules = UserTestModule::select('average')
                    ->where('user_test_id', $user_test_id)
                    ->get();

                $sum = 0;

                foreach ($user_test_modules as $module) {
                    $sum += $module->average;
                }

                $general = count($user_test_modules) > 0 ? $sum / count($user_test_modules) : 0;
                $user_test->total_score = round($general, 2);

                // Aquí puedes hacer lo que necesites con el valor $general
            }


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
    public function show(int $id)
    {

        //
        try {
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.

            $finishEvaluations = FinishEvaluation::select(
                'finish_evaluations.id as finish_evaluation_id',
                'finish_evaluations.evaluation_id as evaluation_id',
                'finish_evaluations.user_id as collaborator_id',
                'E.name as evaluation_name',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
                'finish_evaluations.status'
            )
                ->join('users as U', 'U.id', 'finish_evaluations.user_id')
                ->join('evaluations as E', 'E.id', 'finish_evaluations.evaluation_id')
                ->where("finish_evaluations.evaluation_id", $id)
                ->get();

            // Añadir lógica para devolver "Pendiente" o "Enviado" en función del status
            $finishEvaluations = $finishEvaluations->map(function ($item) {
                $item->status_label = $item->status == 0 ? 'Pendiente' : 'Enviado';
                return $item;
            });


            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',

                'users' => $finishEvaluations
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
    public function getPreview(Request $request)
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
                'module_id' => 'Nullable|Integer',
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
            $user_test_module = UserTestModule::join('test_modules', 'user_test_modules.module_id', '=', 'test_modules.id')
                ->select('user_test_modules.*', 'test_modules.name') // Selecciona todos los campos de user_test_modules y el campo module_name de test_modules
                ->where('user_test_modules.user_test_id', $request->user_test_id)
                ->get();

            $answers = UserTest::select('suggestions', 'chance', 'strengths')
                ->where('id', $request->user_test_id)
                ->get();
            $sum = 0;
            foreach ($user_test_module as $module) {
                $sum = $module->average + $sum;
            }
            $general = $sum / count($user_test_module);

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Modulo consultados correctamente',
                'module' =>  $user_test_module,
                'questions' => $answers,
                'general' => round($general, 2),
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
    public function saveAnswerAverage(Request $request)
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
            $count=0;
            foreach ($questions as $question) {
                $userAnswer = UserAnswer::where([
                    ['user_test_id', $request->user_test_id],
                    ['question_id',  $question->id]
                ])->first();
                $answer = Answer::where('id', $userAnswer->answer_id)->first();
                if($answer->description!='NA')
                {
                    $count++;
                }
                $sum = $sum + $answer->score;
            }
            if($count!=0)
            $average = round($sum / $count, 2);
            else
            $average =5;
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

    public function getAverages(Request $request)
    {
        try {
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
                if($request->user_id==1)
                {
                    $evaluatorTypes = [
                        2 => 'Autoevaluacion',
                        3 => 'Cliente',
                        5 => 'Colaborador',
                        
                    ];
                }else{
                    $evaluatorTypes = [
                        1 => 'Lider',
                        2 => 'Autoevaluacion',
                        3 => 'Cliente',
                        4 => 'Lateral',
                        5 => 'Colaborador',
                        
                    ];
                }
                $sumAverages=0;
                $averagesByType ;
                $sumAutoevaluacion=0;
                $evaluationsAll = UserTestModule::select(
                    'user_test_modules.id',
                    'user_test_modules.user_test_id',
                    'user_test_modules.module_id',
                    'user_test_modules.average',
                    'ET.id as evaluator_type_id'
                )
                    ->join('user_tests as UT', 'UT.id', 'user_test_modules.user_test_id')
                    ->join('user_evaluations as UE', 'UE.id', 'UT.user_evaluation_id')
                    ->join('user_answers as UA', 'UA.user_test_id', 'UT.id')
                    ->join('answers as A', 'A.id', 'UA.answer_id')
                    ->join('users as U', 'U.id', 'UE.user_id')
                    ->join('test_modules as tm', 'tm.id', 'user_test_modules.module_id')
                    ->join('evaluator_type as ET', 'ET.id', 'UE.type_evaluator_id')
                    ->where([
                        ['UE.evaluation_id', $request->evaluation_id],
                        ['UE.user_id', $request->user_id]
                    ])
                    ->groupBy( 'UT.strengths','UT.chance','UT.suggestions','tm.name', 'user_test_modules.id', 'user_test_modules.user_test_id', 'user_test_modules.module_id', 'user_test_modules.average', 'ET.id')
                    ->get();
                  
                    $graficaModulosObj=[];
                    $graficaModulosValues=[];
                    $graficaEvaluadorObj=[];
                    $graficaEvaluadorValue=[];
                    $Comments;
                    $evaluatorsAll=5;
                    $AverageGeneral=0;
                    $AverageAuto=0;
                    $question_averages=[];
                    $modules = TestModule::where('test_id', 134)->get();
                    $questionPromedio=0;
                    $questionAuto=0;
                    foreach ($evaluatorTypes as $evaluatorType => $evaluatorTypeName) {
                    $evaluations = $evaluationsAll->where('evaluator_type_id',$evaluatorType );
                    $answers = UserTest::select('suggestions', 'chance', 'strengths')
                    ->whereIn('id', $evaluations->pluck('user_test_id'))
                    ->get();
                    $Comments[$evaluatorTypeName]=$answers;
                    // Inicializar el array para el tipo de evaluador actual

                    $averageObject = new \stdClass();
                    
                    $lastKey =  count($modules)-1;
                   
                    foreach ($modules as $key => $module) {

                        $evaluationsModule = $evaluations->where('module_id', $module->id);
                        $evaluationsNA = $evaluations->where('module_id', $module->id)->where('average', 0);
                    
                        // Calcular la suma total
                        $totalScoreSum = $evaluationsModule->sum('average');
                    
                        // Dividir entre la cantidad de evaluaciones
                        $average = count($evaluationsModule) > 0 ? $totalScoreSum / (count($evaluationsModule) - count($evaluationsNA)) : 0;
                    
                        $averagesByType[$module->name][$evaluatorTypeName] = $average;
                        $questions = Question::where('module_id', $module->id)->get();
                        // Fetch answers from UserAnswer based on the current test and module
                        $NA = UserAnswer::select('answers.score', 'user_answers.question_id','answers.description', 'user_answers.answer_id','user_test_id')
                        ->join('answers', 'user_answers.answer_id', '=', 'answers.id')
                        ->whereIn('user_test_id', $evaluations->pluck('user_test_id'))
                        ->whereIn('user_answers.question_id', $questions->pluck('id'))
                        ->get();
                       
                            foreach ($NA as $answer) {
                                // Obtener user_answers con NA y sin NA
                                $questionText = $questions->where('id', $answer->question_id)->first()->description;
                                $countNA= $NA->where('question_id', $answer->question_id)->where('description','NA')->all();
                                $countAnswers=$NA->where('question_id', $answer->question_id)->all();
                              
                                // Calcular promedios
                                $evaluatorType = $evaluatorType;
                                $countAnswersCollection = collect($countAnswers);
                                $answersAverage = $countAnswersCollection->pluck('score')->sum();
                                $divisor = count($countAnswers);
                            
                                // Si existe mas de un NA en este conjunto de user_answers
                                if (count($countNA) >0) {
                                    
                                    $divisor = $divisor -count($countNA); 
                                 
                                   
                                   
                                }   // Si todas las preguntas con NA
                                if(count($countNA)  ==count($countAnswers))
                                {
                                    $question_averages[$module->name][$questionText][$evaluatorTypeName] = 0;
                                }            
                                else{         
                                // Verificar si ya existe un promedio para esta pregunta, evaluador y módulo
                                if (!isset($question_averages[$module->name][$questionText][$evaluatorTypeName])) {
                                    $question_averages[$module->name][$questionText][$evaluatorTypeName] = round(($answersAverage / $divisor),2);
                                 
    
                                }      
                            }
                            }
                    
                    }
                   
                   
                }
     // Recorre los promedios de cada módulo y evaluador
            foreach ($averagesByType as $moduleName => $evaluatorData) {
                foreach ($evaluatorData as $evaluatorTypeName => $average) {
                    foreach ($question_averages[$moduleName] as $questionText => &$evaluatorAverages) {
                        // Si esta pregunta aún no tiene un arreglo para almacenar los promedios, inicialízalo
                        if (!isset($evaluatorAverages['Promedio'])) {
                            $evaluatorAverages['Promedio'] = 0;
                        }
                        if (!isset($evaluatorAverages['PromedioSinAuto'])) {
                            $evaluatorAverages['PromedioSinAuto'] = 0;
                        }
                        
                        // Suma el promedio del evaluador al promedio de la pregunta
                      // Verifica si la clave 'Autoevaluacion' está definida en $evaluatorAverages
                        if (isset($evaluatorAverages[$evaluatorTypeName])) {
                            // Suma el valor de 'Autoevaluacion' al promedio
                            $evaluatorAverages['Promedio'] += $evaluatorAverages[$evaluatorTypeName];
                        }

                        
                        // Si no es autoevaluación, suma el promedio del evaluador al promedio sin autoevaluación de la pregunta
                        if ($evaluatorTypeName !== 'Autoevaluacion') {
                            // Verifica si la clave 'Autoevaluacion' está definida en $evaluatorAverages
                            if (isset($evaluatorAverages[$evaluatorTypeName])) {
                                // Suma el valor de 'Autoevaluacion' al promedio
                                $evaluatorAverages['PromedioSinAuto'] += $evaluatorAverages[$evaluatorTypeName];

                            }

                        }
                    }
                }
            }

            // Calcula el promedio total de los evaluadores por pregunta dividiendo por el número total de evaluadores
            foreach ($question_averages as $moduleName => &$moduleQuestions) {
                foreach ($moduleQuestions as $questionText => &$evaluatorAverages) {
                    $totalEvaluators = count($averagesByType[$moduleName]);
                    $evaluatorAverages['Promedio'] /= $totalEvaluators;
                    $evaluatorAverages['PromedioSinAuto'] /= ($totalEvaluators - 1); // Excluye la autoevaluación
                    // Aquí puedes hacer cualquier otra operación que necesites con los promedios
                }
            }

            // Ahora $question_averages contiene el promedio y el promedio sin autoevaluación por pregunta

                
                foreach ($averagesByType as $moduleName => $evaluatorData) {
                    $sumAll = 0;
                    $sumExcludingAutoevaluacion = 0;
                    $countAll = 0;
                    $countExcludingAutoevaluacion = 0;
                
                    foreach ($evaluatorData as $evaluatorType => $average) {
                        // Sumar todos los valores
                        $sumAll += $average;
                        $countAll++;
                
                        // Excluir 'Autoevaluacion' de la suma
                        if ($evaluatorType !== 'Autoevaluacion') {
                            $sumExcludingAutoevaluacion += $average;
                            $countExcludingAutoevaluacion++;
                        }
                
                    }
                
                    // Calcular promedios
                    $averageAll = ($countAll > 0) ? $sumAll / $countAll : 0;
                    $averageExcludingAutoevaluacion = ($countExcludingAutoevaluacion > 0) ? $sumExcludingAutoevaluacion / $countExcludingAutoevaluacion : 0;
                
                    // Añadir promedios al array
                    $averagesByType[$moduleName]['Promedio'] = round($averageAll, 2);
                    $AverageGeneral=$AverageGeneral+round($averageAll, 2);
                    $averagesByType[$moduleName]['PromedioSinAutoevaluacion'] = round($averageExcludingAutoevaluacion, 2);
                    $AverageAuto=$AverageAuto+round($averageExcludingAutoevaluacion, 2);

                    array_push($graficaModulosObj,$moduleName);
                    array_push($graficaModulosValues,round($averageAll, 2));
                }
                //recorrer nuevamente para sacar el  promedio total por evaluador
                $averagesAllModules=[];
                $evaluatorTypesCount = count($evaluatorTypes);
                $modulesCount = count($modules);
                foreach ($evaluatorTypes as $keyType => $evaluatorType) {
                    $averageTotal =0;
                    $countNA=0;
                    $sumTotalMod = 0;
                    foreach ($modules as $keyModule => $module) {
                        $sumTotalMod += $averagesByType[$module->name][$evaluatorType];
                        if($averagesByType[$module->name][$evaluatorType]==0)
                           $countNA++;

                    }
                        $divisor=(count($modules)-$countNA);
                       
                        $averageTotal =$divisor!=0?($sumTotalMod) / $divisor:0;
                   $averagesAllModules[$evaluatorType]= $averageTotal;
                   array_push($graficaEvaluadorObj,$evaluatorType);
                   array_push($graficaEvaluadorValue,$averageTotal);

                }
                $AverageAuto=$AverageAuto/10;
                $AverageGeneral=  $AverageGeneral/10;
                $users = User::select(DB::raw("CONCAT(name, ' ', father_last_name, ' ', mother_last_name) as collaborator_name"), 'email')
                ->where('id', $request->user_id)
                ->first();
                return response()->json([
                    'title' => 'Proceso terminado',
                    'message' => 'Evaluaciones del usuario consultadas correctamente',
                    'modulos' => $averagesAllModules,
                    'evaluador' => $averagesByType,
                    'evaluator_keys' => $graficaEvaluadorObj,
                    'evaluator_values' => $graficaEvaluadorValue,
                    'modules_keys' => $graficaModulosObj,
                    'modules_values' => $graficaModulosValues,
                    'question_averages'=>$question_averages,
                    'Comments'=>$Comments,
                    'general_average'=>$AverageGeneral,
                    'general_auto_average'=>$AverageAuto,
                    'user'=>$users 

                ]);

        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X099'
            ], 500);
        }
    }
}
