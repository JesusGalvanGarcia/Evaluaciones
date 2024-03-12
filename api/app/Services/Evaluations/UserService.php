<?php

namespace App\Services\Evaluations;

use App\Models\Task;
use App\Models\User;
use Illuminate\Support\ServiceProvider;

class UserService extends ServiceProvider
{
    static function checkUser($user_id)
    {

        $user = User::where('status_id', 1)->find($user_id);
        return $user;
    }
}
