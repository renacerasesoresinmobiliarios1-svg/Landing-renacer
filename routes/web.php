<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdvisorController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LeadController;

// Vista principal / Landing Page
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// API Pública de Propiedades y WhatsApp
Route::get('/api/properties', [PropertyController::class, 'index']);
Route::get('/api/properties/{id}', [PropertyController::class, 'show']);
Route::post('/api/properties/{id}/whatsapp-click', [PropertyController::class, 'trackWhatsAppClick']);

// Captura de Prospectos (Mini-CRM)
Route::post('/api/leads', [LeadController::class, 'store']);

// Autenticación Formal y Registro
Route::post('/api/login', [AuthController::class, 'login'])->name('api.login');
Route::post('/api/register-client', [AuthController::class, 'registerClient'])->name('api.register-client');
Route::post('/api/logout', [AuthController::class, 'logout'])->name('api.logout');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rutas de Favoritos (accesibles por clientes autenticados)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/favorites', [FavoriteController::class, 'index']);
    Route::post('/api/favorites/toggle', [FavoriteController::class, 'toggle']);
    Route::get('/api/my-leads', [LeadController::class, 'myLeads']);
    Route::match(['put', 'post'], '/api/leads/{id}', [LeadController::class, 'update']);
});

// Rutas Protegidas de Administración y Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard adaptativo según rol (Admin Jorge o Vendedor)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Gestión de Propiedades desde el Dashboard
    Route::post('/api/properties', [PropertyController::class, 'store']);
    Route::match(['put', 'post'], '/api/properties/{id}', [PropertyController::class, 'update']);
    Route::post('/api/properties/{id}/status', [PropertyController::class, 'updateStatus']);
    Route::delete('/api/properties/{id}', [PropertyController::class, 'destroy']);

    // Módulo de Gestión de Equipo (Asesores)
    Route::get('/api/advisors', [AdvisorController::class, 'index']);
    Route::post('/api/advisors', [AdvisorController::class, 'store']);
    Route::delete('/api/advisors/{id}', [AdvisorController::class, 'destroy']);

    // Mini-CRM de Leads (Admin)
    Route::get('/api/leads', [LeadController::class, 'index']);
});

require __DIR__.'/settings.php';