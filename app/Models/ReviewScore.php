<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewScore extends Model
{
    protected $table = 'review_scores';

    protected $fillable = [
        'review_history_id',
        'section',
        'score',
        'comments'
    ];

    public function reviewHistory()
    {
        return $this->belongsTo(ReviewHistory::class);
    }
}
