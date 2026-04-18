<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Get cart identifier (user_id or session_id)
     */
    private function getCartIdentifier(Request $request)
    {
        if (Auth::check()) {
            return ['user_id' => Auth::id()];
        }
        
        return ['session_id' => $request->session()->get('cart_session_id')];
    }

    /**
     * Place an order from cart
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_phone' => 'required|string|max:20',
                'shipping_address' => 'required|string',
                'city' => 'required|string|max:100',
                'zip_code' => 'required|string|max:10',
                'payment_method' => 'required|string'
            ]);

            $identifier = $this->getCartIdentifier($request);
            
            // Get cart items
            $cartItems = Cart::where($identifier)
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty'
                ], 400);
            }

            // Calculate totals
            $subtotal = $cartItems->sum(function ($item) {
                return $item->quantity * $item->price;
            });
            $shippingCost = 150.00;
            $total = $subtotal + $shippingCost;

            // Start transaction
            DB::beginTransaction();

            try {
                // Create order
                $order = Order::create([
                    'order_number' => Order::generateOrderNumber(),
                    'user_id' => Auth::id(),
                    'session_id' => $request->session()->get('cart_session_id'),
                    'customer_name' => $request->customer_name,
                    'customer_email' => $request->customer_email,
                    'customer_phone' => $request->customer_phone,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->city,
                    'shipping_zip' => $request->zip_code,
                    'subtotal' => $subtotal,
                    'shipping_cost' => $shippingCost,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                    'status' => 'pending'
                ]);

                // Create order items
                foreach ($cartItems as $cartItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'product_name' => $cartItem->product->name,
                        'product_brand' => $cartItem->product->brand,
                        'product_category' => $cartItem->product->category,
                        'product_image' => $cartItem->product->image,
                        'quantity' => $cartItem->quantity,
                        'price' => $cartItem->price,
                        'subtotal' => $cartItem->quantity * $cartItem->price
                    ]);

                    // Update product stock
                    $product = Product::find($cartItem->product_id);
                    if ($product) {
                        $product->stock -= $cartItem->quantity;
                        $product->save();
                    }
                }

                // Clear cart after order
                Cart::where($identifier)->delete();

                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully',
                    'order' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'total' => $order->total,
                        'status' => $order->status
                    ]
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error placing order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own orders
     */
    public function myOrders(Request $request)
    {
        try {
            $userId = Auth::id();
            
            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please login to view orders'
                ], 401);
            }
            
            $orders = Order::where('user_id', $userId)
                ->with(['orderItems'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer_name' => $order->customer_name,
                        'total' => $order->total,
                        'status' => $order->status,
                        'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                        'items' => $order->orderItems->map(function ($item) {
                            return [
                                'product_name' => $item->product_name,
                                'product_brand' => $item->product_brand,
                                'product_image' => $item->product_image,
                                'quantity' => $item->quantity,
                                'price' => $item->price,
                            ];
                        })
                    ];
                });

            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all orders (for admin)
     */
    public function index(Request $request)
    {
        try {
            $orders = Order::with(['orderItems', 'user'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer_name' => $order->customer_name,
                        'customer_email' => $order->customer_email,
                        'customer_phone' => $order->customer_phone,
                        'shipping_address' => $order->shipping_address,
                        'city' => $order->shipping_city,
                        'zip_code' => $order->shipping_zip,
                        'subtotal' => $order->subtotal,
                        'shipping_cost' => $order->shipping_cost,
                        'total' => $order->total,
                        'payment_method' => $order->payment_method,
                        'status' => $order->status,
                        'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                        'items' => $order->orderItems->map(function ($item) {
                            return [
                                'product_name' => $item->product_name,
                                'product_brand' => $item->product_brand,
                                'product_category' => $item->product_category,
                                'product_image' => $item->product_image,
                                'quantity' => $item->quantity,
                                'price' => $item->price,
                                'subtotal' => $item->subtotal
                            ];
                        })
                    ];
                });

            return response()->json([
                'success' => true,
                'orders' => $orders
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching orders: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel order (user can cancel their own pending orders)
     */
    public function cancelOrder(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
            
            // Check if user owns this order
            if ($order->user_id !== Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            // Only allow cancelling pending orders
            if ($order->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending orders can be cancelled'
                ], 400);
            }
            
            $order->status = 'cancelled';
            $order->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error cancelling order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update order status (admin only)
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,processing,shipped,delivered,cancelled'
            ]);

            $order = Order::findOrFail($id);
            $order->status = $request->status;
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Order status updated',
                'order' => $order
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating order: ' . $e->getMessage()
            ], 500);
        }
    }
}
