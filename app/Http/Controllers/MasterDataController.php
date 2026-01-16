<?php

namespace App\Http\Controllers;

use App\Models\Kota;
use App\Models\Provinsi;
use App\Models\RumpunIlmu;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    /**
     * Get Rumpun Ilmu based on level and parent
     */
    public function getRumpunIlmu(Request $request)
    {
        $level = $request->query('level', 1);
        $parentId = $request->query('parent_id');

        $query = RumpunIlmu::where('level', $level);

        if ($parentId) {
            $query->where('parent_id', $parentId);
        }

        return response()->json($query->get());
    }

    /**
     * Get All Provinsi
     */
    public function getProvinsi()
    {
        return response()->json(Provinsi::all());
    }

    /**
     * Get Kota by Provinsi
     */
    public function getKota(Request $request)
    {
        $provinsiId = $request->query('provinsi_id');

        if (!$provinsiId) {
            return response()->json([]);
        }

        return response()->json(Kota::where('provinsi_id', $provinsiId)->get());
    }
}
