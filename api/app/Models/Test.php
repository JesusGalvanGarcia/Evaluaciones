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
        'evaluation_id',
        'name',
        'introduction_text',
        'max_score',
        'min_score',
        'modular',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function modules()
    {
        return $this->hasMany(TestModule::class);
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }
}
