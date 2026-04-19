// Admin Orders Management
let ordersData = [];

/**
 * Load all orders
 */
async function loadOrders() {
  try {
    console.log('Loading orders from /api/orders...');
    const response = await fetch('/api/orders');
    const data = await response.json();
    
    console.log('Orders API response:', data);
    
    if (data.success) {
      ordersData = data.orders;
      console.log('Orders data set to:', ordersData);
      displayOrders();
    } else {
      console.error('Orders API returned success: false');
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

/**
 * Display orders in the table
 */
function displayOrders() {
  const ordersTableBody = document.getElementById('ordersTableBody');
  
  if (!ordersTableBody) {
    console.warn('Orders table body not found!');
    return;
  }

  if (ordersData.length === 0) {
    ordersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
    return;
  }

  ordersTableBody.innerHTML = ordersData.map(order => {
    const statusClass = getStatusClass(order.status);
    const itemsCount = order.items.length;
    
    return `
      <tr>
        <td>${order.order_number}</td>
        <td>${order.customer_name}</td>
        <td>${order.customer_email}</td>
        <td>${order.customer_phone}</td>
        <td>₱${parseFloat(order.total).toLocaleString()}</td>
        <td>
          <span class="status-badge status-${statusClass}">${capitalizeFirst(order.status)}</span>
        </td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td>
          <button class="btn-view" onclick="viewOrderDetails(${order.id})">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-status" onclick="updateOrderStatus(${order.id}, '${order.status}')">
            <i class="fas fa-edit"></i> Status
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Get status class for styling
 */
function getStatusClass(status) {
  const statusMap = {
    'pending': 'warning',
    'processing': 'info',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return statusMap[status] || 'secondary';
}

/**
 * View order details
 */
function viewOrderDetails(orderId) {
  const order = ordersData.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById('orderDetailsModal');
  const modalContent = document.getElementById('orderDetailsContent');

  const itemsHTML = order.items.map(item => {
    const imageUrl = item.product_image ? `/storage/${item.product_image}` : 'https://via.placeholder.com/80';
    return `
      <div class="order-item">
        <img src="${imageUrl}" alt="${item.product_name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        <div class="order-item-details">
          <div class="order-item-name">${item.product_name}</div>
          <div class="order-item-meta">Brand: ${item.product_brand} | Category: ${capitalizeFirst(item.product_category)}</div>
          <div class="order-item-price">₱${parseFloat(item.price).toLocaleString()} × ${item.quantity} = ₱${parseFloat(item.subtotal).toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');

  modalContent.innerHTML = `
    <div class="order-details-header">
      <h3>Order #${order.order_number}</h3>
      <span class="status-badge status-${getStatusClass(order.status)}">${capitalizeFirst(order.status)}</span>
    </div>
    
    <div class="order-section">
      <h4>Customer Information</h4>
      <p><strong>Name:</strong> ${order.customer_name}</p>
      <p><strong>Email:</strong> ${order.customer_email}</p>
      <p><strong>Phone:</strong> ${order.customer_phone}</p>
    </div>

    <div class="order-section">
      <h4>Shipping Address</h4>
      <p>${order.shipping_address}</p>
      <p>${order.city}, ${order.zip_code}</p>
    </div>

    <div class="order-section">
      <h4>Order Items</h4>
      ${itemsHTML}
    </div>

    <div class="order-section">
      <h4>Order Summary</h4>
      <div class="order-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>₱${parseFloat(order.subtotal).toLocaleString()}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>₱${parseFloat(order.shipping_cost).toLocaleString()}</span>
        </div>
        <div class="summary-row total">
          <span><strong>Total:</strong></span>
          <span><strong>₱${parseFloat(order.total).toLocaleString()}</strong></span>
        </div>
      </div>
    </div>

    <div class="order-section">
      <p><strong>Payment Method:</strong> ${order.payment_method}</p>
      <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
    </div>
  `;

  modal.style.display = 'block';
}

/**
 * Update order status
 */
async function updateOrderStatus(orderId, currentStatus) {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusLabels = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  const options = statuses.map(status => 
    `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${statusLabels[status]}</option>`
  ).join('');

  const newStatus = prompt(`Select new status for order:\n\nCurrent: ${statusLabels[currentStatus]}\n\nEnter: pending, processing, shipped, delivered, or cancelled`, currentStatus);

  if (!newStatus || !statuses.includes(newStatus.toLowerCase())) {
    return;
  }

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      },
      body: JSON.stringify({ status: newStatus.toLowerCase() })
    });

    const data = await response.json();

    if (data.success) {
      alert('Order status updated successfully!');
      loadOrders(); // Reload orders
    } else {
      alert('Failed to update order status: ' + data.message);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    alert('An error occurred while updating order status');
  }
}

/**
 * Close modal
 */
function closeOrderModal() {
  const modal = document.getElementById('orderDetailsModal');
  modal.style.display = 'none';
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Filter orders by status
 */
function filterOrdersByStatus(status) {
  const filteredOrders = status === 'all' 
    ? ordersData 
    : ordersData.filter(order => order.status === status);
  
  const ordersTableBody = document.getElementById('ordersTableBody');
  
  if (filteredOrders.length === 0) {
    ordersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
    return;
  }

  ordersTableBody.innerHTML = filteredOrders.map(order => {
    const statusClass = getStatusClass(order.status);
    
    return `
      <tr>
        <td>${order.order_number}</td>
        <td>${order.customer_name}</td>
        <td>${order.customer_email}</td>
        <td>${order.customer_phone}</td>
        <td>₱${parseFloat(order.total).toLocaleString()}</td>
        <td>
          <span class="status-badge status-${statusClass}">${capitalizeFirst(order.status)}</span>
        </td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
        <td>
          <button class="btn-view" onclick="viewOrderDetails(${order.id})">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-status" onclick="updateOrderStatus(${order.id}, '${order.status}')">
            <i class="fas fa-edit"></i> Status
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Load orders when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ordersTableBody')) {
    loadOrders();
  }
});

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('orderDetailsModal');
  if (event.target === modal) {
    closeOrderModal();
  }
}
