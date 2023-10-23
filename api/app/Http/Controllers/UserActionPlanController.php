<?php

namespace App\Http\Controllers;

use App\Models\ActionPlan;
use App\Models\ActionPlanAgreement;
use App\Models\UserActionPlan;
use App\Services\UserService;
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
                'save_type' => 'Required|Integer|NotIn:0|Min:0',
                'agreements' => 'Required|Array',
                'agreements.*.id' => 'Nullable|Integer|NotIn:0|Min:0',
                'agreements.*.parameter_id' => 'Required|Integer|NotIn:0|Min:0',
                'agreements.*.description' => 'Nullable|String',
                'agreements.*.line' => 'Required|Integer|NotIn:0|Min:0'
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

            $user_action_plan = UserActionPlan::firstWhere('id', $request->user_action_plan_id);

            DB::beginTransaction();

            if ($request->agreements)

                foreach ($request->agreements as $agreement) {

                    // Se evalua si la celda del acuerdo ya existia para actualizarlo, caso contrario se crea un nuevo registro.
                    if ($agreement['id'])
                        ActionPlanAgreement::where('id', $agreement['id'])->update([
                            'user_action_plan_id' => $request->user_action_plan_id,
                            'action_plan_parameter_id' => $agreement['parameter_id'],
                            'description' => $agreement['description'],
                            'line' => $agreement['line']
                        ]);
                    else
                        ActionPlanAgreement::create([
                            'user_action_plan_id' => $request->user_action_plan_id,
                            'action_plan_parameter_id' => $agreement['parameter_id'],
                            'description' => $agreement['description'],
                            'line' => $agreement['line']
                        ]);
                }

            // Se actuliza el plan de acción, si el parametro "save_type" es 2 significa que se ha finalizado el plan de acción.  
            $user_action_plan->update([
                'status_id' => $request->save_type == 1 ? 2 : 3,
                'finish_date' => $request->save_type == 1 ? '' : Carbon::now()->format('Y-m-d'),
                'updated_by',
            ]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Plan de acción ' . ($request->save_type == 1 ? 'Guardado' : 'Finalizado') . ' correctamente'
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

            $user_action_plan = UserActionPlan::find($id);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'Plan de Acción no disponible',
                    'message' => 'El plan de acción no está asignado.',
                    'code' => $this->prefix . 'X203'
                ], 400);

            $action_plan = ActionPlan::select(
                'id',
                'name'
            )
                ->with('parameters:id,description,value_type,action_plan_id')
                ->find($user_action_plan->action_plan_id);

            $action_plan_agreements = ActionPlanAgreement::where('user_action_plan_id', $user_action_plan->id)->orderBy('line')->orderBy('action_plan_parameter_id')->get();

            $agreements = collect([]);
            $line_agreements = collect([]);
            $agreement_line = 0;
            $agreements_counter = 0;

            // Se recorren los acuerdos para generar la estructura
            foreach ($action_plan_agreements as $agreement) {

                if ($agreement->line != $agreement_line) {

                    // Se agrega el listado de acuerdos al arreglo de la linea, siempre y cuando la linea sea mayor a 0.
                    if ($agreement_line > 0) {
                        $agreements = $agreements->push(["line" => $agreement_line, "agreements" => $line_agreements]);

                        $line_agreements = collect([]);
                    }

                    // Si la linea del arreglo es diferente a la anterior, se empieza un nuevo objeto de la linea nueva.
                    $agreement_line = $agreement->line;
                }

                $line_agreements->push([
                    "id" => $agreement->id,
                    "parameter_id" => $agreement->action_plan_parameter_id,
                    "description" => $agreement->description
                ]);

                $agreements_counter++;
                // Se agrega el listado de acuerdos al arreglo de la linea,cuando se hayan completado .
                if ($agreements_counter == $action_plan_agreements->count()) {

                    $agreements = $agreements->push(["line" => $agreement_line, "agreements" => $line_agreements]);

                    $line_agreements = collect([]);
                }
            }

            return response()->json([
                'title' => 'Proceso terminado',
                'message' => 'Detalle del Plan de Acción del Usuario consultado correctamente',
                'action_plan' => $action_plan,
                "agreements" => $agreements
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
    }

    public function destroy(string $id)
    {
        //
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

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Consulta Cancelada',
                    'message' => 'Usuario invalido, no tienes acceso.',
                    'code' => $this->prefix . 'X502'
                ], 400);

            $user_action_plan = UserActionPlan::firstWhere('id', $request->user_action_plan_id);

            if (!$user_action_plan)
                return response()->json([
                    'title' => 'No se encontró información',
                    'message' => 'Esté plan de acción no es valido.',
                    'code' => $this->prefix . 'X503'
                ], 400);

            $file_name = Str::upper(Str::uuid());

            DB::beginTransaction();

            $format = explode(";base64", explode("data:image/", $request->signature)[1])[0];
            $path_url = "https://trinizone.s3.us-east-2.amazonaws.com/Evaluaciones/Planes de Acción/$user_action_plan->id/$request->user_id/$file_name.$format";
            $image = str_replace('data:image/' . $format . ';base64,', '', $request->signature);
            $image = str_replace(' ', '+', $image);
            Storage::disk('s3')->put("/Evaluaciones/Planes de Acción/$user_action_plan->id/$file_name.$format", base64_decode($image));

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
}
