<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserSettingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $defaults = [
            'language' => 'en',
            'region' => 'us',
            'emailNotif' => true,
            'pushNotif' => false,
            'smsNotif' => true,
            'soundEffects' => true,
            'volume' => '75',
            'twoFA' => false,
            'profileVisibility' => 'public',
        ];

        $saved = $user->settings ?? [];
        $merged = array_merge($defaults, is_array($saved) ? $saved : []);

        return response()->json($merged);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $validated = $request->validate([
            'language' => ['sometimes', 'string', 'max:10'],
            'region' => ['sometimes', 'string', 'max:10'],
            'emailNotif' => ['sometimes', 'boolean'],
            'pushNotif' => ['sometimes', 'boolean'],
            'smsNotif' => ['sometimes', 'boolean'],
            'soundEffects' => ['sometimes', 'boolean'],
            'volume' => ['sometimes', 'integer', 'between:0,100'],
            'twoFA' => ['sometimes', 'boolean'],
            'profileVisibility' => ['sometimes', 'in:public,private'],
        ]);
        $allowed = [
            'language', 'region', 'emailNotif', 'pushNotif', 'smsNotif',
            'soundEffects', 'volume', 'twoFA', 'profileVisibility',
        ];

        $settings = $user->settings ?? [];
        if (!is_array($settings)) {
            $settings = [];
        }

        foreach ($allowed as $key) {
            if (array_key_exists($key, $validated)) {
                $settings[$key] = $validated[$key];
            }
        }

        $user->settings = $settings;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Settings saved successfully.']);
    }
}
