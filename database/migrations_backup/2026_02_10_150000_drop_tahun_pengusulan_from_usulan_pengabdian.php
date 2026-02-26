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
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            if (Schema::hasColumn('usulan_pengabdian', 'tahun_pengusulan')) {
                $table->dropColumn('tahun_pengusulan');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_pengabdian', 'tahun_pengusulan')) {
                $table->year('tahun_pengusulan')->nullable();
            }
        });
    }
};
