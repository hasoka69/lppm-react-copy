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
        // Expand status ENUM in usulan_penelitian to include 'approved_prodi', 'rejected_prodi', 'waiting_member_approval'
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
            'waiting_member_approval'
        ) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to a safe subset (warning: might lose data if new statuses exist)
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'reviewer_review',
            'needs_revision',
            'revision_dosen',
            'approved',
            'rejected',
            'didanai',
            'ditolak'
        ) DEFAULT 'draft'");
    }
};
