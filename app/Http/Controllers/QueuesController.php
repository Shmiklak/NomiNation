<?php

namespace App\Http\Controllers;

use App\Models\Queue;
use App\Models\User;
use App\Services\Discord;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class QueuesController extends Controller
{
    public function index() {
        return Inertia::render('dashboard', [
            'queues' => Queue::whereIn('status', [Queue::QUEUE_OPEN, Queue::QUEUE_CLOSED])
                ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
                ->orderBy('status', 'asc')
                ->orderByRaw('CASE WHEN type = "subdivision" THEN 0 ELSE 1 END')
                ->orderByRaw('CASE WHEN is_bn_queue = 1 THEN 0 ELSE 1 END')
                ->orderBy('name', 'asc')
                ->with('user')->get()
        ]);
    }

    public function myQueues() {
        $user_id = request()->user()->id;

        return Inertia::render('my_queues', [
            'queues' => Queue::whereHas('members', function ($query) use ($user_id) {
                $query->where('user_id', $user_id);
            })->orderBy('status', 'asc')->orderBy('name', 'asc')->with('user')->get()
        ]);
    }

    public function create(Request $request) {
        if ($request->isMethod('get')) {
            return Inertia::render('queues/create');
        }

        $request->validate([
            'name' => 'required',
            'short_description' => 'required',
            'description' => 'required',
            'request_information' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'type' => 'required',
            'not_interested_requirement' => 'required|integer'
        ]);

        $queue = Queue::create([
           'name' => $request->get('name'),
           'short_description' => $request->get('short_description'),
           'description' => $request->get('description'),
           'request_information' => $request->get('request_information'),
           'type' => $request->get('type'),
           'not_interested_requirement' => $request->get('not_interested_requirement'),
            'user_id' => $request->user()->id,
            'discord_webhook' => $request->get('discord_webhook'),
            'autoclose_amount' => $request->get('autoclose_amount'),
            'reqs_per_user_per_month' => $request->get('reqs_per_user_per_month')
        ]);

        if (!is_null($request->file('image'))) {
            $path = $request->file('image')->store('queues', 'public');
            $queue->image = "/storage/" . $path;
        }

        $queue->save();

        $queue->members()->attach($request->user()->id, [
            'is_admin' => true,
            'joined_at' => now()
        ]);

        return redirect()->route('queue', $queue->id)->with('message', 'Queue has been sent for approval. 
        Please contact Shmiklak if you want to speed this up.');
    }

    public function edit(Request $request, $id) {
        $queue = Queue::findOrFail($id);

        if ($request->user()->id !== $queue->user_id) {
            abort(403);
        }

        if ($request->isMethod('get')) {
            return Inertia::render('queues/edit', [
                'queue' => $queue
            ]);
        }

        $request->validate([
            'name' => 'required',
            'short_description' => 'required',
            'description' => 'required',
            'request_information' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'type' => 'required',
            'not_interested_requirement' => 'required|integer'
        ]);

        $queue->update([
            'name' => $request->get('name'),
            'short_description' => $request->get('short_description'),
            'description' => $request->get('description'),
            'request_information' => $request->get('request_information'),
            'type' => $request->get('type'),
            'not_interested_requirement' => $request->get('not_interested_requirement'),
            'status' => $request->get('status'),
            'discord_webhook' => $request->get('discord_webhook'),
            'autoclose_amount' => $request->get('autoclose_amount'),
            'reqs_per_user_per_month' => $request->get('reqs_per_user_per_month')
        ]);

        if (!is_null($request->file('image'))) {
            $path = $request->file('image')->store('queues', 'public');
            $queue->image = "/storage/" . $path;
        }

        $queue->save();

        if ($queue->status == Queue::QUEUE_OPEN) {
            Discord::sendQueueOpen($queue);
        } else if ($queue->status == Queue::QUEUE_CLOSED) {
            Discord::sendQueueClosed($queue);
        }

        return redirect()->route('queue', $queue->id)->with('message', 'Queue has been updated.');
    }

    public function show(Request $request, $id)
    {
        $queue = Queue::with('user')->with('members')->findOrFail($id);

        $isMember = auth()->check() && $queue->members()->where('user_id', auth()->id())->exists();

        if (($queue->status == Queue::QUEUE_HIDDEN || $queue->status == Queue::QUEUE_WAITING_FOR_APPROVAL)
            && !$isMember) {
            abort(404);
        }

        $query = $queue->beatmaps()
            ->where('is_ranked', false)
            ->orderBy('created_at', 'desc')
            ->with('responses')
            ->with('responses.nominator');

        if ($request->filled('status') && $request->input('status') !== 'Any') {
            $query->where('status', $request->input('status'));
        } else {
            if (auth()->check()) {
                $query->whereNotIn('status', ['INVALID', 'HIDDEN'])
                    ->whereDoesntHave('responses', function ($q) {
                        $q->where('nominator_id', auth()->id())
                            ->where('status', 'UNINTERESTED');
                    });
            } else {
                $query->whereNotIn('status', ['INVALID', 'HIDDEN']);
            }
        }

        $filters = ['genre', 'language'];
        foreach ($filters as $field) {
            if ($request->filled($field) && $request->input($field) !== 'Any') {
                $query->where($field, $request->input($field));
            }
        }

        if ($request->filled('query')) {
            $searchTerms = preg_split('/\s+/', trim($request->input('query')));
            $query->where(function ($subQuery) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $subQuery->where(function ($q) use ($term) {
                        $q->where('title', 'like', "%{$term}%")
                            ->orWhere('artist', 'like', "%{$term}%")
                            ->orWhere('creator', 'like', "%{$term}%");
                    });
                }
            });
        }

        $beatmaps = $query->paginate(16)->withQueryString();

        return Inertia::render('queues/show', [
            'queue' => $queue,
            'beatmaps' => $beatmaps
        ]);
    }


    public function manageMembers(Request $request, $id) {
        $queue = Queue::findOrFail($id);

        if ($request->user()->id !== $queue->user_id) {
            abort(403);
        }

        if ($request->isMethod('get')) {
            return Inertia::render('queues/manage-members', [
                'queue' => $queue,
                'members' => $queue->members()->get()
            ]);
        }
    }

    public function removeUserFromQueue(Request $request) {
        $queue = Queue::findOrFail($request->get('queue_id'));

        if ($request->user()->id !== $queue->user_id) {
            abort(403);
        }

        if ($request->get('user_id') == $queue->user_id) {
            throw ValidationException::withMessages(['user_id' => 'You cannot delete yourself.']);
        }

        $queue->members()->detach($request->get('user_id'));

        return redirect()->route('manage-queue-members', $queue->id)->with('message', 'Queue member has been removed.');
    }

    public function addUserToQueue(Request $request) {
        $queue = Queue::findOrFail($request->get('queue_id'));

        if ($request->user()->id !== $queue->user_id) {
            abort(403);
        }

        $queue->members()->attach($request->get('user_id'), [
            'is_admin' => false,
            'joined_at' => now()
        ]);

        return response()->json(['message' => 'Queue member has been added.']);
    }

    public function updateUserMembership(Request $request) {
        $queue = Queue::findOrFail($request->get('queue_id'));

        if ($request->user()->id !== $queue->user_id) {
            abort(403);
        }

        if ($request->get('user_id') == $queue->user_id) {
            throw ValidationException::withMessages(['user_id' => 'You cannot change your own membership level.']);
        }

        $current = $queue->members()->where('user_id', $request->get('user_id'))->first()?->pivot->is_admin ?? false;

        $queue->members()->updateExistingPivot($request->get('user_id'), [
            'is_admin' => !$current,
        ]);

        return redirect()->route('manage-queue-members', $queue->id)->with('message', 'Queue member has been removed.');
    }

    public function searchUser(Request $request) {
        $users = User::where('username', 'like', '%' . $request->get('query') . '%')->orWhere('osu_id', 'like', '%' . $request->get('query') . '%')->get();

        return response()->json($users);
    }

    public function members($id) {
        $queue = Queue::findOrFail($id);

        return Inertia::render('queues/view-members', [
            'queue' => $queue,
            'members' => $queue->members()->orderBy('username', 'asc')->get()
        ]);
    }
}
