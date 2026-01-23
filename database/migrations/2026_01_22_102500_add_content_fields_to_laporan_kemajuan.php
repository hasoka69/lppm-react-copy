<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            if (!Schema::hasColumn('laporan_kemajuan_penelitian', 'ringkasan')) {
                $table->text('ringkasan')->nullable()->after('status');
            }
            if (!Schema::hasColumn('laporan_kemajuan_penelitian', 'keyword')) {
                $table->string('keyword')->nullable()->after('ringkasan');
            }
            if (!Schema::hasColumn('laporan_kemajuan_penelitian', 'file_laporan')) {
                $table->string('file_laporan')->nullable()->after('keyword');
            }
        });

        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('laporan_kemajuan_pengabdian', 'ringkasan')) {
                $table->text('ringkasan')->nullable()->after('status');
            }
            if (!Schema::hasColumn('laporan_kemajuan_pengabdian', 'keyword')) {
                $table->string('keyword')->nullable()->after('ringkasan');
            }
            if (!Schema::hasColumn('laporan_kemajuan_pengabdian', 'file_laporan')) {
                $table->string('file_laporan')->nullable()->after('keyword');
            }
        });
    }

    public function down(): void
    {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            $table->dropColumn(['ringkasan', 'keyword', 'file_laporan']);
        });

        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['ringkasan', 'keyword', 'file_laporan']);
        });
    }
};
