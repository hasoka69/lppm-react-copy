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
        // Drop columns from anggota_penelitian
        if (Schema::hasTable('anggota_penelitian')) {
            Schema::table('anggota_penelitian', function (Blueprint $table) {
                $columnsToDrop = [];
                if (Schema::hasColumn('anggota_penelitian', 'status_approval'))
                    $columnsToDrop[] = 'status_approval';
                if (Schema::hasColumn('anggota_penelitian', 'approval_comment'))
                    $columnsToDrop[] = 'approval_comment';
                if (Schema::hasColumn('anggota_penelitian', 'approved_at'))
                    $columnsToDrop[] = 'approved_at';

                if (!empty($columnsToDrop)) {
                    $table->dropColumn($columnsToDrop);
                }
            });
        }

        // Drop columns from anggota_pengabdian
        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (Schema::hasColumn('anggota_pengabdian', 'status_persetujuan')) {
                    $table->dropColumn('status_persetujuan');
                }
            });
        }

        // Drop columns from anggota_non_dosen
        if (Schema::hasTable('anggota_non_dosen')) {
            Schema::table('anggota_non_dosen', function (Blueprint $table) {
                if (Schema::hasColumn('anggota_non_dosen', 'status_approval')) {
                    $table->dropColumn('status_approval');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add columns back to anggota_penelitian
        if (Schema::hasTable('anggota_penelitian')) {
            Schema::table('anggota_penelitian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_penelitian', 'status_approval')) {
                    $table->string('status_approval')->default('pending')->nullable();
                }
                if (!Schema::hasColumn('anggota_penelitian', 'approval_comment')) {
                    $table->text('approval_comment')->nullable();
                }
                if (!Schema::hasColumn('anggota_penelitian', 'approved_at')) {
                    $table->timestamp('approved_at')->nullable();
                }
            });
        }

        // Add columns back to anggota_pengabdian
        if (Schema::hasTable('anggota_pengabdian')) {
            Schema::table('anggota_pengabdian', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_pengabdian', 'status_persetujuan')) {
                    $table->string('status_persetujuan')->default('menunggu')->nullable();
                }
            });
        }

        // Add columns back to anggota_non_dosen
        if (Schema::hasTable('anggota_non_dosen')) {
            Schema::table('anggota_non_dosen', function (Blueprint $table) {
                if (!Schema::hasColumn('anggota_non_dosen', 'status_approval')) {
                    $table->string('status_approval')->default('pending')->nullable();
                }
            });
        }
    }
};
