<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ADEGarage Classroom CTF</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #10131a; color: #edf2f7; font: 16px/1.5 system-ui, sans-serif; }
    main { width: min(430px, calc(100% - 32px)); padding: 32px; border: 1px solid #394150; border-radius: 14px; background: #1b202b; box-shadow: 0 18px 45px #0008; }
    h1 { margin-top: 0; color: #ff9d38; } label, input { display: block; width: 100%; box-sizing: border-box; } label { margin-top: 16px; } input { margin-top: 6px; padding: 10px; border: 1px solid #556074; border-radius: 7px; background: #10131a; color: inherit; }
    button { margin-top: 22px; width: 100%; padding: 11px; border: 0; border-radius: 7px; background: #ff8c24; color: #16110a; font-weight: 700; cursor: pointer; } .notice { padding: 10px; border-radius: 7px; background: #283243; } .error { color: #ff9fa6; } code { color: #a8e6cf; }
  </style>
</head>
<body>
  <main>
    <!-- Migration note: legacy@adegarage.ctf imported the 1949 Honda Dream records. -->
    <p class="notice">Authorized classroom CTF target only. This is a fake account and never grants ADEGarage access.</p>
    <h1>Legacy Garage Login</h1>

    @if ($solved)
      <p>Challenge solved. Submit this flag:</p>
      <p><code>{{ $flag }}</code></p>
      <form method="POST" action="{{ route('ctf.legacy.logout') }}">@csrf<button type="submit">Reset challenge</button></form>
    @else
      @if ($errors->has('ctf_login'))<p class="error">{{ $errors->first('ctf_login') }}</p>@endif
      <form method="POST" action="{{ route('ctf.legacy.login') }}" autocomplete="off">
        @csrf
        <label>Email <input name="email" type="email" value="{{ old('email') }}" required></label>
        <label>Password <input name="password" type="password" required></label>
        <button type="submit">Access legacy records</button>
      </form>
    @endif
  </main>
</body>
</html>
