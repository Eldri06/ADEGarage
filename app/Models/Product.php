<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

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
        'status'
    ];

    protected $casts = [
        'models' => 'array',
        'variations' => 'array',
        'specifications' => 'array',
        'in_the_box' => 'array',
        'warranty_info' => 'array',
        'price' => 'decimal:2'
    ];
}
