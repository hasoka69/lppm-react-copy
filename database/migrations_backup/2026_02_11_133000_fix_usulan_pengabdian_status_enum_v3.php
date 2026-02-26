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
        // Explicitly update the status column to include 'didanai' and other missing statuses for usulan_pengabdian
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
        // Revert to a safe previous state (though data loss is possible if new statuses were used)
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
