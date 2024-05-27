<?php

use App\Models\Game;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('games.{gameId}', function (\App\Models\User $user, int $gameId) {
    $game = Game::find($gameId);
    if ($user->id === $game->player_1 || $user->id === $game->player_2) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
