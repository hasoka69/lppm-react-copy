<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class Berita extends Model
{
    protected $table = 'beritas'; // atau 'berita' sesuai nama tabel di database
    protected $fillable = ['judul', 'ringkasan', 'konten', 'user_id'];
    public $timestamps = true;

    public static function createTable()
    {
        Schema::create('beritas', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('ringkasan')->nullable();
            $table->text('konten')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
        });
    }

}