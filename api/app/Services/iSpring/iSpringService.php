<?php

namespace App\Services\iSpring;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class iSpringService extends ServiceProvider
{
    static function getToken()
    {

        $token = Http::withoutVerifying()
            ->asForm()
            ->withHeaders([
                'Accept' => '*/*'
            ])
            ->timeout(30)
            ->post(
                'https://api-learn.ispringlearn.com/api/v3/token',
                [
                    'client_id' => '0bc6d201-66de-11ef-8eab-723f2a388c99',
                    'client_secret' => 'x5SnWUwzrz-U41KrTmOk0xrW-iKi4x9RDfKTk-B6lds',
                    'grant_type' => 'client_credentials'
                ]
            );

        return $token;
    }
}
