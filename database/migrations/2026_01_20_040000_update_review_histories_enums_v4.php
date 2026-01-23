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
        // Expand action ENUM to include common variations to prevent truncation
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
            'final_ditolak_akhir',
            'reviewer_approve',
            'reviewer_reject',
            'reviewer_revise'
        )");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
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
};
