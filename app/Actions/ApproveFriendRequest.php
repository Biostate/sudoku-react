<?php

namespace App\Actions;

use App\Models\FriendRequest;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;

class ApproveFriendRequest
{
    use AsAction;
    use AsController;

    public function handle(FriendRequest $friendRequest)
    {
        $friendRequest->sender->friends()->create([
            'friend_id' => $friendRequest->receiver_id,
        ]);

        $friendRequest->receiver->friends()->create([
            'friend_id' => $friendRequest->sender_id,
        ]);

        $friendRequest->delete();
    }
}
