<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function admin()
    {
        // Hitung total dosen (user dengan role 'dosen')
        $dosenCount = User::role('dosen')->count();

        // Hitung total semua user jika diperlukan
        $totalUsers = User::count();

        // Data untuk statistik
        $stats = [
            'dosenCount' => $dosenCount,
            'userCount' => $totalUsers
        ];

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
