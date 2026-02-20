<?php

namespace App\Http\Controllers;

use App\Models\Panduan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PanduanController extends Controller
{
    // ADMIN METHODS

    public function index()
    {
        $panduans = Panduan::latest()->get();
        return Inertia::render('lppm/panduan/Index', [
            'panduans' => $panduans
        ]);
    }

    public function create()
    {
        return Inertia::render('lppm/panduan/Form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'type' => 'required|in:video,document',
            'deskripsi' => 'nullable|string',
            'video_url' => 'nullable|required_if:type,video|url',
            'file_path' => 'nullable|required_if:type,document|file|mimes:pdf|max:10240',
        ]);

        $data = $request->only(['judul', 'type', 'deskripsi', 'video_url']);
        $data['is_active'] = true;

        if ($request->type === 'video' && $request->video_url) {
            // Extract Video ID and set Thumbnail
            $videoId = $this->extractVideoId($request->video_url);
            if ($videoId) {
                $data['thumbnail_path'] = "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg"; // Use High Quality
            }
            $data['file_path'] = null; // Ensure no file for video type
        } elseif ($request->type === 'document') {
            if ($request->hasFile('file_path')) {
                $data['file_path'] = $request->file('file_path')->store('panduans/files', 'public');
            }
            $data['video_url'] = null;
            $data['thumbnail_path'] = null; // No thumbnail for document
        }

        Panduan::create($data);

        return redirect()->route('lppm.panduan.index')->with('success', 'Panduan berhasil ditambahkan');
    }

    private function extractVideoId($url)
    {
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    public function edit(Panduan $panduan)
    {
        return Inertia::render('lppm/panduan/Form', [
            'panduan' => $panduan
        ]);
    }

    public function update(Request $request, Panduan $panduan)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'type' => 'required|in:video,document',
            'deskripsi' => 'nullable|string',
            'video_url' => 'nullable|required_if:type,video|url',
            'file_path' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $data = $request->only(['judul', 'type', 'deskripsi', 'video_url']);

        if ($request->type === 'video' && $request->video_url) {
            // Extract Video ID and set Thumbnail
            $videoId = $this->extractVideoId($request->video_url);
            if ($videoId) {
                $data['thumbnail_path'] = "https://img.youtube.com/vi/{$videoId}/hqdefault.jpg";
            }
            // Remove old file if exists
            if ($panduan->file_path) {
                Storage::disk('public')->delete($panduan->file_path);
                $data['file_path'] = null;
            }
        } elseif ($request->type === 'document') {
            if ($request->hasFile('file_path')) {
                // Delete old file
                if ($panduan->file_path) {
                    Storage::disk('public')->delete($panduan->file_path);
                }
                $data['file_path'] = $request->file('file_path')->store('panduans/files', 'public');
            }
            $data['video_url'] = null;
            $data['thumbnail_path'] = null;
        }

        $panduan->update($data);

        return redirect()->route('lppm.panduan.index')->with('success', 'Panduan berhasil diperbarui');
    }

    public function destroy(Panduan $panduan)
    {
        if ($panduan->file_path) {
            Storage::disk('public')->delete($panduan->file_path);
        }
        if ($panduan->thumbnail_path) {
            Storage::disk('public')->delete($panduan->thumbnail_path);
        }

        $panduan->delete();

        return redirect()->back()->with('success', 'Panduan berhasil dihapus');
    }

    public function toggleStatus($id)
    {
        $panduan = Panduan::findOrFail($id);
        $panduan->is_active = !$panduan->is_active;
        $panduan->save();

        return back()->with('success', 'Status panduan berhasil diubah');
    }

    // PUBLIC / USER METHODS

    public function indexPublic()
    {
        $panduans = Panduan::where('is_active', true)->latest()->get();
        return Inertia::render('Panduan/Index', [
            'panduans' => $panduans
        ]);
    }

    public function showPublic($id)
    {
        $panduan = Panduan::where('is_active', true)->findOrFail($id);
        return Inertia::render('Panduan/Show', [
            'panduan' => $panduan
        ]);
    }
}
