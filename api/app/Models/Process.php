<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Process extends Model
{
    use SoftDeletes;

    protected $table = "processes";

    protected $fillable = [
        'description',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
