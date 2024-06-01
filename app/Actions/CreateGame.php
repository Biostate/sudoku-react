<?php

namespace App\Actions;

use App\Data\GameData;
use App\Enums\GameMode;
use App\Enums\GameStatus;
use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;

class CreateGame
{
    use AsAction;
    use AsController;

    public function handle(User $user, $gameData): GameData
    {
        $code = bin2hex(random_bytes(4));
        while (Game::where('code', $code)->inProgress()->exists()) {
            $code = bin2hex(random_bytes(4));
        }

        // Generate a new puzzle
        $puzzle = new \Xeeeveee\Sudoku\Puzzle();
        $puzzle->generatePuzzle();
        $puzzle = $puzzle->getPuzzle();

        $game = Game::create([
            'player_1' => $user->id,
            'data' => $puzzle,
            'code' => $code,
            'mode' => $gameData['mode'],
            'status' => GameStatus::CREATED,
            'only_friends' => false,
        ]);

        return GameData::fromModel($game);
    }

    public function asController(Request $request): \Illuminate\Http\RedirectResponse
    {
        $game = $this->handle($request->user(), [
            'mode' => GameMode::VERSUS,
        ]);

        return to_route('game.play', [
            'game' => $game->code,
        ]);
    }
}
