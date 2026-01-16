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
        Schema::create('rumpun_ilmu', function (Blueprint $table) {
            $table->id();
            $table->integer('level'); // 1, 2, 3
            $table->string('nama');
            $table->foreignId('parent_id')->nullable()->constrained('rumpun_ilmu')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rumpun_ilmu');
    }
};
