<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Queue;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('user_id')->constrained('users');
            $table->text('short_description');
            $table->longText('description');
            $table->longText('request_information');
            $table->string('image')->nullable();
            $table->enum('status', [
                Queue::QUEUE_WAITING_FOR_APPROVAL,
                Queue::QUEUE_OPEN,
                Queue::QUEUE_CLOSED,
                Queue::QUEUE_HIDDEN,
            ])->default('waiting_for_approval');
            $table->enum('type', [
                Queue::QUEUE_TYPE_PERSONAL,
                Queue::QUEUE_TYPE_SUBDIVISION,
            ])->default(Queue::QUEUE_TYPE_SUBDIVISION);
            $table->integer('not_interested_requirement')->default(3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
