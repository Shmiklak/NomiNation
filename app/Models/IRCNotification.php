<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IRCNotification extends Model
{
    protected $fillable = ['username', 'message'];
}
