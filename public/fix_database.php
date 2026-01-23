<?php

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

// Now we can use Laravel features
try {
    echo "Checking columns...<br>";

    if (!Schema::hasColumn('laporan_kemajuan_penelitian', 'file_sptb')) {
        Schema::table('laporan_kemajuan_penelitian', function (Blueprint $table) {
            $table->string('file_sptb')->nullable()->after('file_laporan');
        });
        echo "Added file_sptb to laporan_kemajuan_penelitian<br>";
    } else {
        echo "file_sptb already exists in laporan_kemajuan_penelitian<br>";
    }

    if (!Schema::hasColumn('laporan_kemajuan_pengabdian', 'file_sptb')) {
        Schema::table('laporan_kemajuan_pengabdian', function (Blueprint $table) {
            $table->string('file_sptb')->nullable()->after('file_laporan');
        });
        echo "Added file_sptb to laporan_kemajuan_pengabdian<br>";
    } else {
        echo "file_sptb already exists in laporan_kemajuan_pengabdian<br>";
    }

    echo "Done!";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
