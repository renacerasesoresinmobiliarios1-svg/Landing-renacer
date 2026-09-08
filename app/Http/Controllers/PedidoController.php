<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;

class PedidoController extends Controller

{public function store(Request $request)
{
    $request->validate([
        'items' => 'required|array',
        'telefono' => 'required',
    ]);

    $protocoloID = 'PROT-' . date('Ymd') . '-' . rand(100, 999);

    foreach ($request->items as $item) {
        \App\Models\Producto::create([
            'nombre'         => $item['service'], // El nombre del servicio
            'precio'         => $item['price'],
            'categoria'      => $this->detectarCategoria($item['service']),
            'estatus'        => 'RECIBIDO',
            'cliente_nombre' => $request->detalles_adicionales ?? 'CLIENTE_WEB', 
            'fecha_salida'   => now()->addDays(3)->format('Y-m-d'), // Fecha estimada
            'sku'            => 'LAB-' . strtoupper(substr($item['service'], 0, 3)) . '-' . rand(1000, 9999),
            'marca'          => 'N/A',
            'color'          => 'N/A',
            'tipo_limpieza'  => $item['service'],
            'descripcion'    => "WA: " . $request->telefono . " | Notas: " . $request->detalles_adicionales,
        ]);
    }

    return back()->with('success', 'Protocolo registrado correctamente.');
}

private function detectarCategoria($nombre) {
    $n = strtolower($nombre);
    if (str_contains($n, 'sneaker')) return 'SNEAKERS';
    if (str_contains($n, 'cap')) return 'GORRAS';
    return 'ACCESORIOS';
}
}