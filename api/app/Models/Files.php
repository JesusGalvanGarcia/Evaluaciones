<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Files extends Model
{
    use SoftDeletes;

    protected $table = "files";

    protected $fillable = [
        'name',
        'path',
        'user_id',
        'evaluation_id',
        'test_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function filesUser()
    {
        return $this->hasMany(User::class);
    }
    public function filesEvaluation()
    {
        return $this->hasMany(Evaluation::class);
    }
}
