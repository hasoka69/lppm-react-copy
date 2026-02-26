<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Menu;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create Permission
        $permission = Permission::firstOrCreate(['name' => 'template-dokumen-manage', 'guard_name' => 'web']);

        // 2. Assign to Roles
        $roles = Role::whereIn('name', ['Admin', 'Admin LPPM'])->get();
        foreach ($roles as $role) {
            $role->givePermissionTo($permission);
        }

        // 3. Create Menu
        // Find 'Manajemen Pengumuman' to place it nearby, or 'Manajemen User'
        $refMenu = Menu::where('title', 'LIKE', '%Pengumuman%')->first();

        $order = $refMenu ? $refMenu->order + 1 : 99;
        $parentId = $refMenu ? $refMenu->parent_id : null;

        // Shift existing menus down
        if ($refMenu) {
            Menu::where('parent_id', $parentId)
                ->where('order', '>', $refMenu->order)
                ->increment('order');
        }

        Menu::create([
            'title' => 'Template Dokumen',
            'route' => 'lppm.template-dokumen.index', // Matches the resource route name
            'icon' => 'FileText',
            'parent_id' => $parentId,
            'order' => $order,
            'permission_name' => 'template-dokumen-manage',
            'is_active' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $menu = Menu::where('route', 'lppm.template-dokumen.index')->first();
        if ($menu) {
            $menu->delete();
        }

        $permission = Permission::where('name', 'template-dokumen-manage')->first();
        if ($permission) {
            $permission->delete();
        }
    }
};
