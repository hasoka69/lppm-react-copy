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
        Schema::table('panduans', function (Blueprint $table) {
            $table->string('type')->default('video')->after('judul'); // 'video' or 'document'
            $table->string('file_path')->nullable()->change(); // Make nullable for video type
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('panduans', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->string('file_path')->nullable(false)->change();
        });
    }
};
