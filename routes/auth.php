<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\oAuth\OsuAuthController;
use Illuminate\Support\Facades\Route;

Route::get('osu_auth', [OsuAuthController::class, 'redirectToProvider'])->name('osu_login');
Route::get('osu_login', [OsuAuthController::class, 'handleProviderCallback']);
Route::post('logout', [OsuAuthController::class, 'handleLogout'])->name('logout');