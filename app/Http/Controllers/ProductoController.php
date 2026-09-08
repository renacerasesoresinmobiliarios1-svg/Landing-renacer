<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;

class ProductoController extends Controller
{
    public function index()
    {
        return Inertia::render('productos/Index', [
            'productos' => Producto::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'marca' => 'required',
            'nombre' => 'required',
            'categoria' => 'required',
            'fecha_salida' => 'required',
            'precio' => 'required|numeric',
        ]);

        $producto = new Producto();
        $producto->marca = strtoupper($request->marca);
        $producto->nombre = strtoupper($request->nombre);
        $producto->categoria = strtoupper($request->categoria);
        $producto->tipo_limpieza = $request->tipo_limpieza;
        $producto->cliente_nombre = $request->cliente_nombre;
        $producto->precio = $request->precio;
        $producto->fecha_ingreso = $request->fecha_ingreso ?? now()->format('Y-m-d');
        $producto->sku = strtoupper(substr($request->marca, 0, 3)) . '-' . strtoupper(Str::random(6));
        $producto->fecha_salida = Carbon::parse($request->fecha_salida)->format('Y-m-d');
        $producto->estatus = trim(strtoupper($request->estatus ?? 'RECIBIDO'));

        $producto->save();
        return redirect()->back();
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $producto->update([
            'marca' => strtoupper($request->marca ?? $producto->marca),
            'nombre' => strtoupper($request->nombre ?? $producto->nombre),
            'estatus' => trim(strtoupper($request->estatus ?? $producto->estatus)),
            'fecha_salida' => Carbon::parse($request->fecha_salida ?? $producto->fecha_salida)->format('Y-m-d'),
            'precio' => $request->precio ?? $producto->precio,
        ]);

        return redirect()->back();
    }

    // ESTA ES LA FUNCIÓN QUE FALTABA Y CAUSA EL ERROR
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return redirect()->back();
    }
}