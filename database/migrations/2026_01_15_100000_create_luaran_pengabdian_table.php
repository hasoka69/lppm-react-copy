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
        Schema::create('luaran_pengabdian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')
                ->constrained('usulan_pengabdian')
                ->onDelete('cascade');
            $table->integer('tahun');
            $table->string('kategori', 100);
            $table->text('deskripsi');
            $table->enum('status', ['Rencana', 'Dalam Proses', 'Selesai'])->default('Rencana');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            $table->index('usulan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('luaran_pengabdian');
    }
};
