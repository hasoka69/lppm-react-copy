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

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8', // removed confirmed for simplicity unless UI sends confirmation
            'scopus_id' => 'nullable|string',
            'sinta_id' => 'nullable|string',
            'google_scholar_id' => 'nullable|string',
        ]);

        $user->name = $request->name;
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        if ($user->dosen) {
            $user->dosen->update([
                'scopus_id' => $request->scopus_id,
                'sinta_id' => $request->sinta_id,
                'google_scholar_id' => $request->google_scholar_id
            ]);
        }

        return back()->with('success', 'Profile updated successfully.');
    }
}
