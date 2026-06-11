<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\SalesHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesAnalyticsController extends Controller
{
    public function index()
    {
        return response()->json(SalesHistory::all());
    }

    public function summary()
    {
        $summary = [
            'total_sales' => SalesHistory::sum(DB::raw('price * quantity')),
            'total_profit' => SalesHistory::sum('profit'),
            'total_units' => SalesHistory::sum('quantity'),
            'sales_by_month' => SalesHistory::select('month_name', DB::raw('SUM(price * quantity) as revenue'))
                ->groupBy('month_name', 'month')
                ->orderBy('month')
                ->get(),
        ];

        return response()->json($summary);
    }
}
