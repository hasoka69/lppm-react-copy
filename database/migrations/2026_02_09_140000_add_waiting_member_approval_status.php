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
        // 1. Temporarily change to VARCHAR to avoid truncation issues during ENUM modification
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'draft'");
        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'draft'");

        // 2. Sanitize data: Set any status not in the new allowed list to 'draft'
        $allowedStatuses = [
            'draft',
            'submitted',
            'rejected',
            'approved',
            'revision_dosen',
            'revision_admin',
            'revised',
            'waiting_member_approval',
            'auto_submitted'
        ];

        $allowedString = "'" . implode("','", $allowedStatuses) . "'";

        DB::statement("UPDATE usulan_penelitian SET status = 'draft' WHERE status NOT IN ($allowedString)");
        DB::statement("UPDATE usulan_pengabdian SET status = 'draft' WHERE status NOT IN ($allowedString)");

        // 3. Apply new ENUM definition
        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft', 
            'submitted', 
            'rejected', 
            'approved', 
            'revision_dosen', 
            'revision_admin', 
            'revised',
            'waiting_member_approval',
            'auto_submitted'
        ) NOT NULL DEFAULT 'draft'");

        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft', 
            'submitted', 
            'rejected', 
            'approved', 
            'revision_dosen', 
            'revision_admin', 
            'revised',
            'waiting_member_approval',
            'auto_submitted'
        ) NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original ENUM (without new statuses)
        // Warning: This might fail if there are records with the new status. 
        // In a real prod scenario, we'd handle data migration, but here we just revert schema.

        DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
            'draft', 
            'submitted', 
            'rejected', 
            'approved', 
            'revision_dosen', 
            'revision_admin', 
            'revised'
        ) NOT NULL DEFAULT 'draft'");

        DB::statement("ALTER TABLE usulan_pengabdian MODIFY COLUMN status ENUM(
            'draft', 
            'submitted', 
            'rejected', 
            'approved', 
            'revision_dosen', 
            'revision_admin', 
            'revised'
        ) NOT NULL DEFAULT 'draft'");
    }
};
