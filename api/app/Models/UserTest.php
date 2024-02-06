<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserTest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_tests";

    protected $fillable = [
        'user_evaluation_id',
        'test_id',
        'strengths',
        'chance',
        'suggestions',
        'attempts',
        'total_score',
        'finish_date',
        'status_id',
        'created_at',
        'attempts',
        'updated_at',
        'deleted_at',
     
    ];

    public function user_evaluation()
    {
        return $this->belongsTo(UserEvaluation::class);
    }

    public function user_test_modules()
    {
        return $this->hasMany(UserTestModule::class);
    }

    public function user_answers()
    {
        return $this->hasMany(UserAnswer::class);
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
