<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::orderBy('created_at', 'desc')->get();
        return Inertia::render('clientes/Index', ['clientes' => $clientes]);
    }

    public function create()
    {
        return Inertia::render('clientes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'direccion' => 'nullable|string|max:255',
            'rfc' => 'nullable|string|max:13',
            'telefono' => 'nullable|string|max:20',
            'regimen_fiscal' => 'nullable|string|max:100',
        ]);

        Cliente::create($validated);
        return redirect()->route('clientes.index');
    }

    public function update(Request $request, Cliente $cliente)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email,' . $cliente->id,
            'direccion' => 'nullable|string|max:255',
            'rfc' => 'nullable|string|max:13',
            'telefono' => 'nullable|string|max:20',
            'regimen_fiscal' => 'nullable|string|max:100',
        ]);

        $cliente->update($validated);
        return redirect()->route('clientes.index');
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();
        return redirect()->route('clientes.index');
    }

    public function show(Cliente $cliente)
    {
        return Inertia::render('clientes/Show', ['cliente' => $cliente]);
    }
}
