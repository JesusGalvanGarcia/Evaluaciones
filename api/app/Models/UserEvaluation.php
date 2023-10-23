<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserEvaluation extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_evaluations";

    protected $fillable = [
        'user_id',
        'evaluation_id',
        'process_id',
        'responsable_id',
        'finish_date',
        'status_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function user_tests()
    {
        return $this->hasMany(UserTest::class);
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
}
