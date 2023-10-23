<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Question extends Model
{
    use SoftDeletes;

    protected $table = "questions";

    protected $fillable = [
        'module_id',
        'description',
        'score',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }

    public function module()
    {
        return $this->belongsTo(TestModule::class, 'module_id', 'id', 'module_id');
    }
}
