<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestModule extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "test_modules";

    protected $fillable = [
        'id',
        'test_id',
        'name',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function questions()
    {
        return $this->hasMany(Question::class, 'module_id', 'id');
    }

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
