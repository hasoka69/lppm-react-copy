<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Attempting to modify column status...\n";
    Illuminate\Support\Facades\DB::statement("ALTER TABLE usulan_penelitian MODIFY COLUMN status ENUM('draft', 'submitted', 'under_review', 'approved', 'rejected', 'approved_prodi', 'rejected_prodi') DEFAULT 'draft'");
    echo "SUCCESS: Column status updated successfully.\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
