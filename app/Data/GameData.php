<?php

namespace App\Data;

use App\Models\Game;
use Spatie\LaravelData\Data;

class GameData extends Data
{
    public function __construct(
        public int $id,
        public $player1,
        public $player2,
        public $winner,
        public string $code,
        public string $mode,
        public string $status,
        public array $data,
        public bool $onlyFriends,
    ) {
    }

    public static function fromModel(Game $game): self
    {
        return new self(
            id: $game->id,
            player1: PlayerData::from($game->player1),
            player2: $game->player2 ? PlayerData::from($game->player2) : null,
            winner: $game->winner ? PlayerData::from($game->winner) : null,
            code: $game->code,
            mode: $game->mode->value,
            status: $game->status->value,
            data: $game->data,
            onlyFriends: $game->only_friends,
        );
    }
}
