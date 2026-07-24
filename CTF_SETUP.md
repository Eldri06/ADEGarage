# Classroom CTF: legacy login

This is an intentionally vulnerable-looking, isolated classroom exercise. It does not use Supabase, the `users` table, Laravel's `Auth` guard, or any real account.

## Enable only for the activity

Add these values to `.env` on the classroom machine:

```dotenv
CTF_MODE=true
CTF_LEGACY_EMAIL=legacy@adegarage.ctf
CTF_LEGACY_PASSWORD=honda-dream-1949
CTF_FLAG=CTF{legacy_auth_complete}
```

Then clear Laravel's cached configuration and open `/ctf/legacy-login`. After class, set `CTF_MODE=false` (or remove the CTF variables) and clear configuration cache again.

## Player-facing rules

Only test the `/ctf/legacy-login` page and only during the authorized class activity. The source contains a migration clue; it leads to the fake legacy account. The successful login only sets a `classroom_ctf` session key, so it cannot log anyone into ADEGarage.
