<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    public const QUEUE_WAITING_FOR_APPROVAL = 'waiting_for_approval';
    public const QUEUE_OPEN = 'open';
    public const QUEUE_CLOSED = 'closed';
    public const QUEUE_HIDDEN = 'hidden';
    public const QUEUE_TYPE_PERSONAL = 'personal';
    public const QUEUE_TYPE_SUBDIVISION = 'subdivision';

    protected $fillable = [
        'name',
        'status',
        'short_description',
        'description',
        'request_information',
        'image',
        'type',
        'not_interested_requirement',
        'user_id',
        'discord_webhook',
        'autoclose_amount',
        'reqs_per_user_per_month'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class)->withPivot('is_admin', 'joined_at');
    }

    public function admins()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('is_admin')
            ->wherePivot('is_admin', true);
    }

    public function beatmaps() {
        return $this->hasMany(Beatmap::class, 'queue_id');
    }
}
