<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    static function checkPermissions($route_name)
    {

        // Se valida que el usuario este vigente
        $user = UserService::checkUser(request('user_id'));

        if (!$user)
            return false;

        // Se verifican que el usuario tenga permiso para crear nuevos permisos
        if (!$user->hasPermissionTo($route_name))
            return false;

        return true;
    }
}
