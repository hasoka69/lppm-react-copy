<?php

use Inertia\Inertia;
use App\Models\Berita;

class BeritaController extends Controller
{
    public function index()
    {
        $berita = Berita::orderBy('tanggal', 'desc')->get();
        return Inertia::render('berita/Index', [
            'berita' => $berita
        ]);
    }
}
