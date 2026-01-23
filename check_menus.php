<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$menus = App\Models\Menu::all();
foreach ($menus as $menu) {
    echo "ID: {$menu->id}, Title: {$menu->title}, Route: {$menu->route}, Parent: {$menu->parent_id}\n";
}
