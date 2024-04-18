<?php

namespace App\Http\Controllers\Auth;

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
use App\Models\Accesses;
use App\Models\AccessTypes;
use App\Models\Roles;
use App\Models\AccessesRoles;

class ToolsUserController extends Controller
{
    private $prefixCode = 'ToolsUser';

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

            // Obtener el rol del usuario
            $rolId = $user->rol_id;

            $roles = Roles::select(
                'roles_user.id',
                'roles_user.name',
                'roles_user.roles_key',
                'accesses.url',
                'accesses.name as access_name',
                'accesses.key',
                'origins.link as origen_link',
                'origins.name as origen',
                'origins.id_icon as icon_origin',
                'icons.icon as origin_icon',
                'access_icons.icon as access_icon'
            )
            ->join('accesses_roles', 'roles_user.id', '=', 'accesses_roles.role_id')
            ->join('accesses', 'accesses_roles.access_id', '=', 'accesses.id')
            ->join('origins', 'accesses.origen_id', '=', 'origins.id')
            ->join('icons as access_icons', 'accesses.id_icon', '=', 'access_icons.id')
            ->join('icons', 'origins.id_icon', '=', 'icons.id')
            ->where('roles_user.id', $rolId)
            ->where('accesses.active', true)
            ->where('origins.id', '!=',5)

            ->orderBy('roles_user.id')
            ->get();
      
           // return  $roles;
            $groupedRoles = [];
            $options=$roles->where('origen','Sin origen');
        
            // Primero anexar al array los grupos sin origen (Home y Cerrar sesion que no tienen hijos (items))
             foreach ($options as $role) {
                 $origen = $role->origen;
                
                     $groupedRoles[$role->url] = [
                         'routeLink' => $role->url,
                         'label' => $role->key,
                         'icon' => $role->access_icon,
                         'items' => [],
                     ];
                
           
             }
             //Continuar con aquellos que tienen items
            $options=$roles->where('origen','!=','Sin origen');
            foreach ($options as $role) {
                $origen = $role->origen;
                if (!isset($groupedRoles[$origen])) {
                    $groupedRoles[$origen] = [
                        'label' => $origen,
                        'routeLink' => $role->origen_link,
                        'icon' => $role->origin_icon,
                        'items' => [],
                    ];
                }
                $groupedRoles[$origen]['items'][] = [
                    'routeLink' => $role->url,
                    'label' => $role->key,
                    'icon' => $role->access_icon,
                ];
            }
            //Cerrar Sesion siempre ira al  final
            $logoutItem = null;
            foreach ($groupedRoles as $index => $role) {
                if ($role['label'] === 'Cerrar Sesión') {
                    $logoutItem = $role;
                    unset($groupedRoles[$index]);
                    break;
                }
            }
            
            if ($logoutItem !== null) {
                $groupedRoles[] = $logoutItem;
            }
           // return $groupedRoles;
            $groupedRoles = array_values($groupedRoles); // Reindexar el array

            return response()->json([
                'message' => 'Roles consultados correctamente',
                'roles' => $groupedRoles
            ]);
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X199'
            ], 500);
        }
    }
    public function getLinks()
    {
        $validator = Validator::make(request()->all(), [
            'user_id' => 'Required|Integer|NotIn:0|Min:0',
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

        // Obtener el rol del usuario
        $rolId = $user->rol_id;

        $roles = Roles::select(
            'roles_user.id',
            'roles_user.name',
            'roles_user.roles_key',
            'accesses.url',
            'accesses.name as access_name',
            'accesses.key',
            'origins.link as origen_link',
            'origins.name as origen',
            'origins.id_icon as icon_origin',
            'icons.icon as origin_icon',
            'access_icons.icon as access_icon',
            DB::raw("CASE 
            WHEN origins.link = 'exam' THEN CONCAT('dashboard/',accesses.url) 
            ELSE CONCAT(origins.link, '/',accesses.url) 
            END as access_origin_link")
            )
        ->join('accesses_roles', 'roles_user.id', '=', 'accesses_roles.role_id')
        ->join('accesses', 'accesses_roles.access_id', '=', 'accesses.id')
        ->join('origins', 'accesses.origen_id', '=', 'origins.id')
        ->join('icons as access_icons', 'accesses.id_icon', '=', 'access_icons.id')
        ->join('icons', 'origins.id_icon', '=', 'icons.id')
        ->where('roles_user.id', $rolId)
        ->where('accesses.active', true)
        ->where('origins.id', '!=',5)
        ->where('origins.name','!=','Sin origen')
        ->orderBy('roles_user.id')
        ->get();
        $groupedRoles = [];
        foreach ($roles as $role) {
            $origen = $role->origen;
            if (!isset($groupedRoles[$origen])) {
                // Si la etiqueta no existe en el arreglo, la inicializamos con un array vacío
                $groupedRoles[$origen] = [
                    'label' => $origen,
                    'icon' => $role->origin_icon,
                    'routeLink' => $role->origen_link,
                    'items' => [],
                ];
            }
            
            // Agregamos el elemento actual al arreglo 'items' dentro de la etiqueta correspondiente
            $groupedRoles[$origen]['items'][] = [
                'routeLink' => $role->access_origin_link,
                'label' => $role->key,
            ];
        }
        
        // Convertimos el arreglo asociativo en un arreglo indexado
        $groupedRoles = array_values($groupedRoles);
        
   
        
        return response()->json([
            'message' => 'Roles consultados correctamente',
            'access' => $groupedRoles
        ]);
    
        
    }
   
    public function checkTools()
    {
        try {
            $validator = Validator::make(request()->all(), [
                'user_id' => 'Required|Integer|NotIn:0|Min:0',
                'key'=> 'Required|String',
            ]);
            $key = request('key');

            // Check if the key contains "pld"
            if (strpos($key, 'Pld') !== false) {
                // If "pld" is found, check if "exam/" is already at the beginning
                if (strpos($key, 'exam/') !== 0) {
                    // If "exam/" is not at the beginning, concatenate it
                    $key = 'exam/' . $key;
                }
            }
       
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

            // Obtener el rol del usuario
            $rolId = $user->rol_id;

            $roles = Roles::select(
                'roles_user.id',
                'roles_user.name',
                'roles_user.roles_key',
                'accesses.url',
                'accesses.name as access_name',
                'accesses.key',
                'origins.link as origen_link',
                'origins.name as origen',
                'origins.id_icon as icon_origin',
                'icons.icon as origin_icon',
                'access_icons.icon as access_icon'
            )
            ->join('accesses_roles', 'roles_user.id', '=', 'accesses_roles.role_id')
            ->join('accesses', 'accesses_roles.access_id', '=', 'accesses.id')
            ->join('origins', 'accesses.origen_id', '=', 'origins.id')
            ->join('icons as access_icons', 'accesses.id_icon', '=', 'access_icons.id')
            ->join('icons', 'origins.id_icon', '=', 'icons.id')
            ->where('roles_user.id', $rolId)
            ->where('accesses.url', $key) 
            ->orderBy('roles_user.id')
            ->get();
         
            if(count($roles)>0)
            {
                return response()->json([
                    'message' => 'Roles consultados correctamente',
                    'access' => true
                ]);
            }
            else
            {
              
                    return response()->json([
                        'message' => 'Roles consultados correctamente',
                        'access' => false
                    ]);
                
            }
        
        } catch (Exception $e) {

            return response()->json([
                'title' => 'Ocurrio un error en el servidor',
                'message' => $e->getMessage() . ' -L:' . $e->getLine(),
                'code' => $this->prefixCode . 'X199'
            ], 500);
        }
    }
    
}
