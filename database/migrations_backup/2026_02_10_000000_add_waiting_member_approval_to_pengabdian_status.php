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
        // 1. Ubah ke VARCHAR agar aman saat insert status baru
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status VARCHAR(100)");

        // 2. Kembalikan ke ENUM dengan tambahan 'waiting_member_approval'
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'waiting_member_approval',
            'reviewer_assigned',
            'under_review',
            'reviewed',
            'revision_dosen',
            'resubmitted_revision',
            'under_revision_admin',
            'reviewed_approved',
            'rejected_reviewer',
            'approved_prodi',
            'rejected_prodi',
            'approved',
            'rejected',
            'funded',
            'completed'
        ) NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert without waiting_member_approval (potentially dangerous if data exists)
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status VARCHAR(100)");
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'reviewer_assigned',
            'under_review',
            'reviewed',
            'revision_dosen',
            'resubmitted_revision',
            'under_revision_admin',
            'reviewed_approved',
            'rejected_reviewer',
            'approved_prodi',
            'rejected_prodi',
            'approved',
            'rejected',
            'funded',
            'completed'
        ) NOT NULL DEFAULT 'draft'");
    }
};
