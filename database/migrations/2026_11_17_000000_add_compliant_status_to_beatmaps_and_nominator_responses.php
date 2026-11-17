<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE nominator_responses MODIFY status ENUM('ACCEPTED', 'COMPLIANT', 'MODDED', 'RECHECKED', 'NOMINATED', 'INVALID', 'UNINTERESTED') DEFAULT 'ACCEPTED'");
        DB::statement("ALTER TABLE beatmaps MODIFY status ENUM('PENDING', 'INVALID', 'ACCEPTED', 'COMPLIANT', 'NOMINATED', 'HIDDEN', 'RANKED', 'MODDED') DEFAULT 'PENDING'");
    }

    public function down(): void
    {
        DB::table('nominator_responses')->where('status', 'COMPLIANT')->update(['status' => 'ACCEPTED']);
        DB::table('beatmaps')->where('status', 'COMPLIANT')->update(['status' => 'ACCEPTED']);

        DB::statement("ALTER TABLE nominator_responses MODIFY status ENUM('ACCEPTED', 'MODDED', 'RECHECKED', 'NOMINATED', 'INVALID', 'UNINTERESTED') DEFAULT 'ACCEPTED'");
        DB::statement("ALTER TABLE beatmaps MODIFY status ENUM('PENDING', 'INVALID', 'ACCEPTED', 'NOMINATED', 'HIDDEN', 'RANKED', 'MODDED') DEFAULT 'PENDING'");
    }
};
