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
        // Add new statuses for reviewer workflow
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'reviewer_review',
            'needs_revision',
            'revision_dosen',
            'approved',
            'rejected',
            'didanai',
            'ditolak',
            'approved_prodi',
            'rejected_prodi',
            'waiting_member_approval',
            'reviewer_assigned',
            'reviewed_approved',
            'rejected_reviewer',
            'under_revision_admin',
            'resubmitted_revision'
        ) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to previous state
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'reviewer_review',
            'needs_revision',
            'revision_dosen',
            'approved',
            'rejected',
            'didanai',
            'ditolak',
            'approved_prodi',
            'rejected_prodi',
            'waiting_member_approval',
            'reviewer_assigned'
        ) DEFAULT 'draft'");
    }
};
