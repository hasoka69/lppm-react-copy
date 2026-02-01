<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$hasCol1 = \Illuminate\Support\Facades\Schema::hasColumn('anggota_penelitian', 'dosen_id');
$hasCol2 = \Illuminate\Support\Facades\Schema::hasColumn('anggota_pengabdian', 'dosen_id');

echo "anggota_penelitian: " . ($hasCol1 ? 'YES' : 'NO') . "\n";
echo "anggota_pengabdian: " . ($hasCol2 ? 'YES' : 'NO') . "\n";
