<?php

namespace App\Services;

use App\Mail\Evaluations\CompetenciesEvaluation;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\ServiceProvider;
use App\Mail\PerformanceEvaluation as MailPerformanceEvaluation;
use App\Mail\sendEmail360 as sendEmail360;
use App\Mail\resetPassword as resetPassword;

use App\Models\Process;
use App\Models\Files;

use App\Models\Test;
use App\Models\UserCollaborator;
use App\Models\UserEvaluation;
use App\Models\UserTest;
use Illuminate\Support\Facades\DB;
use App\Mail\sendCertificate as sendEmails;
use Carbon\Carbon;

class TestService extends ServiceProvider
{
    static function getClasification($actual_score)
    {

        $clasification = collect();

        switch ($actual_score) {

                // En riesgo
            case $actual_score < 70:
                $clasification = [
                    "clasification" => "En riesgo",
                    "description" => "El colaborador ha tenido un rendimiento significativamente por debajo de las expectativas, tiene áreas de mejoras claramente identificadas, mismas que se le han indicado por medio de retroalimentación, necesidad urgente de intervención y desarrollo."
                ];

                break;

                // Baja
            case $actual_score > 69 && $actual_score < 80:
                $clasification = [
                    "clasification" => "Baja",
                    "description" => "El colaborador tuvo un desempeño insatisfactorio en varias áreas clave, así como el incumplimiento en sus metas y objetivos, requiere acciones correctivas para evitar consecuencias negativas."
                ];

                break;

                // Regular
            case $actual_score > 79 && $actual_score < 90:
                $clasification = [
                    "clasification" => "Regular",
                    "description" => "El colaborador ha tenido un cumplimiento básico de responsabilidades y expectativas, muestra competencias en algunas áreas pero con espacio para mejora. Cumple con las expectativas pero hay oportunidades para el crecimiento."
                ];

                break;

                // Buena
            case $actual_score > 89 && $actual_score < 100:
                $clasification = [
                    "clasification" => "Buena",
                    "description" => "El colaborador ha tenido un rendimiento sólido y consistente, cumple y en algunos casos supera las expectativas en su rol. Demuestra habilidades y competencias efectivas en la mayoría de las áreas."
                ];

                break;

                // Excelente
            case $actual_score > 99 && $actual_score < 120:
                $clasification = [
                    "clasification" => "Excelente",
                    "description" => "El colaborador excede consistentemente las expectativas, muestra un desempeño excepcional y contribuye de manera significativa al equipo y a los objetivos de la organización, tiene un alto sentido de compromiso."
                ];

                break;

                // Máxima
            case $actual_score == 120:
                $clasification = [
                    "clasification" => "Máxima",
                    "description" => "El colaborador tiene un desempeño excepcionalmente destacado en todas las áreas . Ha hecho contribuciones significativas que impactan positivamente en el equipo y en la organización en general, el colaborador muestra competencias que refieren estar listo para ser promovido."
                ];

                break;
                // Default para manejar casos no contemplados
            default:
                $clasification = [
                    "clasification" => "No clasificado",
                    "description" => "Esta evaluación no contiene clasificaciones."
                ];
                break;
        }

        return $clasification;
    }

    static function sendTestMail($evaluation_data)
    {

        // Se obtiene el nombre de
        $evaluated_user = User::find($evaluation_data['user_evaluation']->user_id);

        $responsable_user = User::find($evaluation_data['user_evaluation']->responsable_id);

        $responsable_leader_id = UserCollaborator::where('collaborator_id', $evaluation_data['user_evaluation']->responsable_id)->first();
        $responsable_leader = User::find($responsable_leader_id?->user_id);

        $process = Process::find($evaluation_data['user_evaluation']->process_id);

        if ($responsable_leader) {
            if ($evaluation_data['test']->modular == 0) {

                $mail = Mail::to($responsable_user?->email)->cc(['francisco.delarosa@trinitas.mx'])->send(new MailPerformanceEvaluation($evaluation_data, $evaluated_user, $responsable_user, $process));
            } else {

                $mail = Mail::to($responsable_leader?->email)->send(new CompetenciesEvaluation($evaluation_data, $evaluated_user, $responsable_user, $process));
            }
        }
    }
    static function sendCertificateMail($name, $email, $emailLid, $path, $file)
    {

        Mail::to($email)->send(new sendEmails($name, $emailLid, $path, $file));
    }
    static function sendEmail360($evaluation, $name, $email)
    {

        Mail::to($email)->send(new sendEmail360($name, $evaluation, $email));
    }
    static function sendEmailReset($name, $email, $encrypt)
    {

        Mail::to($email)->send(new resetPassword($name, $email, $encrypt));
    }
    static function createPldTest($test, $user_id, $assigned_users)
    {
        // Convertir $test a un objeto si no lo es
        $test = is_array($test) ? (object) $test : $test;

        $test->evaluation_id = 2;
        $test->max_score = 100;
        $createUpdateTest = self::createUpdateTest($test, $user_id);
        $test_module = TestModuleService::createTestModule($createUpdateTest->id, $test->name, $user_id);
        foreach ($test->test_modules as $module) {
            QuestionService::createOrUpdateQuestionsAndAnswers($module, $test_module->id, $user_id);
        }

        if ($assigned_users) {
            foreach ($assigned_users as $user) {
                UserEvaluationService::createUserEvaluationAndTests($user, $createUpdateTest, $user_id);
            }
        }
        //agregando registros para  files
        $users = User::all();
        foreach ($users as $user) {
            $file = new Files();

            // Establecer los valores para cada columna
            $file->name = $user->name . " " . $user->father_last_name . ".pdf";
            $file->path = 'PLD/Certificados/';
            $file->user_id = $user->id;
            $file->evaluation_id = 2;
            $file->test_id = $createUpdateTest->id;
            $file->created_by = $user_id;
            $file->updated_by = $user_id;
            $file->created_at = Carbon::now()->format('Y-m-d');
            $file->updated_at = Carbon::now()->format('Y-m-d');
            // Guardar el registro en la base de datos
            $file->save();
        }
        return $createUpdateTest;
    }

    static function updatePldTest($test, $user_id, $assigned_users)
    {
        $test = is_array($test) ? (object) $test : $test;
        $test->evaluation_id = 2;
        $test->max_score = 100;
        $createUpdateTest = TestService::createUpdateTest($test, $user_id);
        // $test_module = TestModuleService::updateTestModule($test->id, $test['name'], $user_id);
        foreach ($test->test_modules as $module) {
            QuestionService::createOrUpdateQuestionsAndAnswers($module, $module['id'], $user_id);
        }

        // El siguiente apartado es para deshabilitar la modificación de los intentos
        $has_user_evaluations_started = UserEvaluation::select('user_evaluation_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $test->id)
            ->where('user_evaluations.status_id', '>', 1)
            ->pluck('user_evaluation_id')
            ->isNotEmpty();
        $is_test_in_dates = Carbon::today() < $test->end_date && Carbon::today() > $test->start_date;
        if (!$has_user_evaluations_started && $is_test_in_dates) {
            UserEvaluationService::deleteUserEvaluationAndTests($test->id, $user_id);
            if ($assigned_users) {
                foreach ($assigned_users as $user) {
                    UserEvaluationService::createUserEvaluationAndTests($user, $test, $user_id);
                }
            }
        }
        /*      else{
            if($assigned_users){
                UserEvaluationService::updateUserEvaluationAndTests($assigned_users, $test, $user_id);
            }
        }*/
        return $createUpdateTest;
    }

    static function createUpdateTest($test, $user_id)
    {
        $test = collect($test);
        if ($test->has('id')) {
            $createdUpdatedTest = Test::where(['id' => $test->get('id')])
                ->update(
                    [
                        'evaluation_id' => $test->get('evaluation_id'),
                        'name' => $test->get('name'),
                        'introduction_text' => $test->get('introduction_text'),
                        'max_score' => $test->get('max_score'),
                        'min_score' => $test->get('min_score'),
                        'modular' => 0,
                        'end_date' => $test->get('end_date'),
                        'start_date' => $test->get('start_date'),
                        'created_by' => $user_id,
                        'updated_by' => $user_id,
                        'max_attempts' => $test->get('max_attempts')
                    ]
                );
        } else {
            $createdUpdatedTest = Test::create(
                [
                    'evaluation_id' => $test->get('evaluation_id'),
                    'name' => $test->get('name'),
                    'introduction_text' => $test->get('introduction_text'),
                    'max_score' => $test->get('max_score'),
                    'min_score' => $test->get('min_score'),
                    'modular' => 0,
                    'start_date' => $test->get('start_date'),
                    'end_date' => $test->get('end_date'),
                    'created_by' => $user_id,
                    'updated_by' => $user_id,
                    'max_attempts' => $test->get('max_attempts')
                ]
            );
        }
        return $createdUpdatedTest;
    }
}
