<?php

namespace App\Services;

use Atakde\DiscordWebhook\DiscordWebhook;
use Atakde\DiscordWebhook\Message\MessageFactory;

class Discord {
    public static function sendNewRequest($beatmap) {
//        if (!config('app.debug')) {
            $messageFactory = new MessageFactory();
            $embedMessage = $messageFactory->create('embed');
            $embedMessage->setTitle($beatmap->artist . " - " . $beatmap->title . " (mapped by " . $beatmap->creator . ")");
            $embedMessage->setDescription($beatmap->author->username . " has requested this beatmap in " . $beatmap->queue->name);
            $embedMessage->setUrl("https://osu.ppy.sh/beatmapsets/" . $beatmap->beatmapset_id);
            $embedMessage->setColor(0xFFFFFF);
            $embedMessage->setThumbnailUrl("https://assets.ppy.sh/beatmaps/" . $beatmap->beatmapset_id . "/covers/list.jpg");
            $embedMessage->setAuthorName($beatmap->author->username);
            $embedMessage->setAuthorUrl("https://osu.ppy.sh/users/" . $beatmap->author->osu_id);
            $embedMessage->setAuthorIcon("https://a.ppy.sh/" . $beatmap->author->osu_id);


            $webhook = new DiscordWebhook($embedMessage);
            $webhook->setWebhookUrl(config('discord.default_webhook_url'));
            $webhook->send();
//        }
    }

    public static function sendQueueClosed($queue) {
        //        if (!config('app.debug')) {
        $messageFactory = new MessageFactory();
        $embedMessage = $messageFactory->create('embed');
        $embedMessage->setTitle($queue->name . " is now closed!");
        $embedMessage->setDescription($queue->name . " is not accepting new requests.");
        $embedMessage->setUrl(route('queue', $queue->id));
        $embedMessage->setColor(0xFF0000);
        $embedMessage->setThumbnailUrl(config('app.url') . $queue->image);

        $webhook = new DiscordWebhook($embedMessage);
        $webhook->setWebhookUrl(config('discord.default_webhook_url'));
        $webhook->send();
//        }
    }

    public static function sendQueueOpen($queue) {
        //        if (!config('app.debug')) {
        $messageFactory = new MessageFactory();
        $embedMessage = $messageFactory->create('embed');
        $embedMessage->setTitle($queue->name . " is now open!");
        $embedMessage->setDescription($queue->name . " is accepting new requests.");
        $embedMessage->setUrl(route('queue', $queue->id));
        $embedMessage->setColor(0x71EB34);
        $embedMessage->setThumbnailUrl(config('app.url') . $queue->image);

        $webhook = new DiscordWebhook($embedMessage);
        $webhook->setWebhookUrl(config('discord.default_webhook_url'));
        $webhook->send();
//        }
    }

    public static function sendResponseUpdate($response, $additional_webhook = null) {
        //        if (!config('app.debug')) {
        $messageFactory = new MessageFactory();
        $embedMessage = $messageFactory->create('embed');
        $embedMessage->setTitle($response->request->artist . " - " . $response->request->title . " (mapped by " . $response->request->creator . ")");
        $embedMessage->setDescription($response->nominator->username . " has marked this beatmap as " . $response->status . " in " . $response->request->queue->name);
        $embedMessage->setUrl("https://osu.ppy.sh/beatmapsets/" . $response->request->beatmapset_id);
        $embedMessage->setColor($response->matchingColor());
        $embedMessage->setThumbnailUrl("https://assets.ppy.sh/beatmaps/" . $response->request->beatmapset_id . "/covers/list.jpg");
        $embedMessage->setAuthorName($response->nominator->username);
        $embedMessage->setAuthorUrl("https://osu.ppy.sh/users/" . $response->nominator->osu_id);
        $embedMessage->setAuthorIcon("https://a.ppy.sh/" . $response->nominator->osu_id);


        $webhook = new DiscordWebhook($embedMessage);
        $webhook->setWebhookUrl(config('discord.default_webhook_url'));
        $webhook->send();

        if (!is_null($additional_webhook)) {
            $messageFactory = new MessageFactory();
            $embedMessage = $messageFactory->create('embed');
            $embedMessage->setTitle($response->request->artist . " - " . $response->request->title . " (mapped by " . $response->request->creator . ")");
            $embedMessage->setDescription($response->nominator->username . " has marked this beatmap as " . $response->status . " in " . $response->request->queue->name);
            $embedMessage->setUrl("https://osu.ppy.sh/beatmapsets/" . $response->request->beatmapset_id);
            $embedMessage->setColor($response->matchingColor());
            $embedMessage->setThumbnailUrl("https://assets.ppy.sh/beatmaps/" . $response->request->beatmapset_id . "/covers/list.jpg");
            $embedMessage->setAuthorName($response->nominator->username);
            $embedMessage->setAuthorUrl("https://osu.ppy.sh/users/" . $response->nominator->osu_id);
            $embedMessage->setAuthorIcon("https://a.ppy.sh/" . $response->nominator->osu_id);


            $webhook = new DiscordWebhook($embedMessage);
            $webhook->setWebhookUrl($additional_webhook);
            $webhook->send();
        }
//        }
    }

    public static function sendRankedNotification($beatmap, $additional_webhook = null) {
        $messageFactory = new MessageFactory();
        $embedMessage = $messageFactory->create('embed');

        $embedMessage->setTitle($beatmap->artist . " - " . $beatmap->title . " (mapped by " . $beatmap->creator . ")");
        $embedMessage->setDescription("This beatmap has been marked as **RANKED** in " . $beatmap->queue->name);
        $embedMessage->setUrl("https://osu.ppy.sh/beatmapsets/" . $beatmap->beatmapset_id);
        $embedMessage->setColor(0xE610E5);

        $embedMessage->setThumbnailUrl("https://assets.ppy.sh/beatmaps/" . $beatmap->beatmapset_id . "/covers/list.jpg");
        $embedMessage->setAuthorName($beatmap->creator);
        $embedMessage->setAuthorUrl("https://osu.ppy.sh/users/" . $beatmap->author->osu_id);
        $embedMessage->setAuthorIcon("https://a.ppy.sh/" . $beatmap->author->osu_id);

        $webhook = new DiscordWebhook($embedMessage);
        $webhook->setWebhookUrl(config('discord.default_webhook_url'));
        $webhook->send();

        if (!is_null($additional_webhook)) {
            $webhook = new DiscordWebhook($embedMessage);
            $webhook->setWebhookUrl($additional_webhook);
            $webhook->send();
        }
    }

    public static function sendQueueCleared($queue) {
        //        if (!config('app.debug')) {
        $messageFactory = new MessageFactory();
        $embedMessage = $messageFactory->create('embed');
        $embedMessage->setTitle($queue->name . " has been cleared!");
        $embedMessage->setDescription("All pending requests have been hidden.");
        $embedMessage->setUrl(route('queue', $queue->id));
        $embedMessage->setColor(0x71EB34);
        $embedMessage->setThumbnailUrl(config('app.url') . $queue->image);

        $webhook = new DiscordWebhook($embedMessage);
        $webhook->setWebhookUrl(config('discord.default_webhook_url'));
        $webhook->send();
//        }
    }

}
