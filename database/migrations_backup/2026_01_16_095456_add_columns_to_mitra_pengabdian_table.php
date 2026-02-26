<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('mitra_pengabdian', function (Blueprint $table) {
            $table->string('alamat_mitra')->nullable()->after('jenis_mitra');
            $table->string('penanggung_jawab')->nullable()->after('alamat_mitra');
            $table->string('no_telepon')->nullable()->after('penanggung_jawab');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mitra_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['alamat_mitra', 'penanggung_jawab', 'no_telepon']);
        });
    }
};
