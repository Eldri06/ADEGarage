<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Legacy Garage Console — Classroom CTF</title>
  <style>
    body { margin: 0; min-height: 100vh; background: #10131a; color: #edf2f7; font: 16px/1.5 system-ui, sans-serif; }
    header { padding: 18px 28px; background: #1b202b; border-bottom: 1px solid #394150; display: flex; justify-content: space-between; align-items: center; } main { max-width: 1024px; margin: 32px auto; padding: 0 20px; } h1 { color: #ff9d38; } .notice, .card { border: 1px solid #394150; border-radius: 12px; background: #1b202b; padding: 20px; } .notice { border-color: #ff9d38; } .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0; } .metric { color: #9fe7ff; font-size: 1.8rem; font-weight: 700; } code { color: #a8e6cf; font-size: 1.1rem; } button { padding: 9px 13px; border: 0; border-radius: 6px; background: #ff8c24; font-weight: 700; cursor: pointer; }
  </style>
</head>
<body>
  <header><strong>LEGACY GARAGE CONSOLE</strong><span>Classroom simulation</span></header>
  <main>
    <div class="notice"><strong>CTF complete.</strong> This is a fictional dashboard for the authorized classroom exercise. It is not ADEGarage’s real admin panel and cannot access real data.</div>
    <h1>Legacy Operations Overview</h1>
    <div class="grid">
      <section class="card"><div class="metric">12</div><span>Demo work orders</span></section>
      <section class="card"><div class="metric">₱42,800</div><span>Simulated monthly revenue</span></section>
      <section class="card"><div class="metric">3</div><span>Legacy inventory alerts</span></section>
    </div>
    <section class="card"><h2>Capture the flag</h2><p>Submit this flag to your instructor:</p><code>{{ $flag }}</code></section>
    <form method="POST" action="{{ route('ctf.legacy.logout') }}">@csrf<button type="submit">Reset challenge</button></form>
  </main>
</body>
</html>
