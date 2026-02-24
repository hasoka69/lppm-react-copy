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
        // 1. Initial counts (Corrected role casing)
        $dosenCount = (int) User::whereHas('roles', fn($q) => $q->where('name', 'Dosen'))->count();

        // Determine active semester code
        $request = \Illuminate\Support\Facades\Request::instance();
        $filterCode = $request->input('tahun_akademik');

        // Logic to determine "Current" based on date
        $now = now();
        $isGanjil = $now->month >= 8 || $now->month === 1;
        $calcEndYear = ($now->month === 1) ? $now->year : ($isGanjil ? $now->year + 1 : $now->year);
        $currentCode = (int) ($calcEndYear . ($isGanjil ? '1' : '2'));

        // IF NO FILTER PROVIDED: Try to find latest code with data
        if (!$filterCode) {
            $hasData = \App\Models\UsulanPenelitian::where('tahun_pertama', $currentCode)->exists() ||
                \App\Models\UsulanPengabdian::where('tahun_pertama', $currentCode)->exists();

            if ($hasData) {
                $filterCode = $currentCode;
            } else {
                $latestP = \App\Models\UsulanPenelitian::max('tahun_pertama') ?: 0;
                $latestPg = \App\Models\UsulanPengabdian::max('tahun_pertama') ?: 0;
                $filterCode = max((int) $latestP, (int) $latestPg) ?: $currentCode;
            }
        }

        // --- Robust Filtering Helper ---
        $filterCodes = [(int) $filterCode];
        if (strlen((string) $filterCode) === 5) {
            $baseYear = substr((string) $filterCode, 0, 4);
            $filterCodes[] = (int) $baseYear;
        }

        // Filter KPIs by Academic Year code

        // Filter KPIs by Academic Year code
        $usulanPenelitian = (int) \App\Models\UsulanPenelitian::whereIn('tahun_pertama', $filterCodes)->count();
        $usulanPengabdian = (int) \App\Models\UsulanPengabdian::whereIn('tahun_pertama', $filterCodes)->count();
        $fundsPenelitian = (float) \App\Models\UsulanPenelitian::where('status', 'didanai')->whereIn('tahun_pertama', $filterCodes)->sum('dana_disetujui');
        $fundsPengabdian = (float) \App\Models\UsulanPengabdian::where('status', 'didanai')->whereIn('tahun_pertama', $filterCodes)->sum('dana_disetujui');
        $totalFunds = $fundsPenelitian + $fundsPengabdian;

        // Recently submitted activities (Unified)
        $activities = \App\Models\ReviewHistory::with(['usulan', 'reviewer'])
            ->whereIn('action', ['submit', 'resubmit_revision', 'approve', 'reject', 'return'])
            ->latest('reviewed_at')
            ->limit(7)
            ->get()
            ->map(function ($h) {
                return [
                    'id' => $h->id,
                    'user' => $h->reviewer->name ?? 'System',
                    'action' => $h->action,
                    'title' => $h->usulan->judul ?? 'Pesan Sistem',
                    'time' => $h->reviewed_at ? $h->reviewed_at->diffForHumans() : '-',
                    'type' => str_contains($h->usulan_type ?? '', 'Penelitian') ? 'Penelitian' : 'Pengabdian',
                    'status' => $h->usulan->status ?? 'unknown'
                ];
            });

        // Chart Data (Sync with filter)
        $chartData = collect();
        $year = (int) substr((string) $filterCode, 0, 4);
        $sem = (int) substr((string) $filterCode, 4, 1);

        if ($sem === 1) { // Ganjil
            $months = ['Agu' => [8, $year - 1], 'Sep' => [9, $year - 1], 'Okt' => [10, $year - 1], 'Nov' => [11, $year - 1], 'Des' => [12, $year - 1], 'Jan' => [1, $year]];
        } else { // Genap
            $months = ['Feb' => [2, $year], 'Mar' => [3, $year], 'Apr' => [4, $year], 'Mei' => [5, $year], 'Jun' => [6, $year], 'Jul' => [7, $year]];
        }

        foreach ($months as $label => $info) {
            $mStart = \Carbon\Carbon::create($info[1], $info[0], 1)->startOfMonth();
            $mEnd = $mStart->copy()->endOfMonth();
            $chartData->push([
                'name' => $label,
                'penelitian' => \App\Models\UsulanPenelitian::whereBetween('created_at', [$mStart, $mEnd])->count(),
                'pengabdian' => \App\Models\UsulanPengabdian::whereBetween('created_at', [$mStart, $mEnd])->count(),
            ]);
        }

        // Distribution by Status
        $pStatus = \App\Models\UsulanPenelitian::whereIn('tahun_pertama', $filterCodes)
            ->selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();
        $pgStatus = \App\Models\UsulanPengabdian::whereIn('tahun_pertama', $filterCodes)
            ->selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();

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
                'penelitian' => $pStatus,
                'pengabdian' => $pgStatus,
            ],
            'filters' => [
                'tahun_akademik' => (string) $filterCode
            ]
        ]);
    }
}
