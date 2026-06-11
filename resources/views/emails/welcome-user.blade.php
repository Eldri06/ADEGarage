<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Welcome to ADE Garage</title>
</head>
<body style="margin:0; padding:0; background:#0A0E12; color:#e7f3ff; font-family:Arial, sans-serif;">
    <div style="max-width:560px; margin:0 auto; padding:32px 24px;">
        <h1 style="color:#00F6FF; margin:0 0 16px;">Welcome to ADE Garage</h1>
        <p style="font-size:16px; line-height:1.5;">Hi {{ $user->username ?? $user->name ?? 'there' }},</p>
        <p style="font-size:16px; line-height:1.5;">
            Your account is verified and ready. You can now shop parts, manage orders, and use ADE Garage services.
        </p>
        <p style="font-size:14px; line-height:1.5; color:#9CA3AF;">
            Thanks for joining ADE Garage.
        </p>
    </div>
</body>
</html>
