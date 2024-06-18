<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clasification extends Model
{
    use SoftDeletes;

    protected $table = "clasification";

    protected $fillable = [
        'name',
        'description',
        'end_range',
        'test_id',
        'color',
        'start_range',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];


}
