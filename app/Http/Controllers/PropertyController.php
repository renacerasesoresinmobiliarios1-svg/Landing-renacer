<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\WhatsAppLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    /**
     * Listado público o para frontend de propiedades.
     */
    public function index(Request $request)
    {
        $query = Property::with(['images']);

        if ($request->filled('ciudad') && $request->ciudad !== 'Todas las ciudades') {
            $query->where('ciudad', $request->ciudad);
        }

        if ($request->filled('tipo') && $request->tipo !== 'Todos los tipos') {
            $query->where('tipo', $request->tipo);
        }

        $properties = $query->withCount('whatsappLogs')
            ->orderBy('id', 'desc')
            ->get();

        // Si el usuario está autenticado, enviar también sus IDs de favoritos
        $favoriteIds = [];
        if (Auth::check()) {
            $favoriteIds = Auth::user()->favorites()->pluck('properties.id')->toArray();
        }

        return response()->json([
            'success' => true,
            'data' => $properties,
            'favorite_ids' => $favoriteIds,
        ]);
    }

    /**
     * Ficha de detalle de propiedad.
     */
    public function show($id)
    {
        $property = Property::with(['images', 'whatsappLogs'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $property,
        ]);
    }

    /**
     * Rastreo silencioso de clics hacia WhatsApp.
     */
    public function trackWhatsAppClick(Request $request, $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json([
                'success' => false,
                'message' => 'Propiedad no encontrada',
            ], 404);
        }

        $log = WhatsAppLog::create([
            'property_id' => $property->id,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);

        $totalClicks = WhatsAppLog::where('property_id', $property->id)->count();
        $globalClicks = WhatsAppLog::count();

        return response()->json([
            'success' => true,
            'message' => 'Clic registrado exitosamente',
            'property_id' => $property->id,
            'property_clicks' => $totalClicks,
            'global_clicks' => $globalClicks,
        ]);
    }

    /**
     * Crear una nueva propiedad (soporta especificaciones y múltiples imágenes).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'ubicacion' => 'required|string|max:255',
            'ciudad' => 'required|string',
            'tipo' => 'required|string',
            'precio' => 'required|numeric',
            'costo_base' => 'nullable|numeric',
            'utilidad' => 'nullable|numeric',
            'estatus' => 'nullable|string',
            'habitaciones' => 'nullable|integer',
            'recamaras' => 'nullable|integer',
            'banos' => 'nullable|numeric',
            'estacionamientos' => 'nullable|integer',
            'superficie' => 'nullable|string',
            'terreno_m2' => 'nullable|numeric',
            'construccion_m2' => 'nullable|numeric',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|string',
            'imagen_file' => 'nullable|file|image|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'imagenes_files.*' => 'nullable|file|image|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'telefono_asesor' => 'nullable|string',
        ]);

        // Sincronizar recamaras y habitaciones
        if (isset($validated['recamaras']) && !isset($validated['habitaciones'])) {
            $validated['habitaciones'] = $validated['recamaras'];
        } elseif (isset($validated['habitaciones']) && !isset($validated['recamaras'])) {
            $validated['recamaras'] = $validated['habitaciones'];
        }

        // Procesar archivo de imagen principal si fue adjuntado
        if ($request->hasFile('imagen_file')) {
            $file = $request->file('imagen_file');
            $path = $file->store('properties', 'public');
            $validated['imagen'] = '/storage/' . $path;
        } elseif (empty($validated['imagen'])) {
            $validated['imagen'] = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
        }

        if (empty($validated['precio_texto'])) {
            $validated['precio_texto'] = '$' . number_format($validated['precio'], 2) . ' MXN' . ($validated['tipo'] === 'Renta' ? '/mes' : '');
        }

        $user = Auth::user();
        if ($user && $user->role === 'vendedor') {
            $validated['costo_base'] = 0;
            $validated['utilidad'] = 0;
        }

        $property = Property::create($validated);

        // Guardar imagen principal en la galería de fotos
        if (!empty($validated['imagen'])) {
            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $validated['imagen'],
            ]);
        }

        // Procesar múltiples imágenes si se adjuntaron
        if ($request->hasFile('imagenes_files')) {
            foreach ($request->file('imagenes_files') as $imgFile) {
                $subPath = $imgFile->store('properties', 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => '/storage/' . $subPath,
                ]);
            }
        }

        $property->load('images');

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Propiedad creada con éxito',
                'data' => $property,
            ], 201);
        }

        return redirect()->back()->with('success', 'Propiedad creada exitosamente.');
    }

    /**
     * Actualizar una propiedad existente.
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'sometimes|required|string|max:255',
            'ubicacion' => 'sometimes|required|string|max:255',
            'ciudad' => 'sometimes|required|string',
            'tipo' => 'sometimes|required|string',
            'precio' => 'sometimes|required|numeric',
            'costo_base' => 'nullable|numeric',
            'utilidad' => 'nullable|numeric',
            'estatus' => 'sometimes|required|string',
            'habitaciones' => 'nullable|integer',
            'recamaras' => 'nullable|integer',
            'banos' => 'nullable|numeric',
            'estacionamientos' => 'nullable|integer',
            'superficie' => 'nullable|string',
            'terreno_m2' => 'nullable|numeric',
            'construccion_m2' => 'nullable|numeric',
            'descripcion' => 'nullable|string',
            'imagen' => 'nullable|string',
            'imagen_file' => 'nullable|file|image|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'imagenes_files.*' => 'nullable|file|image|mimes:jpeg,png,jpg,webp,gif|max:10240',
            'telefono_asesor' => 'nullable|string',
        ]);

        if (isset($validated['recamaras'])) {
            $validated['habitaciones'] = $validated['recamaras'];
        }

        // Procesar reemplazo de imagen principal
        if ($request->hasFile('imagen_file')) {
            $file = $request->file('imagen_file');
            $path = $file->store('properties', 'public');
            $validated['imagen'] = '/storage/' . $path;

            PropertyImage::create([
                'property_id' => $property->id,
                'image_path' => $validated['imagen'],
            ]);
        }

        // Procesar nuevas imágenes adicionales
        if ($request->hasFile('imagenes_files')) {
            foreach ($request->file('imagenes_files') as $imgFile) {
                $subPath = $imgFile->store('properties', 'public');
                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path' => '/storage/' . $subPath,
                ]);
            }
        }

        $user = Auth::user();
        if ($user && $user->role === 'vendedor') {
            unset($validated['costo_base']);
            unset($validated['utilidad']);
        }

        if (isset($validated['precio']) && empty($validated['precio_texto'])) {
            $tipo = $validated['tipo'] ?? $property->tipo;
            $validated['precio_texto'] = '$' . number_format($validated['precio'], 2) . ' MXN' . ($tipo === 'Renta' ? '/mes' : '');
        }

        $property->update($validated);
        $property->load('images');

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Propiedad actualizada con éxito',
                'data' => $property,
            ]);
        }

        return redirect()->back()->with('success', 'Propiedad actualizada exitosamente.');
    }

    /**
     * Actualizar estatus rápidamente (Activo, En Trato, Vendido).
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estatus' => 'required|string|in:Activo,En Trato,Vendido,activo,en trato,vendido',
        ]);

        $property = Property::findOrFail($id);
        $property->estatus = ucfirst($request->estatus);
        $property->save();

        return response()->json([
            'success' => true,
            'message' => 'Estatus actualizado correctamente',
            'estatus' => $property->estatus,
        ]);
    }

    /**
     * Eliminar una propiedad.
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);
        $property->delete();

        if (request()->wantsJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Propiedad eliminada',
            ]);
        }

        return redirect()->back()->with('success', 'Propiedad eliminada.');
    }
}
