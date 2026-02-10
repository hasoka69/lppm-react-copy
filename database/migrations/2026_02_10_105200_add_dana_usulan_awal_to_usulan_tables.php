<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->decimal('dana_usulan_awal', 15, 2)->nullable()->after('total_anggaran');
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->decimal('dana_usulan_awal', 15, 2)->nullable()->after('total_anggaran');
        });

        // Populate existing records: Set dana_usulan_awal = total_anggaran
        DB::statement('UPDATE usulan_penelitian SET dana_usulan_awal = total_anggaran');
        DB::statement('UPDATE usulan_pengabdian SET dana_usulan_awal = total_anggaran');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropColumn('dana_usulan_awal');
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropColumn('dana_usulan_awal');
        });
    }
};
