<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasRoles;

    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'user_name',
        'email',
     
        'password',
        'status_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function findForPassport(string $user_email): User
    {
        return $this->where('email', $user_email)->first();
    }

    public function tests()
    {
        return $this->hasMany(Test::class);
    }

    public function evaluations()
    {
        return $this->hasMany(UserEvaluation::class);
    }

    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }
    public function roles()
    {
        return $this->belongsTo(Roles::class, 'rol_id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }
}
