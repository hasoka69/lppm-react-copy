<?php
use App\Models\Menu;

$menu = Menu::where('title', 'Template Dokumen')->first();
if ($menu) {
    echo "Menu Found: " . $menu->title . " (Route: " . $menu->route . ")\n";
    echo "Active: " . $menu->is_active . "\n";
    echo "Parent ID: " . $menu->parent_id . "\n";
} else {
    echo "Menu 'Template Dokumen' NOT Found.\n";
}
