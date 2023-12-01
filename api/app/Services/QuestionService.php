<?php

namespace App\Services;

use App\Models\Answer;
use App\Models\Question;
use Illuminate\Support\ServiceProvider;

class QuestionService extends ServiceProvider
{
    public static function createOrUpdateQuestionsAndAnswers($module, $moduleId, $userId)
    {
        foreach ($module['questions'] as $question) {
            $maxScore = max(array_column($question['answers'], 'score'));
            $newQuestion = self::createOrUpdateQuestion($question, $moduleId, $maxScore, $userId);

            foreach ($question['answers'] as $answer) {
                self::createOrUpdateAnswer($answer, $newQuestion->id, $userId);
            }
        }
    }

    private static function createOrUpdateQuestion($questionData, $moduleId, $maxScore, $userId)
    {
        $newQuestion = collect($questionData);

        if ($newQuestion->has('id')) {
            return Question::where('id', $newQuestion['id'])
                ->update([
                    'module_id' => $moduleId,
                    'description' => $questionData['description'],
                    'score' => $maxScore,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ]);
        } else {
            return Question::create([
                'module_id' => $moduleId,
                'description' => $questionData['description'],
                'score' => $maxScore,
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        }
    }

    private static function createOrUpdateAnswer($answerData, $questionId, $userId)
    {
        $newAnswer = collect($answerData);
        if ($newAnswer->has('id')) {
            return Answer::where('id', $newAnswer['id'])
                ->update([
                    'question_id' => $questionId,
                    'description' => $answerData['description'],
                    'score' => $answerData['score'],
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ]);
            } else {
            return Answer::create([
                'question_id' => $questionId,
                'description' => $answerData['description'],
                'score' => $answerData['score'],
                'created_by' => $userId,
                'updated_by' => $userId,
            ]);
        }
    }
}