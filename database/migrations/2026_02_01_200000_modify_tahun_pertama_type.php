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
        // Use DB::statement because doctrine/dbal might not be installed
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN tahun_pertama BIGINT NULL");
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN tahun_pertama BIGINT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting back to year might be tricky if data is 20261 (out of range/format)
        // ideally we would truncate or convert back, but for now just trying to revert type
        // Revert to YEAR (might lose data if it was 20261)
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN tahun_pertama YEAR NULL");
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN tahun_pertama YEAR NULL");
    }
};
