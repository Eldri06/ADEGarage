<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'month_name',
        'month',
        'date',
        'product',
        'quantity',
        'price',
        'profit',
        'brand',
        'part_type'
    ];
}
