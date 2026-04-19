<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\SupabaseAuthService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('status', 'active')->get();
        return response()->json($products);
    }

    public function store(Request $request, SupabaseAuthService $supabase)
    {
        try {
            $request->validate([
                'name'        => 'required|string|max:255',
                'description' => 'nullable|string',
                'full_description' => 'nullable|string',
                'category'    => 'required|string',
                'brand'       => 'required|string',
                'price'       => 'required|numeric|min:0',
                'stock'       => 'required|integer|min:0',
                'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
                'models'      => 'nullable|array',
                'variations'  => 'nullable|string',
                'specifications' => 'nullable|string',
            ]);

            $data = $request->except('image');

            // Upload image to Supabase Storage
            if ($request->hasFile('image')) {
                $data['image'] = $supabase->uploadProductImage($request->file('image'));
            }

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
                'product' => $product,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error creating product: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        return response()->json(Product::findOrFail($id));
    }

    public function update(Request $request, $id, SupabaseAuthService $supabase)
    {
        try {
            $product = Product::findOrFail($id);

            $request->validate([
                'name'     => 'required|string|max:255',
                'category' => 'required|string',
                'brand'    => 'required|string',
                'price'    => 'required|numeric|min:0',
                'stock'    => 'required|integer|min:0',
                'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
                'models'   => 'nullable|array',
            ]);

            $data = $request->except('image');

            // Replace image in Supabase Storage
            if ($request->hasFile('image')) {
                // Delete old image from Supabase if it exists
                if ($product->image) {
                    $supabase->deleteProductImage($product->image);
                }
                $data['image'] = $supabase->uploadProductImage($request->file('image'));
            }

            $product->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product,
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error updating product: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id, SupabaseAuthService $supabase)
    {
        try {
            $product = Product::findOrFail($id);

            // Delete image from Supabase Storage
            if ($product->image) {
                $supabase->deleteProductImage($product->image);
            }

            $product->delete();

            return response()->json(['success' => true, 'message' => 'Product deleted successfully']);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Error deleting product: ' . $e->getMessage()], 500);
        }
    }

    public function adminIndex()
    {
        return response()->json(Product::all());
    }
}