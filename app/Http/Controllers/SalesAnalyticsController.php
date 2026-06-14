<?php

namespace App\Http\Controllers;

use App\Models\SalesHistory;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Artisan;

class SalesAnalyticsController extends Controller
{
    private function monthName(int $month): string
    {
        return Carbon::create(null, $month, 1)->format('F');
    }

    private function liveOrderItems()
    {
        return OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->select([
                'order_items.product_name as product',
                'order_items.product_brand as brand',
                'order_items.product_category as part_type',
                'order_items.quantity',
                'order_items.price',
                'order_items.subtotal',
                'orders.created_at',
            ])
            ->get();
    }

    private function estimatedProfit(float $revenue): float
    {
        return round($revenue * 0.30, 2);
    }

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
        $historicalRevenue = (float) SalesHistory::sum(DB::raw('price * quantity'));
        $historicalProfit = (float) SalesHistory::sum('profit');
        $historicalUnits = (int) SalesHistory::sum('quantity');
        $historicalOrders = (int) SalesHistory::count();

        $liveRevenue = (float) Order::sum('total');
        $liveOrders = (int) Order::count();
        $upcomingOrders = (int) Order::whereIn('status', [
            'pending',
            'processing',
            'shipped',
            'to-ship',
            'shipping',
            'unpaid',
        ])->count();

        $summary = [
            'total_sales'   => $historicalRevenue,
            'total_profit'  => $historicalProfit,
            'total_units'   => $historicalUnits,
            'record_count'  => $historicalOrders,
            'historical_revenue' => $historicalRevenue,
            'historical_orders' => $historicalOrders,
            'live_revenue' => $liveRevenue,
            'live_orders' => $liveOrders,
            'upcoming_orders' => $upcomingOrders,
            'combined_revenue' => round($historicalRevenue + $liveRevenue, 2),
            'combined_orders' => $historicalOrders + $liveOrders,
            'total_customers' => User::where(function ($query) {
                $query->whereNull('is_admin')->orWhere('is_admin', false);
            })->count(),
            'total_products' => Product::count(),
            'sales_by_month' => $this->combinedMonthlyRevenue(),
        ];

        return response()->json($summary);
    }

    private function combinedMonthlyRevenue()
    {
        $monthly = collect();

        SalesHistory::select(
                    'month_name',
                    'month',
                    DB::raw('SUM(price * quantity) as revenue'),
                    DB::raw('SUM(profit) as profit'),
                    DB::raw('SUM(quantity) as units')
                )
                ->groupBy('month_name', 'month')
                ->orderBy('month')
                ->get()
                ->each(function ($row) use (&$monthly) {
                    $key = (int) $row->month;
                    $monthly[$key] = [
                        'month_name' => $row->month_name ?: $this->monthName($key),
                        'month' => $key,
                        'revenue' => (float) $row->revenue,
                        'profit' => (float) $row->profit,
                        'units' => (int) $row->units,
                    ];
                });

        $this->liveOrderItems()
            ->groupBy(fn ($item) => Carbon::parse($item->created_at)->month)
            ->each(function ($items, $month) use (&$monthly) {
                $revenue = (float) $items->sum('subtotal');
                $existing = $monthly[(int) $month] ?? [
                    'month_name' => $this->monthName((int) $month),
                    'month' => (int) $month,
                    'revenue' => 0,
                    'profit' => 0,
                    'units' => 0,
                ];

                $existing['revenue'] += $revenue;
                $existing['profit'] += $this->estimatedProfit($revenue);
                $existing['units'] += (int) $items->sum('quantity');
                $monthly[(int) $month] = $existing;
            });

        return $monthly->sortKeys()->values();
    }

    /**
     * Top selling products per month.
     */
    public function topProductsMonthly(Request $request)
    {
        $month = $request->query('month'); // optional filter

        $rows = collect();

        SalesHistory::query()
            ->when($month, fn ($query) => $query->where('month', (int) $month))
            ->get()
            ->each(function ($item) use ($rows) {
                $rows->push([
                    'month_name' => $item->month_name ?: $this->monthName((int) $item->month),
                    'month' => (int) $item->month,
                    'product' => $item->product,
                    'brand' => $item->brand,
                    'part_type' => $item->part_type,
                    'quantity' => (int) $item->quantity,
                    'revenue' => (float) $item->price * (int) $item->quantity,
                    'profit' => (float) $item->profit,
                ]);
            });

        $this->liveOrderItems()
            ->filter(fn ($item) => !$month || Carbon::parse($item->created_at)->month === (int) $month)
            ->each(function ($item) use ($rows) {
                $createdAt = Carbon::parse($item->created_at);
                $revenue = (float) $item->subtotal;
                $rows->push([
                    'month_name' => $createdAt->format('F'),
                    'month' => $createdAt->month,
                    'product' => $item->product,
                    'brand' => $item->brand,
                    'part_type' => $item->part_type,
                    'quantity' => (int) $item->quantity,
                    'revenue' => $revenue,
                    'profit' => $this->estimatedProfit($revenue),
                ]);
            });

        $grouped = $rows
            ->groupBy(fn ($row) => $row['month'] . '|' . $row['month_name'] . '|' . $row['product'] . '|' . $row['brand'] . '|' . $row['part_type'])
            ->map(function ($items) {
                $first = $items->first();
                return [
                    'month_name' => $first['month_name'],
                    'month' => $first['month'],
                    'product' => $first['product'],
                    'brand' => $first['brand'],
                    'part_type' => $first['part_type'],
                    'total_quantity' => $items->sum('quantity'),
                    'total_revenue' => round($items->sum('revenue'), 2),
                    'total_profit' => round($items->sum('profit'), 2),
                ];
            })
            ->sortBy('month')
            ->sortByDesc('total_quantity')
            ->groupBy('month_name')
            ->map(fn ($items) => $items->take(5)->values());

        return response()->json($grouped);
    }

    /**
     * Brand profit margins.
     */
    public function brandMargins()
    {
        $historical = SalesHistory::select(
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
            ->get();

        $live = $this->liveOrderItems()
            ->filter(fn ($item) => trim((string) $item->brand) !== '')
            ->groupBy('brand')
            ->map(function ($brand) {
                $revenue = (float) $brand->sum('subtotal');
                return [
                    'brand' => $brand->first()->brand,
                    'total_revenue' => $revenue,
                    'total_profit' => $this->estimatedProfit($revenue),
                    'total_units' => (int) $brand->sum('quantity'),
                    'transaction_count' => $brand->count(),
                ];
            });

        $brands = $historical->map(fn ($brand) => [
                'brand' => $brand->brand,
                'total_revenue' => (float) $brand->total_revenue,
                'total_profit' => (float) $brand->total_profit,
                'total_units' => (int) $brand->total_units,
                'transaction_count' => (int) $brand->transaction_count,
            ])
            ->concat($live)
            ->groupBy('brand')
            ->map(function ($items, $brand) {
                $revenue = (float) $items->sum('total_revenue');
                $profit = (float) $items->sum('total_profit');
                $margin = $revenue > 0
                    ? round(($profit / $revenue) * 100, 1)
                    : 0;

                return [
                    'brand'             => $brand,
                    'total_revenue'     => round($revenue, 2),
                    'total_profit'      => round($profit, 2),
                    'total_units'       => (int) $items->sum('total_units'),
                    'transaction_count' => (int) $items->sum('transaction_count'),
                    'profit_margin'     => $margin,
                ];
            })
            ->sortByDesc('total_revenue')
            ->values();

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
        return response()->json($this->combinedMonthlyRevenue());
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
        $historical = SalesHistory::select(
                'part_type',
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(price * quantity) as total_revenue'),
                DB::raw('SUM(profit) as total_profit')
            )
            ->whereNotNull('part_type')
            ->where('part_type', '!=', '')
            ->groupBy('part_type')
            ->get();

        $live = $this->liveOrderItems()
            ->filter(fn ($item) => trim((string) $item->part_type) !== '')
            ->groupBy('part_type')
            ->map(function ($items, $partType) {
                $revenue = (float) $items->sum('subtotal');
                return [
                    'part_type' => $partType,
                    'total_quantity' => (int) $items->sum('quantity'),
                    'total_revenue' => $revenue,
                    'total_profit' => $this->estimatedProfit($revenue),
                ];
            });

        $breakdown = $historical->map(fn ($item) => [
                'part_type' => $item->part_type,
                'total_quantity' => (int) $item->total_quantity,
                'total_revenue' => (float) $item->total_revenue,
                'total_profit' => (float) $item->total_profit,
            ])
            ->concat($live)
            ->groupBy('part_type')
            ->map(fn ($items, $partType) => [
                'part_type' => $partType,
                'total_quantity' => (int) $items->sum('total_quantity'),
                'total_revenue' => round($items->sum('total_revenue'), 2),
                'total_profit' => round($items->sum('total_profit'), 2),
            ])
            ->sortByDesc('total_revenue')
            ->values();

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
            $exitCode = Artisan::call('ml:classify-products', ['--update' => true]);
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
    public function demandForecast()
    {
        $products = Product::whereNotNull('demand_score')
            ->where('demand_score', '>', 0)
            ->orderBy('demand_score', 'desc')
            ->take(20)
            ->get();
        return response()->json($products);
    }

    public function predictDemand(Request $request)
    {
        $request->validate([
            'avg_price'   => 'required|numeric',
            'avg_profit'  => 'required|numeric',
            'month'       => 'required|numeric',
            'day_of_week' => 'required|numeric',
            'brand'       => 'required|string',
            'part_type'   => 'required|string',
        ]);

        try {
            $response = Http::timeout(10)->post('http://127.0.0.1:5001/predict/demand', [
                'avg_price'   => $request->avg_price,
                'avg_profit'  => $request->avg_profit,
                'month'       => $request->month,
                'day_of_week' => $request->day_of_week,
                'brand'       => $request->brand,
                'part_type'   => $request->part_type,
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
}
