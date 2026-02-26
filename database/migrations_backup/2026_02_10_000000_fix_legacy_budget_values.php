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
        // Fix Penelitian records where dana_disetujui was hardcoded to 7,000,000 
        // but the actual total_anggaran was different (effectively restoring the original intent)
        // We only target 'didanai' status because that's where the hardcoding happened in finalDecision.

        DB::table('usulan_penelitian')
            ->where('status', 'didanai')
            ->where('dana_disetujui', 7000000)
            ->update([
                'dana_disetujui' => DB::raw('total_anggaran')
            ]);

        // Same for Pengabdian
        DB::table('usulan_pengabdian')
            ->where('status', 'didanai')
            ->where('dana_disetujui', 7000000)
            ->update([
                'dana_disetujui' => DB::raw('total_anggaran')
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Usually, we don't have enough info to reverse a data fix like this perfectly
        // unless we log the old values, but since this is a bug fix for a hardcoded value,
        // "undoing" doesn't strictly make sense.
    }
};
