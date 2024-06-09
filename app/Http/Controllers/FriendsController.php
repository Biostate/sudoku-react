<?php

namespace App\Http\Controllers;

use App\Data\UserData;
use Inertia\Inertia;

class FriendsController extends Controller
{
    public function index()
    {
        $friends = auth()->user()->friends()->with('friend')->get()->pluck('friend');

        return Inertia::render('Friends/index', [
            'friends' => UserData::collect($friends ?? []),
        ]);
    }
}
