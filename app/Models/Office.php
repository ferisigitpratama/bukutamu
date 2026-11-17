<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Office extends Model
{
    protected $fillable = [
        'name',
        'code',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function visitors(): HasMany
    {
        return $this->hasMany(Visitor::class);
    }

    public function securityPersonnel(): HasMany
    {
        return $this->hasMany(SecurityPersonnel::class);
    }
}
