<?php

namespace App\Services\Evaluations;

use App\Mail\Evaluations\Desempeño\ActionPlan;
use App\Mail\Evaluations\Signatures;
use App\Models\Task;
use App\Models\User;
use App\Models\UserActionPlan;
use App\Models\UserCollaborator;
use Illuminate\Support\Facades\Mail;
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

    static function sendConfirmMail($user_evaluation, $evaluation_name, $file)
    {
        $evaluated_user = User::find($user_evaluation->user_id);

        $responsable_user = User::find($user_evaluation->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $user_evaluation->responsable_id)->first();

        $responsable_leader = User::find($responsable_leader_id?->user_id);

      $mail = Mail::to($responsable_user->email)->cc(['francisco.delarosa@trinitas.mx', $evaluated_user->email])->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));


    }
    static function sendConfirmMail360($user_evaluation, $evaluation_name, $file)
    {
        $evaluated_user = User::find($user_evaluation->user_id);

        $responsable_user = User::find($user_evaluation->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $user_evaluation->responsable_id)->first();

        $responsable_leader = User::find($responsable_leader_id?->user_id);

        $mail = Mail::to('brenda.ortiz@trinitas.mx')->cc('francisco.delarosa@trinitas.mx')->send(new ActionPlan($evaluation_name, $evaluated_user, $responsable_user,$file));
       // $mail = Mail::to($evaluated_user->email)->cc(['francisco.delarosa@trinitas.mx', $responsable_leader?->email])->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));

    }

    static function sendConfirmSignaturesMail($user_evaluation, $evaluation_name)
    {

        $evaluated_user = User::find($user_evaluation->user_id);

        $responsable_user = User::find($user_evaluation->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $user_evaluation->responsable_id)->first();
        $responsable_leader = User::find($responsable_leader_id?->user_id);

        //$mail = Mail::to('brenda.ortiz@trinitas.mx')->cc('francisco.delarosa@trinitas.mx')->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));
        $mail = Mail::to($evaluated_user->email)->cc(['francisco.delarosa@trinitas.mx', $responsable_leader?->email])->send(new Signatures($evaluation_name, $evaluated_user, $responsable_user));
    }
}
