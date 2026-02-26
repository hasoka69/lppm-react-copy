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
        // Update status enum to include all workflow states
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'approved_prodi',
            'rejected_prodi',
            'reviewer_review',
            'needs_revision',
            'didanai',
            'ditolak'
        ) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft',
            'submitted',
            'approved_prodi',
            'rejected_prodi',
            'reviewer_review',
            'didanai',
            'ditolak'
        ) DEFAULT 'draft'");
    }
};
