<?php

namespace App\Http\Controllers\Evaluations\Evaluation;

use App\Http\Controllers\Controller;

use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\ActionPlanParameter;
use App\Models\ActionPlanSignature;
use App\Models\Question;
use App\Models\Test;
use App\Models\UserActionPlan;
use App\Models\UserAgreement;
use App\Models\UserEvaluation;
use App\Services\Evaluations\ActionPlanService;
use App\Services\Evaluations\UserService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class UserActionPlanController extends Controller
{
    private $prefix = 'UserActionPlan';

    public function index()
    {
        //
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
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_action_plan_id' => 'Required|Integer|NotIn:0|Min:0',
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
                    'code' => $this->prefix . 'X103'
                ], 400);

            $user_action_plan = UserActionPlan::firstWhere([['id', $request->user_action_plan_id], ['status_id', '!=', 3]]);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'Plan de acción no valido',
                    'message' => 'Es posible que el plan de acción ya haya sido finalizado, solicite al adminitrador acceso para editarlo.',
                    'code' => $this->prefix . 'X104'
                ], 400);
            if ($user_action_plan->responsable_id != $request->user_id)
                return response()->json([
                    'title' => 'Plan de acción no valido',
                    'message' => 'Es posible que no tenga acceso a llenar este plan de accion.',
                    'code' => $this->prefix . 'X104'
                ], 400);
            DB::beginTransaction();

            UserAgreement::create([
                'user_action_plan_id' => $request->user_action_plan_id,
                'opportunity_area' => $request->opportunity_area,
                'goal' => $request->goal,
                'developed_skill' => $request->developed_skill,
                'action' => $request->action,
                'established_date' => $request->established_date,
                'principal_agreement' => 0,
                'created_by' => $request->user_id,
                'updated_by' => $request->user_id
            ]);

            if ($user_action_plan->status_id == 1)
                $user_action_plan->update([
                    'status_id' => 2,
                    'updated_by' => $request->user_id
                ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Acuerdo guardado correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
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

            $user_action_plan = UserActionPlan::select(
                'user_action_plans.id',
                'user_action_plans.user_id',
                'user_action_plans.action_plan_id',
                'user_action_plans.finish_date',
                'user_action_plans.responsable_id',
                'user_action_plans.status_id',
                'AP.name as action_plan_name',
                'E.name as evaluation_name'
            )
                ->join('action_plans as AP', 'AP.id', 'user_action_plans.action_plan_id')
                ->join('evaluations as E', 'E.id', 'AP.evaluation_id')
                ->find($id);

            try {

                $user_test_modules = $user_action_plan
                    ->action_plan
                    ->evaluation
                    ->user_evaluations
                    ->where('user_id', $user_action_plan->user_id)
                    ->firstOrFail() // Asumiendo que se espera que haya un resultado
                    ->user_tests
                    ->first(function ($userTest) {
                        return Test::find($userTest->test_id)->modular ?? false;
                    });

                if ($user_test_modules) {
                    $user_test_modules = $user_test_modules
                        ->user_test_modules()
                        ->with('module:id,name') // Cargar la relación 'module'
                        ->get()
                        ->map(function ($module) {
                            return [
                                'id' => $module->id,
                                'user_test_id' => $module->user_test_id,
                                'module_id' => $module->module_id,
                                'note' => $module->note,
                                'created_at' => $module->created_at,
                                'updated_at' => $module->updated_at,
                                'deleted_at' => $module->deleted_at,
                                'average' => ($module->average * 100) / 5,
                                'module_name' => $module->module->name,
                                'question' => Question::select('questions.description')
                                    ->join('user_answers as UA', 'UA.question_id', 'questions.id')
                                    ->join('answers as A', 'A.id', 'UA.answer_id')
                                    ->where([
                                        ['questions.module_id', $module->id],
                                        ['UA.user_test_id', $module->user_test_id]
                                    ])
                                    ->orderBy('A.score')
                                    ->first()
                            ];
                        });
                } else {
                    $user_test_modules = collect(); // O devolver una colección vacía si no se encuentra ningún usuario de prueba modular
                }
            } catch (Exception $e) {

                return response()->json([
                    'title' => 'Plan de Acción no disponible',
                    'message' => $e->getMessage(),
                    'code' => $this->prefix . 'X206'
                ], 400);
            }

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'Plan de Acción no disponible',
                    'message' => 'El plan de acción no está asignado.',
                    'code' => $this->prefix . 'X203'
                ], 400);

            if ($user_action_plan->status_id == 1)
                UserActionPlan::where('id', $user_action_plan->id)->update(
                    ['status_id' => 2],
                    ['updated_by' => request('user_id')]
                );

            $action_plan_agreements = UserAgreement::select(
                'id',
                'opportunity_area',
                'goal',
                'developed_skill',
                'action',
                'established_date',
                'principal_agreement'
            )
                ->where('user_action_plan_id', $id)
                ->get();

            $signatures = ActionPlanSignature::select(
                'action_plan_signatures.id',
                'action_plan_signatures.responsable_id',
                'action_plan_signatures.url',
                'action_plan_signatures.signature_date',
                DB::raw("CONCAT(U.name, ' ', U.father_last_name, ' ', U.mother_last_name) as collaborator_name"),
            )->join('users as U', 'U.id', 'action_plan_signatures.responsable_id')
                ->where([['user_action_plan_id', $id]])

                ->get();

            if (!$signatures->firstWhere('responsable_id', request('user_id')) && request('user_id') != 19 && request('user_id') != 88)
                return response()->json([
                    'title' => 'No estás autorizado.',
                    'message' => 'El plan de acción no está disponible, contacta al administradoor.',
                    'code' => $this->prefix . 'X204'
                ], 400);

            // Se consulta la evaluación del usuario
            $user_evaluation = ActionPlanService::findUserActionPlan($user_action_plan);

            $userPermission = UserService::checkUserPermisse('Acceso Administracion desempeno', $user);
            if (!$userPermission && $user_evaluation->responsable_id != request('user_id') && $user_evaluation->user_id != request('user_id'))
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X202'
                ], 400);
            if (!$user_evaluation)
                return response()->json([
                    'title' => 'No se encontró información',
                    'message' => 'Está evaluación no es valida.',
                    'code' => $this->prefix . 'X205'
                ], 400);

            /* if ($user_evaluation->process_id != 5)
                $user_evaluation->update([
                    'process_id' => 4
                ]);*/

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle del Plan de Acción del Usuario consultado correctamente',
                'user_action_plan' => $user_action_plan,
                "agreements" => $action_plan_agreements,
                "signatures" => $signatures,
                "strengths" => $user_test_modules->where('average','>=',85)->values(),
                "opportunity_areas" => $user_test_modules->where('average','<',85)->values(),
                "notes" =>  $user_test_modules
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X299'
            ], 500);
        }
    }

    public function update(Request $request, string $id)
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
                'user_action_plan_id' => 'Required|Integer|NotIn:0|Min:0',
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X301'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X302'
                ], 400);

            $user_action_plan = UserActionPlan::firstWhere([['id', $request->user_action_plan_id], ['status_id', '!=', 3]]);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'Plan de acción no valido',
                    'message' => 'Es posible que el plan de acción ya haya sido finalizado, solicite al adminitrador acceso para editarlo.',
                    'code' => $this->prefix . 'X303'
                ], 400);

            $agreement = UserAgreement::find($id);

            if (!$agreement)
                return response()->json([
                    'title' => 'Acuerdo no valido',
                    'message' => 'No se encontró esté acuerdo, favor de validar la información.',
                    'code' => $this->prefix . 'X303'
                ], 400);

            DB::beginTransaction();

            $agreement->update([
                'user_action_plan_id' => $request->user_action_plan_id,
                'opportunity_area' => $request->opportunity_area,
                'goal' => $request->goal,
                'developed_skill' => $request->developed_skill,
                'action' => $request->action,
                'established_date' => $request->established_date,
                'updated_by' => $request->user_id
            ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Acuerdo actualizado correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X399'
            ], 500);
        }
    }

    public function destroy(string $id)
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
                    'code' => $this->prefix . 'X401'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X402'
                ], 400);

            // $user_action_plan = UserActionPlan::firstWhere([['id', $request->user_action_plan_id], ['status_id', '!=', 3]]);

            // if (!$user_action_plan)
            //     return response()->json([
            //         'title' => 'Plan de acción no valido',
            //         'message' => 'Es posible que el plan de acción ya haya sido finalizado, solicite al adminitrador acceso para editarlo.',
            //         'code' => $this->prefix . 'X303'
            //     ], 400);

            $agreement = UserAgreement::find($id);

            if (!$agreement)
                return response()->json([
                    'title' => 'Acuerdo no valido',
                    'message' => 'No se encontró esté acuerdo, favor de validar la información.',
                    'code' => $this->prefix . 'X403'
                ], 400);

            DB::beginTransaction();

            $agreement->update([
                'deleted_by' => request('user_id')
            ]);

            $agreement->delete();

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Acuerdo actualizado correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();
            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefix . 'X499'
            ], 500);
        }
    }

    public function storeSignature(Request $request)
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

            // Se validan los parametros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'user_action_plan_id' => 'Required|Integer|NotIn:0|Min:0',
                'signature' => 'Required'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefix . 'X501'
                ], 400);
            }
            // Se valida al usuario
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X502'
                ], 400);

            // Se consulta el plan de acción del usuario
            $user_action_plan = UserActionPlan::firstWhere('id', $request->user_action_plan_id);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'No se encontró información',
                    'message' => 'Esté plan de acción no es valido.',
                    'code' => $this->prefix . 'X503'
                ], 400);

            // Se consulta la evaluación del usuario
            $user_evaluation = ActionPlanService::findUserActionPlan($user_action_plan);

            if (!$user_evaluation)
                return response()->json([
                    'title' => 'No se encontró información',
                    'message' => 'Está evaluación no es valida.',
                    'code' => $this->prefix . 'X504'
                ], 400);

            // Se crea el nombre del archivo
            $file_name = Str::upper(Str::uuid());

            // Se consulta la firma que se va a guardar y se valida
            $signature = ActionPlanSignature::where([
                ['user_action_plan_id', $request->user_action_plan_id],
                ['responsable_id', $request->user_id],
                ['url', null]
            ])
                ->first();

            if (!$signature)
                return response()->json([
                    'title' => 'Firma no disponible',
                    'message' => 'Es posible que no tengas autorización para firmar o que ya se haya firmado anteriormente.',
                    'code' => $this->prefix . 'X505'
                ], 400);

            // Se le da formato al archivo recibido y se carga al servidor
            $format = explode(";base64", explode("data:image/", $request->signature)[1])[0];
            $path_url = "https://trinizone.s3.us-east-2.amazonaws.com/Evaluaciones/PlanesDeAccion/$user_action_plan->id/$request->user_id/$file_name.$format";
            $image = str_replace('data:image/' . $format . ';base64,', '', $request->signature);
            $image = str_replace(' ', '+', $image);
            Storage::disk('s3')->put("/Evaluaciones/PlanesDeAccion/$user_action_plan->id/$request->user_id/$file_name.$format", base64_decode($image));

            DB::beginTransaction();

            // Se actualiza la información de la firma en la BD
            $signature->update([
                'file_name' => $file_name,
                'url' => $path_url,
                'signature_date' => Carbon::now()->format('Y-m-d')
            ]);

            // Si ya se han realizado todas las firmas se actualiza el estado de la evaluación
            $pending_signatures = ActionPlanSignature::where([
                ['user_action_plan_id', $request->user_action_plan_id],
                ['url', null]
            ])->get();

            if ($pending_signatures->count() == 0) {

                UserEvaluation::find($user_evaluation->id)->update([
                    'finish_date' => Carbon::now()->format('Y-m-d'),
                    'status_id' => 3,
                    'updated_by' => $request->user_id
                ]);

                ActionPlanService::sendConfirmSignaturesMail($user_evaluation, $user_evaluation->evaluation->name);
            }

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Firma guardada correctamente'
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

    public function confirmActionPlan(Request $request)
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
                'user_action_plan_id' => 'Required|Integer|NotIn:0|Min:0',
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

            $user_action_plan = UserActionPlan::firstWhere([['id', $request->user_action_plan_id], ['status_id', '!=', 3]]);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'Plan de acción no valido',
                    'message' => 'Es posible que el plan de acción ya haya sido finalizado, contacte al administrado.',
                    'code' => $this->prefix . 'X603'
                ], 400);

            if ($user_action_plan->responsable_id != $request->user_id)
                return response()->json([
                    'title' => 'Confirmación Cancelada',
                    'message' => 'No tienes permiso para confirmar esté plan de acción.',
                    'code' => $this->prefix . 'X603'
                ], 400);

            // Se consulta la evaluación del usuario
            $user_evaluation = ActionPlanService::findUserActionPlan($user_action_plan);

            if (!$user_evaluation)
                return response()->json([
                    'title' => 'No se encontró información',
                    'message' => 'Está evaluación no es valida.',
                    'code' => $this->prefix . 'X504'
                ], 400);

            DB::beginTransaction();

            // Se finaliza el plan de acción
            $user_action_plan->update([
                'status_id' => 3,
                'updated_by' => $request->user_id,
                'finish_date' => Carbon::now()->format('Y-m-d')
            ]);
            $processId = $user_evaluation->process_id;

            switch ($processId) {
                case 8:
                    $newProcessId = 9;
                    break;
                case 10:
                    $newProcessId = 11;
                    break;
                default:
                    $newProcessId = 15;
            }
            // La evaluación pasa a estar en el proceso de firmas
            UserEvaluation::where('id', $user_evaluation->id)->update([
                'process_id' => $newProcessId,
                'status_id' => 3,
                'updated_by' => $request->user_id
            ]);

            DB::commit();

            // Se envía el correo de confirmación del plan de acción.
           // if($newProcessId ==5)
            ActionPlanService::sendConfirmMail($user_evaluation, $user_evaluation->evaluation->name,"ActionPlanComplete");
           // else
           // ActionPlanService::sendConfirmMail($user_evaluation, $user_evaluation->evaluation->name,"ActionPlan350");

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Plan de acción confirmado correctamente'
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
}
