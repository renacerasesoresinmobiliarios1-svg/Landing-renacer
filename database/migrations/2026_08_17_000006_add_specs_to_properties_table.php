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
        Schema::table('properties', function (Blueprint $table) {
            $table->float('terreno_m2')->nullable()->after('superficie');
            $table->float('construccion_m2')->nullable()->after('terreno_m2');
            $table->integer('recamaras')->default(0)->after('construccion_m2');
            $table->integer('estacionamientos')->default(0)->after('banos');
            $table->text('descripcion')->nullable()->after('destacada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn(['terreno_m2', 'construccion_m2', 'recamaras', 'estacionamientos', 'descripcion']);
        });
    }
};
