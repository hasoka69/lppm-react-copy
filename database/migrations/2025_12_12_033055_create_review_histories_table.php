<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('review_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usulan_id')->constrained('usulan_penelitian')->onDelete('cascade');
            $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
            $table->enum('reviewer_type', ['kaprodi', 'reviewer']);
            $table->enum('action', [
                'submitted',
                'kaprodi_approved',
                'kaprodi_rejected',
                'reviewer_approved',
                'reviewer_rejected',
                'funding_approved'
            ]);
            $table->text('comments')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_histories');
    }
};
