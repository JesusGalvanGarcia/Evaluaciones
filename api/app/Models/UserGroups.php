<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserGroups extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_groups";

    protected $fillable = [
        'user_id',
        'group_id',
        'level',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
