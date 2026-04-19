let currentQuantity = 1;
    let currentProductData = {};
    let modalMode = 'both';
    let selectedVariations = {
      size: { value: 'small', price: 0, imageSuffix: 'small' },
      color: { value: 'black', price: 0, imageSuffix: 'black' },
      material: { value: 'ceramic', price: 0, imageSuffix: 'ceramic' }
    };

    let cartItems = [];
    let currentStep = 2;
    const shippingCost = 150;
    let isEditMode = false;

    // Global filter function - accessible from anywhere
    function getCheckedFilters(type){
      return Array.from(document.querySelectorAll(`input[data-filter-type="${type}"]:checked`)).map(i => i.id.toLowerCase());
    }

    function filterProducts(){
      const productItems = Array.from(document.querySelectorAll('.product-item'));
      const priceSlider = document.getElementById('priceRange');
      const searchInput = document.getElementById('searchInput');
      const modelSelect = document.getElementById('modelSelect');

      const checkedCategories = getCheckedFilters('category');
      const checkedBrands = getCheckedFilters('brand');
      const maxPrice = Number(priceSlider.value) || Infinity;
      const searchTerm = (searchInput.value||'').trim().toLowerCase();
      const selectedModel = (modelSelect.value||'').toLowerCase();

      let visibleCount = 0;

      productItems.forEach((el) => {
        const category = (el.dataset.category || '').toLowerCase();
        const brand = (el.dataset.brand || '').toLowerCase();
        const price = Number(el.dataset.price) || 0;
        const models = JSON.parse(el.getAttribute('data-models') || '[]').map(m => String(m).toLowerCase());

        const okCategory = checkedCategories.length === 0 || checkedCategories.includes(category);
        const okBrand = checkedBrands.length === 0 || checkedBrands.includes(brand);
        const okPrice = !maxPrice || price <= maxPrice;
        const okModel = !selectedModel || models.includes(selectedModel);

        const title = el.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const details = el.querySelector('.product-details')?.textContent.toLowerCase() || '';
        const okSearch = !searchTerm || title.includes(searchTerm) || details.includes(searchTerm);

        const show = okCategory && okBrand && okPrice && okModel && okSearch;
        el.style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      console.log(`Filtering: ${visibleCount} products visible`);
    }

    document.addEventListener('DOMContentLoaded', function () {
      const productItems = Array.from(document.querySelectorAll('.product-item'));
      const priceSlider = document.getElementById('priceRange');
      const currentPrice = document.getElementById('currentPrice');
      const searchInput = document.getElementById('searchInput');
      const modelSelect = document.getElementById('modelSelect');
      const cartCountSpan = document.getElementById('cartCount');
      const toastRoot = document.getElementById('toastRoot');
      
      // Username is already set by Blade template, no need to override
      const usernameDisplay = document.getElementById("usernameDisplay");

      if (currentPrice && priceSlider) {
        currentPrice.textContent = '₱' + Number(priceSlider.value || 15000).toLocaleString();
      }

      // Category filter - single selection
      document.querySelectorAll('input[type="checkbox"][data-filter-type="category"]').forEach(cb => {
        cb.addEventListener('change', function() {
          console.log('Category changed:', this.id, this.checked);
          if (this.checked) {
            document.querySelectorAll('input[type="checkbox"][data-filter-type="category"]').forEach(otherCb => {
              if (otherCb !== this) {
                otherCb.checked = false;
              }
            });
          }
          filterProducts();
        });
      });

      // Brand filter - multiple selection
      document.querySelectorAll('input[type="checkbox"][data-filter-type="brand"]').forEach(cb => {
        cb.addEventListener('change', function() {
          console.log('Brand changed:', this.id, this.checked);
          filterProducts();
        });
      });

      // Price slider
      if (priceSlider) {
        priceSlider.addEventListener('input', function () {
          console.log('Price changed:', this.value);
          if (currentPrice) {
            currentPrice.textContent = '₱' + Number(this.value).toLocaleString();
          }
          filterProducts();
        });
      }

      // Model compatibility
      if (modelSelect) {
        modelSelect.addEventListener('change', function() {
          console.log('Model changed:', this.value);
          filterProducts();
        });
      }

      // Search with debounce
      if (searchInput) {
        let searchTimeout = null;
        searchInput.addEventListener('input', function () {
          console.log('Search input:', this.value);
          clearTimeout(searchTimeout);
          searchTimeout = setTimeout(filterProducts, 160);
        });
      }

      document.querySelectorAll('.btn-buy-now').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const card = this.closest('.product-card');
          const productItem = this.closest('.product-item');
          openProductModal(card, productItem, 'buyNow');
        });
      });

      document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          const card = this.closest('.product-card');
          const productItem = this.closest('.product-item');
          openProductModal(card, productItem, 'addToCart');
        });
      });

      document.querySelectorAll('.recommendation-card-horizontal').forEach(card => {
        card.addEventListener('click', function(e) {
          e.preventDefault();
          openRecommendationModal(this);
        });
      });

      document.querySelectorAll('.variation-option').forEach(option => {
        option.addEventListener('click', function() {
          const variationType = this.dataset.variation;
          const value = this.dataset.value;
          const price = parseInt(this.dataset.price) || 0;
          const imageSuffix = this.dataset.imageSuffix || value;
          
          this.parentElement.querySelectorAll('.variation-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          
          this.classList.add('selected');
          
          selectedVariations[variationType] = { value: value, price: price, imageSuffix: imageSuffix };
          
          updateModalPrice();
          updateModalImage();
        });
      });

      loadSavedShippingInfo();

      // Initial filter to show all products
      console.log('Initializing filters...');
      console.log('Total products found:', productItems.length);
      filterProducts();
    });

    function updateModalPrice() {
      const basePrice = currentProductData.basePrice || 0;
      const variationTotal = Object.values(selectedVariations).reduce((sum, v) => sum + v.price, 0);
      const totalPrice = basePrice + variationTotal;
      
      document.getElementById('modalProductPrice').textContent = '₱' + totalPrice.toLocaleString();
      currentProductData.price = totalPrice;
    }

    function updateModalImage() {
      const baseImageUrl = currentProductData.baseImageUrl;
      const productName = currentProductData.title;
      
      const variationString = `${selectedVariations.size.imageSuffix}+${selectedVariations.material.imageSuffix}+${selectedVariations.color.imageSuffix}`;
      
      document.getElementById('modalProductImage').src = newImageUrl;
      document.getElementById('modalProductImage').alt = `${productName} - ${variationString}`;
    }

    // Make function globally accessible
    window.openProductModal = function openProductModal(card, productItem, mode = 'both') {
      currentQuantity = 1;
      modalMode = mode;
      
      const title = card.querySelector('.product-title').textContent;
      const stock = parseInt(productItem.dataset.stock) || 15;
      const basePrice = parseInt(productItem.dataset.price) || 0;
      const imageSrc = card.querySelector('.product-image').src;
      const productId = parseInt(productItem.dataset.productId) || null;
      
      console.log('openProductModal - Product data:', {
        productId: productId,
        title: title,
        hasProductId: !!productId,
        datasetProductId: productItem.dataset.productId
      });
      
      currentProductData = {
        id: productId,
        title: title,
        stock: stock,
        basePrice: basePrice,
        price: basePrice,
        imageSrc: imageSrc,
        baseImageUrl: imageSrc,
        fullDescription: productItem.dataset.fullDescription || null,
        variations: productItem.dataset.variations || null,
        specifications: productItem.dataset.specifications || null
      };
      
      console.log('currentProductData set to:', currentProductData);
      
      setupModal();
    }

    // Make function globally accessible
    window.openRecommendationModal = function openRecommendationModal(card) {
      currentQuantity = 1;
      modalMode = 'both';
      
      const title = card.dataset.productName || card.querySelector('.recommendation-title-horizontal')?.textContent || 'Product';
      const basePrice = parseInt(card.dataset.productPrice) || 0;
      const stock = parseInt(card.dataset.productStock) || 15;
      const imageSrc = card.dataset.productImage || card.querySelector('.recommendation-image-horizontal')?.src || '';
      const productId = parseInt(card.dataset.productId) || null;
      
      currentProductData = {
        id: productId,
        title: title,
        stock: stock,
        basePrice: basePrice,
        price: basePrice,
        imageSrc: imageSrc,
        baseImageUrl: imageSrc
      };
      
      setupModal();
    }

    function setupModal() {
      document.getElementById('modalProductTitle').textContent = currentProductData.title;
      document.getElementById('modalProductImage').src = currentProductData.imageSrc;
      document.getElementById('modalProductImage').alt = currentProductData.title;
      document.getElementById('modalProductPrice').textContent = '₱' + currentProductData.basePrice.toLocaleString();
      document.getElementById('quantityValue').textContent = currentQuantity;
      
      // Update description if available
      if (currentProductData.fullDescription) {
        const descElement = document.getElementById('productDescriptionText');
        if (descElement) {
          descElement.textContent = currentProductData.fullDescription;
        }
      }
      
      // Update specifications if available
      if (currentProductData.specifications) {
        try {
          const specs = JSON.parse(currentProductData.specifications);
          updateSpecifications(specs);
        } catch (e) {
          console.error('Error parsing specifications:', e);
        }
      }
      
      const stockStatus = document.getElementById('modalStockStatus');
      const stock = currentProductData.stock;
      
      if (stock > 10) {
        stockStatus.className = 'stock-status in-stock';
        stockStatus.innerHTML = '<i class="fa-solid fa-check-circle"></i><span id="modalStockText">In Stock (' + stock + ' units)</span>';
      } else if (stock > 0) {
        stockStatus.className = 'stock-status low-stock';
        stockStatus.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i><span id="modalStockText">Low Stock (' + stock + ' left)</span>';
      } else {
        stockStatus.className = 'stock-status low-stock';
        stockStatus.innerHTML = '<i class="fa-solid fa-times-circle"></i><span id="modalStockText">Out of Stock</span>';
      }
      
      document.querySelectorAll('.variation-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      document.querySelector('#sizeOptions .variation-option[data-value="small"]')?.classList.add('selected');
      document.querySelector('#colorOptions .variation-option[data-value="black"]')?.classList.add('selected');
      document.querySelector('#materialOptions .variation-option[data-value="ceramic"]')?.classList.add('selected');
      
      selectedVariations = {
        size: { value: 'small', price: 0, imageSuffix: 'small' },
        color: { value: 'black', price: 0, imageSuffix: 'black' },
        material: { value: 'ceramic', price: 0, imageSuffix: 'ceramic' }
      };

      updateModalPrice();
      
      const buyNowBtn = document.querySelector('.modal-action-btn.buy-now-action');
      const addCartBtn = document.querySelector('.modal-action-btn.add-cart-action');
      
      if (modalMode === 'buyNow') {
        buyNowBtn.classList.remove('hidden');
        addCartBtn.classList.add('hidden');
      } else if (modalMode === 'addToCart') {
        buyNowBtn.classList.add('hidden');
        addCartBtn.classList.remove('hidden');
      } else {
        buyNowBtn.classList.remove('hidden');
        addCartBtn.classList.remove('hidden');
      }
      
      document.getElementById('productModal').classList.add('active');
    }

    function updateSpecifications(specs) {
      // Find the specifications table in the modal
      const specsTable = document.querySelector('#specs-content .specs-table tbody');
      if (specsTable && specs && Object.keys(specs).length > 0) {
        specsTable.innerHTML = Object.entries(specs).map(([key, value]) => `
          <tr>
            <td>${key}</td>
            <td>${value}</td>
          </tr>
        `).join('');
      }
    }

    window.closeModal = function closeModal() {
      document.getElementById('productModal').classList.remove('active');
    }

    window.increaseQuantity = function increaseQuantity() {
      if (currentQuantity < currentProductData.stock) {
        currentQuantity++;
        document.getElementById('quantityValue').textContent = currentQuantity;
      } else {
        showToast('Maximum stock reached');
      }
    }

    window.decreaseQuantity = function decreaseQuantity() {
      if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantityValue').textContent = currentQuantity;
      }
    }

    window.handleBuyNow = async function handleBuyNow() {
      const totalPricePerItem = currentProductData.price; 
      const totalCost = totalPricePerItem * currentQuantity;
      
      // Add to database cart if product ID exists
      if (currentProductData.id && typeof addToCart === 'function') {
        await addToCart(currentProductData.id, currentQuantity);
        closeModal();
        await showCheckoutPage();
        showToast(`Proceeding to checkout with ${currentQuantity}x ${currentProductData.title}`);
      } else {
        // Fallback to local cart if no product ID
        const cartItem = {
          id: Date.now(),
          name: currentProductData.title,
          price: totalPricePerItem,
          quantity: currentQuantity,
          image: document.getElementById('modalProductImage').src,
          variations: {
            size: selectedVariations.size.value,
            material: selectedVariations.material.value,
            color: selectedVariations.color.value
          }
        };

        cartItems = [cartItem];

        closeModal();
        await showCheckoutPage();
        updateCartDisplay();
        
        showToast(`Proceeding to checkout with ${currentQuantity}x ${currentProductData.title}`);
      }
    }

    window.handleAddToCart = async function handleAddToCart() {
      const totalPricePerItem = currentProductData.price; 
      const totalCost = totalPricePerItem * currentQuantity;
      
      console.log('handleAddToCart called with:', {
        productId: currentProductData.id,
        quantity: currentQuantity,
        addToCartExists: typeof addToCart === 'function'
      });
      
      // Add to database cart if product ID exists
      if (currentProductData.id && typeof addToCart === 'function') {
        console.log('Adding to database cart...');
        await addToCart(currentProductData.id, currentQuantity);
      } else {
        console.warn('Product ID missing or addToCart not available:', {
          productId: currentProductData.id,
          addToCartType: typeof addToCart
        });
        // Fallback to local cart if no product ID
        const cartItem = {
          id: Date.now(),
          name: currentProductData.title,
          price: totalPricePerItem,
          quantity: currentQuantity,
          image: document.getElementById('modalProductImage').src,
          variations: {
            size: selectedVariations.size.value,
            material: selectedVariations.material.value,
            color: selectedVariations.color.value
          }
        };

        cartItems.push(cartItem);

        const cartCountSpan = document.getElementById('cartCount');
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;

        updateCartDisplay();
        showToast(`Added ${currentQuantity}x ${currentProductData.title} to cart - ₱${totalCost.toLocaleString()}`);
      }
      
      closeModal();
    }

    function showToast(message){
      const toastRoot = document.getElementById('toastRoot');
      const t = document.createElement('div');
      t.className = 'toast-custom';
      t.textContent = message;
      toastRoot.appendChild(t);
      void t.offsetWidth;

      setTimeout(() => { 
        t.style.animation = 'slideOutToRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
        setTimeout(() => t.remove(), 400);
      }, 2500);
    }

    window.scrollRecommendations = function scrollRecommendations(direction) {
      const grid = document.getElementById('recommendationsGrid');
      const scrollAmount = 300;
      
      if (direction === 'left') {
        grid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }

    document.getElementById('productModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    window.showCheckoutPage = async function showCheckoutPage() {
      document.getElementById('shopPage').style.display = 'none';
      document.getElementById('checkoutPage').classList.add('active');
      
      currentStep = 2;
      updateStepperUI();
      
      // Load cart from database and display it
      if (typeof loadCart === 'function') {
        console.log('Calling loadCart from showCheckoutPage');
        await loadCart();
      } else {
        console.error('loadCart function not found!');
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.goToStep = async function goToStep(stepNum) {
      if (currentStep === 3 && stepNum > 3) {
        const form = document.getElementById('checkoutForm');
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        saveShippingInfo();
      }

      currentStep = stepNum;
      updateStepperUI();

      document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
      });

      const pages = ['', 'page-cart', 'page-cart', 'page-checkout', 'page-review', 'page-done'];
      document.getElementById(pages[stepNum]).classList.add('active');

      // Load cart when navigating to cart page (step 2)
      if (stepNum === 2 && typeof loadCart === 'function') {
        console.log('Loading cart for step 2');
        await loadCart();
      }

      if (stepNum === 4) {
        updateReviewPage();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateStepperUI() {
      const steps = document.querySelectorAll('.step');
      steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStep) {
          step.classList.add('active');
        } else if (stepNumber < currentStep) {
          step.classList.add('completed');
        }
      });
    }

    window.updateCartQuantity = function updateCartQuantity(itemId, change) {
      const item = cartItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = item.quantity + change;
      if (newQuantity < 1) {
        removeCartItem(itemId);
        return;
      }

      item.quantity = newQuantity;
      updateCartDisplay();
      
      const cartCountSpan = document.getElementById('cartCount');
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartCountSpan.textContent = totalItems;
    }

    window.removeCartItem = function removeCartItem(itemId) {
      cartItems = cartItems.filter(i => i.id !== itemId);
      updateCartDisplay();
      
      const cartCountSpan = document.getElementById('cartCount');
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      cartCountSpan.textContent = totalItems;
      
      if (cartItems.length === 0) {
        showToast('Cart is empty. Returning to shop...');
        setTimeout(backToShop, 1500);
      }
    }

    function updateCartDisplay() {
      // This function is now deprecated - use updateCartDisplayFromDB from cart.js instead
      // Call the database version if available
      if (typeof updateCartDisplayFromDB === 'function') {
        updateCartDisplayFromDB();
        return;
      }
      
      // Fallback to local cart (for backwards compatibility)
      const cartItemsContainer = document.getElementById('cartItems');
      
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: #94a3b8;">Your cart is empty</div>';
        updatePrices(0);
        return;
      }

      cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-price">₱${item.price.toLocaleString()}</div>
            <div class="item-variations">
              Size: ${item.variations.size} | Material: ${item.variations.material} | Color: ${item.variations.color}
            </div>
          </div>
          <div class="item-controls">
            <div class="cart-quantity-control">
              <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">−</button>
              <span class="cart-quantity-display">${item.quantity}</span>
              <button class="cart-quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeCartItem(${item.id})">Remove</button>
          </div>
        </div>
      `).join('');

      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updatePrices(subtotal);
    }

    window.updatePrices = function updatePrices(subtotal) {
      const elements = {
        'subtotal': subtotal,
        'orderTotal': subtotal,
        'cartTotal': subtotal,
        'checkoutSubtotal': subtotal,
        'checkoutTotal': subtotal + shippingCost,
        'reviewSubtotal': subtotal,
        'reviewTotal': subtotal + shippingCost
      };
      
      Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          element.textContent = `₱${elements[id].toLocaleString()}`;
        }
      });
    }

    function loadSavedShippingInfo() {
      // Get user-specific key (use username or user ID if available)
      const username = document.getElementById('usernameDisplay')?.textContent || 'guest';
      const storageKey = `shippingInfo_${username}`;
      
      const savedInfo = localStorage.getItem(storageKey);
      if (savedInfo) {
        const formData = JSON.parse(savedInfo);
        document.getElementById('fullName').value = formData.fullName || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('address').value = formData.address || '';
        document.getElementById('city').value = formData.city || '';
        document.getElementById('zipCode').value = formData.zipCode || '';
      }
    }

    function saveShippingInfo() {
      const form = document.getElementById('checkoutForm');
      const formData = {
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        address: form.address.value,
        city: form.city.value,
        zipCode: form.zipCode.value
      };
      
      // Get user-specific key (use username or user ID if available)
      const username = document.getElementById('usernameDisplay')?.textContent || 'guest';
      const storageKey = `shippingInfo_${username}`;
      
      localStorage.setItem(storageKey, JSON.stringify(formData));
      
      if (isEditMode) {
        showToast('Shipping information saved successfully!');
        toggleEditMode();
      }
    }

    window.toggleEditMode = function toggleEditMode() {
      isEditMode = !isEditMode;
      const inputs = document.querySelectorAll('#checkoutForm input[type="text"], #checkoutForm input[type="email"], #checkoutForm input[type="tel"]');
      const editBtn = document.getElementById('editInfoBtn');
      
      inputs.forEach(input => {
        input.disabled = !isEditMode;
      });
      
      if (isEditMode) {
        editBtn.textContent = 'Save Info';
        editBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        editBtn.style.borderColor = 'rgba(34, 197, 94, 0.4)';
        editBtn.style.color = '#22c55e';
      } else {
        editBtn.textContent = 'Edit Info';
        editBtn.style.background = 'rgba(56, 189, 248, 0.2)';
        editBtn.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        editBtn.style.color = '#38bdf8';
        
        if (isEditMode === false) {
          saveShippingInfo();
        }
      }
    }

    function updateReviewPage() {
      const reviewItemsHTML = cartItems.map(item => `
        <div class="review-item">
          <span class="review-label">${item.name} (x${item.quantity})</span>
          <span class="review-value">₱${(item.price * item.quantity).toLocaleString()}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Variations</span>
          <span class="review-value">Size: ${item.variations.size}, Material: ${item.variations.material}, Color: ${item.variations.color}</span>
        </div>
      `).join('');
      document.getElementById('reviewItems').innerHTML = reviewItemsHTML;

      const form = document.getElementById('checkoutForm');
      const shippingHTML = `
        <div class="review-item">
          <span class="review-label">Name</span>
          <span class="review-value">${form.fullName.value}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Email</span>
          <span class="review-value">${form.email.value}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Phone</span>
          <span class="review-value">${form.phone.value}</span>
        </div>
        <div class="review-item">
          <span class="review-label">Address</span>
          <span class="review-value">${form.address.value}, ${form.city.value} ${form.zipCode.value}</span>
        </div>
      `;
      document.getElementById('reviewShipping').innerHTML = shippingHTML;

      const paymentMethod = form.paymentMethod.options[form.paymentMethod.selectedIndex].text;
      const paymentHTML = `
        <div class="review-item">
          <span class="review-label">Payment Method</span>
          <span class="review-value">${paymentMethod}</span>
        </div>
      `;
      document.getElementById('reviewPayment').innerHTML = paymentHTML;
    }

    window.placeOrder = async function placeOrder() {
      try {
        const form = document.getElementById('checkoutForm');
        
        // Validate form
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const orderData = {
          customer_name: form.fullName.value,
          customer_email: form.email.value,
          customer_phone: form.phone.value,
          shipping_address: form.address.value,
          city: form.city.value,
          zip_code: form.zipCode.value,
          payment_method: form.paymentMethod.value
        };

        console.log('Placing order with data:', orderData);

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken || ''
          },
          body: JSON.stringify(orderData)
        });

        const data = await response.json();
        console.log('Order response:', data);

        if (response.ok && data.success) {
          // Display order number
          document.getElementById('orderNumber').textContent = data.order.order_number;
          
          // Clear cart count
          const cartCountSpan = document.getElementById('cartCount');
          if (cartCountSpan) {
            cartCountSpan.textContent = '0';
          }
          
          // Go to success page
          goToStep(5);
          
          showToast('Order placed successfully!');
        } else {
          showToast(data.message || 'Failed to place order');
          console.error('Order error:', data);
        }
      } catch (error) {
        console.error('Error placing order:', error);
        showToast('An error occurred while placing order');
      }
    }

    document.querySelectorAll('.step').forEach(step => {
      step.addEventListener('click', async function() {
        const stepNum = parseInt(this.dataset.step);
        if (stepNum <= currentStep || stepNum === currentStep + 1) {
          await goToStep(stepNum);
        }
      });
    });

    window.toggleAccordion = function toggleAccordion(sectionId) {
      const content = document.getElementById(sectionId + '-content');
      const chevron = document.getElementById(sectionId + '-chevron');
      const header = chevron.closest('.accordion-header');
      
      content.classList.toggle('open');
      chevron.classList.toggle('rotated');
      header.classList.toggle('active');
    }

    let selectedRating = 0;
    
    window.setRating = function setRating(rating) {
      selectedRating = rating;
      const stars = document.querySelectorAll('#starRating i');
      
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.remove('far');
          star.classList.add('fas', 'active');
        } else {
          star.classList.remove('fas', 'active');
          star.classList.add('far');
        }
      });
    }

    window.submitReview = function submitReview() {
      const name = document.getElementById('reviewerName').value.trim();
      const reviewText = document.getElementById('reviewText').value.trim();
      
      if (!name) {
        showToast('Please enter your name');
        return;
      }
      
      if (selectedRating === 0) {
        showToast('Please select a star rating');
        return;
      }
      
      if (!reviewText) {
        showToast('Please write a review');
        return;
      }
      
      let starsHTML = '';
      for (let i = 0; i < 5; i++) {
        if (i < selectedRating) {
          starsHTML += '<i class="fas fa-star"></i>';
        } else {
          starsHTML += '<i class="far fa-star"></i>';
        }
      }
      
      const newReview = document.createElement('div');
      newReview.className = 'review-item';
      newReview.innerHTML = `
        <div class="review-header">
          <span class="review-author">${name}</span>
          <span class="review-stars">${starsHTML}</span>
        </div>
        <p class="review-text">${reviewText}</p>
      `;
      const reviewsList = document.getElementById('reviewsList');
      reviewsList.appendChild(newReview);
      document.getElementById('reviewerName').value = '';
      document.getElementById('reviewText').value = '';
      selectedRating = 0;
      document.querySelectorAll('#starRating i').forEach(star => {
        star.classList.remove('fas', 'active');
        star.classList.add('far');
      });
      
      showToast('Review submitted successfully!');
    }

    window.toggleFilterSection = function toggleFilterSection(sectionId) {
      const content = document.getElementById(sectionId + '-content');
      const chevron = document.getElementById(sectionId + '-chevron');
      
      if (content && chevron) {
        content.classList.toggle('collapsed');
        chevron.classList.toggle('rotated');
      }
    }

    window.clearAllFilters = function clearAllFilters() {
      console.log('Clearing all filters...');
      
      // Clear all checkboxes
      document.querySelectorAll('input[type="checkbox"][data-filter-type]').forEach(cb => {
        cb.checked = false;
      });
      
      // Reset price slider
      const priceSlider = document.getElementById('priceRange');
      const currentPrice = document.getElementById('currentPrice');
      if (priceSlider && currentPrice) {
        priceSlider.value = 15000;
        currentPrice.textContent = '₱15,000';
      }
      
      // Reset model select
      const modelSelect = document.getElementById('modelSelect');
      if (modelSelect) {
        modelSelect.value = '';
      }
      
      // Clear search input
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      
      // Re-filter products to show all
      filterProducts();
      
      showToast('All filters cleared');
    }

    window.backToShop = function backToShop() {
      document.getElementById('checkoutPage').classList.remove('active');
      document.getElementById('shopPage').style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }