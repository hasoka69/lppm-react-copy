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
        // Add new statuses: didanai, ditolak, needs_revision
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM('draft', 'submitted', 'under_review', 'approved_prodi', 'rejected_prodi', 'reviewer_review', 'approved', 'rejected', 'didanai', 'ditolak', 'needs_revision') DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum (note: verify no data is lost or provide fallback)
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM('draft', 'submitted', 'under_review', 'approved_prodi', 'rejected_prodi', 'reviewer_review', 'approved', 'rejected') DEFAULT 'draft'");
    }
};
