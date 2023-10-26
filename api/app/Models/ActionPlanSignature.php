<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActionPlanSignature extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "action_plan_signatures";

    protected $fillable = [
        'user_action_plan_id',
        'responsable_id',
        'url',
        'signature_date'
    ];

    public function user_action_plan()
    {
        return $this->belongsTo(UserActionPlan::class);
    }
}
