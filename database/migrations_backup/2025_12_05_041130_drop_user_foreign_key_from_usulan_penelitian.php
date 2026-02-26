<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropUserForeignKeyFromUsulanPenelitian extends Migration
{
    public function up()
    {
        // Drop the foreign key constraint
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->dropForeign(['user_id']); // user_id is the foreign key column
        });
    }

    public function down()
    {
        // Re-create the foreign key constraint if needed
        Schema::table('usulan_penelitian', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
}
