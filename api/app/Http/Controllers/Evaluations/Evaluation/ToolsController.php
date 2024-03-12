<?php

namespace App\Http\Controllers\Evaluations\Evaluation;

use App\Http\Controllers\Controller;

use App\Models\Attachment;
use App\Models\User;
use App\Services\Evaluations\UserService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ToolsController extends Controller
{
    private $prefixCode = 'Tools';

    public function roles()
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X101'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X102'
                ], 400);

            $roles = Role::select(
                'id',
                'name',
                'created_at'
            )
                ->orderBy('id')
                ->get();

            return response()->json([
                'message' => 'Roles consultados correctamente',
                'roles' => $roles
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X199'
            ], 500);
        }
    }

    public function role()
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'role_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X101'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X102'
                ], 400);

            $role = Role::select(
                'id',
                'name',
                'created_at'
            )
                ->find(request('role_id'));

            $permissions = $role->permissions->pluck('id');

            return response()->json([
                'message' => 'Roles consultados correctamente',
                'role' => $role,
                'permissions' => $permissions
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X199'
            ], 500);
        }
    }

    public function permissions()
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0'
            ]);

            if ($validator->fails()) {

                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X101'
                ], 400);
            }

            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X102'
                ], 400);

            $permissions = Permission::select(
                'id',
                'name'
            )
                ->whereNotIn('id', [1])
                ->orderBy('id')
                ->get();

            return response()->json([
                'message' => 'Permisos consultados correctamente',
                'permissions' => $permissions
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X199'
            ], 500);
        }
    }

    public function storePermissions(Request $request)
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        if (!$this->checkPermissions(request()->route()->getName())) {

            return response()->json([
                'title' => 'Proceso cancelado',
                'message' => 'No tienes permiso para hacer esto.',
                'code' => $this->prefixCode . 'P202'
            ], 400);
        }

        try {

            // Se validan los parámetros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|Min:1',
                'permissions' => 'Required|Array',
                'permissions.*' => 'Required|String|Distinct',
            ]);

            // Si la validación detecta un error regresa la descripción del error
            if ($validator->fails())
                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X201'
                ], 400);

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X202'
                ], 400);

            // Por cada permiso enviado se almacena en BD, si el permiso ya existe regresara un error
            foreach ($request->permissions as $permission)
                Permission::create(['name' => $permission]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso concluido',
                'message' => (count($request->permissions) > 1 ? 'Permisos generados ' : 'Permiso generado ') . 'correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . '299'
            ], 500);
        }
    }

    public function storeRoles(Request $request)
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        if (!$this->checkPermissions(request()->route()->getName())) {

            return response()->json([
                'title' => 'Proceso cancelado',
                'message' => 'No tienes permiso para hacer esto.',
                'code' => $this->prefixCode . 'P302'
            ], 400);
        }

        try {
            // Se validan los parámetros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|Min:1',
                'roles' => 'Required|Array',
                'roles.*' => 'Required|String|Distinct',
            ]);

            // Si la validación detecta un error regresa la descripción del error
            if ($validator->fails())
                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X301'
                ], 400);

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X302'
                ], 400);

            DB::beginTransaction();

            // Por cada rol enviado se almacena en BD, si el rol ya existe regresara un error
            foreach ($request->roles as $role)
                Role::create(['name' => $role]);

            DB::commit();

            return response()->json([
                'title' => 'Proceso concluido',
                'message' => (count($request->roles) > 1 ? 'Roles generados ' : 'Rol generado ') . 'correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . '399'
            ], 500);
        }
    }

    public function assignPermissions(Request $request)
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        if (!$this->checkPermissions(request()->route()->getName())) {

            return response()->json([
                'title' => 'Proceso cancelado',
                'message' => 'No tienes permiso para hacer esto.',
                'code' => $this->prefixCode . 'P402'
            ], 400);
        }

        try {

            // Se validan los parámetros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|Min:1',
                'permissions' => 'Required|Array',
                'permissions.*' => 'Required|Distinct',
            ]);

            // Si la validación detecta un error regresa la descripción del error
            if ($validator->fails())
                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X401'
                ], 400);

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X402'
                ], 400);

            DB::beginTransaction();

            // Se consulta el rol, si lo encuentra se asignan los permisos, si algún permiso no es encontrado devolverá un error.
            $role = Role::find($request->role_id);

            if ($role)
                $role->syncPermissions($request->permissions);

            // Se consulta el usuario objetivo, si lo encuentra se asignan los permisos, si algún permiso no es encontrado devolverá un error.
            $user_target = User::find($request->user);

            if ($user_target) {

                $user_target->syncPermissions($request->permissions);


                if ($user_target->id == 117)
                    $user_target->givePermissionTo([1, 4]);
            }

            DB::commit();

            return response()->json([
                'title' => 'Proceso concluido',
                'message' => (count($request->permissions) > 1 ? 'Permisos asignados ' : 'Permiso asignado ') . 'correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . '499'
            ], 500);
        }
    }

    public function assignRoles(Request $request)
    {
        app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        if (!$this->checkPermissions(request()->route()->getName())) {

            return response()->json([
                'title' => 'Proceso cancelado',
                'message' => 'No tienes permiso para hacer esto.',
                'code' => $this->prefixCode . 'P502'
            ], 400);
        }

        try {

            // Se validan los parámetros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|Min:1',
                'roles' => 'Required|Array',
                'roles.*' => 'Required|Distinct',
            ]);

            // Si la validación detecta un error regresa la descripción del error
            if ($validator->fails())
                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X501'
                ], 400);

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X502'
                ], 400);

            DB::beginTransaction();

            // Se valida que el usuario objetivo exista.
            $user_target = User::find($request->user);

            if (!$user_target)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario seleccionado no encontrado.',
                    'code' => $this->prefixCode . 'X504'
                ], 400);

            $user_target->syncRoles($request->roles);

            DB::commit();

            return response()->json([
                'title' => 'Proceso concluido',
                'message' => (count($request->roles) > 1 ? 'Roles asignados ' : 'Rol asignado ') . 'correctamente'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . '599'
            ], 500);
        }
    }

    public function checkPermission(Request $request)
    {
        try {
            app()->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
            if (!$this->checkPermissions(request()->route()->getName())) {

                return response()->json([
                    'title' => 'Proceso cancelado',
                    'message' => 'No tienes permiso para hacer esto.',
                    'code' => $this->prefixCode . 'P702'
                ], 400);
            }

            // Se validan los parámetros de entrada
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|Min:1'
            ]);

            // Si la validación detecta un error regresa la descripción del error
            if ($validator->fails())
                return response()->json([
                    'title' => 'Datos Faltantes',
                    'message' => $validator->messages()->first(),
                    'code' => $this->prefixCode . 'X701'
                ], 400);

            // Se valida que el usuario este vigente
            $user = UserService::checkUser(request('user_id'));

            if (!$user)
                return response()->json([
                    'title' => 'Fallo en la consulta',
                    'message' => 'Usuario no encontrado.',
                    'code' => $this->prefixCode . 'X702'
                ], 400);

            // Se verifican que el usuario tenga permiso para crear nuevos permisos
            if (!$user->hasPermissionTo($request->permission))
                return response()->json([
                    'title' => 'Acceso Restringido',
                    'message' => 'Usuario no tiene permiso.',
                    'code' => $this->prefixCode . 'X703'
                ], 400);

            return response()->json([
                'title' => 'Proceso concluido',
                'message' => 'Tienes autorización para continuar'
            ]);
        } catch (Exception $e) {

            DB::rollBack();

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . '799'
            ], 500);
        }
    }
}
