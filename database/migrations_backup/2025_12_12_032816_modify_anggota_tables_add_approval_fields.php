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
        // Add approval workflow to anggota_penelitian (dosen)
        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->foreignId('dosen_id')->nullable()->constrained('dosen')->onDelete('set null');
            $table->enum('status_approval', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('approval_comment')->nullable();
            $table->timestamp('approved_at')->nullable();
        });

        // Add approval workflow to anggota_non_dosen (mahasiswa)
        Schema::table('anggota_non_dosen', function (Blueprint $table) {
            $table->foreignId('mahasiswa_id')->nullable()->constrained('mahasiswa')->onDelete('set null');
            $table->enum('status_approval', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('approval_comment')->nullable();
            $table->timestamp('approved_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('anggota_penelitian', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['dosen_id']);
            $table->dropColumn(['dosen_id', 'status_approval', 'approval_comment', 'approved_at']);
        });

        Schema::table('anggota_non_dosen', function (Blueprint $table) {
            $table->dropForeignKeyIfExists(['mahasiswa_id']);
            $table->dropColumn(['mahasiswa_id', 'status_approval', 'approval_comment', 'approved_at']);
        });
    }
};
