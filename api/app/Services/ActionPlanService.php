<?php

namespace App\Services;

use App\Models\Task;
use App\Models\User;
use App\Models\UserActionPlan;
use Illuminate\Support\ServiceProvider;

class ActionPlanService extends ServiceProvider
{
    static function findUserActionPlan(UserActionPlan $user_action_plan)
    {

        if ($user_action_plan->action_plan)
            if ($user_action_plan->action_plan->evaluation)
                if ($user_action_plan->action_plan->evaluation->user_evaluations)
                    return  $user_action_plan->action_plan->evaluation->user_evaluations
                        ->where('user_id', $user_action_plan->user_id)
                        ->where('responsable_id', $user_action_plan->responsable_id)
                        ->first();

                else
                    return false;
            else
                return false;
        else
            return false;
    }
}
