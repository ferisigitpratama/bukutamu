<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SecurityPersonnel extends Model
{
    protected $table = 'security_personnel';

    protected $fillable = [
        'office_id',
        'name',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }

    public function visitors(): HasMany
    {
        return $this->hasMany(Visitor::class, 'security_id');
    }
}
