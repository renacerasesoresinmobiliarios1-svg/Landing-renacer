<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\VentaItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function index()
    {
        $ventas = Venta::with('cliente', 'user', 'items.producto')
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('ventas/Index', ['ventas' => $ventas]);
    }

    public function create()
    {
        $clientes = Cliente::orderBy('nombre')->get();
        $productos = Producto::where('stock', '>', 0)->orderBy('nombre')->get();
        return Inertia::render('ventas/Create', [
            'clientes' => $clientes,
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'nullable',
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'impuesto' => 'nullable|numeric|min:0',
            'metodo_pago' => 'nullable|string|max:50',
            'notas' => 'nullable|string',
        ]);

        $clienteId = $validated['cliente_id'] === 'general' ? null : ($validated['cliente_id'] ?? null);
        
        $subtotal = 0;
        $items = [];

        foreach ($validated['productos'] as $item) {
            $producto = Producto::find($item['producto_id']);
            $itemSubtotal = $producto->precio * $item['cantidad'];
            $subtotal += $itemSubtotal;

            $items[] = [
                'producto_id' => $item['producto_id'],
                'cantidad' => $item['cantidad'],
                'precio_unitario' => $producto->precio,
                'subtotal' => $itemSubtotal,
            ];

            $producto->stock -= $item['cantidad'];
            $producto->save();
        }

        $impuesto = $validated['impuesto'] ?? 0;
        $total = $subtotal + $impuesto;

        $venta = Venta::create([
            'cliente_id' => $clienteId,
            'user_id' => Auth::id(),
            'subtotal' => $subtotal,
            'impuesto' => $impuesto,
            'total' => $total,
            'metodo_pago' => $validated['metodo_pago'] ?? 'efectivo',
            'notas' => $validated['notas'] ?? null,
        ]);

        foreach ($items as $item) {
            VentaItem::create(array_merge($item, ['venta_id' => $venta->id]));
        }

        return redirect()->route('ventas.index');
    }

    public function show(Venta $venta)
    {
        $venta->load('cliente', 'user', 'items.producto');
        return Inertia::render('ventas/Show', ['venta' => $venta]);
    }

    public function edit(Venta $venta)
    {
        $venta->load('cliente', 'items.producto');
        $clientes = Cliente::orderBy('nombre')->get();
        $productos = Producto::orderBy('nombre')->get();
        return Inertia::render('ventas/Edit', [
            'venta' => $venta,
            'clientes' => $clientes,
            'productos' => $productos,
        ]);
    }

    public function update(Request $request, Venta $venta)
    {
        $validated = $request->validate([
            'estado' => 'nullable|string|max:50',
            'notas' => 'nullable|string',
        ]);

        $venta->update($validated);
        return redirect()->route('ventas.index');
    }

    public function destroy(Venta $venta)
    {
        foreach ($venta->items as $item) {
            $producto = $item->producto;
            $producto->stock += $item->cantidad;
            $producto->save();
            $item->delete();
        }
        
        $venta->delete();
        return redirect()->route('ventas.index');
    }
}
