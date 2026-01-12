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
        // Using raw SQL to modify ENUM column as Doctrine doesn't support it well for ENUMs
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'approved_prodi', 'rejected_prodi') DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'draft'");
    }
};
