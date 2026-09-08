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
        Schema::table('productos', function (Blueprint $table) {
            if (!Schema::hasColumn('productos', 'marca')) {
                $table->string('marca')->nullable();
            }
            if (!Schema::hasColumn('productos', 'cliente_nombre')) {
                $table->string('cliente_nombre')->nullable();
            }
            if (!Schema::hasColumn('productos', 'tipo_limpieza')) {
                $table->string('tipo_limpieza')->nullable();
            }
            if (!Schema::hasColumn('productos', 'estatus')) {
                $table->string('estatus')->default('RECOLECTADO');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            //
        });
    }
};
