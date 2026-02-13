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
        // Add to usulan_penelitian
        if (Schema::hasTable('usulan_penelitian')) {
            Schema::table('usulan_penelitian', function (Blueprint $table) {
                if (!Schema::hasColumn('usulan_penelitian', 'tanggal_mulai_kontrak')) {
                    $table->date('tanggal_mulai_kontrak')->nullable()->after('tanggal_kontrak');
                }
                if (!Schema::hasColumn('usulan_penelitian', 'tanggal_selesai_kontrak')) {
                    $table->date('tanggal_selesai_kontrak')->nullable()->after('tanggal_mulai_kontrak');
                }
            });
        }

        // Add to usulan_pengabdian
        if (Schema::hasTable('usulan_pengabdian')) {
            Schema::table('usulan_pengabdian', function (Blueprint $table) {
                if (!Schema::hasColumn('usulan_pengabdian', 'tanggal_mulai_kontrak')) {
                    $table->date('tanggal_mulai_kontrak')->nullable()->after('tanggal_kontrak');
                }
                if (!Schema::hasColumn('usulan_pengabdian', 'tanggal_selesai_kontrak')) {
                    $table->date('tanggal_selesai_kontrak')->nullable()->after('tanggal_mulai_kontrak');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropColumn(['tanggal_mulai_kontrak', 'tanggal_selesai_kontrak']);
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['tanggal_mulai_kontrak', 'tanggal_selesai_kontrak']);
        });
    }
};
