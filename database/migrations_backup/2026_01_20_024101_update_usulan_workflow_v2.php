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
        // 1. Update Usulan Pengabdian
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_pengabdian', 'dana_disetujui')) {
                $table->decimal('dana_disetujui', 15, 2)->nullable()->after('total_anggaran');
            }
            if (!Schema::hasColumn('usulan_pengabdian', 'reviewer_id')) {
                $table->unsignedBigInteger('reviewer_id')->nullable()->after('user_id');
                $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('set null');
            }
        });

        // Update existing statuses to compatible values before altering ENUM
        DB::table('usulan_pengabdian')->where('status', 'under_review')->update(['status' => 'reviewer_assigned']);
        DB::table('usulan_pengabdian')->where('status', 'approved')->update(['status' => 'didanai']);
        DB::table('usulan_pengabdian')->where('status', 'rejected')->update(['status' => 'ditolak_akhir']);
        DB::table('usulan_pengabdian')->where('status', 'rejected_prodi')->update(['status' => 'ditolak_akhir']);
        DB::table('usulan_pengabdian')->where('status', 'reviewer_review')->update(['status' => 'reviewer_assigned']);
        DB::table('usulan_pengabdian')->where('status', 'needs_revision')->update(['status' => 'revision_dosen']);
        DB::table('usulan_pengabdian')->where('status', 'ditolak')->update(['status' => 'ditolak_akhir']);

        // Update Enum for Pengabdian
        $statuses = "'draft', 'submitted', 'approved_prodi', 'reviewer_assigned', 'under_revision_admin', 'revision_dosen', 'resubmitted_revision', 'reviewed_approved', 'didanai', 'rejected_reviewer', 'ditolak_akhir'";
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM($statuses) DEFAULT 'draft'");

        // 2. Update Usulan Penelitian
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            if (!Schema::hasColumn('usulan_penelitian', 'dana_disetujui')) {
                $table->decimal('dana_disetujui', 15, 2)->nullable()->after('total_anggaran');
            }
            if (!Schema::hasColumn('usulan_penelitian', 'reviewer_id')) {
                $table->unsignedBigInteger('reviewer_id')->nullable()->after('user_id');
                $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('set null');
            }
        });

        // Update existing statuses for Penelitian
        DB::table('usulan_penelitian')->where('status', 'under_review')->update(['status' => 'reviewer_assigned']);
        DB::table('usulan_penelitian')->where('status', 'approved')->update(['status' => 'didanai']);
        DB::table('usulan_penelitian')->where('status', 'rejected')->update(['status' => 'ditolak_akhir']);
        DB::table('usulan_penelitian')->where('status', 'rejected_prodi')->update(['status' => 'ditolak_akhir']);
        DB::table('usulan_penelitian')->where('status', 'reviewer_review')->update(['status' => 'reviewer_assigned']);
        DB::table('usulan_penelitian')->where('status', 'needs_revision')->update(['status' => 'revision_dosen']);
        DB::table('usulan_penelitian')->where('status', 'ditolak')->update(['status' => 'ditolak_akhir']);

        // Update Enum for Penelitian
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM($statuses) DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->dropColumn(['dana_disetujui', 'reviewer_id']);
        });

        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropForeign(['reviewer_id']);
            $table->dropColumn(['dana_disetujui', 'reviewer_id']);
        });
    }
};
