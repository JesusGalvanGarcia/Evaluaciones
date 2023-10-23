<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPlan extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "action_plans";

    protected $fillable = [
        'evaluation_id',
        'name',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function evaluation()
    {
        return $this->hasOne(Evaluation::class);
    }

    public function user_action_plans()
    {
        return $this->hasMany(UserActionPlan::class);
    }

    public function parameters()
    {
        return $this->hasMany(ActionPlanParameter::class);
    }
}
