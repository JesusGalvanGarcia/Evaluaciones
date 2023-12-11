<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccessesRoles extends Model
{
    use SoftDeletes;

    protected $table = "accesses_roles";

    protected $fillable = [
        'id',
        'access_id',
        'role_id',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_by',
        'deleted_at'
    ];
    public function roles()
    {
        return $this->hasMany(Roles::class);
    }
    public function Access()
    {
        return $this->hasMany(Accesses::class);
    }
  
}
