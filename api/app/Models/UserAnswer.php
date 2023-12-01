<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAnswer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_answers";

    protected $fillable = [
        'user_test_id',
        'question_id',
        'answer_id',
        'attempt'
    ];

    public function user_test()
    {
        return $this->belongsTo(UserTest::class);
    }

    public function answer()
    {
        return $this->belongsTo(Answer::class);
    }
}
