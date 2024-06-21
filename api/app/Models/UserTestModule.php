<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserTestModule extends Model
{
    use SoftDeletes;

    protected $table = "user_test_modules";

    protected $fillable = [
        'user_test_id',
        'module_id',
        'note',
        'average',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function user_test()
    {
        return $this->belongsTo(UserTest::class);
    }

    public function module()
    {
        return $this->belongsTo(TestModule::class, 'module_id', 'id', 'module_id');
    }
}
