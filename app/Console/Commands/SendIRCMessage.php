<?php

namespace App\Console\Commands;

use App\Models\IRCNotification;
use App\Services\IRCService;
use Illuminate\Console\Command;

class SendIRCMessage extends Command
{
    protected $signature = 'irc:send {user} {message}';
    protected $description = 'Send a message to the IRC channel';

    protected $ircService;

    public function __construct()
    {
        parent::__construct();
        $config = config('irc');
        $this->ircService = new IRCService(
            $config['server'],
            $config['port'],
            $config['nickname'],
            $config['password']
        );
    }

    public function handle()
    {
        $user = $this->argument('user');
        $message = $this->argument('message');
        $this->ircService->sendMessageToUser($user, $message);
        IRCNotification::create([
            'username' => $user,
            'message' => $message,
        ]);
        $this->info('Message sent to IRC channel.');
    }
}
