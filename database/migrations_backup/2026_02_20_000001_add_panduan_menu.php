<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert Panduan Menu
        DB::table('menus')->insert([
            'title' => 'Panduan',
            'icon' => 'BookOpen',
            'route' => '/lppm/panduan',
            'parent_id' => null,
            'order' => 10, // Assuming a safe order number
            'permission_name' => 'dashboard-lppm-view',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('menus')->where('route', '/lppm/panduan')->delete();
    }
};
