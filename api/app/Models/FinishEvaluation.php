<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinishEvaluation extends Model
{
    use SoftDeletes;

    protected $table = "finish_evaluations";

    protected $fillable = [
        'status',
        'user_id',
        'evaluation_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function FinishUser()
    {
        return $this->hasMany(User::class);
    }
    public function FinishEvaluation()
    {
        return $this->hasMany(Evaluation::class);
    }
}
