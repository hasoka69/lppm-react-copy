<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengumumanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengumuman = Pengumuman::latest()->get();
        return Inertia::render('lppm/pengumuman/Index', [
            'pengumuman' => $pengumuman
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        Pengumuman::create([
            'content' => $request->content,
            'is_active' => true,
        ]);

        return back()->with('success', 'Pengumuman berhasil ditambahkan');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pengumuman $pengumuman)
    {
        $request->validate([
            'content' => 'required|string',
            'is_active' => 'boolean'
        ]);

        $pengumuman->update($request->only('content', 'is_active'));

        return back()->with('success', 'Pengumuman berhasil diperbarui');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengumuman $pengumuman)
    {
        $pengumuman->delete();
        return back()->with('success', 'Pengumuman berhasil dihapus');
    }

    public function indexPublic()
    {
        $pengumuman = Pengumuman::where('is_active', true)->latest()->paginate(9);
        return Inertia::render('pengumuman/Index', [
            'pengumuman' => $pengumuman
        ]);
    }
}
