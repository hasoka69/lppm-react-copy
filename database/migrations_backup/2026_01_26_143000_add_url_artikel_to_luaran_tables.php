<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->string('url_artikel', 255)->nullable()->after('url_bukti');
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->string('url_artikel', 255)->nullable()->after('url_bukti');
        });
    }

    public function down(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->dropColumn('url_artikel');
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->dropColumn('url_artikel');
        });
    }
};
