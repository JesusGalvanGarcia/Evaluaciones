<?php

namespace App\Services\Evaluations;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

//use App\Models\Task;
use App\Models\User;
use Illuminate\Support\ServiceProvider;

class UserService extends ServiceProvider
{
    static function checkUser($user_id)
    {

        $user = User::where('status_id', 1)->find($user_id);
        return $user;
    }
    static function checkUserPermisse($name,$user)
    {   
        $userPermissions = $user->permissions;

        // Buscar el permiso específico dentro de los permisos del usuario
        $permission = $userPermissions->where('name', $name)->first();
        return $permission;
    }
    static function checkUserPermisseArray($name,$user)
    {   
        $userPermissions = $user->permissions;

        // Buscar el permiso específico dentro de los permisos del usuario
        $permission = $userPermissions->whereIn('name', $name)->first();
        return $permission;
    }
}
