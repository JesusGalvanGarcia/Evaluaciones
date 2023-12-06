<?php

namespace App\Services;

use App\Models\UserEvaluation;
use App\Models\UserTest;
use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;

class UserEvaluationService extends ServiceProvider
{
    public static function createUserEvaluationAndTests($userId, $testData, $requestUserId)
    {
        $newUserEvaluation = UserEvaluation::create([
            'user_id' => $userId,
            'evaluation_id' => 2,
            'process_id' => 1,
            'status_id' => 1,
            'created_by' => $requestUserId,
            'updated_by' => $requestUserId,
            'responsable_id' => $requestUserId,
            'actual_attempt' => 1,
        ]);

        for ($i = 0; $i < $testData->max_attempts; $i++) {
            UserTest::create([
                'test_id' => $testData->id,
                'total_score' => 0,
                'status_id' => 1,
                'user_evaluation_id' => $newUserEvaluation->id,
                'attempts' => $i + 1,
            ]);
        }
    }

    public static function deleteUserEvaluationAndTests($test_id, $requestUserId){
        $userEvaluationIds = UserEvaluation::select('user_evaluation_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $test_id)
            ->pluck('user_evaluation_id')
            ->toArray();

        $user_tests=UserTest::whereIn('user_evaluation_id', $userEvaluationIds)->get();
            $user_tests->each(function ($user_test) use($requestUserId) {
                $user_test->update(['deleted_by'=> $requestUserId]);
                $user_test->delete();
            });

        $user_evaluations = UserEvaluation::whereIn('id', $userEvaluationIds)->get();
            $user_evaluations->each(function ($user_evaluation) use($requestUserId) {
                $user_evaluation->update(['deleted_by'=> $requestUserId]);
                $user_evaluation->delete();
            });
    }

    /**
     * @deprecated 0
     * El siguiente método no se utiliza, pero se deja como idea. Mantiene los usuarios que ya están dados
     * de alta y modifica los que se agregan y eliminan, pero sin actualizar los existentes.
     */
    public static function updateUserEvaluationAndTests($assigned_users, $testData, $requestUserId)
    {
        $userIdsExistent = UserEvaluation::select('user_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $testData->id)
            ->pluck('user_id')
            ->toArray();

        $userEvaluationIdsExistent = UserEvaluation::select('user_evaluation_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $testData->id)
            ->pluck('user_evaluation_id')
            ->toArray();
        
        $userEvaluationIdsPersistent = UserEvaluation::select('user_evaluation_id')
            ->join('user_tests', 'user_tests.user_evaluation_id', 'user_evaluations.id')
            ->where('user_tests.test_id', $testData->id)
            ->whereIn('user_evaluations.user_id', $assigned_users)
            ->pluck('user_evaluation_id')
            ->toArray();
            
        // Identificar user_evaluation_id que deben ser eliminados
        $evaluationIdsToDelete = array_diff($userEvaluationIdsExistent, $userEvaluationIdsPersistent);
        $userToBeAdded = array_diff($assigned_users, $userIdsExistent);

        $user_tests=UserTest::whereIn('user_evaluation_id', $evaluationIdsToDelete)->get();
            $user_tests->each(function ($user_test) use($requestUserId) {
                $user_test->update(['deleted_by'=> $requestUserId]);
                $user_test->delete();
            });

        $user_evaluations = UserEvaluation::whereIn('id', $evaluationIdsToDelete)->get();
            $user_evaluations->each(function ($user_evaluation) use($requestUserId) {
                $user_evaluation->update(['deleted_by'=> $requestUserId]);
                $user_evaluation->delete();
            });

        // Actualizar UserTest existentes y agregar nuevos según sea necesario
        foreach ($userToBeAdded as $user) { 
            $newUserEvaluation = UserEvaluation::create([
                'user_id' => $user,
                'evaluation_id' => 2,
                'process_id' => 1,
                'status_id' => 1,
                'created_by' => $requestUserId,
                'updated_by' => $requestUserId,
                'responsable_id' => $requestUserId,
                'actual_attempt' => 1,
            ]);
    
            for ($i = 0; $i < $testData->max_attempts; $i++) {
                UserTest::create([
                    'test_id' => $testData->id,
                    'total_score' => 0,
                    'status_id' => 1,
                    'user_evaluation_id' => $newUserEvaluation->id,
                    'attempts' => $i + 1,
                ]);
            }
        }
    }
}
