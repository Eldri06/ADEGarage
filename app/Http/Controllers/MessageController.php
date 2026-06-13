<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'sender_name' => $data['name'] ?? (Auth::user()->username ?? null),
            'sender_email' => strtolower($data['email']),
            'body' => $data['message'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully.',
            'data' => $this->formatMessage($message),
        ], 201);
    }

    public function index()
    {
        $messages = Message::whereNull('parent_id')
            ->latest()
            ->limit(100)
            ->get()
            ->map(fn (Message $message) => $this->formatMessage($message));

        return response()->json([
            'success' => true,
            'messages' => $messages,
        ]);
    }

    public function thread(Message $message)
    {
        $thread = collect([$message])
            ->concat(Message::where('parent_id', $message->id)->get())
            ->sortBy('created_at')
            ->map(fn (Message $m) => $this->formatMessage($m));

        return response()->json([
            'success' => true,
            'messages' => $thread->values(),
        ]);
    }

    public function markRead(Message $message)
    {
        if (!$message->read_at) {
            $message->forceFill(['read_at' => now()])->save();
        }

        return response()->json(['success' => true]);
    }

    public function reply(Request $request, Message $message)
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $reply = Message::create([
            'parent_id' => $message->id,
            'sender_id' => Auth::id(),
            'receiver_id' => $message->sender_id,
            'sender_name' => Auth::user()->username ?? 'Admin',
            'sender_email' => Auth::user()->email ?? null,
            'body' => $data['message'],
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reply saved successfully.',
            'data' => $this->formatMessage($reply),
        ], 201);
    }

    private function formatMessage(Message $message): array
    {
        return [
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'receiver_id' => $message->receiver_id,
            'sender_name' => $message->sender_name ?: 'Customer',
            'sender_email' => $message->sender_email,
            'body' => $message->body,
            'read' => (bool) $message->read_at,
            'created_at' => optional($message->created_at)->toIso8601String(),
        ];
    }
}
