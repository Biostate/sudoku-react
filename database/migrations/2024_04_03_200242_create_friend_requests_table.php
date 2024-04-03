<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('friend_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class, 'sender_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\User::class, 'receiver_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->unique(['sender_id', 'receiver_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friend_requests');
    }
};
