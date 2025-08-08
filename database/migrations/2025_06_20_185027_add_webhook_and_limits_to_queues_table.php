<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('queues', function (Blueprint $table) {
            $table->string('discord_webhook')->nullable();
            $table->integer('autoclose_amount')->nullable();
            $table->integer('reqs_per_user_per_month')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('queues', function (Blueprint $table) {
            $table->dropColumn([
                'discord_webhook',
                'autoclose_amount',
                'reqs_per_user_per_month',
            ]);
        });
    }
};
