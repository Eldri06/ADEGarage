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

    private function liveProductOrderStats(string $productName, int $targetMonth, int $targetDayOfWeek): array
    {
        $targetIsoDay = $targetDayOfWeek + 1; // Frontend uses Monday=0, Carbon ISO uses Monday=1.
        $items = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->whereRaw('LOWER(TRIM(order_items.product_name)) = ?', [strtolower(trim($productName))])
            ->select([
                'order_items.quantity',
                'order_items.subtotal',
                'orders.created_at',
            ])
            ->get();

        $recentCutoff = Carbon::now()->subDays(14);

        return [
            'live_units' => (int) $items->sum('quantity'),
            'live_revenue' => round((float) $items->sum('subtotal'), 2),
            'recent_units_14d' => (int) $items
                ->filter(fn ($item) => Carbon::parse($item->created_at)->gte($recentCutoff))
                ->sum('quantity'),
            'target_month_units' => (int) $items
                ->filter(fn ($item) => Carbon::parse($item->created_at)->month === $targetMonth)
                ->sum('quantity'),
            'target_dow_units' => (int) $items
                ->filter(fn ($item) => Carbon::parse($item->created_at)->dayOfWeekIso === $targetIsoDay)
                ->sum('quantity'),
        ];
    }

    private function applyLiveRfAdjustment(float $prediction, array $stats): array
    {
        if (($stats['live_units'] ?? 0) <= 0) {
            return [
                'prediction' => $prediction,
                'multiplier' => 1.0,
            ];
        }

        $recentLift = min(0.35, ((int) $stats['recent_units_14d']) * 0.04);
        $monthLift = min(0.20, ((int) $stats['target_month_units']) * 0.015);
        $dowLift = min(0.15, ((int) $stats['target_dow_units']) * 0.025);
        $multiplier = round(1 + $recentLift + $monthLift + $dowLift, 4);

        return [
            'prediction' => round($prediction * $multiplier, 2),
            'multiplier' => $multiplier,
        ];
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
        $output = '';

        try {
            $health = Http::timeout(3)->get('http://127.0.0.1:5001/health');
            if ($health->successful()) {
                $exitCode = Artisan::call('ml:classify-products');
                $output = Artisan::output();
                if ($exitCode !== 0) {
                    $output .= "\nML sync returned exit code $exitCode.";
                }
            } else {
                $output = "ML server not responding — skipped ML classification. Data refresh continues.";
            }
        } catch (\Exception $e) {
            $output = "ML server unavailable (" . $e->getMessage() . ") — skipped ML classification. Data refresh continues.";
        }

        return response()->json([
            'success' => true,
            'message' => 'Analytics data refreshed.',
            'output' => $output,
        ]);
    }
    public function revenueForecast()
    {
        $products = Product::whereNotNull('demand_score')
            ->where('demand_score', '>', 0)
            ->orderBy('demand_score', 'desc')
            ->take(20)
            ->get();
        return response()->json($products);
    }

    public function predictRevenue(Request $request)
    {
        $request->validate([
            'avg_price'    => 'required|numeric',
            'avg_profit'   => 'required|numeric',
            'month'        => 'required|numeric',
            'day_of_week'  => 'required|numeric',
            'brand'        => 'nullable|string',
            'part_type'    => 'nullable|string',
            'product_name' => 'nullable|string',
        ]);

        $scriptPath = base_path('ml_predict_revenue.py');
        if (!file_exists($scriptPath)) {
            return response()->json(['error' => 'Python prediction script not found.'], 500);
        }

        $payload = [
            'avg_price'    => (float) $request->avg_price,
            'avg_profit'   => (float) $request->avg_profit,
            'brand'        => $request->brand ?? '',
            'part_type'    => $request->part_type ?? '',
            'month'        => (int) $request->month,
            'day_of_week'  => (int) $request->day_of_week,
            'product_name' => $request->product_name ?? '',
        ];

        $tmpDir = storage_path('app/ml_predict');
        if (!is_dir($tmpDir)) {
            @mkdir($tmpDir, 0777, true);
        }
        $tmpFile = tempnam($tmpDir, 'in_');
        file_put_contents($tmpFile, json_encode($payload));

        $ph = popen(sprintf('python3 "%s" --json-file "%s" 2>/dev/null', $scriptPath, $tmpFile), 'r');
        $output = '';
        if ($ph) {
            while (!feof($ph)) {
                $output .= fread($ph, 8192);
            }
            pclose($ph);
        }
        @unlink($tmpFile);

        $result = json_decode((string) $output, true);
        if (!$result || isset($result['error'])) {
            return response()->json([
                'error' => $result['error'] ?? 'Prediction script returned no output.',
            ], 502);
        }

        if (($result['model_used'] ?? null) === 'random_forest' && trim((string) $payload['product_name']) !== '') {
            $liveStats = $this->liveProductOrderStats($payload['product_name'], $payload['month'], $payload['day_of_week']);
            $adjusted = $this->applyLiveRfAdjustment((float) ($result['predicted_revenue_php'] ?? 0), $liveStats);
            $result['predicted_revenue_php'] = $adjusted['prediction'];
            $result['live_order_adjustment'] = [
                'multiplier' => $adjusted['multiplier'],
                'live_units' => $liveStats['live_units'],
                'recent_units_14d' => $liveStats['recent_units_14d'],
                'target_month_units' => $liveStats['target_month_units'],
                'target_dow_units' => $liveStats['target_dow_units'],
            ];
        }

        return response()->json($result);
    }

    public function revenueModelMetadata()
    {
        $scriptPath = base_path('ml_predict_revenue.py');
        if (!file_exists($scriptPath)) {
            return response()->json(['error' => 'Python prediction script not found.'], 500);
        }

        $command = sprintf('python3 "%s" --metadata 2>/dev/null', $scriptPath);
        $output = shell_exec($command);
        $result = json_decode((string) $output, true);

        if (!$result || isset($result['error'])) {
            return response()->json([
                'error' => $result['error'] ?? 'Failed to read Linear Regression model metadata.',
            ], 502);
        }

        return response()->json($result);
    }

    public function productsWithSalesAvg()
    {
        $historical = SalesHistory::select(
                'product',
                'brand',
                'part_type',
                DB::raw('AVG(price) as avg_price'),
                DB::raw('AVG(profit) as avg_profit'),
                DB::raw('SUM(quantity) as total_qty')
            )
            ->whereNotNull('product')
            ->where('product', '!=', '')
            ->groupBy('product', 'brand', 'part_type')
            ->get()
            ->map(fn($p) => [
                'name'     => $p->product,
                'brand'    => $p->brand,
                'category' => $p->part_type,
                'avg_price'  => round((float) $p->avg_price, 2),
                'avg_profit' => round((float) $p->avg_profit, 2),
                'total_qty' => (int) $p->total_qty,
            ]);

        $live = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereNotIn('orders.status', ['cancelled'])
            ->select(
                'order_items.product_name as product',
                'order_items.product_brand as brand',
                'order_items.product_category as part_type',
                DB::raw('AVG(order_items.price) as avg_price'),
                DB::raw('AVG(order_items.price) * 0.50 as avg_profit'),
                DB::raw('SUM(order_items.quantity) as total_qty')
            )
            ->whereNotNull('order_items.product_name')
            ->where('order_items.product_name', '!=', '')
            ->groupBy('order_items.product_name', 'order_items.product_brand', 'order_items.product_category')
            ->get()
            ->map(fn($p) => [
                'name'     => $p->product,
                'brand'    => $p->brand,
                'category' => $p->part_type,
                'avg_price'  => round((float) $p->avg_price, 2),
                'avg_profit' => round((float) $p->avg_profit, 2),
                'total_qty' => (int) $p->total_qty,
            ]);

        $keyed = [];
        foreach ($historical as $h) {
            $k = strtolower(trim($h['name'] . '|' . $h['brand'] . '|' . $h['category']));
            $keyed[$k] = $h;
        }
        foreach ($live as $l) {
            $k = strtolower(trim($l['name'] . '|' . $l['brand'] . '|' . $l['category']));
            if (isset($keyed[$k])) {
                $e = &$keyed[$k];
                $t = $e['total_qty'] + $l['total_qty'];
                $e['avg_price']  = round((($e['avg_price'] * $e['total_qty']) + ($l['avg_price'] * $l['total_qty'])) / $t, 2);
                $e['avg_profit'] = round((($e['avg_profit'] * $e['total_qty']) + ($l['avg_profit'] * $l['total_qty'])) / $t, 2);
                $e['total_qty']  = $t;
                unset($e);
            } else {
                $keyed[$k] = $l;
            }
        }

        return response()->json(array_values($keyed));
    }

    public function brandRevenueDaily(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        // Collect daily revenue per brand from SalesHistory
        $histQuery = SalesHistory::select(
                'brand',
                'date',
                DB::raw('SUM(price * quantity) as daily_revenue')
            )
            ->whereNotNull('brand')->where('brand', '!=', '')
            ->when($from, fn ($q) => $q->where('date', '>=', $from))
            ->when($to, fn ($q) => $q->where('date', '<=', $to))
            ->groupBy('brand', 'date');

        $historicalDaily = $histQuery->get()
            ->map(fn ($r) => [
                'brand' => $r->brand,
                'date' => $r->date instanceof \Carbon\Carbon ? $r->date->format('Y-m-d') : (string) $r->date,
                'daily_revenue' => (float) $r->daily_revenue,
            ]);

        // Collect daily revenue per brand from live orders
        $liveItems = $this->liveOrderItems();
        if ($from) {
            $liveItems = $liveItems->filter(fn ($item) => Carbon::parse($item->created_at)->format('Y-m-d') >= $from);
        }
        if ($to) {
            $liveItems = $liveItems->filter(fn ($item) => Carbon::parse($item->created_at)->format('Y-m-d') <= $to);
        }

        $liveDaily = $liveItems
            ->filter(fn ($item) => trim((string) $item->brand) !== '')
            ->groupBy(fn ($item) => $item->brand . '||' . Carbon::parse($item->created_at)->format('Y-m-d'))
            ->map(fn ($items, $key) => [
                'brand' => $items->first()->brand,
                'date' => explode('||', $key)[1],
                'daily_revenue' => (float) $items->sum('subtotal'),
            ])
            ->values();

        // Merge historical + live, group by brand, compute mean of daily revenues
        $merged = collect([...$historicalDaily, ...$liveDaily])
            ->groupBy('brand')
            ->map(fn ($days) => [
                'brand' => $days->first()['brand'],
                'avg_daily_revenue' => round($days->avg('daily_revenue'), 2),
            ])
            ->sortByDesc('avg_daily_revenue')
            ->values();

        return response()->json($merged);
    }

    public function partTypeRevenueDaily(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        // Collect daily revenue per part_type from SalesHistory
        $histQuery = SalesHistory::select(
                'part_type',
                'date',
                DB::raw('SUM(price * quantity) as daily_revenue')
            )
            ->whereNotNull('part_type')->where('part_type', '!=', '')
            ->when($from, fn ($q) => $q->where('date', '>=', $from))
            ->when($to, fn ($q) => $q->where('date', '<=', $to))
            ->groupBy('part_type', 'date');

        $historicalDaily = $histQuery->get()
            ->map(fn ($r) => [
                'part_type' => $r->part_type,
                'date' => $r->date instanceof \Carbon\Carbon ? $r->date->format('Y-m-d') : (string) $r->date,
                'daily_revenue' => (float) $r->daily_revenue,
            ]);

        // Collect daily revenue per part_type from live orders
        $liveItems = $this->liveOrderItems();
        if ($from) {
            $liveItems = $liveItems->filter(fn ($item) => Carbon::parse($item->created_at)->format('Y-m-d') >= $from);
        }
        if ($to) {
            $liveItems = $liveItems->filter(fn ($item) => Carbon::parse($item->created_at)->format('Y-m-d') <= $to);
        }

        $liveDaily = $liveItems
            ->filter(fn ($item) => trim((string) $item->part_type) !== '')
            ->groupBy(fn ($item) => $item->part_type . '||' . Carbon::parse($item->created_at)->format('Y-m-d'))
            ->map(fn ($items, $key) => [
                'part_type' => $items->first()->part_type,
                'date' => explode('||', $key)[1],
                'daily_revenue' => (float) $items->sum('subtotal'),
            ])
            ->values();

        // Merge historical + live, group by part_type, compute mean of daily revenues
        $merged = collect([...$historicalDaily, ...$liveDaily])
            ->groupBy('part_type')
            ->map(fn ($days) => [
                'part_type' => $days->first()['part_type'],
                'avg_daily_revenue' => round($days->avg('daily_revenue'), 2),
            ])
            ->sortByDesc('avg_daily_revenue')
            ->values();

        return response()->json($merged);
    }
}
