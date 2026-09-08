<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\WhatsAppLog;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $role = $user ? $user->role : 'vendedor';

        if ($role === 'admin') {
            // ADMIN (Jorge): Acceso completo, métricas de clics, utilidades financieras y estado de disponibilidad
            $kpis = [
                'total_whatsapp_clicks' => (int) WhatsAppLog::count(),
                'total_utilidad' => (float) Property::sum('utilidad'),
                'total_propiedades' => (int) Property::count(),
                'status_counts' => [
                    'activo' => Property::where('estatus', 'Activo')->count(),
                    'en_trato' => Property::where('estatus', 'En Trato')->count(),
                    'vendido' => Property::where('estatus', 'Vendido')->count(),
                ],
            ];

            $properties = Property::withCount('whatsappLogs')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($prop) {
                    return [
                        'id' => $prop->id,
                        'titulo' => $prop->titulo,
                        'ubicacion' => $prop->ubicacion,
                        'ciudad' => $prop->ciudad,
                        'tipo' => $prop->tipo,
                        'precio' => (float) $prop->precio,
                        'precio_texto' => $prop->precio_texto,
                        'costo_base' => (float) $prop->costo_base,
                        'utilidad' => (float) $prop->utilidad,
                        'estatus' => $prop->estatus,
                        'habitaciones' => $prop->habitaciones,
                        'banos' => $prop->banos,
                        'superficie' => $prop->superficie,
                        'imagen' => $prop->imagen,
                        'telefono_asesor' => $prop->telefono_asesor,
                        'whatsapp_clicks' => (int) $prop->whatsapp_logs_count,
                        'created_at' => $prop->created_at ? $prop->created_at->format('Y-m-d') : null,
                    ];
                });

            return Inertia::render('dashboard/Index', [
                'role' => 'admin',
                'user' => $user,
                'kpis' => $kpis,
                'properties' => $properties,
            ]);
        }

        // VENDEDOR: Vista reducida operativa. RESTRICCIÓN ESTRICTA: Sin costo_base, utilidad ni clics de WA
        $properties = Property::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($prop) {
                return [
                    'id' => $prop->id,
                    'titulo' => $prop->titulo,
                    'ubicacion' => $prop->ubicacion,
                    'ciudad' => $prop->ciudad,
                    'tipo' => $prop->tipo,
                    'precio' => (float) $prop->precio,
                    'precio_texto' => $prop->precio_texto,
                    'estatus' => $prop->estatus,
                    'habitaciones' => $prop->habitaciones,
                    'banos' => $prop->banos,
                    'superficie' => $prop->superficie,
                    'imagen' => $prop->imagen,
                    'telefono_asesor' => $prop->telefono_asesor,
                    'created_at' => $prop->created_at ? $prop->created_at->format('Y-m-d') : null,
                ];
            });

        return Inertia::render('dashboard/Index', [
            'role' => 'vendedor',
            'user' => $user,
            'kpis' => null,
            'properties' => $properties,
        ]);
    }
}