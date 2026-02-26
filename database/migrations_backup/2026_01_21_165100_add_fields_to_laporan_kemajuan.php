<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            $table->text('ringkasan')->nullable();
            $table->string('keyword')->nullable();
            $table->string('file_laporan')->nullable();
        });

        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            $table->text('ringkasan')->nullable();
            $table->string('keyword')->nullable();
            $table->string('file_laporan')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            $table->dropColumn(['ringkasan', 'keyword', 'file_laporan']);
        });

        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['ringkasan', 'keyword', 'file_laporan']);
        });
    }
};
