<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class LeadController extends Controller
{
    /**
     * Listado global de prospectos para el Administrador (Jorge) con filtros avanzados y métricas de equipo.
     */
    public function index(Request $request)
    {
        $query = Lead::with(['property', 'advisor']);

        // Filtro por Estatus
        if ($request->filled('estatus') && $request->estatus !== 'Todos') {
            $query->where('estatus', $request->estatus);
        }

        // Filtro por Asesor asignado
        if ($request->filled('advisor_id') && $request->advisor_id !== 'Todos') {
            $query->where('user_id', $request->advisor_id);
        }

        // Filtro por Período / Fecha
        if ($request->filled('periodo')) {
            match ($request->periodo) {
                'hoy' => $query->whereDate('created_at', Carbon::today()),
                'semana' => $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]),
                'mes' => $query->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year),
                default => null,
            };
        }

        // Búsqueda en texto (nombre, teléfono, email, notas)
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('cliente_nombre', 'like', $term)
                  ->orWhere('cliente_telefono', 'like', $term)
                  ->orWhere('cliente_email', 'like', $term)
                  ->orWhere('notas', 'like', $term)
                  ->orWhereHas('property', function ($qp) use ($term) {
                      $qp->where('titulo', 'like', $term)->orWhere('ubicacion', 'like', $term);
                  });
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        // KPIs Generales
        $kpis = [
            'total' => Lead::count(),
            'nuevos' => Lead::where('estatus', 'Nuevo')->count(),
            'contactados' => Lead::where('estatus', 'Contactado')->count(),
            'citas' => Lead::where('estatus', 'Cita Agendada')->count(),
            'cerrados' => Lead::where('estatus', 'Cerrado')->count(),
        ];

        // Leaderboard de Rendimiento de Asesores
        $advisors = User::where('role', 'vendedor')->get();
        $teamPerformance = $advisors->map(function ($advisor) {
            $advisorLeads = Lead::where('user_id', $advisor->id);
            $total = (clone $advisorLeads)->count();
            $citas = (clone $advisorLeads)->where('estatus', 'Cita Agendada')->count();
            $cerrados = (clone $advisorLeads)->where('estatus', 'Cerrado')->count();

            return [
                'id' => $advisor->id,
                'name' => $advisor->name,
                'email' => $advisor->email,
                'telefono' => $advisor->telefono,
                'total_leads' => $total,
                'citas_agendadas' => $citas,
                'citas_count' => $citas,
                'ventas_cerradas' => $cerrados,
                'cerrados_count' => $cerrados,
                'conversion_rate' => $total > 0 ? round(($cerrados / $total) * 100, 1) : 0,
                'tasa_cierre' => $total > 0 ? round(($cerrados / $total) * 100, 1) : 0,
            ];
        })->sortByDesc('total_leads')->values();

        return response()->json([
            'success' => true,
            'data' => $leads,
            'kpis' => $kpis,
            'team_performance' => $teamPerformance,
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

        $query = Lead::where('user_id', $user->id)->with('property');

        if ($request->filled('periodo')) {
            match ($request->periodo) {
                'hoy' => $query->whereDate('created_at', Carbon::today()),
                'semana' => $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]),
                'mes' => $query->whereMonth('created_at', Carbon::now()->month)->whereYear('created_at', Carbon::now()->year),
                default => null,
            };
        }

        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->where('cliente_nombre', 'like', $term)
                  ->orWhere('cliente_telefono', 'like', $term)
                  ->orWhere('cliente_email', 'like', $term)
                  ->orWhere('notas', 'like', $term);
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        $nuevosCount = Lead::where('user_id', $user->id)
            ->where('estatus', 'Nuevo')
            ->count();

        $citasCount = Lead::where('user_id', $user->id)
            ->where('estatus', 'Cita Agendada')
            ->count();

        return response()->json([
            'success' => true,
            'data' => $leads,
            'nuevos_count' => $nuevosCount,
            'citas_count' => $citasCount,
        ]);
    }

    /**
     * Captura de nuevo Lead / Solicitud de Cita.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'cliente_nombre' => 'required|string|max:255',
            'cliente_telefono' => 'required|string|max:50',
            'cliente_email' => 'nullable|email|max:255',
            'user_id' => 'nullable|exists:users,id',
            'fecha_visita' => 'nullable|date',
            'turno_visita' => 'nullable|string|max:100',
            'canal_utm' => 'nullable|string|max:100',
            'notas' => 'nullable|string',
            'origen' => 'nullable|string',
            'estatus' => 'nullable|string',
        ]);

        // Asignar al asesor correspondiente o al primer asesor activo
        $advisorId = $validated['user_id'] ?? null;
        if (!$advisorId) {
            $property = Property::find($validated['property_id']);
            if ($property && $property->telefono_asesor) {
                $matchedUser = User::where('telefono', $property->telefono_asesor)->first();
                if ($matchedUser) {
                    $advisorId = $matchedUser->id;
                }
            }
            if (!$advisorId) {
                $defaultAdvisor = User::where('role', 'vendedor')->first();
                $advisorId = $defaultAdvisor ? $defaultAdvisor->id : null;
            }
        }

        $isAppointment = !empty($validated['fecha_visita']);
        $estatus = $validated['estatus'] ?? ($isAppointment ? 'Cita Agendada' : 'Nuevo');

        $lead = Lead::create([
            'property_id' => $validated['property_id'],
            'user_id' => $advisorId,
            'cliente_nombre' => $validated['cliente_nombre'],
            'cliente_telefono' => $validated['cliente_telefono'],
            'cliente_email' => $validated['cliente_email'] ?? null,
            'fecha_visita' => $validated['fecha_visita'] ?? null,
            'turno_visita' => $validated['turno_visita'] ?? null,
            'canal_utm' => $validated['canal_utm'] ?? null,
            'origen' => $validated['origen'] ?? ($isAppointment ? 'Agendador de Citas' : 'WhatsApp'),
            'estatus' => $estatus,
            'notas' => $validated['notas'] ?? ($isAppointment 
                ? "Solicitud de recorrido para el {$validated['fecha_visita']} en turno {$validated['turno_visita']}." 
                : 'Interesado en información y recorrido.'),
        ]);

        $lead->load(['property', 'advisor']);

        return response()->json([
            'success' => true,
            'message' => $isAppointment ? '¡Visita agendada con éxito!' : 'Prospecto registrado exitosamente',
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
            'fecha_visita' => 'nullable|date',
            'turno_visita' => 'nullable|string',
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

