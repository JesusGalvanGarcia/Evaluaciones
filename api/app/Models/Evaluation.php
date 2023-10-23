<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evaluation extends Model
{
    use SoftDeletes;

    protected $table = "evaluations";

    protected $fillable = [
        'name',
        'start_date',
        'end_date',
        'frequency_id',
        'type_id',
        'process_id',
        'status_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function action_plan()
    {
        return $this->hasOne(ActionPlan::class);
    }

    public function user_evaluations()
    {
        return $this->hasMany(UserEvaluation::class);
    }

    public function tests()
    {
        return $this->hasMany(Test::class);
    }
}
