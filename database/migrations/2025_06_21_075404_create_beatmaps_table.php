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
        Schema::create('beatmaps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('queue_id')->index()->constrained('queues');
            $table->foreignId('request_author')->index()->constrained('users');
            $table->text('comment')->nullable();
            $table->foreignId('beatmapset_id')->index();
            $table->string('title');
            $table->string('artist');
            $table->string('creator');
            $table->string('cover')->nullable();
            $table->string('genre')->nullable();
            $table->string('language')->nullable();
            $table->float('bpm')->nullable();
            $table->enum('status', [
                'PENDING',
                'INVALID',
                'ACCEPTED',
                'NOMINATED',
                'HIDDEN'
            ])->default('PENDING');
            $table->boolean('is_ranked')->default(false);
            $table->timestamp('ranked_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beatmaps');
    }
};
