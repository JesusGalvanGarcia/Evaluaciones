<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAgreement extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_agreements";

    protected $fillable = [
        'user_action_plan_id',
        'opportunity_area',
        'goal',
        'developed_skill',
        'action',
        'established_date',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function user_action_plan()
    {
        return $this->belongsTo(UserActionPlan::class);
    }
}
