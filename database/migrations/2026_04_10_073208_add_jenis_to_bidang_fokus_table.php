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
        Schema::table('bidang_fokus', function (Blueprint $table) {
            // Adds 'jenis' string to separate 'tematik' from 'ririn'
            $table->string('jenis')->nullable()->after('nama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bidang_fokus', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
