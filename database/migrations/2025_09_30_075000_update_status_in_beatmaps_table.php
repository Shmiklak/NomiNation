<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE beatmaps MODIFY status ENUM('PENDING', 'INVALID', 'ACCEPTED', 'NOMINATED', 'HIDDEN', 'RANKED', 'MODDED') DEFAULT 'PENDING'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE beatmaps MODIFY status ENUM('PENDING', 'INVALID', 'ACCEPTED', 'NOMINATED', 'HIDDEN') DEFAULT 'PENDING'");
    }
};

