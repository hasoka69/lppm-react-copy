<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // laporan_kemajuan_penelitian
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            if (!Schema::hasColumn('laporan_kemajuan_penelitian', 'file_sptb')) {
                $table->string('file_sptb')->nullable()->after('file_laporan');
            }
        });

        // laporan_kemajuan_pengabdian
        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('laporan_kemajuan_pengabdian', 'file_sptb')) {
                $table->string('file_sptb')->nullable()->after('file_laporan');
            }
        });
    }

    public function down(): void
    {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            if (Schema::hasColumn('laporan_kemajuan_penelitian', 'file_sptb')) {
                $table->dropColumn('file_sptb');
            }
        });

        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            if (Schema::hasColumn('laporan_kemajuan_pengabdian', 'file_sptb')) {
                $table->dropColumn('file_sptb');
            }
        });
    }
};
