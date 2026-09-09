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
        Schema::table('leads', function (Blueprint $table) {
            $table->string('cliente_email')->nullable()->after('cliente_telefono');
            $table->date('fecha_visita')->nullable()->after('estatus');
            $table->string('turno_visita')->nullable()->after('fecha_visita');
            $table->string('canal_utm')->nullable()->after('turno_visita');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leads', function (Blueprint $table) {
            $table->dropColumn(['cliente_email', 'fecha_visita', 'turno_visita', 'canal_utm']);
        });
    }
};
