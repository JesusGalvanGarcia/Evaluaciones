<?php

namespace App\Services\Auth;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\ServiceProvider;

class UserService extends ServiceProvider
{
    static function checkRol($user_id)
    {

        $user = User::where('status_id', 1)->find($user_id);
        return $user;
    }
}
