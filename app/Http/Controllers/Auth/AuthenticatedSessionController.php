<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // LOGIKA REDIRECT BARU BERDASARKAN PERAN
        $user = $request->user(); // Menggunakan $request->user() setelah authenticate()

        // Penting: Urutan pengecekan peran (Role Priority)

        if ($user->hasRole('Admin')) {
            return redirect()->intended('/admin/dashboard');
        } elseif ($user->hasRole('Admin LPPM')) { // PERBAIKAN: Tambahkan Admin LPPM
            return redirect()->intended('/lppm/dashboard');
        } elseif ($user->hasRole('Reviewer')) {
            return redirect()->intended('/reviewer/dashboard');
        } elseif ($user->hasRole('Kaprodi')) {
            return redirect()->intended('/kaprodi/dashboard');
        } elseif ($user->hasRole('Dosen')) {
            return redirect()->intended('/dosen/dashboard');
        }

        // Default redirect jika peran tidak terdeteksi
        return redirect()->intended('/'); 
    }
    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}