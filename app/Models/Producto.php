<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;

protected $fillable = [
    'nombre',
    'marca',
    'sku',
    'precio',
    'categoria',
    'tipo_limpieza',
    'cliente_nombre',
    'fecha_ingreso',
    'fecha_salida',
    'imagen',
    'estatus',
];

    protected $casts = [
        'precio' => 'decimal:2',
    ];

    public function ventaItems(): HasMany
    {
        return $this->hasMany(VentaItem::class);
    }
}