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
        // 1. Add contract columns to Usulan Penelitian
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->string('nomor_kontrak')->nullable()->after('status');
            $table->date('tanggal_kontrak')->nullable()->after('nomor_kontrak');
        });

        // 2. Add contract columns to Usulan Pengabdian
        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->string('nomor_kontrak')->nullable()->after('status');
            $table->date('tanggal_kontrak')->nullable()->after('nomor_kontrak');
        });

        // 3. Create Review Scores table for granular scoring
        Schema::create('review_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('review_history_id')->constrained('review_histories')->onDelete('cascade');
            $table->string('section'); // e.g., 'judul', 'abstrak', 'metode', etc.
            $table->integer('score'); // 0-100 (or scale)
            $table->text('comments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_scores');

        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropColumn(['nomor_kontrak', 'tanggal_kontrak']);
        });

        Schema::table('usulan_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['nomor_kontrak', 'tanggal_kontrak']);
        });
    }
};
