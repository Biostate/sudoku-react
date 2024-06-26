<?php

namespace App\Actions;

use App\Data\GameData;
use App\Enums\GameStatus;
use App\Events\GameFinished;
use App\Models\Game;
use App\Models\User;
use App\Sudoku\Puzzle;
use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Lorisleiva\Actions\Concerns\AsController;

class FinishGame
{
    use AsAction;
    use AsController;

    public function handle(Game $game, ?User $winner = null): GameData
    {
        // TODO: update game status to playing
        $game->status = GameStatus::FINISHED;
        if ($winner) {
            $game->winner_id = $winner->id;
        }
        $game->save();

        GameFinished::dispatch($game);

        return GameData::fromModel($game);
    }

    public function asController(Request $request, Game $game): \Illuminate\Http\RedirectResponse
    {
        // TODO: check the user is allowed to finish the game
        // game must be in playing status
        // user must be one of the players

        $board = $request->input('board');

        $valid = $this->isSolutionMatchedWithPuzzle($game->data, $board);

        if (! $valid) {
            return redirect()->back();
        }

        $solved = $this->validateBoard($board);

        if (! $solved) {
            return redirect()->back();
        }

        $this->handle($game, auth()->user());

        return redirect()->back();
    }

    private function isSolutionMatchedWithPuzzle($puzzle, $solution)
    {
        for ($row = 0; $row < 9; $row++) {
            for ($col = 0; $col < 9; $col++) {
                // Check if the puzzle value is not zero and does not match the solution
                if ($puzzle[$row][$col] != 0 && $puzzle[$row][$col] != $solution[$row][$col]) {
                    return false;
                }
            }
        }

        return true;
    }

    private function validateBoard(array $board): bool
    {
        foreach ($board as $row => $cols) {
            foreach ($cols as $col => $value) {
                if (! $value) {
                    return false;
                }
            }
        }

        $puzzle = new Puzzle();
        $puzzle->setSolution($board);

        return $puzzle->isSolved();
    }
}
