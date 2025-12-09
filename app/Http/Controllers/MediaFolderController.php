<?php

namespace App\Http\Controllers;

use App\Models\MediaFolder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class MediaFolderController extends Controller
{
    use AuthorizesRequests;

    // Display the list of folders and their files
    public function index(Request $request)
    {
        $user = $request->user();
        $folderId = $request->input('folder_id');

        // Retrieve all folders for the user
        $folders = $user->mediaFolders()->orderBy('name')->get();

        // Retrieve the current folder if the folderId exists
        $currentFolder = $folderId ? $user->mediaFolders()->find($folderId) : null;

        if ($folderId && !$currentFolder) {
            return redirect('/files');
        }

        // Retrieve files based on folderId
        $files = $user->media()
            ->where('collection_name', 'files')
            ->when($folderId, function ($query) use ($folderId) {
                $query->whereJsonContains('custom_properties->folder_id', (string) $folderId);
            }, function ($query) {
                $query->whereNull('custom_properties->folder_id');
            })
            ->get();

        return Inertia::render('files/Index', [
            'folders' => $folders,
            'currentFolderId' => $folderId,
            'currentFolder' => $currentFolder, // ensure this is always set
            'files' => $files->map(fn($media) => [
                'id' => $media->id,
                'name' => $media->name,
                'size' => $media->humanReadableSize,
                'mime_type' => $media->mime_type,
                'url' => $media->getFullUrl(),
                'created_at' => $media->created_at->diffForHumans(),
            ]),
        ]);
    }

    // Store a new folder
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:media_folders,id',
        ]);

        $folder = $request->user()->mediaFolders()->create([
            'name' => $request->name,
            'parent_id' => $request->parent_id,
        ]);

        return back()->with('success', 'Folder berhasil dibuat.');
    }

    // Destroy a folder and its files
    public function destroy(MediaFolder $medium)
    {
        $folder = $medium;
        $user = $folder->user;

        // Delete all files inside the folder
        $files = $user->media()
            ->where('collection_name', 'files')
            ->whereJsonContains('custom_properties->folder_id', (string)$folder->id)
            ->get();

        foreach ($files as $file) {
            // You can also delete files from storage here if needed
            $file->delete();
        }

        // Delete all direct subfolders of the current folder
        $childFolders = $user->mediaFolders()->where('parent_id', $folder->id)->get();
        foreach ($childFolders as $child) {
            $child->delete();
        }

        // Delete the main folder itself
        $folder->delete();

        return redirect('/files')->with('success', 'Folder berhasil dihapus.');
    }
}
