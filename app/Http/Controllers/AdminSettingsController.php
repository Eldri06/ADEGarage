<?php

namespace App\Http\Controllers;

use App\Models\AdminSetting;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    public function index()
    {
        $settings = AdminSetting::all()->mapWithKeys(function ($item) {
            $value = $item->value;
            if (is_array($value) && count($value) === 1 && isset($value[0]) && is_string($value[0])) {
                $decoded = json_decode($value[0], true);
                if (is_array($decoded)) {
                    return [$item->key => $decoded];
                }
            }
            return [$item->key => $value];
        });

        $defaults = [
            'store_info' => [
                'storeName' => 'ADE GARAGE',
                'storeEmail' => 'admin@adegarage.com',
                'storePhone' => '+63 912 345 6789',
                'storeAddress' => 'gedli lamang, Philippines',
                'storeLocation' => 'Cebu City, Philippines',
            ],
            'notification_settings' => [
                'emailNotif' => true,
                'orderNotif' => true,
                'stockNotif' => true,
                'customerNotif' => false,
            ],
            'business_hours' => [
                'openingTime' => '09:00',
                'closingTime' => '18:00',
                'weekendOpen' => true,
            ],
        ];

        $merged = [];
        foreach ($defaults as $key => $default) {
            $merged[$key] = array_merge($default, $settings[$key] ?? []);
        }

        return response()->json($merged);
    }

    public function update(Request $request)
    {
        $validSections = ['store_info', 'notification_settings', 'business_hours'];

        foreach ($validSections as $section) {
            if ($request->has($section)) {
                $data = $request->input($section);
                if (is_array($data)) {
                    AdminSetting::setValue($section, $data);
                }
            }
        }

        return response()->json(['success' => true, 'message' => 'Settings saved successfully.']);
    }
}
