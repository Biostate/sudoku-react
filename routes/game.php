<?php

use Illuminate\Support\Facades\Route;

Route::prefix('game')->middleware('auth')->group(function () {
    Route::post('/', \App\Actions\CreateGame::class)->name('game.create');
    Route::get('{game:code}', \App\Http\Controllers\PlayGameController::class)->name('game.play');
    Route::post('{game:code}/start', \App\Actions\StartGame::class)->name('game.start');
    Route::post('{game:code}/finish', \App\Actions\FinishGame::class)->name('game.finish');
});
