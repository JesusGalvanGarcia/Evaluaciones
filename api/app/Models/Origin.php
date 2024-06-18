<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Icons extends Model
{
    use SoftDeletes;

    protected $table = "origins";

    protected $fillable = [
        'id',
        'name',
        'link',
        'Icon',
        'active',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_by',
        'deleted_at'
    ];

 
 
}
