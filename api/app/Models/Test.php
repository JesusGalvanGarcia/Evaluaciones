<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Test extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "tests";

    protected $fillable = [
        'id',
        'evaluation_id',
        'name',
        'introduction_text',
        'max_score',
        'min_score',
        'modular',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at',
        'start_date',
        'end_date',
        'max_attempts'
    ];

    public function test_modules()
    {
        return $this->hasMany(TestModule::class);
    }

    public function user_tests()
    {
        return $this->hasMany(UserTest::class);
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
}
