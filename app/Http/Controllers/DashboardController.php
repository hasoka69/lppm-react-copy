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
        // Removed active grants and funds as per request

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
            ],
            'activities' => $activities,
            'user' => $userData
        ]);
    }

    public function lppm()
    {
        // 1. KPI Stats (Global or Filtered? Ideally Global for "Overview", or Filtered?)
        // Let's keep them Global for now as "Total Assets",
        // OR filter them if user wants "How many proposals in 2024?"
        // Usually Dashboard KPIs are "Current State".
        // Let's Keep Global for consistency with "Total Dosen" etc.

        $dosenCount = User::whereHas('roles', fn($q) => $q->where('name', 'dosen'))->count();
        $usulanPenelitian = \App\Models\UsulanPenelitian::count();
        $usulanPengabdian = \App\Models\UsulanPengabdian::count();

        // Calculate total funded amount
        $fundsPenelitian = \App\Models\UsulanPenelitian::where('status', 'didanai')->sum('dana_disetujui');
        $fundsPengabdian = \App\Models\UsulanPengabdian::where('status', 'didanai')->sum('dana_disetujui');
        $totalFunds = $fundsPenelitian + $fundsPengabdian;

        // 4. Recent Activites (Global)
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

        // 2. Chart Data
        $filterCode = \Illuminate\Support\Facades\Request::input('tahun_akademik');
        $chartData = collect();
        $baseQueryPenelitian = \App\Models\UsulanPenelitian::query();
        $baseQueryPengabdian = \App\Models\UsulanPengabdian::query();

        if ($filterCode) {
            // Semester Filter Logic
            $year = (int) substr($filterCode, 0, 4);
            $sem = (int) substr($filterCode, 4, 1);

            if ($sem === 1) {
                // Ganjil: Aug (Year-1) to Jan (Year)
                $startDate = \Carbon\Carbon::create($year - 1, 8, 1)->startOfDay();
                $endDate = \Carbon\Carbon::create($year, 1, 31)->endOfDay();
                $months = [
                    'Agu' => [8, $year - 1],
                    'Sep' => [9, $year - 1],
                    'Okt' => [10, $year - 1],
                    'Nov' => [11, $year - 1],
                    'Des' => [12, $year - 1],
                    'Jan' => [1, $year]
                ];
            } else {
                // Genap: Feb (Year) to Jul (Year)
                $startDate = \Carbon\Carbon::create($year, 2, 1)->startOfDay();
                $endDate = \Carbon\Carbon::create($year, 7, 31)->endOfDay();
                $months = [
                    'Feb' => [2, $year],
                    'Mar' => [3, $year],
                    'Apr' => [4, $year],
                    'Mei' => [5, $year],
                    'Jun' => [6, $year],
                    'Jul' => [7, $year]
                ];
            }

            // Filter KPIs by this period as well?
            // Usually KPIs like "Total Count" should reflect the filter.
            $usulanPenelitian = $baseQueryPenelitian->whereBetween('created_at', [$startDate, $endDate])->count();
            $usulanPengabdian = $baseQueryPengabdian->whereBetween('created_at', [$startDate, $endDate])->count();
            $fundsPenelitian = \App\Models\UsulanPenelitian::where('status', 'didanai')->whereBetween('created_at', [$startDate, $endDate])->sum('dana_disetujui');
            $fundsPengabdian = \App\Models\UsulanPengabdian::where('status', 'didanai')->whereBetween('created_at', [$startDate, $endDate])->sum('dana_disetujui');
            $totalFunds = $fundsPenelitian + $fundsPengabdian;

            // Generate Monthly Data for Chart
            foreach ($months as $label => $dateInfo) {
                $m = $dateInfo[0];
                $y = $dateInfo[1];

                $monthStart = \Carbon\Carbon::create($y, $m, 1)->startOfDay();
                $monthEnd = $monthStart->copy()->endOfMonth();

                $pCount = \App\Models\UsulanPenelitian::whereBetween('created_at', [$monthStart, $monthEnd])->count();
                $pgCount = \App\Models\UsulanPengabdian::whereBetween('created_at', [$monthStart, $monthEnd])->count();

                $chartData->push([
                    'name' => $label, // e.g. "Aug"
                    'penelitian' => $pCount,
                    'pengabdian' => $pgCount
                ]);
            }

        } else {
            // Default: 5 Year Annual Trend (No Filter)
            // Academic Year: Aug Y to Jul Y+1
            $currentDate = now();
            $currentMonth = $currentDate->month;
            $currentYear = $currentDate->year;

            $baseYear = ($currentMonth >= 8) ? $currentYear : $currentYear - 1;

            for ($i = 4; $i >= 0; $i--) {
                $startY = $baseYear - $i;
                $endY = $startY + 1;
                $label = "$startY/$endY";

                $startDate = \Carbon\Carbon::create($startY, 8, 1)->startOfDay();
                $endDate = \Carbon\Carbon::create($endY, 7, 31)->endOfDay();

                $penelitianCount = \App\Models\UsulanPenelitian::whereBetween('created_at', [$startDate, $endDate])->count();
                $pengabdianCount = \App\Models\UsulanPengabdian::whereBetween('created_at', [$startDate, $endDate])->count();

                $chartData->push([
                    'name' => $label,
                    'penelitian' => $penelitianCount,
                    'pengabdian' => $pengabdianCount,
                ]);
            }
        }

        // 3. Status Distribution (Filtered if needed, or All Time?)
        // If filtered, should reflect period.
        // Re-query with filter if present.

        $pStatusQuery = \App\Models\UsulanPenelitian::selectRaw('status, count(*) as count');
        $pgStatusQuery = \App\Models\UsulanPengabdian::selectRaw('status, count(*) as count');

        if ($filterCode && isset($startDate) && isset($endDate)) {
            $pStatusQuery->whereBetween('created_at', [$startDate, $endDate]);
            $pgStatusQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        $penelitianStatus = $pStatusQuery->groupBy('status')->pluck('count', 'status')->toArray();
        $pengabdianStatus = $pgStatusQuery->groupBy('status')->pluck('count', 'status')->toArray();


        // ... Recent Activities (Keep logic or filter? Let's keep latest global for now as "Activities" are usually recent logs)
        // Actually, if I filter by year 2020, seeing current activities is weird.
        // Let's leave activities simply "Latest" regardless of filter, as it's an "Activity Log".

        return Inertia::render('lppm/Dashboard', [
            'stats' => [
                'dosen' => $dosenCount, // Users count doesn't change by proposal date
                'penelitian' => $usulanPenelitian,
                'pengabdian' => $usulanPengabdian,
                'total_funds' => $totalFunds,
            ],
            'chartData' => $chartData,
            'activities' => $activities,
            'statusDist' => [
                'penelitian' => $penelitianStatus,
                'pengabdian' => $pengabdianStatus
            ],
            'filters' => \Illuminate\Support\Facades\Request::only(['tahun_akademik'])
        ]);
    }
}
