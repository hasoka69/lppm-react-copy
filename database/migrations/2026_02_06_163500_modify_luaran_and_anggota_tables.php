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
        // 1. Remove 'tahun' from luaran tables
        if (Schema::hasColumn('luaran_penelitian', 'tahun')) {
            Schema::table('luaran_penelitian', function (Blueprint $table) {
                $table->dropColumn('tahun');
            });
        }
        if (Schema::hasColumn('luaran_pengabdian', 'tahun')) {
            Schema::table('luaran_pengabdian', function (Blueprint $table) {
                $table->dropColumn('tahun');
            });
        }

        // 2. Restore 'status_approval' to anggota tables
        if (Schema::hasTable('anggota_penelitian')) {
            Schema::table('anggota_penelitian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_penelitian', 'status_approval')) {
                    $table->enum('status_approval', ['pending', 'accepted', 'rejected'])->default('pending')->after('tugas');
                }
            });
        }
        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_pengabdian', 'status_approval')) {
                    $table->enum('status_approval', ['pending', 'accepted', 'rejected'])->default('pending')->after('tugas');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverse Luaran
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->integer('tahun')->nullable();
        });
        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->integer('tahun')->nullable();
        });

        // Reverse Anggota
        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->dropColumn('status_approval');
        });
        Schema::table('anggota_pengabdian', function (Blueprint $table) {
            $table->dropColumn('status_approval');
        });
    }
};
