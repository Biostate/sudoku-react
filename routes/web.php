<?php

use App\Http\Controllers\FriendsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('friends', [FriendsController::class, 'index'])->name('friends');
    Route::post('friend-requests', \App\Actions\SendFriendRequest::class)
        ->name('friend-requests.send');
    Route::post('friend-requests/{friendRequest}/approve', \App\Actions\ApproveFriendRequest::class)
        ->name('friend-requests.approve');

    Route::post('friend-requests/{friendRequest}/reject', \App\Actions\RejectFriendRequest::class)
        ->name('friend-requests.reject');
});

require __DIR__.'/auth.php';
require __DIR__.'/game.php';
