<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "--- DB DEBUG START ---\n";
try {
    $pCount = DB::table('usulan_penelitian')->count();
    $pgCount = DB::table('usulan_pengabdian')->count();
    $dCount = DB::table('users')->whereExists(function ($query) {
        $query->select(DB::raw(1))
            ->from('model_has_roles')
            ->join('roles', 'roles.id', '=', 'model_has_roles.role_id')
            ->whereColumn('model_has_roles.model_id', 'users.id')
            ->where('roles.name', 'Dosen');
    })->count();

    echo "Total Penelitian: $pCount\n";
    echo "Total Pengabdian: $pgCount\n";
    echo "Total Dosen: $dCount\n";

    echo "\nSample Penelitian (tahun_pertama):\n";
    $pSamples = DB::table('usulan_penelitian')->select('id', 'judul', 'tahun_pertama', 'created_at')->limit(5)->get();
    foreach ($pSamples as $s) {
        echo "ID: {$s->id} | Tahun: {$s->tahun_pertama} | Judul: " . substr($s->judul, 0, 30) . "...\n";
    }

    echo "\nSample Pengabdian (tahun_pertama):\n";
    $pgSamples = DB::table('usulan_pengabdian')->select('id', 'judul', 'tahun_pertama', 'created_at')->limit(5)->get();
    foreach ($pgSamples as $s) {
        echo "ID: {$s->id} | Tahun: {$s->tahun_pertama} | Judul: " . substr($s->judul, 0, 30) . "...\n";
    }

    echo "\nUnique tahun_pertama in Penelitian:\n";
    $pYears = DB::table('usulan_penelitian')->select('tahun_pertama')->distinct()->get();
    foreach ($pYears as $y) {
        echo "- {$y->tahun_pertama}\n";
    }

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
echo "--- DB DEBUG END ---\n";
