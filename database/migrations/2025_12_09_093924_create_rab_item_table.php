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
        Schema::create('rab_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')
                ->constrained('usulan_penelitian')
                ->onDelete('cascade');
            $table->enum('tipe', ['bahan', 'pengumpulan_data']);
            $table->string('kategori', 100);
            $table->string('item', 255);
            $table->string('satuan', 50);
            $table->integer('volume');
            $table->bigInteger('harga_satuan');
            $table->bigInteger('total');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            $table->index('usulan_id');
            $table->index('tipe');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rab_item');
    }
};
