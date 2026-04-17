<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get cart identifier (user_id or session_id)
     */
    private function getCartIdentifier(Request $request)
    {
        if (Auth::check()) {
            return ['user_id' => Auth::id()];
        }
        
        // For guest users, use session
        if (!$request->session()->has('cart_session_id')) {
            $request->session()->put('cart_session_id', uniqid('cart_', true));
        }
        
        return ['session_id' => $request->session()->get('cart_session_id')];
    }

    /**
     * Get all cart items
     */
    public function index(Request $request)
    {
        $identifier = $this->getCartIdentifier($request);
        
        $cartItems = Cart::where($identifier)
            ->with('product')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'product_image' => $item->product->image,
                    'product_brand' => $item->product->brand,
                    'product_category' => $item->product->category,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->quantity * $item->price,
                    'stock' => $item->product->stock
                ];
            });

        $total = $cartItems->sum('subtotal');

        return response()->json([
            'success' => true,
            'cart_items' => $cartItems,
            'total' => $total,
            'count' => $cartItems->sum('quantity')
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1'
            ]);

            $product = Product::findOrFail($request->product_id);

            // Check stock availability
            if ($product->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available'
                ], 400);
            }

            $identifier = $this->getCartIdentifier($request);

            // Check if product already in cart
            $cartItem = Cart::where($identifier)
                ->where('product_id', $request->product_id)
                ->first();

            if ($cartItem) {
                // Update quantity
                $newQuantity = $cartItem->quantity + $request->quantity;
                
                if ($product->stock < $newQuantity) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Not enough stock available'
                    ], 400);
                }

                $cartItem->quantity = $newQuantity;
                $cartItem->save();
            } else {
                // Create new cart item
                $cartItem = Cart::create(array_merge($identifier, [
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity,
                    'price' => $product->price
                ]));
            }

            return response()->json([
                'success' => true,
                'message' => 'Product added to cart',
                'cart_item' => $cartItem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error adding to cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $identifier = $this->getCartIdentifier($request);
            $cartItem = Cart::where($identifier)->findOrFail($id);

            // Check stock availability
            if ($cartItem->product->stock < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Not enough stock available'
                ], 400);
            }

            $cartItem->quantity = $request->quantity;
            $cartItem->save();

            return response()->json([
                'success' => true,
                'message' => 'Cart updated',
                'cart_item' => $cartItem
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating cart: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $id)
    {
        try {
            $identifier = $this->getCartIdentifier($request);
            $cartItem = Cart::where($identifier)->findOrFail($id);
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error removing item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all cart items
     */
    public function clear(Request $request)
    {
        try {
            $identifier = $this->getCartIdentifier($request);
            Cart::where($identifier)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error clearing cart: ' . $e->getMessage()
            ], 500);
        }
    }
}
