<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPlanParameter extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "action_plan_parameters";

    protected $fillable = [
        'action_plan_id',
        'value_type',
        'description',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function action_plan()
    {
        return $this->belongsTo(ActionPlan::class);
    }
}
