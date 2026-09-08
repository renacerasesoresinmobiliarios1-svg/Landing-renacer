<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    /**
     * Listado global de prospectos para el Administrador (Jorge).
     */
    public function index(Request $request)
    {
        $query = Lead::with(['property', 'advisor']);

        if ($request->filled('estatus') && $request->estatus !== 'Todos') {
            $query->where('estatus', $request->estatus);
        }

        if ($request->filled('advisor_id') && $request->advisor_id !== 'Todos') {
            $query->where('user_id', $request->advisor_id);
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        $kpis = [
            'total' => Lead::count(),
            'nuevos' => Lead::where('estatus', 'Nuevo')->count(),
            'contactados' => Lead::where('estatus', 'Contactado')->count(),
            'citas' => Lead::where('estatus', 'Cita Agendada')->count(),
            'cerrados' => Lead::where('estatus', 'Cerrado')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $leads,
            'kpis' => $kpis,
        ]);
    }

    /**
     * Listado de prospectos asignados al vendedor autenticado.
     */
    public function myLeads(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado',
                'data' => [],
                'nuevos_count' => 0,
            ], 401);
        }

        $leads = Lead::where('user_id', $user->id)
            ->with('property')
            ->orderBy('created_at', 'desc')
            ->get();

        $nuevosCount = Lead::where('user_id', $user->id)
            ->where('estatus', 'Nuevo')
            ->count();

        return response()->json([
            'success' => true,
            'data' => $leads,
            'nuevos_count' => $nuevosCount,
        ]);
    }

    /**
     * Captura de nuevo Lead (desde botón de WhatsApp o ficha de detalle).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'cliente_nombre' => 'required|string|max:255',
            'cliente_telefono' => 'required|string|max:50',
            'user_id' => 'nullable|exists:users,id',
            'notas' => 'nullable|string',
            'origen' => 'nullable|string',
        ]);

        // Si no se especifica asesor, intentar asignar al primer asesor vendedor disponible o dejar null
        $advisorId = $validated['user_id'] ?? null;
        if (!$advisorId) {
            $defaultAdvisor = User::where('role', 'vendedor')->first();
            $advisorId = $defaultAdvisor ? $defaultAdvisor->id : null;
        }

        $lead = Lead::create([
            'property_id' => $validated['property_id'],
            'user_id' => $advisorId,
            'cliente_nombre' => $validated['cliente_nombre'],
            'cliente_telefono' => $validated['cliente_telefono'],
            'origen' => $validated['origen'] ?? 'WhatsApp',
            'estatus' => 'Nuevo',
            'notas' => $validated['notas'] ?? 'Interesado en información y recorrido por WhatsApp.',
        ]);

        $lead->load(['property', 'advisor']);

        return response()->json([
            'success' => true,
            'message' => 'Prospecto registrado exitosamente',
            'data' => $lead,
        ], 201);
    }

    /**
     * Actualizar asignación de asesor, estatus o notas del lead.
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'estatus' => 'nullable|string|in:Nuevo,Contactado,Cita Agendada,Cerrado,Descartado',
            'notas' => 'nullable|string',
        ]);

        $lead->update($validated);
        $lead->load(['property', 'advisor']);

        return response()->json([
            'success' => true,
            'message' => 'Prospecto actualizado correctamente',
            'data' => $lead,
        ]);
    }
}
