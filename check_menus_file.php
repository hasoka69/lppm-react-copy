<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$menus = App\Models\Menu::all();
$out = "";
foreach ($menus as $menu) {
    $out .= "ID: {$menu->id}, Title: {$menu->title}, Route: {$menu->route}, Parent: {$menu->parent_id}\n";
}
file_put_contents('menus_output.txt', $out);
echo "Done\n";
