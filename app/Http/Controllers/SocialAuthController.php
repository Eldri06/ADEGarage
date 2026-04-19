<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;

class SocialAuthController extends Controller
{
    public function redirect()
    {
        $provider = 'google';
        return Socialite::driver($provider)
            ->with(['prompt' => 'select_account'])
            ->redirect();
    }

    public function callback()
    {
        $provider = 'google';

        $oauthUser = Socialite::driver($provider)->user();

        // 1) Find by provider_id
        $user = User::where('provider', $provider)
            ->where('provider_id', $oauthUser->getId())
            ->first();

        // 2) Link by email if exists
        if (!$user && $oauthUser->getEmail()) {
            $user = User::where('email', $oauthUser->getEmail())->first();
        }

        // 3) Create or update
        if (!$user) {
            $user = User::create([
                'username'       => $oauthUser->getNickname() ?: ($oauthUser->getName() ?: 'User'),
                'email'          => $oauthUser->getEmail(),
                'password'       => bcrypt(str()->random(32)), // random placeholder
                'profilepicture' => $oauthUser->getAvatar() ?: null,
                'provider'       => $provider,
                'provider_id'    => $oauthUser->getId(),
                'provider_token' => $oauthUser->token ?? null,
            ]);
        } else {
            $user->forceFill([
                'provider'       => $provider,
                'provider_id'    => $oauthUser->getId(),
                'provider_token' => $oauthUser->token ?? $user->provider_token,
                'profilepicture' => $user->profilepicture ?: $oauthUser->getAvatar(),
            ])->save();
        }

        Auth::login($user, true);
        return redirect()->route('customer_home');
    }
}