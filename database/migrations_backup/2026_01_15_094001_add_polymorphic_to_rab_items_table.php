<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rab_item', function (Blueprint $table) {
            // 1. Drop existing FK constraint first
            $table->dropForeign(['usulan_id']);

            // 2. Add 'usulan_type' column for polymorphism
            // Default to UsulanPenelitian for existing data
            $table->string('usulan_type')->after('usulan_id')->default('App\\Models\\UsulanPenelitian');
        });

        // 3. Change 'tipe' column from ENUM to STRING to support dynamic categories
        // Depending on DB, changing enum to string might require raw statement or change()
        // Here we attempt using native change() method assuming dbal is installed or supported
        // If strict mode prevents it, we might need raw SQL. For MySQL/MariaDB:

        // Using DB statement for safety on ENUM modification
        DB::statement("ALTER TABLE rab_item MODIFY COLUMN tipe VARCHAR(255) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rab_item', function (Blueprint $table) {
            // Revert usulan_type
            $table->dropColumn('usulan_type');

            // Restore FK (Assuming only UsulanPenelitian existed)
            $table->foreign('usulan_id')->references('id')->on('usulan_penelitian')->onDelete('cascade');
        });

        // Revert tipe to ENUM (Warning: Data loss if new types exist)
        // DB::statement("ALTER TABLE rab_item MODIFY COLUMN tipe ENUM('bahan', 'pengumpulan_data')");
    }
};
