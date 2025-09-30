<?php

use App\Http\Controllers\NominatorController;
use App\Http\Controllers\QueuesController;
use App\Http\Controllers\BeatmapsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dashboard', [QueuesController::class, 'index'])->name('dashboard');
Route::get('queue/{id}', [QueuesController::class, 'show'])->name('queue');
Route::get('queue/{id}/members', [QueuesController::class, 'members'])->name('queue.members');

Route::middleware(['auth'])->group(function () {
    Route::get('my-queues', [QueuesController::class, 'myQueues'])->name('my-queues');
//    Route::post('queue/{id}', [QueuesController::class, 'test'])->name('queue');


    Route::match(['get', 'post'], 'create-queue', [QueuesController::class, 'create'])->name('create-queue');
    Route::match(['get', 'post'], 'edit-queue/{id}', [QueuesController::class, 'edit'])->name('edit-queue');
    Route::match(['get', 'post'], 'manage-queue-members/{id}', [QueuesController::class, 'manageMembers'])->name('manage-queue-members');
    Route::post('remove-user-from-queue', [QueuesController::class, 'removeUserFromQueue'])->name('remove-user-from-queue');
    Route::post('add-user-to-queue', [QueuesController::class, 'addUserToQueue'])->name('add-user-to-queue');
    Route::post('update-user-membership', [QueuesController::class, 'updateUserMembership'])->name('update-user-membership');
    Route::get('search-user', [QueuesController::class, 'searchUser'])->name('search-user');

    Route::post('submit-request',[BeatmapsController::class, 'submitRequest'] )->name('submit-request');
    Route::post('submit-response', [NominatorController::class, 'submitResponse'] )->name('submit-response');
    Route::post('submit-multiple-response', [NominatorController::class, 'submitMultipleResponse'] )->name('submit-multiple-response');
    Route::post('submit-ranked', [NominatorController::class, 'submitRanked'] )->name('submit-ranked');
    Route::post('clear-queue', [NominatorController::class, 'clearQueue'] )->name('clear-queue');

    Route::get('my-requests', [BeatmapsController::class, 'my_requests'])->name('my-requests');
    Route::get('my-responses', [BeatmapsController::class, 'my_responses'])->name('my-responses');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
