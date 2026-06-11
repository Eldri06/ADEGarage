<?php

namespace App\Http\Controllers;

use App\Models\SalesHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;

class SalesAnalyticsController extends Controller
{
    /**
     * Return all sales history records.
     */
    public function index()
    {
        return response()->json(SalesHistory::all());
    }

    /**
     * Aggregated summary for the dashboard overview.
     */
    public function summary()
    {
        $summary = [
            'total_sales'   => SalesHistory::sum(DB::raw('price * quantity')),
            'total_profit'  => SalesHistory::sum('profit'),
            'total_units'   => SalesHistory::sum('quantity'),
            'record_count'  => SalesHistory::count(),
            'sales_by_month' => SalesHistory::select(
                    'month_name',
                    'month',
                    DB::raw('SUM(price * quantity) as revenue'),
                    DB::raw('SUM(profit) as profit'),
                    DB::raw('SUM(quantity) as units')
                )
                ->groupBy('month_name', 'month')
                ->orderBy('month')
                ->get(),
        ];

        return response()->json($summary);
    }

    /**
     * Top selling products per month.
     */
    public function topProductsMonthly(Request $request)
    {
        $month = $request->query('month'); // optional filter

        $query = SalesHistory::select(
                'month_name',
                'month',
                'product',
                'brand',
                'part_type',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(price * quantity) as total_revenue'),
                DB::raw('SUM(profit) as total_profit')
            )
            ->groupBy('month_name', 'month', 'product', 'brand', 'part_type');

        if ($month) {
            $query->where('month', (int) $month);
        }

        $results = $query->orderBy('month')
            ->orderByDesc('total_quantity')
            ->get();

        // Group by month and take top 5 per month
        $grouped = $results->groupBy('month_name')->map(function ($items) {
            return $items->take(5)->values();
        });

        return response()->json($grouped);
    }

    /**
     * Brand profit margins.
     */
    public function brandMargins()
    {
        $brands = SalesHistory::select(
                'brand',
                DB::raw('SUM(price * quantity) as total_revenue'),
                DB::raw('SUM(profit) as total_profit'),
                DB::raw('SUM(quantity) as total_units'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->groupBy('brand')
            ->orderByDesc('total_revenue')
            ->get()
            ->map(function ($brand) {
                $margin = $brand->total_revenue > 0
                    ? round(($brand->total_profit / $brand->total_revenue) * 100, 1)
                    : 0;

                return [
                    'brand'             => $brand->brand,
                    'total_revenue'     => round($brand->total_revenue, 2),
                    'total_profit'      => round($brand->total_profit, 2),
                    'total_units'       => $brand->total_units,
                    'transaction_count' => $brand->transaction_count,
                    'profit_margin'     => $margin,
                ];
            });

        return response()->json($brands);
    }

    /**
     * Dead stock alert — products with very low or zero sales in recent months.
     */
    public function deadStock()
    {
        // Get products with lowest total quantity sold
        $deadStock = SalesHistory::select(
                'product',
                'brand',
                'part_type',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(price * quantity) as total_revenue'),
                DB::raw('MAX(date) as last_sale_date')
            )
            ->groupBy('product', 'brand', 'part_type')
            ->havingRaw('SUM(quantity) <= 5') // Adjust threshold if needed
            ->orderBy('last_sale_date', 'asc')
            ->limit(20)
            ->get();

        return response()->json($deadStock);
    }

    /**
     * Monthly revenue trend from sales_histories.
     */
    public function revenueTrend()
    {
        $trend = SalesHistory::select(
                'month_name',
                'month',
                DB::raw('SUM(price * quantity) as revenue'),
                DB::raw('SUM(profit) as profit'),
                DB::raw('SUM(quantity) as units')
            )
            ->groupBy('month_name', 'month')
            ->orderBy('month')
            ->get();

        return response()->json($trend);
    }

    /**
     * ML tier distribution (from products table).
     */
    public function tierDistribution()
    {
        $distribution = Product::select(
                'ml_tier',
                DB::raw('COUNT(*) as count')
            )
            ->whereNotNull('ml_tier')
            ->groupBy('ml_tier')
            ->get();

        return response()->json($distribution);
    }

    /**
     * Part type breakdown (category-level analysis).
     */
    public function partTypeBreakdown()
    {
        $breakdown = SalesHistory::select(
                'part_type',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(price * quantity) as total_revenue'),
                DB::raw('SUM(profit) as total_profit')
            )
            ->whereNotNull('part_type')
            ->where('part_type', '!=', '')
            ->groupBy('part_type')
            ->orderByDesc('total_revenue')
            ->get();

        return response()->json($breakdown);
    }

    /**
     * Proxy a tier prediction request to the Flask ML microservice.
     */
    public function predictTier(Request $request)
    {
        $request->validate([
            'price'    => 'required|numeric',
            'quantity' => 'required|numeric',
            'profit'   => 'required|numeric',
        ]);

        try {
            $response = Http::timeout(5)->post('http://127.0.0.1:5001/predict/tier', [
                'price'    => $request->price,
                'quantity' => $request->quantity,
                'profit'   => $request->profit,
            ]);

            if ($response->successful()) {
                return response()->json($response->json());
            }

            return response()->json(['error' => 'ML service returned an error'], 502);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'ML service unavailable. Make sure ml_server.py is running.',
                'detail' => $e->getMessage(),
            ], 503);
        }
    }

    /**
     * Programmatically runs the Artisan ML clustering sync
     */
    public function runClassification()
    {
        try {
            // Call the artisan command and capture output
            $exitCode = Artisan::call('ml:classify-products');
            $output = Artisan::output();

            if ($exitCode === 0) {
                return response()->json([
                    'success' => true,
                    'message' => 'ML Sync completed successfully',
                    'output' => $output
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'ML Sync failed. Check the server output.',
                'output' => $output
            ], 500);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error starting ML sync.',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }
}
