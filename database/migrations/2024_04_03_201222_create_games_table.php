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
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class, 'player_1')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\User::class, 'player_2')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->foreignIdFor(\App\Models\User::class, 'winner_id')
                ->nullable()
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('code');
            $table->string('mode');
            $table->json('data');
            $table->string('status');
            $table->boolean('only_friends')
                ->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('games');
    }
};
