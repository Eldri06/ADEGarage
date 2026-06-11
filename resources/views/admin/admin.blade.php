<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>ADE GARAGE</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{url('Css/admin.css')}}"> 
</head>
<body class="admin-body">
  <div class="sidebar-overlay" id="sidebarOverlay"></div>

  <aside class="admin-sidebar" id="adminSidebar">
    <div class="sidebar-header">
      <h1 class="sidebar-brand">ADE GARAGE</h1>
      <span class="admin-badge">ADMIN</span>
    </div>
    
    <nav class="sidebar-nav">
      <a href="#" class="nav-item active" data-section="dashboard">
        <i class="fas fa-chart-line"></i>
        <span>Dashboard</span>
      </a>
      <a href="#" class="nav-item" data-section="products">
        <i class="fas fa-box"></i>
        <span>Products</span>
      </a>
      <a href="#" class="nav-item" data-section="orders">
        <i class="fas fa-shopping-cart"></i>
        <span>Orders</span>
      </a>
      <a href="#" class="nav-item" data-section="inventory">
        <i class="fas fa-warehouse"></i>
        <span>Inventory</span>
      </a>
      <a href="#" class="nav-item" data-section="analytics">
        <i class="fas fa-chart-bar"></i>
        <span>Analytics</span>
      </a>
      <a href="#" class="nav-item" data-section="settings">
        <i class="fas fa-cog"></i>
        <span>Settings</span>
      </a>
    </nav>
    
    <div class="sidebar-footer">
      <a href="index.html" class="nav-item">
        <i class="fas fa-store"></i>
        <span>View Store</span>
      </a>
      <a href="#" class="nav-item" onclick="logout(event)">
        <i class="fas fa-sign-out-alt" ></i>
        <span>Logout</span>
      </a>
    </div>
  </aside>

  <main class="admin-main">
    <header class="admin-header">
      <button class="sidebar-toggle" id="sidebarToggle">
        <i class="fas fa-bars"></i>
      </button>
      
      <div class="header-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Search products, orders, customers..." id="adminSearch">
      </div>
      
      <div class="header-actions">
        <button class="header-btn" title="Notifications" id="notificationBtn" onclick="toggleNotificationPanel()">
          <i class="fas fa-bell"></i>
          <span class="notification-badge" id="notificationCount">3</span>
        </button>
        <button class="header-btn" title="Messages" id="messageBtn">
          <i class="fas fa-envelope"></i>
          <span class="notification-badge" id="messageCount">5</span>
        </button>
        <div class="admin-user">
          <img src="storage/asset/mina.jfif" alt="Admin" class="admin-avatar">
          <span class="admin-name">Admin</span>
        </div>
      </div>
    </header>

    <section class="admin-section active" id="section-dashboard">
      <div class="section-header">
        <h2 class="section-title">Dashboard</h2>
        <div class="section-actions">
          <button class="btn-action" onclick="exportDashboard()">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-action" onclick="refreshDashboard()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-card-clickable" role="button" tabindex="0" onclick="openDashboardStatModal('revenue')" onkeydown="handleDashboardCardKey(event, 'revenue')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1ee0ff 0%, #0891b2 100%);">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value" id="totalRevenue">₱0</div>
            <div class="stat-change positive" id="revenueChange">
              <i class="fas fa-arrow-up"></i> Loading...
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-clickable" role="button" tabindex="0" onclick="openDashboardStatModal('orders')" onkeydown="handleDashboardCardKey(event, 'orders')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #1eff8e 0%, #10b981 100%);">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value" id="totalOrders">0</div>
            <div class="stat-change positive" id="ordersChange">
              <i class="fas fa-arrow-up"></i> Loading...
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-clickable" role="button" tabindex="0" onclick="openDashboardStatModal('customers')" onkeydown="handleDashboardCardKey(event, 'customers')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff7a1f 0%, #f97316 100%);">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Customers</div>
            <div class="stat-value" id="totalCustomers">0</div>
            <div class="stat-change positive" id="customersChange">
              <i class="fas fa-arrow-up"></i> Loading...
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-clickable" role="button" tabindex="0" onclick="openDashboardStatModal('products')" onkeydown="handleDashboardCardKey(event, 'products')">
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff1e8e 0%, #ec4899 100%);">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Products</div>
            <div class="stat-value" id="totalProducts">0</div>
            <div class="stat-change neutral" id="productsChange">
              <i class="fas fa-minus"></i> Loading...
            </div>
          </div>
        </div>
      </div>



      <div class="data-card">
        <div class="card-header">
          <h3>Recent Orders</h3>
          <a href="#" class="view-all" onclick="viewAllRecentOrders(); return false;">View All</a>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody id="recentOrdersTable">
            </tbody>
          </table>
        </div>
      </div>
    </section>

   
    <section class="admin-section" id="section-products">
      <div class="section-header">
        <h2 class="section-title">Products</h2>
        <div class="section-actions">
          <button class="btn-action" onclick="exportProducts()">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-action btn-primary" onclick="openProductModal()">
            <i class="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      <div class="data-card">
        <div class="card-header">
          <h3>All Products</h3>
          <div class="filter-group">
            <select class="filter-select" id="categoryFilter" onchange="filterProductsByCategory(this.value)">
              <option value="all">All Categories</option>
              <option value="brakes">Brakes</option>
              <option value="tires">Tires</option>
              <option value="engine">Engine</option>
              <option value="accessories">Accessories</option>
            </select>
            <select class="filter-select" id="brandFilter" onchange="filterProductsByBrand(this.value)">
              <option value="all">All Brands</option>
              <option value="aeromax">AeroMax</option>
              <option value="speedtech">SpeedTech</option>
              <option value="motopro">MotoPro</option>
            </select>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Smart Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="productsTable">
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="admin-section" id="section-orders">
      <div class="section-header">
        <h2 class="section-title">Orders</h2>
        <div class="section-actions">
          <button class="btn-action btn-primary" onclick="exportOrders()">
            <i class="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      <div class="orders-filter-tabs">
        <button class="filter-tab active" data-status="all" onclick="filterOrders('all')">All</button>
        <button class="filter-tab" data-status="pending" onclick="filterOrders('pending')">Pending</button>
        <button class="filter-tab" data-status="processing" onclick="filterOrders('processing')">Processing</button>
        <button class="filter-tab" data-status="shipped" onclick="filterOrders('shipped')">Shipped</button>
        <button class="filter-tab" data-status="delivered" onclick="filterOrders('delivered')">Delivered</button>
        <button class="filter-tab" data-status="cancelled" onclick="filterOrders('cancelled')">Cancelled</button>
      </div>

      <div class="orders-grid" id="ordersGrid">
      </div>
    </section>

    <section class="admin-section" id="section-inventory">
      <div class="section-header">
        <h2 class="section-title">Inventory</h2>
        <div class="section-actions">
          <button class="btn-action" onclick="exportInventory()">
            <i class="fas fa-download"></i> Export
          </button>
          <button class="btn-action btn-primary" onclick="updateInventory()">
            <i class="fas fa-sync-alt"></i> Update
          </button>
        </div>
      </div>

      <div class="data-card">
        <div class="card-header">
          <h3>Stock Levels</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Min Required</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="inventoryTable">
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="admin-section" id="section-analytics">
      <div class="section-header">
        <h2 class="section-title">Analytics</h2>
        <div class="section-actions">
          <button class="btn-action" onclick="generateReport()">
            <i class="fas fa-file-pdf"></i> Generate Report
          </button>
          <button class="btn-action" onclick="exportAnalytics()">
            <i class="fas fa-download"></i> Export Data
          </button>
          <button class="btn-action btn-primary" id="btnSyncMl" onclick="syncMLData()">
            <i class="fas fa-sync"></i> Refresh Smart Suggestions
          </button>
        </div>
      </div>

      <!-- Row 1: Revenue Trend + Part Type Breakdown -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Monthly Revenue Trend</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales by Part Type</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="partTypeChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Row 2: Brand Margins + ML Tier Distribution -->
      <div class="charts-row">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Brand Profit Margins</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="brandMarginsChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Smart Product Ratings Distribution</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="tierDistChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Row 3: Top Products per Month -->
      <div class="data-card">
        <div class="card-header">
          <h3>Top Products per Month</h3>
          <div class="filter-group">
            <select class="filter-select" id="topProductsMonthFilter" onchange="loadTopProductsMonthly(this.value)">
              <option value="">All Months</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Brand</th>
                <th>Part Type</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody id="topProductsTable">
            </tbody>
          </table>
        </div>
      </div>

      <!-- Row 4: Dead Stock Alert -->
      <div class="data-card">
        <div class="card-header">
          <h3><i class="fas fa-exclamation-triangle" style="color: #ff7a1f; margin-right: 8px;"></i>Dead Stock Alert</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Part Type</th>
                <th>Total Sold</th>
                <th>Revenue</th>
                <th>Last Sale</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="deadStockTable">
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="admin-section" id="section-settings">
      <div class="section-header">
        <h2 class="section-title">Settings</h2>
      </div>

      <div class="settings-grid">
        <div class="data-card">
          <div class="card-header">
            <h3>Store Information</h3>
          </div>
          <form class="settings-form" id="storeInfoForm" onsubmit="saveStoreInfo(event)">
            <div class="form-group">
              <label>Store Name</label>
              <input type="text" class="form-control" id="storeName" value="ADE GARAGE">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" id="storeEmail" value="admin@adegarage.com">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" class="form-control" id="storePhone" value="+63 912 345 6789">
            </div>
            <div class="form-group">
              <label>Address</label>
              <input type="text" class="form-control" id="storeAddress" value="gedli lamang, Philippines">
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" class="form-control" id="storeLocation" value="Cebu City, Philippines" placeholder="City, Province/Region">
            </div>
            <button type="submit" class="btn-action btn-primary">Save Changes</button>
          </form>
        </div>

        <div class="data-card">
          <div class="card-header">
            <h3>Notifications</h3>
          </div>
          <form class="settings-form" id="notificationSettingsForm" onsubmit="saveNotificationSettings(event)">
            <div class="form-check">
              <input type="checkbox" id="emailNotif" checked>
              <label for="emailNotif">Email Notifications</label>
            </div>
            <div class="form-check">
              <input type="checkbox" id="orderNotif" checked>
              <label for="orderNotif">New Order Alerts</label>
            </div>
            <div class="form-check">
              <input type="checkbox" id="stockNotif" checked>
              <label for="stockNotif">Low Stock Alerts</label>
            </div>
            <div class="form-check">
              <input type="checkbox" id="customerNotif">
              <label for="customerNotif">New Customer Alerts</label>
            </div>
            <button type="submit" class="btn-action btn-primary">Save Changes</button>
          </form>
        </div>

        <div class="data-card">
          <div class="card-header">
            <h3>Business Hours</h3>
          </div>
          <form class="settings-form" id="businessHoursForm" onsubmit="saveBusinessHours(event)">
            <div class="form-group">
              <label>Opening Time</label>
              <input type="time" class="form-control" id="openingTime" value="09:00">
            </div>
            <div class="form-group">
              <label>Closing Time</label>
              <input type="time" class="form-control" id="closingTime" value="18:00">
            </div>
            <div class="form-check">
              <input type="checkbox" id="weekendOpen" checked>
              <label for="weekendOpen">Open on Weekends</label>
            </div>
            <button type="submit" class="btn-action btn-primary">Save Changes</button>
          </form>
        </div>

        <div class="data-card">
          <div class="card-header">
            <h3>Security</h3>
          </div>
          <form class="settings-form" id="securityForm" onsubmit="changePassword(event)">
            <div class="form-group">
              <label>Current Password</label>
              <input type="password" class="form-control" id="currentPassword">
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input type="password" class="form-control" id="newPassword">
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input type="password" class="form-control" id="confirmPassword">
            </div>
            <button type="submit" class="btn-action btn-primary">Change Password</button>
          </form>
        </div>
      </div>
    </section>
  </main>

 
  <div class="admin-modal" id="productModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 id="productModalTitle">Add New Product</h3>
        <button class="modal-close" onclick="closeProductModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form id="productForm" class="settings-form">
          <input type="hidden" id="productId">
          
          <div class="form-group">
            <label>Product Image</label>
            <input type="file" class="form-control" id="productImage" accept="image/*" onchange="previewProductImage(event)">
            <small style="color: #94a3b8;">Upload a new image to replace the current one, or leave this blank to keep the existing product image.</small>
            <div id="imagePreview" style="margin-top: 10px; display: none;">
              <img id="previewImg" style="max-width: 150px; max-height: 150px; border-radius: 8px; border: 2px solid #1e2a38;">
            </div>
            <input type="hidden" id="productImageUrl">
          </div>

          <div class="form-group">
            <label>Product Name</label>
            <input type="text" class="form-control" id="productName" required>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" id="productDescription" rows="3" placeholder="Enter product description..." required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select class="form-control" id="productCategory" required>
                <option value="brakes">Brakes</option>
                <option value="tires">Tires</option>
                <option value="engine">Engine</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div class="form-group">
              <label>Brand</label>
              <select class="form-control" id="productBrand" required>
                <option value="aeromax">AeroMax</option>
                <option value="speedtech">SpeedTech</option>
                <option value="motopro">MotoPro</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Price (₱)</label>
              <input type="number" class="form-control" id="productPrice" required min="0" step="0.01">
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" class="form-control" id="productStock" required min="0">
            </div>
          </div>
          <div class="form-group">
            <label>Full Description (Optional)</label>
            <textarea class="form-control" id="productFullDescription" rows="4" placeholder="Detailed product description..."></textarea>
          </div>

          <div class="form-group">
            <label>Variations (Optional - JSON format)</label>
            <textarea class="form-control" id="productVariations" rows="3" placeholder='{"size": ["Small", "Medium (+₱50)"], "color": ["Black", "Red (+₱30)"]}'></textarea>
            <small style="color: #94a3b8;">Example: {"size": ["Small", "Medium"], "material": ["Ceramic", "Metallic"]}</small>
          </div>

          <div class="form-group">
            <label>Specifications (Optional - JSON format)</label>
            <textarea class="form-control" id="productSpecifications" rows="3" placeholder='{"Material": "Ceramic", "Weight": "850g"}'></textarea>
            <small style="color: #94a3b8;">Example: {"Material": "Ceramic", "Diameter": "280mm"}</small>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn-action" onclick="closeProductModal()">Cancel</button>
        <button class="btn-action btn-primary" onclick="saveProduct()">Save Product</button>
      </div>
    </div>
  </div>

  <div class="order-detail-modal" id="orderDetailModal">
    <div class="order-detail-content">
      <div class="order-detail-header">
        <div>
          <h3 id="orderDetailId">ADE-2025-001</h3>
          <div class="order-detail-meta" id="orderDetailMeta">Order snapshot</div>
        </div>
        <button class="modal-close" onclick="closeOrderDetail()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="order-detail-body">
        <div class="order-info-section">
          <h4><i class="fas fa-info-circle"></i> Order Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Order ID</span>
              <span class="info-value" id="detailOrderId">ADE-2025-001</span>
            </div>
            <div class="info-item">
              <span class="info-label">Customer</span>
              <span class="info-value" id="detailCustomer">Junaica Layno</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status</span>
              <span class="info-value" id="detailStatus">
                <span class="status-badge to-ship">TO SHIP</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Order Date</span>
              <span class="info-value" id="detailDate">January 10, 2025</span>
            </div>
          </div>
        </div>

        <div class="order-info-section">
          <h4><i class="fas fa-box"></i> Products</h4>
          <div id="detailProducts">
          </div>
        </div>

        <div class="order-info-section">
          <h4><i class="fas fa-user-shield"></i> Customer & Delivery</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value" id="detailCustomerEmail">admin@adegarage.com</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone</span>
              <span class="info-value" id="detailCustomerPhone">+63 000 000 0000</span>
            </div>
            <div class="info-item info-item-wide">
              <span class="info-label">Shipping Address</span>
              <span class="info-value" id="detailShippingAddress">Address</span>
            </div>
            <div class="info-item">
              <span class="info-label">City</span>
              <span class="info-value" id="detailShippingCity">Cebu City</span>
            </div>
            <div class="info-item">
              <span class="info-label">Postal Code</span>
              <span class="info-value" id="detailZipCode">6000</span>
            </div>
          </div>
        </div>

        <div class="order-info-section">
          <h4><i class="fas fa-credit-card"></i> Payment Details</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Payment Method</span>
              <span class="info-value" id="detailPaymentMethod">GCash</span>
            </div>
            <div class="info-item">
              <span class="info-label">Subtotal</span>
              <span class="info-value" id="detailSubtotal">₱2,500</span>
            </div>
            <div class="info-item">
              <span class="info-label">Shipping Fee</span>
              <span class="info-value" id="detailShippingFee">₱100</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total</span>
              <span class="info-value total-amount" id="detailTotal">₱2,600</span>
            </div>
          </div>
        </div>

        <div class="order-info-section">
          <h4><i class="fas fa-truck"></i> Shipping Information</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Shipping Method</span>
              <span class="info-value" id="detailShippingMethod">J&T Express - Pick Up</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tracking Number</span>
              <span class="info-value" id="detailTrackingNumber">JT73116575</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estimated Delivery</span>
              <span class="info-value" id="detailEstimatedDelivery">January 15-17, 2025</span>
            </div>
          </div>
        </div>
      </div>

      <div class="order-detail-footer">
        <button class="btn-update-status" onclick="openOrderStatusModal()">
          <i class="fas fa-check-circle"></i> Change Status
        </button>
        <button class="btn-print" onclick="printOrder()">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  </div>

  <div class="admin-modal" id="orderStatusModal">
    <div class="modal-dialog" style="max-width: 520px;">
      <div class="modal-header">
        <h3>Update Order Status</h3>
        <button class="modal-close" onclick="closeOrderStatusModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="status-modal-summary">
          <div class="status-modal-label">Selected Order</div>
          <div class="status-modal-order" id="orderStatusOrderNumber">#ADE-2025-001</div>
          <div class="status-modal-current" id="orderStatusCurrentBadge"></div>
        </div>
        <form class="settings-form" onsubmit="submitOrderStatusUpdate(event)">
          <div class="form-group">
            <label for="orderStatusSelect">New Status</label>
            <select class="form-control" id="orderStatusSelect" required>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="status-modal-note">
            <i class="fas fa-sparkles"></i>
            <span>Use the dropdown to update the order without typing anything manually.</span>
          </div>
          <div class="modal-footer modal-footer-inline">
            <button type="button" class="btn-action" onclick="closeOrderStatusModal()">Cancel</button>
            <button type="submit" class="btn-action btn-primary" id="saveOrderStatusBtn">Save Status</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="admin-modal" id="dashboardStatModal">
    <div class="modal-dialog" style="max-width: 860px;">
      <div class="modal-header">
        <h3 id="dashboardStatTitle">Dashboard Detail</h3>
        <button class="modal-close" onclick="closeDashboardStatModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="stat-modal-hero">
          <div>
            <div class="stat-modal-kicker" id="dashboardStatKicker">Overview</div>
            <div class="stat-modal-value" id="dashboardStatValue">0</div>
            <div class="stat-modal-description" id="dashboardStatDescription">Detailed breakdown</div>
          </div>
          <div class="stat-modal-badge" id="dashboardStatBadge">
            <i class="fas fa-chart-line"></i>
          </div>
        </div>
        <div class="stat-modal-grid" id="dashboardStatGrid"></div>
        <div class="stat-modal-section">
          <div class="stat-modal-section-title">What this includes</div>
          <div class="stat-modal-list" id="dashboardStatList"></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-action" onclick="closeDashboardStatModal()">Close</button>
        <button class="btn-action btn-primary" id="dashboardStatActionBtn" onclick="handleDashboardStatAction()">Open Section</button>
      </div>
    </div>
  </div>

  <div class="notification-panel" id="notificationPanel">
    <div class="panel-header">
      <h3 class="panel-title">Notifications</h3>
      <button class="panel-close" onclick="closeNotificationPanel()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="panel-content" id="notificationContent">
    </div>
  </div>

  <div class="message-panel" id="messagePanel">
    <div class="message-list-view" id="messageListView">
      <div class="panel-header">
        <h3 class="panel-title">Messages</h3>
        <button class="panel-close" onclick="closeMessagePanel()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="panel-content" id="messageContent">
      </div>
    </div>

    <div class="message-conversation" id="messageConversation">
      <div class="conversation-header">
        <button class="conversation-back" onclick="backToMessageList()">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="conversation-avatar"></div>
        <div class="conversation-info">
          <div class="conversation-name" id="conversationName">Customer</div>
          <div class="conversation-status">Online</div>
        </div>
      </div>
      <div class="conversation-messages" id="conversationMessages">
      </div>
      <div class="conversation-input">
        <input type="file" id="imageInput" accept="image/*" style="display: none;" onchange="handleImageSelect(event)">
        <button class="conversation-attach" onclick="document.getElementById('imageInput').click()">
          <i class="fas fa-paperclip"></i>
        </button>
        <input type="text" placeholder="Type your message..." id="messageInput" onkeypress="handleMessageKeyPress(event)" />
        <button class="conversation-send" onclick="sendMessage()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>

  <div class="toast-container" id="toastRoot"></div>

  <div class="admin-modal" id="addStockModal">
    <div class="modal-dialog" style="max-width: 500px;">
      <div class="modal-header">
        <h3>Add Stock</h3>
        <button class="modal-close" onclick="closeAddStockModal()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form id="addStockForm" class="settings-form">
          <input type="hidden" id="stockProductId">
          <div class="form-group">
            <label>Product Name</label>
            <input type="text" class="form-control" id="stockProductName" readonly style="background: #0a0f14; cursor: not-allowed;">
          </div>
          <div class="form-group">
            <label>Current Stock</label>
            <input type="text" class="form-control" id="stockCurrentAmount" readonly style="background: #0a0f14; cursor: not-allowed;">
          </div>
          <div class="form-group">
            <label>Quantity to Add</label>
            <input type="number" class="form-control" id="stockQuantityToAdd" required min="1" placeholder="Enter quantity to add">
          </div>
          <div class="form-group">
            <label>New Total Stock</label>
            <input type="text" class="form-control" id="stockNewTotal" readonly style="background: #0a0f14; cursor: not-allowed; font-weight: 600; color: #1eff8e;">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn-action" onclick="closeAddStockModal()">Cancel</button>
        <button class="btn-action btn-primary" onclick="confirmAddStock()">Add Stock</button>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="{{url('Js/admin.js')}}"></script>
</body>
</html>
