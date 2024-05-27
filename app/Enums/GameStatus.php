<?php

declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

final class GameStatus extends Enum
{
    const CREATED = 'created';

    const WAITING = 'waiting';

    const PLAYING = 'playing';

    const FINISHED = 'finished';

    const CANCELED = 'canceled';

    const ABANDONED = 'abandoned';
}
