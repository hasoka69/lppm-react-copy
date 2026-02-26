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
        $statuses = [
            'draft',
            'submitted',
            'waiting_member_approval',
            'reviewer_assigned',
            'under_review',
            'reviewer_review',
            'reviewed',
            'reviewed_approved',
            'rejected_reviewer',
            'under_revision_admin',
            'revision_dosen',
            'resubmitted_revision',
            'approved_prodi',
            'rejected_prodi',
            'approved',
            'rejected',
            'didanai',
            'funded',
            'ditolak',
            'ditolak_akhir',
            'needs_revision',
            'completed'
        ];

        $statusString = "'" . implode("','", $statuses) . "'";

        // Update usulan_penelitian
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM($statusString) DEFAULT 'draft'");

        // Update usulan_pengabdian
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM($statusString) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to rollback ENUM changes safely without potentially breaking data
    }
};
