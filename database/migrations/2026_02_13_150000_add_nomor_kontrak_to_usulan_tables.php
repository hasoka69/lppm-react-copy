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
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_penelitian', 'nomor_kontrak')) {
                $table->string('nomor_kontrak')->nullable()->after('status');
            }
            if (!Schema::hasColumn('usulan_penelitian', 'tanggal_kontrak')) {
                $table->date('tanggal_kontrak')->nullable()->after('status');
            }
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_pengabdian', 'nomor_kontrak')) {
                $table->string('nomor_kontrak')->nullable()->after('status');
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'tanggal_kontrak')) {
                $table->date('tanggal_kontrak')->nullable()->after('status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropColumn(['nomor_kontrak', 'tanggal_kontrak']);
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['nomor_kontrak', 'tanggal_kontrak']);
        });
    }
};
