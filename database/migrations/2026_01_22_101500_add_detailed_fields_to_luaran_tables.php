<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->string('peran_penulis', 100)->nullable()->after('is_wajib');
            $table->string('nama_jurnal', 255)->nullable()->after('peran_penulis');
            $table->string('issn', 100)->nullable()->after('nama_jurnal');
            $table->string('pengindek', 100)->nullable()->after('issn');
            $table->string('file_bukti_submit')->nullable()->after('file_bukti');
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->string('peran_penulis', 100)->nullable()->after('is_wajib');
            $table->string('nama_jurnal', 255)->nullable()->after('peran_penulis');
            $table->string('issn', 100)->nullable()->after('nama_jurnal');
            $table->string('pengindek', 100)->nullable()->after('issn');
            $table->string('file_bukti_submit')->nullable()->after('file_bukti');
        });
    }

    public function down(): void
    {
        Schema::table('luaran_penelitian', function (Blueprint $table) {
            $table->dropColumn(['peran_penulis', 'nama_jurnal', 'issn', 'pengindek', 'file_bukti_submit']);
        });

        Schema::table('luaran_pengabdian', function (Blueprint $table) {
            $table->dropColumn(['peran_penulis', 'nama_jurnal', 'issn', 'pengindek', 'file_bukti_submit']);
        });
    }
};
