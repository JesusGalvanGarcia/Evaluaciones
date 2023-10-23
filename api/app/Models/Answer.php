<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Answer extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "answers";

    protected $fillable = [
        'question_id',
        'description',
        'score',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function user_answers()
    {
        return $this->hasMany(UserAnswer::class);
    }
}
