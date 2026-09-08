<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('ubicacion');
            $table->string('ciudad');
            $table->string('tipo'); // 'Venta' o 'Renta'
            $table->decimal('precio', 14, 2);
            $table->string('precio_texto')->nullable();
            $table->decimal('costo_base', 14, 2)->default(0);
            $table->decimal('utilidad', 14, 2)->default(0);
            $table->string('estatus')->default('Activo'); // 'Activo', 'En Trato', 'Vendido'
            $table->integer('habitaciones')->default(1);
            $table->decimal('banos', 4, 1)->default(1.0);
            $table->string('superficie')->nullable();
            $table->text('imagen')->nullable();
            $table->string('telefono_asesor')->nullable();
            $table->boolean('destacada')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
