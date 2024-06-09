<?php

namespace App\Data;

use App\Models\FriendRequest;
use Spatie\LaravelData\Data;

class FriendRequestData extends Data
{
    public function __construct(
        public int $id,
        public string $username,
        public string $sentAt,
        public string $avatar,
    ) {
    }

    public static function fromModel(FriendRequest $friendRequest): self
    {
        return new self(
            id: $friendRequest->id,
            username: $friendRequest->sender->name,
            sentAt: $friendRequest->created_at->diffForHumans(),
            avatar: $friendRequest->sender->avatar,
        );
    }
}
