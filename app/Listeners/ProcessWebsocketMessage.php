<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Events\MessageReceived;

class ProcessWebsocketMessage
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageReceived $event): void
    {
        //Log::info('Message received', ['message' => $event->message]);
    }
}
