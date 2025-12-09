<?php

namespace App\Http\Controllers\Api;

use App\Models\MediaFolder;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MediaFolderController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $folderId = $request->input('folder_id');

        // Retrieve all folders for the user
        $folders = $user->mediaFolders()->orderBy('name')->get();

        // Retrieve files based on folderId
        $files = $user->media()
            ->where('collection_name', 'files')
            ->when($folderId, function ($query) use ($folderId) {
                $query->whereJsonContains('custom_properties->folder_id', (string) $folderId);
            }, function ($query) {
                $query->whereNull('custom_properties->folder_id');
            })
            ->get();

        return response()->json([
            'folders' => $folders,
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

    // API to delete a file
    public function destroyFile($fileId)
    {
        $file = Auth::user()->media()->findOrFail($fileId);
        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }
}
