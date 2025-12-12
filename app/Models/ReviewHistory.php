<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReviewHistory extends Model
{
    protected $table = 'review_histories';

    protected $fillable = [
        'usulan_id',
        'reviewer_id',
        'reviewer_type',
        'action',
        'comments',
        'reviewed_at',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'reviewed_at',
    ];

    /**
     * Get the proposal that this review is for
     */
    public function usulan()
    {
        return $this->belongsTo(UsulanPenelitian::class);
    }

    /**
     * Get the reviewer user
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
