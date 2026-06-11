// Cart functionality
let cartData = [];
let cartLoadPromise = null;

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

/**
 * Load cart items from server
 */
window.loadCart = async function loadCart() {
  if (cartLoadPromise) {
    return cartLoadPromise;
  }

  cartLoadPromise = (async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (data.success) {
        cartData = data.cart_items;
        updateCartCount(data.count);
        updateCartDisplayFromDB();
        return data;
      } else {
        console.error('Cart API returned success: false');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      cartLoadPromise = null;
    }
  })();

  return cartLoadPromise;
}

/**
 * Add product to cart
 */
window.addToCart = async function addToCart(productId, quantity = 1, options = {}) {
  const { reload = true, silent = false } = options;

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

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

    const data = await response.json();

    if (response.ok && data.success) {
      if (!silent) {
        showCartToast('success', data.message || 'Product added to cart!');
      }

      if (reload) {
        await loadCart();
      } else {
        const currentCount = Number(document.getElementById('cartCount')?.textContent || 0);
        updateCartCount(currentCount + quantity);
      }

      return data;
    } else {
      showCartToast('error', data.message || 'Failed to add to cart');
      console.error('Cart error:', data);
      return data;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showCartToast('error', 'An error occurred: ' + error.message);
    return { success: false, message: error.message };
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
      await loadCart();
    } else {
      showCartToast('error', data.message || 'Failed to update cart');
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    showCartToast('error', 'An error occurred while updating cart');
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
      showCartToast('success', 'Item removed from cart');
      await loadCart();
    } else {
      showCartToast('error', data.message || 'Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    showCartToast('error', 'An error occurred while removing item');
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
      showCartToast('success', 'Cart cleared');
      await loadCart();
    } else {
      showCartToast('error', data.message || 'Failed to clear cart');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
    showCartToast('error', 'An error occurred while clearing cart');
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
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const subtotalElement = document.getElementById('subtotal');
  const orderTotalElement = document.getElementById('orderTotal');

  if (!cartItemsContainer) {
    return;
  }

  if (!cartData || cartData.length === 0) {
    cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #94a3b8;"><p>Your cart is empty</p></div>';
    if (cartTotalElement) cartTotalElement.textContent = '₱0';
    if (subtotalElement) subtotalElement.textContent = '₱0';
    if (orderTotalElement) orderTotalElement.textContent = '₱0';
    return;
  }

  // Calculate total
  const total = cartData.reduce((sum, item) => sum + item.subtotal, 0);

  // Render cart items
  cartItemsContainer.innerHTML = cartData.map(item => {
    const imageUrl = item.product_image ? `/storage/${item.product_image}` : '/images/products/placeholder.png';
    
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
function showCartToast(type, message) {
  // Check if showToast is already defined globally
  if (typeof window.showToast === 'function') {
    if (window.showToast.length >= 2) {
      window.showToast(type, message);
    } else {
      window.showToast(message);
    }
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
