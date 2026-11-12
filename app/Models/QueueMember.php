<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class QueueMember extends Pivot
{
    protected $casts = [
        'queue_id' => 'integer',
        'user_id' => 'integer',
        'is_admin' => 'boolean',
    ];
}
