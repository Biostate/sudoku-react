<?php

namespace App\Models;

use App\Enums\GameMode;
use App\Enums\GameStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_1',
        'player_2',
        'winner_id',
        'code',
        'mode',
        'status',
        'data',
        'only_friends',
    ];

    protected $casts = [
        'mode' => GameMode::class,
        'status' => GameStatus::class,
        'only_friends' => 'boolean',
        'data' => 'array',
    ];

    public function player1(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player_1');
    }

    public function player2(): BelongsTo
    {
        return $this->belongsTo(User::class, 'player_2');
    }

    public function winner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    public function scopeInProgress($query)
    {
        return $query->whereIn('status', [
            GameStatus::CREATED,
            GameStatus::WAITING,
            GameStatus::PLAYING,
        ]);
    }
}
