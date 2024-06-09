<?php

namespace App\Actions;

use App\Models\FriendRequest;
use Lorisleiva\Actions\Concerns\AsAction;

class RejectFriendRequest
{
    use AsAction;

    public function handle(FriendRequest $friendRequest)
    {
        $friendRequest->delete();

        // TODO: broadcast a notification to the sender
    }
}
