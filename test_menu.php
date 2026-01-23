<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$menus = \App\Models\Menu::orderBy('order')->get(['id', 'title', 'parent_id', 'route']);
echo json_encode($menus, JSON_PRETTY_PRINT);
