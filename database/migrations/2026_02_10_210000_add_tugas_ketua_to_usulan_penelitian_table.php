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
        // Check if column exists to prevent error if previous migration actually partially ran
        if (!Schema::hasColumn('usulan_penelitian', 'tugas_ketua')) {
            Schema::table('usulan_penelitian', function (Blueprint $table) {
                $table->text('tugas_ketua')->nullable()->after('tahun_pertama');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('usulan_penelitian', 'tugas_ketua')) {
            Schema::table('usulan_penelitian', function (Blueprint $table) {
                $table->dropColumn('tugas_ketua');
            });
        }
    }
};
