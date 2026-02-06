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
        Schema::table('dosen', function (Blueprint $table) {
            $table->string('scopus_id')->nullable()->after('prodi');
            $table->string('sinta_id')->nullable()->after('scopus_id');
            $table->string('google_scholar_id')->nullable()->after('sinta_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dosen', function (Blueprint $table) {
            $table->dropColumn(['scopus_id', 'sinta_id', 'google_scholar_id']);
        });
    }
};
