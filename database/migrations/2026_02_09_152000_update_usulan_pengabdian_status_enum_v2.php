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
        // Add new statuses for reviewer workflow in Pengabdian
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'under_review',
            'approved_prodi',
            'rejected_prodi',
            'reviewer_review',
            'approved',
            'rejected',
            'didanai',
            'ditolak',
            'needs_revision',
            'reviewer_assigned',
            'reviewed_approved',
            'rejected_reviewer',
            'under_revision_admin',
            'resubmitted_revision',
            'revision_dosen',
            'ditolak_akhir'
        ) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to previous known state
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'under_review',
            'approved_prodi',
            'rejected_prodi',
            'reviewer_review',
            'approved',
            'rejected',
            'didanai',
            'ditolak',
            'needs_revision'
        ) DEFAULT 'draft'");
    }
};
