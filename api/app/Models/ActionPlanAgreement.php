<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActionPlanAgreement extends Model
{
    use HasFactory;
    protected $table = "action_plan_agreements";

    protected $fillable = [
        'user_action_plan_id',
        'action_plan_parameter_id',
        'description',
        'line',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function user_action_plan()
    {
        return $this->belongsTo(UserActionPlan::class);
    }
}
