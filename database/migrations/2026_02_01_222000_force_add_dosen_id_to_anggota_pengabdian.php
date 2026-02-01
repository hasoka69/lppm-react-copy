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
        // Enforce adding dosen_id to anggota_pengabdian
        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_pengabdian', 'dosen_id')) {
                    $table->unsignedBigInteger('dosen_id')->nullable()->after('usulan_id')->index();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (Schema::hasColumn('anggota_pengabdian', 'dosen_id')) {
                    $table->dropColumn('dosen_id');
                }
            });
        }
    }
};
