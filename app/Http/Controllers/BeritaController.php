<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BeritaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Berita::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('judul', 'like', "%{$search}%")
                ->orWhere('categories', 'like', "%{$search}%");
        }

        $berita = $query->latest()->paginate(10);

        return Inertia::render('lppm/berita/Index', [
            'berita' => $berita,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('lppm/berita/Form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'konten' => 'required|string',
            'status' => 'required|in:draft,published',
            'gambar' => 'nullable|image|max:2048', // 2MB Max
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('gambar')) {
            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = '/storage/' . $path;
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $validated['user_id'] = auth()->id();

        Berita::create($validated);

        return redirect()->route('lppm.berita.index')->with('success', 'Berita berhasil dibuat.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Berita $berita)
    {
        // Used for public view logic if needed here, generally separate or reuse
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $berita = Berita::findOrFail($id);
        return Inertia::render('lppm/berita/Form', [
            'berita' => $berita
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'ringkasan' => 'nullable|string',
            'konten' => 'required|string',
            'status' => 'required|in:draft,published',
            'gambar' => 'nullable', // could be string (existing path) or file
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($berita->gambar) {
                $oldPath = str_replace('/storage/', '', $berita->gambar);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('gambar')->store('berita', 'public');
            $validated['gambar'] = '/storage/' . $path;
        }

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $berita->update($validated);

        return redirect()->route('lppm.berita.index')->with('success', 'Berita berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);

        if ($berita->gambar) {
            $oldPath = str_replace('/storage/', '', $berita->gambar);
            Storage::disk('public')->delete($oldPath);
        }

        $berita->delete();

        return redirect()->route('lppm.berita.index')->with('success', 'Berita berhasil dihapus.');
    }

    public function indexPublic()
    {
        $berita = Berita::published()->latest('published_at')->paginate(9);
        $featured = Berita::published()->where('featured', true)->latest('published_at')->first();

        return Inertia::render('berita/Index', [
            'berita' => $berita,
            'featured' => $featured
        ]);
    }

    public function showPublic($slug)
    {
        $berita = Berita::published()->where('slug', $slug)->firstOrFail();
        $related = Berita::published()->where('id', '!=', $berita->id)->latest('published_at')->take(3)->get();

        return Inertia::render('berita/Show', [
            'berita' => $berita,
            'related' => $related
        ]);
    }
}
