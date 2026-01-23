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
        // 1. Expand reviewer_type ENUM
        DB::statement("ALTER TABLE review_histories MODIFY COLUMN reviewer_type ENUM('kaprodi', 'reviewer', 'dosen', 'admin_lppm')");

        // 2. Expand action ENUM
        DB::statement("ALTER TABLE review_histories MODIFY COLUMN action ENUM(
            'submitted', 
            'kaprodi_approved', 
            'kaprodi_rejected', 
            'reviewer_approved', 
            'reviewer_rejected', 
            'reviewer_revision_requested', 
            'funding_approved',
            'submit',
            'resubmit_revision',
            'assign_reviewer',
            'set_budget_and_revision',
            'final_didanai',
            'final_ditolak_akhir'
        )");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting to previous state (might lose data if new values exist)
        DB::statement("ALTER TABLE review_histories MODIFY COLUMN reviewer_type ENUM('kaprodi', 'reviewer')");
        DB::statement("ALTER TABLE review_histories MODIFY COLUMN action ENUM('submitted', 'kaprodi_approved', 'kaprodi_rejected', 'reviewer_approved', 'reviewer_rejected', 'reviewer_revision_requested', 'funding_approved')");
    }
};
