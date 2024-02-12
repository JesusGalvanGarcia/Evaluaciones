<?php

namespace App\Http\Controllers;
use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\ActionPlanParameter;
use App\Models\ActionPlanSignature;
use App\Services\TestService;
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

use App\Services\UserService;
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
            try{
                //Traer los datos del index de examenes
                // Se consultan las pruebas de la evaluación asignadas.
                $evaluations = Evaluation::all();

                
    
                return response()->json([
                    'title' => 'Proceso terminado',
                    'message' => 'Examenes consultados correctamente',
                  
                    'evaluations'=>$evaluations
                ]);
    
            }catch(Exception $e)
            {
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
        try{
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $users = User::selectRaw("id, CONCAT(name, ' ', father_last_name, ' ', mother_last_name) as collaborator_name")->get();

            

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',
              
                'evaluations'=>$users
            ]);

        }catch(Exception $e)
        {
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
        try{
            //Traer los datos del index de examenes
            // Se consultan las pruebas de la evaluación asignadas.
            $users = User::select('users.id', DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"))
            ->join('Finish_evaluations', 'Finish_evaluations.user_id', '=', 'users.id')
            ->groupBy('users.id', 'users.name', 'users.father_last_name', 'users.mother_last_name')
            ->get();
        
            

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',
              
                'evaluations'=>$users
            ]);

        }catch(Exception $e)
        {
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
        try{ 
            
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);

            $existingRecords = DB::table('user_evaluations')
            ->join('users', 'user_evaluations.responsable_id', '=', 'users.id')
            ->select('user_evaluations.responsable_id as id',DB::raw("CONCAT(users.name, ' ', users.father_last_name, ' ', users.mother_last_name) as collaborator_name"),
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
            'existingRecords'=>$existingRecords
        ]);
            }catch(Exception $e)
            {
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
        try{
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
            foreach ($usersData as $user)
             {
                TestService::sendEmail360($user->name,$evaluationName,$user->email);
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
        ->where('process_id',6)
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
    $signature=[];
    $userIdsArray = $actionPlan->pluck('user_id')->toArray();
    $responsableIdsArray = $actionPlan->pluck('responsable_id')->toArray();
    $action_plan = UserActionPlan::
    whereIn('user_id',$userIdsArray)
    ->whereIn('responsable_id', $responsableIdsArray)
    ->where('action_plan_id', 2)
    ->get();
  
    foreach($action_plan as $plan)
    {
        $signature[] = 
        [
            'user_action_plan_id' => $plan->id,
            'responsable_id' => $plan->responsable_id,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
   
    foreach($signature as $item)
    {

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
        try{
        $validator = Validator::make(request()->all(), [
            'user_id' => 'Required|Integer|NotIn:0|Min:0',
            'users' => 'Array|Nullable',
            'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
        ]);
  
        $userIds = collect($request->users)->pluck('id')->toArray();
        //enviar correo 
        // Obtener los correos electrónicos de los usuarios

        //tabla con los usuarios
        foreach($userIds as $user)
        {
            FinishEvaluation::create([
                'user_id' => $user,
                'evaluation_id' => $request->evaluation_id,
                'status' => false,
                'created_by' => $request->user_id, // Utilizamos Auth::id() para obtener el ID del usuario autenticado
                'updated_by' => $request->user_id, // O ajusta según sea necesario
                'deleted_by' => null, // O ajusta según sea necesario
                'created_at' => now(), // Utilizamos now() para obtener la fecha y hora actual
                'updated_at' => now(), // O ajusta según sea necesario
                'deleted_at' => null, 
            ]);
        }

        //Autoevaluacion
        $userAutoevaluation = collect($userIds)->map(function ($item) {
            return [
                'user_id' => $item,
                'responsable_id' => $item,
                'type' => 2,
            ];
        });
        
        //consulta para traer  colaboradores
        $userCollaboratorIds = UserCollaborator::whereIn('user_id', $userIds)
        ->select('user_id', 'collaborator_id as responsable_id')
        ->get();
        //asignando  identificador de tipo  examen
        $userCollaboratorIds = $userCollaboratorIds->map(function ($item) {
            // Añadir la nueva propiedad con el valor que desees
            $item->type = 5;
            
            return $item;
        });
        //consulta para traer lider
        $userCollaboratorLiderIds = UserCollaborator::whereIn('collaborator_id', $userIds)
        ->select('user_id as responsable_id', 'collaborator_id as user_id') //ahora el responsable es el user_id
        ->get();
        //asignando identificador de tipo examen
        $userCollaboratorLiderIds = $userCollaboratorLiderIds->map(function ($item) {
            // Añadir la nueva propiedad con el valor que desees
            $item->type = 1;
            
            return $item;
        });
        //consulta para traer laterales
        $userLiderIds = collect($userCollaboratorLiderIds)->pluck('responsable_id')->toArray();
       
        $userCollaboratorLiderIds2 = UserCollaborator::whereIn('user_id', $userLiderIds)
        ->select('collaborator_id as responsable_id','user_id') 
        ->whereNotIn('collaborator_id', $userIds)
        ->get()
        ->toArray();
       
// Convert the result to a collection
        $userCollaboratorLiderIds2 = collect($userCollaboratorLiderIds2);

        // Assigning identifier type
        $userCollaboratorLiderIds2 = $userCollaboratorLiderIds2->map(function ($item) use ($userCollaboratorLiderIds) {
            // Add the new property with the desired value
            $item['type'] = 4;

            // Find the matching item in $userCollaboratorLiderIds based on responsable_id
            $matchingItem = $userCollaboratorLiderIds->first(function ($userCollaborator) use ($item) {
                return $userCollaborator['responsable_id'] === $item['user_id'];
            });

            // Set user_id based on the matching item
            $item['user_id'] = $matchingItem ? $matchingItem['user_id'] : null;

            return $item;
        });


        $evaluationsTotal=  array_merge(
            $userCollaboratorIds->toArray(),
            $userCollaboratorLiderIds->toArray(),
            $userCollaboratorLiderIds2->toArray(),
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
        ->where('process_id',7)
        ->where('evaluation_id', $request->evaluation_id)
        ->pluck('id')
        ->toArray();
        //hacer un  pluck pero  de los responsable_id
        $responsables_ds = UserEvaluation::whereIn('user_id', $userIdsTotal)
        ->whereIn('responsable_id', $userRespTotal)
        ->where('process_id',7)
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
    foreach ($usersData as $user)
     {
        TestService::sendEmail360($user->name,$evaluationName,$user->email);
    }

    $user_evaluations = UserEvaluation::whereIn('user_id', $userIdsMatch)
        ->where('evaluation_id', $request->evaluation_id)
        ->where('process_id', 7)
        ->get();
    $user_evaluations =  $user_evaluations->filter(function ($item) {
        return $item['type_evaluator_id'] != 2;
    });

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
    $signature=[];
    $signatureResponsable=[];
    $userIdsArray = $actionPlan->pluck('user_id')->toArray();
    $responsableIdsArray = $actionPlan->pluck('responsable_id')->toArray();
    $action_plan = UserActionPlan::
    whereIn('user_id',$userIdsArray)
    ->whereIn('responsable_id', $responsableIdsArray)
    ->where('action_plan_id', 3)
    ->get();
  
    foreach($action_plan as $plan)
    {
        $signature[] = 
        [
            'user_action_plan_id' => $plan->id,
            'responsable_id' => $plan->responsable_id,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
   
    foreach($signature as $item)
    {

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
            'test'=>$InsertCollaboratorsTest,
            'user_evaluations'=>$InsertCollaborators,
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
        try{ 
            
            $idEvaluation=$request->evaluation_id;
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'users' => 'Array|Nullable',
                'evaluation_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
                'responsable_id.*' => 'Integer|NotIn:0|Min:0|Distinct',
            ]);

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
        foreach ($usersData as $user)
         {
            TestService::sendEmail360($user->name,$evaluationName,$user->email);
        }
         
        foreach ($request->users as $user) {
            $userId = isset($user['id']) ? $user['id'] : null;
            $evaluationId = $request->evaluation_id;  
            $responsableId = $request->responsable_id; 
         
          $newuser= UserEvaluation::create([
                'user_id' => $responsableId ,
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
            $test= Test::where('evaluation_id',$evaluationId)->first();
            UserTest::create([
                'test_id' => $test->id,
                'total_score' => 0,
                'status_id' =>1,
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
     
        $userIdsMatch = collect($request->users)->pluck('id')->toArray();
        DB::beginTransaction();
        $user_evaluations = UserEvaluation::whereIn('responsable_id', $userIdsMatch)
        ->where('evaluation_id', $request->evaluation_id)
        ->where('process_id', 7)
        ->where('type_evaluator_id', 3)
        ->get();
    $user_evaluations =  $user_evaluations->filter(function ($item) {
        return $item['type_evaluator_id'] != 2;
    });

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
    $signature=[];
    $userIdsArray = $actionPlan->pluck('user_id')->toArray();
    $responsableIdsArray = $actionPlan->pluck('responsable_id')->toArray();
    $action_plan = UserActionPlan::
    whereIn('user_id',$userIdsArray)
    ->whereIn('responsable_id', $responsableIdsArray)
    ->where('action_plan_id', 3)
    ->get();
  
    foreach($action_plan as $plan)
    {
        $signature[] = 
        [
            'user_action_plan_id' => $plan->id,
            'responsable_id' => $plan->responsable_id,
            'created_at' => now(),
            'updated_at' => now(),
            'deleted_at' => null,
        ];
    }
   
    foreach($signature as $item)
    {

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
            }catch(Exception $e)
            {
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
       try{
        $user_finish  = FinishEvaluation::where([
            ['user_id', $request->user_id],
            ['evaluation_id', $request->evaluation_id ],
        ])->first();
       
             $user_finish->update(
                [
                    'status' => true
                ]
            );
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',
              
                'users'=>$user_finish
            ]);
       }catch(Exception $e)
       {
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
        try{

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
          
            'user_action_plan'=>$user_action_plan
        ]);
    }catch(Exception $e)
    {
  
     return response()->json([
         'title' => 'Ocurrio un error en el servidor',
         'message' => $e->getMessage() . ' -L:' . $e->getLine(),
         'code' => $this->prefix . 'X699'
     ], 500);
    }
    }
    public function get360(Request $request)
    {
       try{
        
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
            DB::raw("
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
        ->where('user_evaluations.user_id',$request->user_id)
        ->get();
 
     
            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Examenes consultados correctamente',
              
                'users'=>$personal_evaluations
            ]);
       }catch(Exception $e)
       {
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
       try{
        
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
            DB::raw("
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
              
                'users'=>$personal_evaluations
            ]);
       }catch(Exception $e)
       {
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
       try{
    $user_finish = FinishEvaluation::where([
        ['finish_evaluations.user_id', $request->user_id],
        ['finish_evaluations.status',true]
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
              
                'users'=>$user_finish
            ]);
       }catch(Exception $e)
       {
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
           try{
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
          
            'users'=>$finishEvaluations
        ]);
       }catch(Exception $e)
       {
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
    public function show(int $id)
    {
       
            //
            try{
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
                  
                    'users'=>$finishEvaluations
                ]);
    
            }catch(Exception $e)
            {
                DB::rollBack();
                return response()->json([
                    'title' => 'Ocurrio un error en el servidor',
                    'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                    'code' => $this->prefix . 'X699'
                ], 500);
            }
        
    }
}