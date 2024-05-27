<?php

namespace App\Http\Controllers;

use App\Data\GameData;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlayGameController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, Game $game)
    {
        if ($game->player_2 === null && $game->player_1 !== $request->user()->id) {
            $game->player_2 = $request->user()->id;
            $game->save();
        }

        $game->load('player1', 'player2');

        if (app()->environment('local')) {
            $puzzle = new \Xeeeveee\Sudoku\Puzzle($game->data);
            $puzzle->solve();
            $solution = $puzzle->getSolution();
        } else {
            $solution = null;
        }

        return Inertia::render('Game/Play', [
            'game' => GameData::fromModel($game),
            'solution' => $solution,
        ]);
    }
}
