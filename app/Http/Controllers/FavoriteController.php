<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    /**
     * Obtener listado de inmuebles guardados por el cliente autenticado.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'No autenticado',
                'data' => [],
            ], 401);
        }

        $favorites = $user->favorites()
            ->orderBy('favorites.created_at', 'desc')
            ->get();

        $favoriteIds = $favorites->pluck('id')->toArray();

        return response()->json([
            'success' => true,
            'data' => $favorites,
            'favorite_ids' => $favoriteIds,
        ]);
    }

    /**
     * Alternar (agregar o quitar) una propiedad de favoritos.
     */
    public function toggle(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Debes iniciar sesión para guardar favoritos',
            ], 401);
        }

        $request->validate([
            'property_id' => 'required|exists:properties,id',
        ]);

        $propertyId = $request->input('property_id');
        $existing = Favorite::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isFavorite = false;
            $message = 'Propiedad eliminada de favoritos';
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'property_id' => $propertyId,
                'created_at' => now(),
            ]);
            $isFavorite = true;
            $message = 'Propiedad guardada en favoritos';
        }

        $totalFavorites = Favorite::where('user_id', $user->id)->count();

        return response()->json([
            'success' => true,
            'message' => $message,
            'is_favorite' => $isFavorite,
            'property_id' => $propertyId,
            'total_favorites' => $totalFavorites,
        ]);
    }
}
