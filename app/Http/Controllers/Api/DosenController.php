<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dosen;
use Illuminate\Http\Request;

class DosenController extends Controller
{
    /**
     * Search dosen by NIDN or Nama
     * Query parameters:
     * - q: search term (NIDN or Nama)
     * - limit: max results (default: 10)
     */
    public function search(Request $request)
    {
        $query = $request->input('q', '');
        $limit = $request->input('limit', 10);

        if (empty($query)) {
            return response()->json(['data' => []]);
        }

        $dosen = Dosen::where(function ($q) use ($query) {
            $q->where('nidn', 'like', "%{$query}%")
                ->orWhere('nama', 'like', "%{$query}%");
        })
        ->limit($limit)
        ->get(['id', 'nidn', 'nama', 'email', 'no_hp']);

        return response()->json([
            'data' => $dosen,
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
