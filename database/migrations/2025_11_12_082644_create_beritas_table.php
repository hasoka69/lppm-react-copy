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
    Schema::create('beritas', function (Blueprint $table) {
        $table->id();
        $table->string('judul');
        $table->string('slug')->unique();
        $table->string('kategori')->nullable();
        $table->text('ringkasan')->nullable();
        $table->text('konten')->nullable();
        $table->string('gambar')->nullable(); // path di public/storage or public/images
        $table->date('tanggal')->nullable();
        $table->boolean('featured')->default(false); // untuk hero
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beritas');
    }
};
