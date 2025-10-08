<?php

namespace App\Http\Controllers;

use App\Models\Beatmap;
use App\Models\NominatorResponse;
use App\Models\Queue;
use App\Services\Discord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Validation\ValidationException;

class NominatorController extends Controller
{
    public function submitMultipleResponse(Request $request) {
        $request->validate([
            'queue_id' => 'required',
            'user_id' => 'required',
            'query' => 'sometimes',
            'genre' => 'sometimes',
            'language' => 'sometimes',
        ]);

        $queue = Queue::findOrFail($request['queue_id']);
        $nominator_id = $request->get('user_id');

        $query = $queue->beatmaps()
            ->with('queue')
            ->orderByDesc('created_at')
            ->where('status', 'PENDING')
            ->when($request->filled('query'), function ($q) use ($request) {
                $terms = preg_split('/\s+/', trim($request->query('query')));
                $q->where(function ($sub) use ($terms) {
                    foreach ($terms as $term) {
                        $sub->where(function ($x) use ($term) {
                            $x->where('title', 'like', "%{$term}%")
                            ->orWhere('artist', 'like', "%{$term}%")
                            ->orWhere('creator', 'like', "%{$term}%");
                        });
                    }
                });
            })
            ->when($request->filled('genre') && $request->genre !== 'Any',
                fn($q) => $q->where('genre', $request->genre))
            ->when($request->filled('language') && $request->language !== 'Any',
                fn($q) => $q->where('language', $request->language));


        $beatmaps = $query->get();

        foreach ($beatmaps as $beatmap) {
            $response = new NominatorResponse();
            $response->request_id = $beatmap->id;
            $response->nominator_id = $nominator_id;
            $response->status = 'UNINTERESTED';
            $response->save();

            try {
                Discord::sendResponseUpdate($response, $queue->discord_webhook);
            } catch (ValidationException $e) {}

            $beatmap->updateStatus(false);
        }

        return redirect()->back()->with('success', 'Responses updated for all filtered beatmaps.');
    }


    public function submitRanked(Request $request) {
        $request->validate([
            'beatmap_id' => 'required'
        ]);

        $nominator_id = $request->has('nominator_id') ? $request->get('nominator_id') : auth()->user()->id;
        $beatmap = Beatmap::findOrFail($request->get('beatmap_id'));

        if (!$beatmap->queue->members()->where('user_id', $nominator_id)->exists()) {
            abort(403);
        }

        $beatmap->updateRanked();

        try {
            Discord::sendRankedNotification($beatmap, $beatmap->queue->discord_webhook);
        } catch (\Exception $e) {

        }

        return redirect()->back();
    }


    public function clearQueue(Request $request) {
        $request->validate([
            'queue_id' => 'required',
            'filters' => 'required'
        ]);

        $nominator_id = $request->has('nominator_id') ? $request->get('nominator_id') : auth()->user()->id;
        $beatmap = Beatmap::findOrFail($request->get('beatmap_id'));

        if (!$beatmap->queue->members()->where('user_id', $nominator_id)->exists()) {
            abort(403);
        }

        $beatmap->updateRanked();

        redirect()->back();
    }

    public function submitResponse(Request $request) {
        $request->validate([
            'beatmap_id' => 'required',
            'comment' => 'sometimes',
            'status' => 'required',
        ]);

        $nominator_id = $request->has('nominator_id') ? $request->get('nominator_id') : auth()->user()->id;
        $beatmap = Beatmap::findOrFail($request->get('beatmap_id'));

        if (!$beatmap->queue->members()->where('user_id', $nominator_id)->exists()) {
            abort(403);
        }

        $response = NominatorResponse::where('nominator_id', $nominator_id)->where('request_id', $request->get('beatmap_id'))->first();

        if ($request->status === 'REMOVE_MY_RESPONSE' && $response !== null) {
            $response->delete();
            $beatmap->updateStatus();
            return response()->json(['message' => 'Your response has been removed']);
        }

        if ($response !== null) {
            $response->status = $request->get('status');
            $response->comment = $request->get('comment');
        } else {
            $response = new NominatorResponse();
            $response->request_id = $request->get('beatmap_id');
            $response->nominator_id = $nominator_id;
            $response->comment = $request->get('comment');
            $response->status = $request->get('status');
        }

        $response->save();
        $beatmap->updateStatus();


        try {
            Discord::sendResponseUpdate($response, $beatmap->queue->discord_webhook);
        } catch (ValidationException $e) {

        }

        if ($request->get('status') === 'ACCEPTED') {
            $username = str_replace(' ', '_', $beatmap->creator);
            $beatmap_title = str_replace("'", "\'", "{$beatmap->beatmapset_id} {$beatmap->artist} - {$beatmap->title}");
            Artisan::call("irc:send '{$username}' 'Hello! I am here to tell you that {$response->nominator->username} has accepted your [https://osu.ppy.sh/beatmapsets/{$beatmap_title}] beatmap on [https://nomination.shmiklak.uz NomiNation website] in {$beatmap->queue->name}. You can contact this nominator for details. Please note, this is an automated message.'" );
        }

        return redirect()->back();
    }
}
