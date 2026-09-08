<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdvisorController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeadController;

// Health & Diagnostic endpoint (solo disponible en entorno local de desarrollo)
if (app()->environment('local')) {
    Route::get('/debug-test', function () {
        return response()->json([
            'status' => 'ok',
            'php_version' => PHP_VERSION,
            'app_key_set' => !empty(config('app.key')),
            'db_connection' => config('database.default'),
            'sqlite_exists' => file_exists(database_path('database.sqlite')),
            'sqlite_writable' => is_writable(database_path('database.sqlite')),
            'storage_writable' => is_writable(storage_path('framework/sessions')),
            'properties_count' => \App\Models\Property::count(),
        ]);
    });
}

// Vista principal / Landing Page
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// API Pública de Propiedades y WhatsApp
Route::get('/api/properties', [PropertyController::class, 'index']);
Route::get('/api/properties/{id}', [PropertyController::class, 'show']);
Route::post('/api/properties/{id}/whatsapp-click', [PropertyController::class, 'trackWhatsAppClick'])->middleware('throttle:30,1');

// Captura de Prospectos (Mini-CRM con protección anti-spam)
Route::post('/api/leads', [LeadController::class, 'store'])->middleware('throttle:10,1');

// Autenticación Formal y Registro (con protección contra fuerza bruta)
Route::post('/api/login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('api.login');
Route::post('/api/register-client', [AuthController::class, 'registerClient'])->middleware('throttle:5,1')->name('api.register-client');
Route::post('/api/logout', [AuthController::class, 'logout'])->name('api.logout');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rutas de Clientes / Usuarios Autenticados
Route::middleware(['auth'])->group(function () {
    Route::get('/api/favorites', [FavoriteController::class, 'index']);
    Route::post('/api/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/api/my-leads', [LeadController::class, 'myLeads'])->middleware('role:admin,vendedor');
    Route::match(['put', 'post'], '/api/leads/{id}', [LeadController::class, 'update'])->middleware('role:admin,vendedor');
});

// Rutas de Asesores y Administradores (Staff Interno)
Route::middleware(['auth', 'role:admin,vendedor'])->group(function () {
    // Dashboard adaptativo
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Gestión operativa de Propiedades (Crear, Editar, Cambiar Estatus)
    Route::post('/api/properties', [PropertyController::class, 'store']);
    Route::match(['put', 'post'], '/api/properties/{id}', [PropertyController::class, 'update']);
    Route::post('/api/properties/{id}/status', [PropertyController::class, 'updateStatus']);
});

// Rutas Exclusivas de Dirección / Administrador (Jorge)
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Eliminar Propiedades
    Route::delete('/api/properties/{id}', [PropertyController::class, 'destroy']);

    // Módulo de Gestión de Asesores (Crear, Listar, Eliminar)
    Route::get('/api/advisors', [AdvisorController::class, 'index']);
    Route::post('/api/advisors', [AdvisorController::class, 'store']);
    Route::delete('/api/advisors/{id}', [AdvisorController::class, 'destroy']);

    // Vista global completa del CRM de Leads
    Route::get('/api/leads', [LeadController::class, 'index']);
});

require __DIR__.'/settings.php';