<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>@yield('code') — ADE Garage</title>
<style>body{margin:0;display:grid;min-height:100vh;place-items:center;background:#07111f;color:#eef6ff;font:16px system-ui,sans-serif}.card{max-width:34rem;padding:3rem;text-align:center}.code{color:#1ee0ff;font-size:5rem;font-weight:800;margin:0}a{color:#1ee0ff}</style></head>
<body><main class="card"><p class="code">@yield('code')</p><h1>@yield('title')</h1><p>@yield('message')</p><a href="{{ url('/') }}">Return home</a></main></body></html>
