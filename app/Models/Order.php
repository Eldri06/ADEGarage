<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'session_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_city',
        'shipping_zip',
        'subtotal',
        'shipping_cost',
        'total',
        'payment_method',
        'status'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items for the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number
     */
    public static function generateOrderNumber()
    {
        $year = date('Y');
        $random = str_pad(mt_rand(1, 9999), 4, '0', STR_PAD_LEFT);
        return "ADE-{$year}-{$random}";
    }
}
