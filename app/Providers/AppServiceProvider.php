<?php

namespace App\Providers;

use App\oAuth\OsuProvider;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->bootOsuSocialite();

        Authenticate::redirectUsing(function ($request) {
            return route('home');
        });
    }

    private function bootOsuSocialite() {
        $socialite = $this->app->make('Laravel\Socialite\Contracts\Factory');
        $socialite->extend('osu', function($app) use ($socialite) {
            $config = $app['config']['services.osu'];
            return $socialite->buildProvider(OsuProvider::class, $config);
        });
    }
}
