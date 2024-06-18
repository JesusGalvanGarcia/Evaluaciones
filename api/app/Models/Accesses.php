<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Accesses extends Model
{
    use SoftDeletes;

    protected $table = "accesses";

    protected $fillable = [
        'id',
        'key',
        'name',
        'description',
        'origin',
        'url',
        'id_icon',
        'access_type_id',
        'active',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_by',
        'deleted_at'
    ];

 
 
}
