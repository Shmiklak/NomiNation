<?php

namespace Database\Seeders;

use App\Models\Beatmap;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Beatmap::factory()->count(50)->create();
    }
}
