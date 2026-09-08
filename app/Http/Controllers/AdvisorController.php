<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdvisorController extends Controller
{
    /**
     * Listar todos los asesores (vendedores).
     */
    public function index()
    {
        $advisors = User::where('role', 'vendedor')
            ->orderBy('created_at', 'desc')
            ->get(['id', 'name', 'email', 'telefono', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $advisors,
        ]);
    }

    /**
     * Registrar un nuevo asesor.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telefono' => 'nullable|string|max:30',
            'password' => 'required|string|min:6',
        ]);

        $advisor = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'telefono' => $validated['telefono'] ?? null,
            'role' => 'vendedor',
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Asesor registrado exitosamente',
            'data' => $advisor,
        ], 201);
    }

    /**
     * Dar de baja / eliminar un asesor.
     */
    public function destroy($id)
    {
        $advisor = User::where('role', 'vendedor')->findOrFail($id);
        $advisor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Asesor eliminado del sistema',
        ]);
    }
}
