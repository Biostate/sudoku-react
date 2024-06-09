<?php

namespace App\Actions;

use App\Events\NewFriendRequest;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;

class SendFriendRequest
{
    use AsAction;
    use AsController;

    public function handle(User $user, User $friend): void
    {
        $request = FriendRequest::create([
            'sender_id' => $user->id,
            'receiver_id' => $friend->id,
        ]);

        NewFriendRequest::dispatch($request);
    }

    /**
     * @throws ValidationException
     */
    public function asController(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => [
                'required',
                'email',
                Rule::exists('users')->where(function (Builder $query) {
                    return $query->where('email', request('email'))
                        ->where('id', '!=', auth()->id());
                }),
            ],
        ]);

        /** @var User $user */
        $user = auth()->user();
        $email = $request->input('email');
        $friend = User::where('email', $email)->firstOrFail();

        if ($user->isFriendWith($friend)) {
            throw ValidationException::withMessages([
                'email' => ['You are already friends with this user.'],
            ]);
        }

        $this->handle($user, $friend);

        return to_route('friends');
    }
}
