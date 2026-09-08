<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'user_id',
        'cliente_nombre',
        'cliente_telefono',
        'origen',
        'estatus',
        'notas',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function advisor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
