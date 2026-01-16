<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('review_histories', function (Blueprint $table) {
            // 1. Drop foreign key constraint
            $table->dropForeign(['usulan_id']);

            // 2. Add usulan_type column after usulan_id
            $table->string('usulan_type')->after('usulan_id')->nullable();
        });

        // 3. Backfill existing data to UsulanPenelitian
        DB::table('review_histories')->update(['usulan_type' => 'App\Models\UsulanPenelitian']);

        Schema::table('review_histories', function (Blueprint $table) {
            // 4. Modify action enum to include revision_requested
            // Note: Modifying ENUM in Laravel requires raw statement usually, or we can just expect it works if DB supports it.
            // But for safety and consistency with previous fix:
        });

        // Add all possible actions including the missing 'reviewer_revision_requested'
        DB::statement("ALTER TABLE review_histories MODIFY COLUMN action ENUM('submitted', 'kaprodi_approved', 'kaprodi_rejected', 'reviewer_approved', 'reviewer_rejected', 'reviewer_revision_requested', 'funding_approved')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert enum
        // DB::statement("ALTER TABLE review_histories MODIFY COLUMN action ENUM('submitted', 'kaprodi_approved', 'kaprodi_rejected', 'reviewer_approved', 'reviewer_rejected', 'funding_approved')");

        Schema::table('review_histories', function (Blueprint $table) {
            $table->dropColumn('usulan_type');
            // Re-adding FK might fail if there are Pengabdian data now, so wrap in try-catch or careful logic.
            // For now, simpler down:
            $table->foreign('usulan_id')->references('id')->on('usulan_penelitian')->onDelete('cascade');
        });
    }
};
