<?php

namespace App\Http\Middleware;

use App\Models\SettingApp;
use App\Models\UsulanPenelitian;
use App\Models\UsulanPengabdian;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user() ? array_merge($request->user()->toArray(), [
                    'role' => $request->user()->getRoleNames()->first(),
                    'roles' => $request->user()->getRoleNames()->toArray(),
                ]) : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
                'info' => session('info'),
            ],
            'setting' => fn() => SettingApp::first(),
            'notificationCounts' => function () use ($request) {
                if (!$request->user() || !$request->user()->hasRole('Admin LPPM')) return null;

                $actionStatuses = ['resubmitted_revision', 'under_revision_admin'];

                return [
                    'penelitian' => UsulanPenelitian::whereIn('status', $actionStatuses)
                        ->select('tahun_pertama', DB::raw('count(*) as count'))
                        ->groupBy('tahun_pertama')
                        ->pluck('count', 'tahun_pertama')
                        ->toArray(),
                    'pengabdian' => UsulanPengabdian::whereIn('status', $actionStatuses)
                        ->select('tahun_pertama', DB::raw('count(*) as count'))
                        ->groupBy('tahun_pertama')
                        ->pluck('count', 'tahun_pertama')
                        ->toArray(),
                    'total_penelitian' => UsulanPenelitian::whereIn('status', $actionStatuses)->count(),
                    'total_pengabdian' => UsulanPengabdian::whereIn('status', $actionStatuses)->count(),
                ];
            },
        ]);

    }
}
