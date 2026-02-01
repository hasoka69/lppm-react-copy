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
        // Add dosen_id to anggota_penelitian if not exists
        if (Schema::hasTable('anggota_penelitian')) {
            Schema::table('anggota_penelitian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_penelitian', 'dosen_id')) {
                    $table->unsignedBigInteger('dosen_id')->nullable()->after('usulan_id')->index();
                }
            });
        }

        // Add dosen_id to anggota_pengabdian if not exists
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
        if (Schema::hasTable('anggota_penelitian')) {
            Schema::table('anggota_penelitian', function (Blueprint $table) {
                if (Schema::hasColumn('anggota_penelitian', 'dosen_id')) {
                    $table->dropColumn('dosen_id');
                }
            });
        }

        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (Schema::hasColumn('anggota_pengabdian', 'dosen_id')) {
                    $table->dropColumn('dosen_id');
                }
            });
        }
    }
};
