<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;

class Beatmap extends Model
{
    use HasFactory;

    protected $fillable = [
        'queue_id', 'request_author', 'comment', 'beatmapset_id',
        'title', 'artist', 'creator', 'cover', 'genre', 'language', 'bpm', 'is_ranked'
    ];

    protected $appends = [
        'queue',
        'author',
        'total_accepted',
        'total_nominated'
    ];

    public function author() {
        return $this->belongsTo(User::class, 'request_author');
    }

    public function queue() {
        return $this->belongsTo(Queue::class, 'queue_id');
    }

    public function responses() {
        return $this->hasMany(NominatorResponse::class, 'request_id');
    }

    public function getAuthorAttribute() {
        return $this->author()->first();
    }

    public function getQueueAttribute() {
        return $this->queue()->first();
    }

    public function getTotalAcceptedAttribute() {
        return $this->responses()->whereIn('status',  ['ACCEPTED', 'MODDED', 'RECHECKED'])->count();
    }

    public function getTotalNominatedAttribute() {
        return $this->responses()->whereIn('status',  ['NOMINATED'])->count();
    }

    public function updateStatus() {
        $old_status = $this->status;

        $nominated_responses = $this->responses()->where('status', 'NOMINATED')->count();
        $accepted_responses = $this->responses()->whereIn('status',  ['ACCEPTED'])->count();
        $modded_responses = $this->responses()->where('status',  'MODDED', 'RECHECKED')->count();
        $invalid_responses = $this->responses()->where('status',  'INVALID')->count();
        $uninterested_responses = $this->responses()->where('status',  'UNINTERESTED')->count();

        if ($nominated_responses > 0) {
            $this->status = 'NOMINATED';
        } else if ($accepted_responses > 0) {
            $this->status = 'ACCEPTED';
        } else if ($modded_responses > 0) {
            $this->status = 'MODDED';
        } else if ($invalid_responses >= 1) {
            $this->status = 'INVALID';
        } else if ($uninterested_responses >= $this->queue->not_interested_requirement || ($this->queue->type == 'personal' && $uninterested_responses > 0)) {
            $this->status = 'HIDDEN';
        } else {
            $this->status = 'PENDING';
        }
        $this->save();

        if ($this->status != $old_status) {
            $this->sendMessage();
        }
    }

    public function updateRanked() {
        $this->is_ranked = 1;
        $this->ranked_at = Carbon::now();
        $this->status = 'RANKED';
        $this->save();
    }

    public function sendMessage() {
        $username = str_replace(' ', '_', $this->author->username);
        $beatmap_title = str_replace("'", "\'", "{$this->beatmapset_id} {$this->artist} - {$this->title}");

        switch ($this->status) {
            case 'INVALID':
                Artisan::call("irc:send '{$username}' 'Hello! Unfortunately your request for beatmap [https://osu.ppy.sh/beatmapsets/{$beatmap_title}] has been marked as invalid in {$this->queue->name} on [https://nomination.shmiklak.uz NomiNation website]. You can view your request there to see the reasons why beatmap nominators believe so. Please note, this is an automated message.'");
                break;
            case 'HIDDEN':
                Artisan::call("irc:send '{$username}' 'Hello! Unfortunately your request for beatmap [https://osu.ppy.sh/beatmapsets/{$beatmap_title}] has been hidden from {$this->queue->name} on [https://nomination.shmiklak.uz NomiNation website] because beatmap nominators of this queue are not interested in it. Please note, this is an automated message.'");
        }
    }
}
