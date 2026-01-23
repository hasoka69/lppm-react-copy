<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_pengabdian')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['Draft', 'Submitted', 'Accepted', 'Rejected'])->default('Draft');
            $table->text('catatan')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_kemajuan_pengabdian');
    }
};
