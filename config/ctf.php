<?php

return [
    // This must be explicitly enabled in .env. Never enable it on a public or
    // production deployment.
    'enabled' => (bool) env('CTF_MODE', false),

    // These belong only to the isolated classroom challenge. They are not
    // ADEGarage or Supabase credentials.
    'legacy_email' => env('CTF_LEGACY_EMAIL', 'legacy@adegarage.ctf'),
    'legacy_password' => env('CTF_LEGACY_PASSWORD', 'honda-dream-1949'),
    'flag' => env('CTF_FLAG', 'CTF{legacy_auth_complete}'),
];
