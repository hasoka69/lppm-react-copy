<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MahasiswaController extends Controller
{
    /**
     * Search mahasiswa by NIM or Nama
     * Query parameters:
     * - q: search term (NIM or Nama)
     * - limit: max results (default: 10)
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 10);

        // ✅ Debug log
        Log::info('Mahasiswa search API called', [
            'query' => $query,
            'limit' => $limit,
            'user_id' => auth()->id(),
        ]);

        if (empty($query)) {
            Log::info('Mahasiswa search: Empty query');
            return response()->json(['data' => []]);
        }

        $mahasiswa = Mahasiswa::where(function ($q) use ($query) {
            $q->where('nim', 'like', "%{$query}%")
                ->orWhere('nama', 'like', "%{$query}%");
        })
        ->limit($limit)
        ->get(['id', 'nim', 'nama', 'angkatan', 'jurusan', 'email', 'status']);

        // ✅ Debug log
        Log::info('Mahasiswa search results', [
            'query' => $query,
            'count' => $mahasiswa->count(),
            'results' => $mahasiswa->toArray(),
        ]);

        return response()->json([
            'data' => $mahasiswa,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
