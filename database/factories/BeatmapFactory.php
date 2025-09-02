<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Beatmap;
use App\Models\User;
use App\Models\Queue;

class BeatmapFactory extends Factory
{
    protected $model = Beatmap::class;

    public function definition(): array
    {
        $statuses = ['PENDING', 'INVALID', 'ACCEPTED', 'NOMINATED', 'HIDDEN'];

        return [
            'queue_id' => '1',
            'request_author' => '1',
            'comment' => $this->faker->optional()->sentence(),
            'beatmapset_id' => $this->faker->unique()->numberBetween(1000000, 3000000),
            'title' => $this->faker->sentence(3),
            'artist' => $this->faker->name(),
            'creator' => 'Maiev',
            'cover' => $this->faker->optional()->imageUrl(200, 200),
            'genre' => 'Rock',
            'language' => 'English',
            'bpm' => $this->faker->optional()->randomFloat(2, 60, 200),
            'status' => $this->faker->randomElement($statuses),
            'is_ranked' => 0,
            'ranked_at' => null,
        ];
    }
}
