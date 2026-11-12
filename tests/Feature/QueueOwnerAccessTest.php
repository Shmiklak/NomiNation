<?php

namespace Tests\Feature;

use App\Models\Queue;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use PDO;
use Tests\TestCase;

class QueueOwnerAccessTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // The later beatmap migrations are MySQL-only, so only run the ones needed here.
        $this->artisan('migrate', ['--path' => [
            'database/migrations/0001_01_01_000000_create_users_table.php',
            'database/migrations/2025_06_20_085816_create_queues_table.php',
            'database/migrations/2025_06_20_124510_create_queue_user_table.php',
            'database/migrations/2025_06_20_185027_add_webhook_and_limits_to_queues_table.php',
        ]]);

        // Some production database drivers return every column as a string.
        DB::connection()->getPdo()->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, true);
        $this->withoutVite();
    }

    private function createUser(): User
    {
        return User::create([
            'osu_id' => fake()->unique()->randomNumber(6),
            'username' => fake()->unique()->userName(),
        ]);
    }

    private function createQueue(User $owner): Queue
    {
        $queue = Queue::create([
            'name' => 'Test queue',
            'status' => Queue::QUEUE_OPEN,
            'short_description' => 'Short',
            'description' => 'Description',
            'request_information' => 'Information',
            'type' => Queue::QUEUE_TYPE_PERSONAL,
            'not_interested_requirement' => 3,
            'user_id' => $owner->id,
        ]);

        $queue->members()->attach($owner->id, ['is_admin' => true, 'joined_at' => now()]);

        return $queue;
    }

    public function test_queue_owner_can_open_the_edit_page()
    {
        $owner = $this->createUser();
        $queue = $this->createQueue($owner);

        $this->actingAs($owner)->get(route('edit-queue', $queue->id))->assertOk();
    }

    public function test_other_users_cannot_open_the_edit_page()
    {
        $queue = $this->createQueue($this->createUser());

        $this->actingAs($this->createUser())->get(route('edit-queue', $queue->id))->assertForbidden();
    }

    public function test_queue_attributes_keep_their_types()
    {
        $owner = $this->createUser();
        $queue = Queue::with('members')->find($this->createQueue($owner)->id);

        $this->assertSame($owner->id, $queue->user_id);
        $this->assertSame(3, $queue->not_interested_requirement);
        $this->assertFalse($queue->is_bn_queue);
        $this->assertTrue($queue->members->first()->pivot->is_admin);
    }
}
