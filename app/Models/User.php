<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'osu_id',
        'username',
        'osu_token',
        'osu_refresh_token'
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
    ];

    public function queues()
    {
        return $this->belongsToMany(Queue::class);
    }

    public function beatmaps() {
        return $this->hasMany(Beatmap::class, 'request_author');
    }

    public function isRestricted() {
        return $this->restricted_access;
    }
}
