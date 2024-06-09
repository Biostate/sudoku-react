<?php

namespace App\Actions;

use App\Data\GameData;
use App\Enums\GameMode;
use App\Enums\GameStatus;
use App\Models\Game;
use App\Models\User;
use App\Sudoku\Puzzle;
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
        $puzzle = new Puzzle();
        $cellSize = $gameData['difficulty'] * 4;
        $puzzle->generatePuzzle($cellSize);
        $puzzle = $puzzle->getPuzzle();

        $game = Game::create([
            'player_1' => $user->id,
            'data' => $puzzle,
            'code' => $code,
            'mode' => $gameData['mode'],
            'status' => GameStatus::CREATED,
            'only_friends' => false,
            'enable_highlighting' => $gameData['enable_highlighting'] ?? false,
        ]);

        return GameData::fromModel($game);
    }

    public function asController(Request $request): \Illuminate\Http\RedirectResponse
    {
        // TODO: Validate request
        // game_mode must be in enum GameMode
        // difficulty_level must be 1 to 9

        $game = $this->handle($request->user(), [
            'mode' => $request->input('game_mode'),
            'difficulty' => $request->input('difficulty_level'),
            'enable_highlighting' => $request->input('enable_highlighting'),
        ]);

        return to_route('game.play', [
            'game' => $game->code,
        ]);
    }
}
