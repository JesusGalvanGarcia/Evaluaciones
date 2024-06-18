<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItems extends Model
{
    use SoftDeletes;

    protected $table = "menu_items";

    protected $fillable = [
        'url',
        'name',
        'permission_id',
        'menu_id',
        'icon',
        'created_by',
        'created_at',
        'updated_by',
        'updated_at',
        'deleted_by',
        'deleted_at'
    ];

    public function menu() //pertenece a un menu
    {
        return $this->belongsTo(Menu::class);
    }



  
}
