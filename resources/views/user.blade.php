<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>User Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link rel="stylesheet" href="{{url('Css/user.css')}}">
</head>
<body>

  <button class="hamburger-menu" id="hamburgerMenu">
    <span></span>
    <span></span>
    <span></span>
  </button>

  <div class="sidebar-overlay" id="sidebarOverlay"></div>


  <aside class="sidebar" id="sidebar">

    <nav>
      <ul>
        <li class="active" data-section="shop">
          <i class="fas fa-shop"></i><a href="/customer_home">Shop</a> 
        </li>
         <li class="active" data-section="profile">
          <i class="fas fa-user"></i> Profile
        </li>
        <li data-section="purchases">
          <i class="fas fa-box"></i> My Purchases
        </li>
        <li data-section="settings">
          <i class="fas fa-cog"></i> Settings
        </li>
        <li>
          <a href="{{route('logout')}}"onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
         <i class="fas fa-sign-out-alt" class="btn-logout" action="/logout" method="POST"></i> Log Out </a>
         <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">@csrf</form>
        </li>
      </ul>
    </nav>
  </aside>


  <main class="content">
    <section id="profile" class="section active">
      <div class="glass profile-card">
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <div class="avatar" id="avatarImage"></div>
            <button class="avatar-edit-btn" id="avatarEditBtn">
              <i class="fas fa-camera"></i>
            </button>
            <input type="file" id="avatarInput" accept="image/*" style="display: none;">
          </div>
        </div>


        @if(session('success'))
          <div class="alert alert-success">
            {{ session('success') }}
          </div>
        @endif

        @if($errors->any())
          <div class="alert alert-error">
            <ul>
              @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
              @endforeach
            </ul>
          </div>
        @endif

        <form class="profile-form" method="POST" action="{{ route('profile.update') }}">
          @csrf
          @method('PUT')
          <div>
            <label>Username</label>
            <input type="text" name="username" placeholder="Enter username" value="{{ old('username', auth()->user()->username) }}" required>
            @error('username')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter email" value="{{ old('email', auth()->user()->email) }}" required>
            @error('email')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>
          <div>
            <label>First Name</label>
            <input type="text" name="first_name" placeholder="Enter first name" value="{{ old('first_name', auth()->user()->first_name) }}">
            @error('first_name')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>
          <div>
            <label>Last Name</label>
            <input type="text" name="last_name" placeholder="Enter last name" value="{{ old('last_name', auth()->user()->last_name) }}">
            @error('last_name')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>
          <div>
            <label>Phone Number</label>
            <input type="text" name="phone_number" placeholder="Enter phone number" value="{{ old('phone_number', auth()->user()->phone_number) }}">
            @error('phone_number')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>
          <div>
            <label>Address / City</label>
            <input type="text" name="address" placeholder="Enter address" value="{{ old('address', auth()->user()->address) }}">
            @error('address')
              <span class="error-text">{{ $message }}</span>
            @enderror
          </div>

          <div class="profile-actions">
            <button type="submit" class="btn orange">Save Changes</button>
            <button type="button" class="btn blue">Cancel</button>
          </div>
        </form>
      </div>
    </section>
    <section id="purchases" class="section">
      <h2 class="section-title blue">MY PURCHASES</h2>
      <div class="tabs">
        <button class="tab active" data-tab="toPay">To Pay</button>
        <button class="tab" data-tab="toShip">To Ship</button>
        <button class="tab" data-tab="toReceive">To Receive</button>
        <button class="tab" data-tab="toRate">To Rate</button>
        <button class="tab" data-tab="completed">Completed</button>
        <button class="tab" data-tab="returned">Returned</button>
        <button class="tab" data-tab="cancelled">Cancelled</button>
      </div>
      <div class="orders-grid" id="ordersGrid">
        <p style="text-align: center; color: #a7c0d8; padding: 40px;">Loading your orders...</p>
      </div>
    </section>
    <section id="settings" class="section">
      <h2 class="section-title blue">SETTINGS</h2>
      <div class="glass settings-box">
        <h3 class="settings-title">
          <i class="fas fa-globe"></i> Language & Region
        </h3>
        <div class="setting-item">
          <label>Language</label>
          <select class="setting-select">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div class="setting-item">
          <label>Region</label>
          <select class="setting-select">
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
            <option value="au">Australia</option>
          </select>
        </div>
      </div>
      <div class="glass settings-box">
        <h3 class="settings-title">
          <i class="fas fa-bell"></i> Notifications
        </h3>
        <div class="setting-item">
          <label>Email Notifications</label>
          <label class="toggle-switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <label>Push Notifications</label>
          <label class="toggle-switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <label>SMS Notifications</label>
          <label class="toggle-switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <div class="glass settings-box">
        <h3 class="settings-title">
          <i class="fas fa-volume-up"></i> Audio
        </h3>
        <div class="setting-item">
          <label>Sound Effects</label>
          <label class="toggle-switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <label>Volume Level</label>
          <input type="range" class="volume-slider" min="0" max="100" value="75">
        </div>
      </div>
      <div class="glass settings-box">
        <h3 class="settings-title">
          <i class="fas fa-shield-alt"></i> Privacy & Security
        </h3>
        <div class="setting-item">
          <label>Two-Factor Authentication</label>
          <label class="toggle-switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <label>Profile Visibility</label>
          <select class="setting-select">
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div class="setting-item">
          <button class="btn orange">Change Password</button>
          <button class="btn blue">Download Data</button>
        </div>
      </div>
    </section>

  </main>

  <script src="{{url('Js/user.js')}}"></script>
  <script>
    // Load user's orders from database
    let allOrders = [];
    
    async function loadMyOrders() {
      try {
        const response = await fetch('/api/my-orders');
        const data = await response.json();
        
        if (data.success) {
          allOrders = data.orders;
          displayOrders(allOrders);
        } else {
          document.getElementById('ordersGrid').innerHTML = '<p style="text-align: center; color: #a7c0d8; padding: 40px;">No orders found</p>';
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersGrid').innerHTML = '<p style="text-align: center; color: #a7c0d8; padding: 40px;">Error loading orders</p>';
      }
    }
    
    function displayOrders(orders) {
      const grid = document.getElementById('ordersGrid');
      
      if (orders.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #a7c0d8; padding: 40px;">No orders found</p>';
        return;
      }
      
      grid.innerHTML = orders.map(order => {
        const firstItem = order.items[0];
        const imageUrl = firstItem.product_image ? `/storage/${firstItem.product_image}` : 'https://via.placeholder.com/60';
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Map status to tab names
        let dataStatus = '';
        let badgeClass = '';
        let badgeText = '';
        let buttonText = '';
        let buttonClass = '';
        
        if (order.status === 'pending') {
          dataStatus = 'toPay';
          badgeClass = 'orange';
          badgeText = 'To Pay';
          buttonText = 'Cancel Order';
          buttonClass = 'orange';
        } else if (order.status === 'processing') {
          dataStatus = 'toShip';
          badgeClass = 'blue';
          badgeText = 'To Ship';
          buttonText = 'Track Order';
          buttonClass = 'blue';
        } else if (order.status === 'shipped') {
          dataStatus = 'toReceive';
          badgeClass = 'blue';
          badgeText = 'To Receive';
          buttonText = 'Track Package';
          buttonClass = 'blue';
        } else if (order.status === 'delivered') {
          dataStatus = 'completed';
          badgeClass = 'green';
          badgeText = 'Completed';
          buttonText = 'Buy Again';
          buttonClass = 'blue';
        } else if (order.status === 'cancelled') {
          dataStatus = 'cancelled';
          badgeClass = 'orange';
          badgeText = 'Cancelled';
          buttonText = 'Reorder';
          buttonClass = 'blue';
        }
        
        return `
          <div class="order-card glass" data-status="${dataStatus}">
            <p class="order-number">Order #${order.order_number}</p>
            <span class="badge ${badgeClass}">${badgeText}</span>
            <div class="order-details">
              <div class="thumb" style="background-image: url('${imageUrl}'); background-size: cover; background-position: center;"></div>
              <div class="info">
                <h3 class="product-name">${firstItem.product_name}</h3>
                <p class="price">₱${parseFloat(order.total).toLocaleString()}</p>
                <p class="qty">Qty: ${totalItems}${order.items.length > 1 ? ' (+' + (order.items.length - 1) + ' more)' : ''}</p>
              </div>
            </div>
            ${buttonText ? `<button class="btn ${buttonClass}" onclick="handleOrderAction(${order.id}, '${order.status}')">${buttonText}</button>` : ''}
          </div>
        `;
      }).join('');
      
      // After displaying orders, apply the active tab filter
      filterOrdersByActiveTab();
    }
    
    function filterOrdersByActiveTab() {
      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        const status = activeTab.dataset.tab;
        const orderCards = document.querySelectorAll('.order-card');
        
        orderCards.forEach(card => {
          if (card.dataset.status === status) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
    }
    
    async function handleOrderAction(orderId, status) {
      if (status === 'pending') {
        // Cancel order
        if (confirm('Are you sure you want to cancel this order?')) {
          try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken || ''
              }
            });
            
            const data = await response.json();
            
            if (data.success) {
              alert('Order cancelled successfully!');
              loadMyOrders(); // Reload orders
            } else {
              alert('Failed to cancel order: ' + data.message);
            }
          } catch (error) {
            console.error('Error cancelling order:', error);
            alert('An error occurred while cancelling the order');
          }
        }
      } else if (status === 'processing' || status === 'shipped') {
        alert('Tracking feature coming soon! Order ID: ' + orderId);
      } else if (status === 'delivered') {
        alert('Buy again feature coming soon! Order ID: ' + orderId);
      } else if (status === 'cancelled') {
        alert('Reorder feature coming soon! Order ID: ' + orderId);
      }
    }
    
    // Load orders when page loads
    document.addEventListener('DOMContentLoaded', loadMyOrders);
  </script>
</body>
</html>
