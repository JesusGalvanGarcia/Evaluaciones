<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EvaluatorType extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "evaluator_type";

    protected $fillable = [
        'id',
        'description',
        'created_by',
        'updated_by',
        'deleted_by'
    ];


}
