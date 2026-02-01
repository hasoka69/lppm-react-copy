<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function admin()
    {
        // 1. User Stats
        $users = User::with('roles')->get();
        $userStats = [
            'total' => $users->count(),
            'dosen' => $users->filter(fn($u) => $u->hasRole('dosen'))->count(),
            'reviewer' => $users->filter(fn($u) => $u->hasRole('reviewer'))->count(),
            'kaprodi' => $users->filter(fn($u) => $u->hasRole('kaprodi'))->count(),
            'admin' => $users->filter(fn($u) => $u->hasRole('admin') || $u->hasRole('super-admin'))->count(),
        ];

        // 2. Proposal Stats
        $penelitianCount = \App\Models\UsulanPenelitian::count();
        $pengabdianCount = \App\Models\UsulanPengabdian::count();
        $penelitianFunds = \App\Models\UsulanPenelitian::where('status', 'didanai')->sum('dana_disetujui');
        $pengabdianFunds = \App\Models\UsulanPengabdian::where('status', 'didanai')->sum('dana_disetujui');

        // 3. System Info
        $systemInfo = [
            'php_version' => phpversion(),
            'laravel_version' => app()->version(),
            'server_os' => php_uname('s') . ' ' . php_uname('r'),
            'database_connection' => config('database.default'),
        ];

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'users' => $userStats,
                'proposals' => [
                    'penelitian' => $penelitianCount,
                    'pengabdian' => $pengabdianCount,
                    'total_funds' => $penelitianFunds + $pengabdianFunds,
                ],
                'system' => $systemInfo,
            ]
        ]);
    }

    public function dosen()
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        // Stats Penelitian
        $penelitianQuery = \App\Models\UsulanPenelitian::where('user_id', $user->id);
        $totalPenelitian = $penelitianQuery->count();
        $penelitianActive = $penelitianQuery->where('status', 'didanai')->count();
        $penelitianFunds = $penelitianQuery->where('status', 'didanai')->sum('dana_disetujui');

        // Stats Pengabdian
        $pengabdianQuery = \App\Models\UsulanPengabdian::where('user_id', $user->id);
        $totalPengabdian = $pengabdianQuery->count();
        $pengabdianActive = $pengabdianQuery->where('status', 'didanai')->count();
        $pengabdianFunds = $pengabdianQuery->where('status', 'didanai')->sum('dana_disetujui');

        // Combined Stats
        $activeGrants = $penelitianActive + $pengabdianActive;
        $totalFunds = $penelitianFunds + $pengabdianFunds;

        // Recent Activities
        $recentPenelitian = \App\Models\UsulanPenelitian::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->judul,
                    'type' => 'Penelitian',
                    'date' => $item->updated_at->format('d M Y'), // Format date for display
                    'status' => $item->status,
                    // Fix: Use correct route based on status, simplified for now
                    'link' => route('dosen.penelitian.edit', $item->id)
                ];
            });

        $recentPengabdian = \App\Models\UsulanPengabdian::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->judul,
                    'type' => 'Pengabdian',
                    'date' => $item->updated_at->format('d M Y'),
                    'status' => $item->status,
                    'link' => route('dosen.pengabdian.edit', $item->id)
                ];
            });

        // Merge and sort
        $activities = $recentPenelitian->merge($recentPengabdian)
            ->sortByDesc(function ($item) {
                return strtotime($item['date']);
            })
            ->take(5)
            ->values();

        // Load Dosen profile for NIDN
        $user->load('dosen');

        $userData = [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar, // Via accessor
            'role' => 'Dosen',
            'nidn' => $user->dosen?->nidn ?? '-',
            'prodi' => $user->dosen?->prodi ?? '-',
        ];

        return Inertia::render('dosen/Dashboard', [
            'stats' => [
                'total_penelitian' => $totalPenelitian,
                'total_pengabdian' => $totalPengabdian,
                'active_grants' => $activeGrants,
                'total_funds' => $totalFunds,
            ],
            'activities' => $activities,
            'user' => $userData
        ]);
    }

    public function lppm()
    {
        // 1. KPI Stats
        $dosenCount = User::role('dosen')->count();
        $usulanPenelitian = \App\Models\UsulanPenelitian::count();
        $usulanPengabdian = \App\Models\UsulanPengabdian::count();

        // Calculate total funded amount
        $fundsPenelitian = \App\Models\UsulanPenelitian::where('status', 'didanai')->sum('dana_disetujui');
        $fundsPengabdian = \App\Models\UsulanPengabdian::where('status', 'didanai')->sum('dana_disetujui');
        $totalFunds = $fundsPenelitian + $fundsPengabdian;

        // 2. Chart Data: Monthly Submission Trends (Last 6 Months)
        $months = collect(range(5, 0))->map(function ($i) {
            return now()->subMonths($i)->format('M Y');
        });

        $chartData = $months->map(function ($month) {
            // Parse month back to start/end date
            $date = \Carbon\Carbon::createFromFormat('M Y', $month);
            $start = $date->copy()->startOfMonth();
            $end = $date->copy()->endOfMonth();

            return [
                'name' => $month,
                'penelitian' => \App\Models\UsulanPenelitian::whereBetween('created_at', [$start, $end])->count(),
                'pengabdian' => \App\Models\UsulanPengabdian::whereBetween('created_at', [$start, $end])->count(),
            ];
        });

        // 3. Chart Data: Status Distribution
        $statuses = ['Draft', 'Submitted', 'Didanai', 'Ditolak'];
        // Note: 'Ditolak' in DB might be 'ditolak_admin' or 'ditolak_reviewer', simplifying for chart

        $penelitianStatus = \App\Models\UsulanPenelitian::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $pengabdianStatus = \App\Models\UsulanPengabdian::selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // 4. Recent Activites
        $recentPenelitian = \App\Models\UsulanPenelitian::with('ketua')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->judul,
                'user' => $item->ketua->name ?? 'Unknown',
                'type' => 'Penelitian',
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'unix' => $item->created_at->timestamp
            ]);

        $recentPengabdian = \App\Models\UsulanPengabdian::with('ketua')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->judul,
                'user' => $item->ketua->name ?? 'Unknown',
                'type' => 'Pengabdian',
                'status' => $item->status,
                'time' => $item->created_at->diffForHumans(),
                'unix' => $item->created_at->timestamp
            ]);

        $activities = $recentPenelitian->merge($recentPengabdian)
            ->sortByDesc('unix')
            ->take(7)
            ->values();

        return Inertia::render('lppm/Dashboard', [
            'stats' => [
                'dosen' => $dosenCount,
                'penelitian' => $usulanPenelitian,
                'pengabdian' => $usulanPengabdian,
                'total_funds' => $totalFunds,
            ],
            'chartData' => $chartData,
            'activities' => $activities,
            'statusDist' => [
                'penelitian' => $penelitianStatus,
                'pengabdian' => $pengabdianStatus
            ]
        ]);
    }
}
