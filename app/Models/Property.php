<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Property extends Model
{
    protected $table = 'properties';

    protected $fillable = [
        'titulo',
        'ubicacion',
        'ciudad',
        'tipo',
        'precio',
        'precio_texto',
        'costo_base',
        'utilidad',
        'estatus',
        'habitaciones',
        'recamaras',
        'banos',
        'estacionamientos',
        'superficie',
        'terreno_m2',
        'construccion_m2',
        'descripcion',
        'imagen',
        'telefono_asesor',
        'destacada',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'costo_base' => 'decimal:2',
        'utilidad' => 'decimal:2',
        'banos' => 'float',
        'habitaciones' => 'integer',
        'recamaras' => 'integer',
        'estacionamientos' => 'integer',
        'terreno_m2' => 'float',
        'construccion_m2' => 'float',
        'destacada' => 'boolean',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class, 'property_id');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class, 'property_id');
    }

    public function whatsappLogs(): HasMany
    {
        return $this->hasMany(WhatsAppLog::class, 'property_id');
    }

    public function getWhatsappClicksCountAttribute(): int
    {
        return $this->whatsappLogs()->count();
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites', 'property_id', 'user_id')->withTimestamps();
    }
}
