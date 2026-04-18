// Cart functionality
let cartData = [];

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

/**
 * Load cart items from server
 */
window.loadCart = async function loadCart() {
  try {
    console.log('Loading cart from /api/cart...');
    const response = await fetch('/api/cart');
    const data = await response.json();
    
    console.log('Cart API response:', data);
    
    if (data.success) {
      cartData = data.cart_items;
      console.log('Cart data set to:', cartData);
      console.log('Cart count:', data.count);
      updateCartCount(data.count);
      updateCartDisplayFromDB();
    } else {
      console.error('Cart API returned success: false');
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
}

/**
 * Add product to cart
 */
window.addToCart = async function addToCart(productId, quantity = 1) {
  try {
    console.log('Adding to cart:', { productId, quantity });
    
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    console.log('CSRF Token:', csrfToken ? 'Found' : 'Missing');
    
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: quantity
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok && data.success) {
      showToast('success', data.message || 'Product added to cart!');
      await loadCart(); // Reload cart and update display
    } else {
      showToast('error', data.message || 'Failed to add to cart');
      console.error('Cart error:', data);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('error', 'An error occurred: ' + error.message);
  }
}

/**
 * Update cart item quantity
 */
window.updateCartItem = async function updateCartItem(cartItemId, quantity) {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({ quantity })
    });

    const data = await response.json();

    if (data.success) {
      await loadCart(); // Reload cart
    } else {
      showToast('error', data.message || 'Failed to update cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    showToast('error', 'An error occurred while updating cart');
  }
}

/**
 * Remove item from cart
 */
window.removeFromCart = async function removeFromCart(cartItemId) {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      }
    });

    const data = await response.json();

    if (data.success) {
      showToast('success', 'Item removed from cart');
      await loadCart(); // Reload cart
    } else {
      showToast('error', data.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    showToast('error', 'An error occurred while removing item');
  }
}

/**
 * Clear entire cart
 */
window.clearCart = async function clearCart() {
  if (!confirm('Are you sure you want to clear your cart?')) {
    return;
  }

  try {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      }
    });

    const data = await response.json();

    if (data.success) {
      showToast('success', 'Cart cleared');
      await loadCart(); // Reload cart
    } else {
      showToast('error', data.message || 'Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    showToast('error', 'An error occurred while clearing cart');
  }
}

/**
 * Update cart count badge
 */
window.updateCartCount = function updateCartCount(count) {
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = count || 0;
    cartCountElement.style.display = count > 0 ? 'block' : 'none';
  }
}

/**
 * Update cart display from database
 */
window.updateCartDisplayFromDB = function updateCartDisplayFromDB() {
  console.log('Updating cart display from DB. Cart data:', cartData);
  
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const subtotalElement = document.getElementById('subtotal');
  const orderTotalElement = document.getElementById('orderTotal');

  console.log('Cart container found:', !!cartItemsContainer);

  if (!cartItemsContainer) {
    console.warn('Cart items container not found! Will retry when container is available.');
    return;
  }

  if (!cartData || cartData.length === 0) {
    console.log('Cart is empty, showing empty message');
    cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #94a3b8;"><p>Your cart is empty</p></div>';
    if (cartTotalElement) cartTotalElement.textContent = '₱0';
    if (subtotalElement) subtotalElement.textContent = '₱0';
    if (orderTotalElement) orderTotalElement.textContent = '₱0';
    return;
  }

  console.log('Rendering', cartData.length, 'cart items');
  
  // Calculate total
  const total = cartData.reduce((sum, item) => sum + item.subtotal, 0);

  // Render cart items
  cartItemsContainer.innerHTML = cartData.map(item => {
    const imageUrl = item.product_image ? `/storage/${item.product_image}` : `https://via.placeholder.com/100/1a2332/1ee0ff?text=${item.product_name.substring(0, 2)}`;
    
    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="item-image">
          <img src="${imageUrl}" alt="${item.product_name}">
        </div>
        <div class="item-details">
          <div class="item-name">${item.product_name}</div>
          <div class="item-price">₱${parseFloat(item.price).toLocaleString()}</div>
          <div class="item-variations">
            Brand: ${item.product_brand} | Category: ${capitalizeFirst(item.product_category)}
          </div>
        </div>
        <div class="item-controls">
          <div class="cart-quantity-control">
            <button class="cart-quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity - 1})">−</button>
            <span class="cart-quantity-display">${item.quantity}</span>
            <button class="cart-quantity-btn" onclick="changeQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Update totals
  if (cartTotalElement) cartTotalElement.textContent = `₱${total.toLocaleString()}`;
  if (subtotalElement) subtotalElement.textContent = `₱${total.toLocaleString()}`;
  if (orderTotalElement) orderTotalElement.textContent = `₱${total.toLocaleString()}`;
  
  // Also update checkout prices if the function exists
  if (typeof updatePrices === 'function') {
    updatePrices(total);
  }
}

/**
 * Change quantity
 */
window.changeQuantity = async function changeQuantity(cartItemId, newQuantity) {
  if (newQuantity < 1) {
    await removeFromCart(cartItemId);
  } else {
    await updateCartItem(cartItemId, newQuantity);
  }
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Show toast notification (if not already defined)
 */
function showToast(type, message) {
  // Check if showToast is already defined globally
  if (typeof window.showToast === 'function') {
    window.showToast(type, message);
    return;
  }

  // Simple fallback toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
