<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('form_templates', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // 'penelitian' | 'pengabdian'
            $table->integer('step'); // 1, 2, 3...
            $table->integer('version')->default(1);
            $table->boolean('active')->default(true);
            $table->json('fields'); // JSON Config
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('form_templates');
    }
};
