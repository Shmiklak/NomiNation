<?php

namespace App\Services;

use GuzzleHttp\Client as GClient;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Session;

class OsuApi {
    private $baseUrl;
    private $client;
    public function __construct() {
        $this->baseUrl = "https://osu.ppy.sh/api/v2/";
        $this->client = new GClient();
    }

    private function get($url, $data = []) {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . Session::get('osu_access_token'),
            'Accept-Language' => 'en'
        ];

        try {
            $res = $this->client->request('GET', $this->baseUrl. $url, [
                'headers' => $headers
            ]);
        } catch (GuzzleException $e) {
            if ($e->getCode() == 401) {
                $this->refreshToken();
                $this->get($url, $data);
            }
        }

        try {
            $response = json_decode($res->getBody()->getContents(), true);
        } catch (\Exception $e) {
            dd('Your token may have expired. Try logging in again.');
        }

        return $response;
    }

    private function delete($url, $data = []) {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . Session::get('osu_access_token'),
            'Accept-Language' => 'en'
        ];

        $res = $this->client->request('DELETE', $this->baseUrl . $url, [
            'headers' => $headers
        ]);

        $response = json_decode($res->getBody()->getContents());

        return $response;
    }

    public function refreshToken() {
        $headers = [
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Accept' => 'application/json'
        ];

        try {
            $res = $this->client->request('POST', 'https://osu.ppy.sh/oauth/token', [
                'headers' => $headers,
                'form_params' => [
                    'client_id' => config('services.osu.client_id'),
                    'client_secret' => config('services.osu.client_secret'),
                    'grant_type' => 'client_credentials',
                    'refresh_token' => Session::get('osu_refresh_token'),
                ]
            ]);
        } catch (GuzzleException $e) {
            dd('Something went wrong! Please let Shmiklak know.', $e->getMessage());
        }

        $response = json_decode($res->getBody()->getContents());
        Session::put('osu_access_token', $response->access_token);
        Session::put('osu_refresh_token', $response->refresh_token);

        return $response;
    }

    public function revokeToken() {
        $this->delete('oauth/tokens/current');
    }

    public function getBeatmapset($beatmapset_id) {
        return $this->get('beatmapsets/'.$beatmapset_id);
    }
}
