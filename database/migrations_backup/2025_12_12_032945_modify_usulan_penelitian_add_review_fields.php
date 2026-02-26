<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            // Change status column from existing to new enum with workflow states
            $table->enum('status', [
                'draft',
                'submitted',
                'kaprodi_review',
                'kaprodi_rejected',
                'reviewer_review',
                'didanai',
                'ditolak'
            ])->change();

            // Review tracking fields
            $table->foreignId('kaprodi_reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('current_reviewer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('revision_count')->default(0);
            $table->timestamp('submitted_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['kaprodi_reviewer_id']);
            $table->dropForeignKeyIfExists(['current_reviewer_id']);
            $table->dropColumn(['kaprodi_reviewer_id', 'current_reviewer_id', 'revision_count', 'submitted_at']);
        });
    }
};
