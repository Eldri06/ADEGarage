<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $appends = [
        'image_url',
    ];

    protected $fillable = [
        'name',
        'description',
        'full_description',
        'category',
        'brand',
        'price',
        'stock',
        'image',
        'models',
        'variations',
        'specifications',
        'in_the_box',
        'warranty_info',
        'status',
        'ml_tier',
        'demand_score',
    ];

    protected $casts = [
        'models' => 'array',
        'variations' => 'array',
        'specifications' => 'array',
        'in_the_box' => 'array',
        'warranty_info' => 'array',
        'price' => 'decimal:2'
    ];

    public function getImageUrlAttribute(): string
    {
        return static::resolveImagePath($this->image, [
            'name' => $this->name,
            'brand' => $this->brand,
            'category' => $this->category,
        ]);
    }

    public static function resolveImagePath(?string $image, array $product = []): string
    {
        $image = trim((string) $image);
        if ($image !== '') {
            if (preg_match('/^https?:\/\//i', $image) || str_starts_with($image, '/')) {
                return $image;
            }

            return '/storage/' . ltrim($image, '/');
        }

        $mappedImage = static::mapCatalogImage($product);
        if ($mappedImage !== null) {
            return $mappedImage;
        }

        return static::buildCategoryFallbackImage(
            (string) ($product['category'] ?? ''),
            (string) ($product['name'] ?? 'NA')
        );
    }

    private static function mapCatalogImage(array $product): ?string
    {
        $name = static::normalizeImageValue($product['name'] ?? '');
        $brand = static::normalizeImageValue($product['brand'] ?? '');
        $category = static::normalizeImageValue($product['category'] ?? '');

        if (str_contains($name, 'xrm 110 cowling / headlight case') && str_contains($name, 'red')) {
            return '/images/products/xrm110_headlight_case_red.png';
        }

        if ($brand === 'honda' && str_contains($category, 'fender')) {
            return '/images/products/honda_yellow_fender.png';
        }

        if ($brand === 'yamaha' && (str_contains($category, 'panel') || str_contains($category, 'cover') || str_contains($category, 'cowling'))) {
            return '/images/products/yamaha_yellow_cover.png';
        }

        if (str_contains($name, 'cam chain') || str_contains($name, 'slipper')) {
            return '/images/products/cam_chain_slipper.png';
        }

        if (str_contains($name, 'bolt') && (str_contains($name, 'hinge') || str_contains($name, 'seat'))) {
            return '/images/products/bolt_seat_hinge_kpg900.png';
        }

        return null;
    }

    private static function buildCategoryFallbackImage(string $category, string $name): string
    {
        $category = static::normalizeImageValue($category);

        if (str_contains($category, 'brake')) {
            return '/images/products/category_brake.png';
        }

        if (str_contains($category, 'wheel') || str_contains($category, 'tire')) {
            return '/images/products/category_wheel.png';
        }

        if (str_contains($category, 'engine') || str_contains($category, 'drive train')) {
            return '/images/products/category_engine.png';
        }

        if (str_contains($category, 'filter')) {
            return '/images/products/category_filter.png';
        }

        if (str_contains($category, 'lighting')) {
            return '/images/products/category_lighting.png';
        }

        if (str_contains($category, 'cowling') || str_contains($category, 'panel') || str_contains($category, 'fender')) {
            return '/images/products/category_cowling.png';
        }

        if (str_contains($category, 'electrical') || str_contains($category, 'battery')) {
            return '/images/products/category_electrical.png';
        }

        if (str_contains($category, 'exhaust')) {
            return '/images/products/category_exhaust.png';
        }

        if (str_contains($category, 'suspension')) {
            return '/images/products/category_suspension.png';
        }

        if (str_contains($category, 'transmission')) {
            return '/images/products/category_transmission.png';
        }

        if (str_contains($category, 'clutch')) {
            return '/images/products/category_clutch.png';
        }

        $initials = strtoupper(substr(trim($name) ?: 'NA', 0, 2));

        return 'https://via.placeholder.com/600x400/1a2332/1ee0ff?text=' . rawurlencode($initials);
    }

    private static function normalizeImageValue(mixed $value): string
    {
        return strtolower(trim((string) $value));
    }
}
