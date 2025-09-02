<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Beatmap;

class BeatmapSeeder extends Seeder
{
    public function run(): void
    {
        Beatmap::factory()->count(100)->create();
    }
}
