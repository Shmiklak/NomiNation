<?php

namespace App\Http\Controllers;

use App\Models\Beatmap;
use App\Models\Queue;
use App\Services\Discord;
use App\Services\OsuApi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BeatmapsController extends Controller
{
    public function submitRequest(Request $request) {
        $request->validate([
            'queue_id' => 'required',
            'beatmap_link' => 'required|url',
            'comments' => 'sometimes'
        ]);

        if (auth()->user()->isRestricted()) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'Your profile has been banned from using this website.'
            ]);
        }

        $queue = Queue::findOrFail($request->get('queue_id'));

        if ($queue->status != Queue::QUEUE_OPEN) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'The queue does not accept requests at the moment. Please try again later.'
            ]);
        }

        $request_timer = Carbon::now()->subMonth();

        $previous_request_count = Beatmap::where('request_author', auth()->user()->id)->where('queue_id', $queue->id)
            ->where('created_at', '>=', $request_timer)->count();

        if ($queue->reqs_per_user_per_month != null && $previous_request_count >= $queue->reqs_per_user_per_month) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'You have reached the limits of requests per month for this queue, please try again later. If you believe this is an error please contact Shmiklak.'
            ]);
        }

        $parsed_url = parse_url($request->get('beatmap_link'));
        $beatmap_id = explode('/', $parsed_url['path'])[2];

        if (Beatmap::where('beatmapset_id', $beatmap_id)->where('queue_id', $queue->id)->exists()) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'This beatmap has already been requested before to this queue. If you believe this is an error please contact Shmiklak.'
            ]);
        }

        try {
            $beatmap_data = (new OsuApi())->getBeatmapset($beatmap_id);
        } catch (ClientException $exception) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'Could not find the beatmap. If you believe this is an error please contact Shmiklak.'
            ]);
        }

        $beatmap = Beatmap::create([
            'request_author' => auth()->user()->id,
            'queue_id' => $queue->id,
            'comment' => $request->get('comments'),
            'beatmapset_id' => $beatmap_id,
            'title' => $beatmap_data["title"],
            'artist' => $beatmap_data["artist"],
            'creator' => $beatmap_data["creator"],
            'cover' => $beatmap_data["covers"]["list@2x"],
            'genre' => $beatmap_data["genre"]["name"],
            'language' => $beatmap_data["language"]["name"],
            'bpm' => $beatmap_data['bpm']
        ]);

        Discord::sendNewRequest($beatmap);

        if ($queue->autoclose_amount != null) {
            $number_of_requests = Beatmap::where('queue_id', $queue->id)->where('created_at', '>=', $queue->updated_at)->count();
            if ($number_of_requests >= $queue->autoclose_amount) {
                $queue->status = Queue::QUEUE_CLOSED;
                $queue->save();
                Discord::sendQueueClosed($queue);
            }
        }

        return redirect()->route('queue', $queue->id)->with(['message' => 'Your request has been submitted.']);
    }

    public function update_request(Request $request) {
        $this->validate($request, [
            'request_id' => 'required',
            'comments' => 'sometimes'
        ]);

        if (auth()->user()->isRestricted()) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'Your profile has been banned from using this website.'
            ]);
        }

        $beatmap = Beatmap::find($request->get('request_id'));

        if (auth()->user()->id !== $beatmap->request_author) {
            throw ValidationException::withMessages([
                'beatmap_link' => 'You can only edit your own requests.'
            ]);
        }

        $beatmap->comment = $request->get('comments');
        $beatmap->save();

        return redirect()->back();
    }

    public function my_requests() {
        $user = auth()->user();
        $beatmaps = $user->beatmaps()->orderBy('created_at', 'desc')->with('responses')->with('responses.nominator')->paginate(16)->withQueryString();
        return Inertia::render('my_requests', [
            'beatmaps' => $beatmaps
        ]);
    }

    public function my_responses() {
        $user = auth()->user();
        $user->is_admin = true;

        $beatmaps = Beatmap::whereHas('responses', function($q) use ($user) {
            $q->where('nominator_id', $user->id);
        })->orderBy('created_at', 'desc')->with('responses')->with('responses.nominator')->paginate(16)->withQueryString();

        return Inertia::render('my_responses', [
            'beatmaps' => $beatmaps,
            'members' => [$user]
        ]);
    }
}
