<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Updating status column enum...\n";
    Illuminate\Support\Facades\DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM(
        'draft',
        'submitted',
        'approved_prodi',
        'rejected_prodi',
        'reviewer_review',
        'needs_revision',
        'didanai',
        'ditolak'
    ) DEFAULT 'draft'");
    echo "SUCCESS: Status column updated successfully.\n";
    echo "Available statuses: draft, submitted, approved_prodi, rejected_prodi, reviewer_review, needs_revision, didanai, ditolak\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
