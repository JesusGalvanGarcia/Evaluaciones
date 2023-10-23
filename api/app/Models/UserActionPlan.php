<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserActionPlan extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_action_plans";

    protected $fillable = [
        'user_id',
        'action_plan_id',
        'finish_date',
        'status_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function action_plan()
    {
        return $this->belongsTo(ActionPlan::class);
    }

    public function agreements()
    {
        return $this->hasMany(ActionPlanAgreement::class);
    }
}
