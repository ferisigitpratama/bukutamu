<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Visitor extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'address',
        'visitor_type',
        'company',
        'purpose',
        'receptionist_id',
        'office_id',
        'security_id',
        'visited_at',
    ];

    protected function casts(): array
    {
        return [
            'visited_at' => 'datetime',
        ];
    }

    public function receptionist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receptionist_id');
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }

    public function security(): BelongsTo
    {
        return $this->belongsTo(SecurityPersonnel::class, 'security_id');
    }
}
