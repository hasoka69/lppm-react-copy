<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect; // Fix: Add Redirect facade

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        // Load relationships if needed, e.g. dosen
        $user->load('dosen');

        return Inertia::render('profile/Index', [
            // Pass simple 'dosen' object for easier access
            'dosen_data' => $user->dosen,
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => ['required', 'image', 'max:2048'], // 2MB Max
        ]);

        $user = $request->user();

        if ($request->hasFile('photo')) {
            $user->clearMediaCollection('avatars');
            $user->addMediaFromRequest('photo')
                ->toMediaCollection('avatars');
        }

        return back();
    }
}
