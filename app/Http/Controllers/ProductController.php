<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $products = Product::where('status', 'active')->get();
        return response()->json($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'full_description' => 'nullable|string',
                'category' => 'required|string',
                'brand' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'models' => 'nullable|array',
                'variations' => 'nullable|string',
                'specifications' => 'nullable|string',
            ]);

            $data = $request->except('image');

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('products', 'public');
                $data['image'] = $imagePath;
            }

            // Convert models array to JSON if provided
            if ($request->has('models')) {
                $data['models'] = $request->models;
            }

            // Parse JSON strings for variations and specifications
            if ($request->has('variations') && $request->variations) {
                $data['variations'] = json_decode($request->variations, true);
            }
            if ($request->has('specifications') && $request->specifications) {
                $data['specifications'] = json_decode($request->specifications, true);
            }

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'brand' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'models' => 'nullable|array',
        ]);

        $data = $request->except('image');

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $data['image'] = $imagePath;
        }

        // Convert models array to JSON if provided
        if ($request->has('models')) {
            $data['models'] = $request->models;
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'product' => $product
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // Delete image if exists
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Get all products for admin.
     */
    public function adminIndex()
    {
        $products = Product::all();
        return response()->json($products);
    }
}
