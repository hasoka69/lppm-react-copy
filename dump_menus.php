<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

$riwayat = DB::table('menus')->get();
file_put_contents('all_menus.json', json_encode($riwayat, JSON_PRETTY_PRINT));
echo "Done";
