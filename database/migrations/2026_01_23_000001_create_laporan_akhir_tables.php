<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('laporan_akhir_penelitian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('ringkasan')->nullable();
            $table->string('keyword')->nullable();
            $table->string('file_laporan')->nullable();
            $table->string('file_poster')->nullable();
            $table->string('url_video')->nullable();
            $table->string('file_sptb')->nullable();
            $table->enum('status', ['Draft', 'Submitted', 'Accepted', 'Rejected'])->default('Draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('laporan_akhir_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('ringkasan')->nullable();
            $table->string('keyword')->nullable();
            $table->string('file_laporan')->nullable();
            $table->string('file_poster')->nullable();
            $table->string('url_video')->nullable();
            $table->string('file_sptb')->nullable();
            $table->enum('status', ['Draft', 'Submitted', 'Accepted', 'Rejected'])->default('Draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_akhir_penelitian');
        Schema::dropIfExists('laporan_akhir_pengabdian');
    }
};
