<?php

namespace App\Http\Controllers;

use App\Models\TemplateDokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TemplateDokumenController extends Controller
{
    public function index()
    {
        $templates = TemplateDokumen::orderBy('created_at', 'desc')->get();
        return Inertia::render('lppm/TemplateDokumen/Index', [
            'templates' => $templates
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jenis' => 'required|in:Penelitian,Pengabdian',
            'file' => 'required|file|mimes:docx|max:10240', // Max 10MB
        ]);

        $path = $request->file('file')->store('templates', 'public');

        TemplateDokumen::create([
            'nama' => $request->nama,
            'jenis' => $request->jenis,
            'file_path' => $path,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Template berhasil diupload.');
    }

    public function destroy($id)
    {
        $template = TemplateDokumen::findOrFail($id);

        if ($template->file_path && Storage::disk('public')->exists($template->file_path)) {
            Storage::disk('public')->delete($template->file_path);
        }

        $template->delete();

        return redirect()->back()->with('success', 'Template berhasil dihapus.');
    }

    public function toggleStatus(TemplateDokumen $template)
    {
        $template->update(['is_active' => !$template->is_active]);
        return redirect()->back()->with('success', 'Status template diperbarui.');
    }
}
