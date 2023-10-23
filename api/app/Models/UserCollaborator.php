<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserCollaborator extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "user_collaborators";

    protected $fillable = [
        'user_id',
        'collaborator_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
