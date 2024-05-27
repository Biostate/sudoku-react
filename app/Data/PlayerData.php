<?php

namespace App\Data;

use App\Models\User;
use Spatie\LaravelData\Data;

class PlayerData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {
    }

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
        );
    }
}
