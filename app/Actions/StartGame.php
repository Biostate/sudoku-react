<?php

namespace App\Actions;

use App\Data\GameData;
use App\Enums\GameStatus;
use App\Events\GameStarted;
use App\Models\Game;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;

class StartGame
{
    use AsAction;
    use AsController;

    public function handle(Game $game): GameData
    {
        // TODO: update game status to playing
        $game->status = GameStatus::PLAYING;
        $game->save();

        GameStarted::dispatch($game);

        return GameData::fromModel($game);
    }

    public function asController(Request $request, Game $game): \Illuminate\Http\RedirectResponse
    {
        // TODO: check the user is allowed to start the game

        $gameData = $this->handle($game);

        return redirect()->back();
    }
}
