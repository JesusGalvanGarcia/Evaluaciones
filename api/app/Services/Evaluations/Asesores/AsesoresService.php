<?php

namespace App\Services\Evaluations\Asesores;

use App\Models\Task;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use App\Mail\Evaluations\Evaluation360\sendEmail360 as sendEmail360;
use App\Models\Process;
use App\Models\User;
use App\Models\UserActionPlan;
use App\Mail\Evaluations\Evaluation360\signatures360 as Signatures360;
use App\Mail\Evaluations\Evaluation360\evaluation360 as evaluation360;
use App\Mail\Evaluations\Asesores\asesores as sendAsesores;
use App\Mail\Evaluations\Asesores\asesoresComplete as asesoresComplete;

use App\Models\UserCollaborator;


use App\Mail\Evaluations\Evaluation360\actionPlan360 as ActionPlan;


class AsesoresService extends ServiceProvider
{
    static function sendEmail($evaluation, $name, $email)
    {
         
        Mail::to($email)->send(new sendAsesores($name,$evaluation,$email));

    }

    static function sendTestMail($evaluation_data)
    {  

        // Se obtiene el nombre de
        $evaluated_user = User::find($evaluation_data['user_evaluation']->user_id);

        $responsable_user = User::find($evaluation_data['user_evaluation']->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $evaluation_data['user_evaluation']->responsable_id)->first();
        $responsable_leader = User::find($responsable_leader_id?->user_id);
        $process = Process::find($evaluation_data['user_evaluation']->process_id);
        $mail = Mail::to($responsable_user?->email)->cc(['francisco.delarosa@trinitas.mx',$evaluated_user->email])->send(new asesoresComplete($evaluation_data, $evaluated_user, $responsable_user, $process));
       
        
    }



  
}
