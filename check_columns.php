<?php
use Illuminate\Support\Facades\Schema;

echo "Checking columns...\n";

if (Schema::hasColumn('usulan_penelitian', 'nomor_kontrak')) {
    echo "usulan_penelitian.nomor_kontrak exists.\n";
} else {
    echo "usulan_penelitian.nomor_kontrak does NOT exist.\n";
}

if (Schema::hasColumn('usulan_pengabdian', 'nomor_kontrak')) {
    echo "usulan_pengabdian.nomor_kontrak exists.\n";
} else {
    echo "usulan_pengabdian.nomor_kontrak does NOT exist.\n";
}
