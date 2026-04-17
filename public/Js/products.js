// Fetch and display products from database
async function loadProductsFromDatabase() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    console.log('Loaded products from database:', products);
    
    // Update the product grid with database products
    const productGrid = document.getElementById('productGrid');
    if (productGrid && products.length > 0) {
      productGrid.innerHTML = products.map(product => {
        const imageUrl = product.image ? `/storage/${product.image}` : `https://via.placeholder.com/900x600/1a2332/1ee0ff?text=${product.name.substring(0, 2)}`;
        const models = product.models ? JSON.parse(product.models) : [];
        const modelsString = models.length > 0 ? models.join(', ') : 'Universal';
        
        return `
          <div class="col-lg-4 col-md-6 product-item" 
               data-product-id="${product.id}"
               data-category="${product.category}" 
               data-brand="${product.brand}" 
               data-price="${product.price}" 
               data-models='${JSON.stringify(models)}' 
               data-stock="${product.stock}"
               data-full-description="${product.full_description || ''}"
               data-variations='${product.variations ? JSON.stringify(product.variations) : '{}'}'
               data-specifications='${product.specifications ? JSON.stringify(product.specifications) : '{}'}'>
            <div class="product-card position-relative">
              <img class="product-image" src="${imageUrl}" alt="${product.name}">
              <div class="product-title">${product.name}</div>
              <div class="product-details">
                <div><strong>Brand:</strong> ${capitalizeFirst(product.brand)}</div>
                <div><strong>Compatibility:</strong> ${modelsString}</div>
                <div><strong>Price:</strong> ₱${parseFloat(product.price).toLocaleString()}</div>
              </div>
              <div class="product-buttons">
                <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      // Re-attach event listeners after products are loaded
      attachProductEventListeners();
      
      // Re-run filter to show all products
      if (typeof filterProducts === 'function') {
        console.log('Re-filtering products after database load...');
        filterProducts();
      }
    }
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

/**
 * Attach event listeners to product buttons
 */
function attachProductEventListeners() {
  console.log('Attaching event listeners to product buttons...');
  
  // Remove old listeners and attach new ones
  document.querySelectorAll('.btn-buy-now').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('Buy Now clicked');
      const card = this.closest('.product-card');
      const productItem = this.closest('.product-item');
      if (typeof openProductModal === 'function') {
        openProductModal(card, productItem, 'buyNow');
      } else {
        console.error('openProductModal function not found');
      }
    });
  });

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('=== Add to Cart Button Clicked ===');
      
      const card = this.closest('.product-card');
      const productItem = this.closest('.product-item');
      console.log('Card found:', !!card);
      console.log('Product Item found:', !!productItem);
      console.log('window.openProductModal exists:', typeof window.openProductModal);
      
      if (typeof window.openProductModal === 'function') {
        console.log('Calling window.openProductModal...');
        try {
          window.openProductModal(card, productItem, 'addToCart');
          console.log('Modal function called successfully');
        } catch (error) {
          console.error('Error calling modal:', error);
          alert('Error: ' + error.message);
        }
      } else {
        console.error('window.openProductModal is not a function!');
        alert('Modal function not found. Type: ' + typeof window.openProductModal);
      }
    });
  });
  
  console.log('Event listeners attached to', document.querySelectorAll('.btn-add-cart').length, 'buttons');
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Buy now - add to cart and go to checkout
 */
async function buyNow(productId) {
  await addToCart(productId);
  // Navigate to cart/checkout page
  if (typeof showCheckoutPage === 'function') {
    showCheckoutPage();
    if (typeof goToStep === 'function') {
      goToStep(2);
    }
  }
}

/**
 * Load recommended products
 */
async function loadRecommendedProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    
    // Get random products for recommendations (or you can filter by category later)
    const shuffled = products.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 8); // Get 8 random products
    
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    if (recommendationsGrid && recommended.length > 0) {
      recommendationsGrid.innerHTML = recommended.map((product, index) => {
        const imageUrl = product.image ? `/storage/${product.image}` : `https://via.placeholder.com/900x600/1a2332/1ee0ff?text=${product.name.substring(0, 2)}`;
        const isAIRecommended = index % 3 === 0; // Mark every 3rd as AI recommended
        
        return `
          <div class="recommendation-card-horizontal" 
               data-product-id="${product.id}"
               data-product-name="${product.name}" 
               data-product-price="${product.price}" 
               data-product-brand="${product.brand}" 
               data-product-stock="${product.stock}" 
               data-product-image="${imageUrl}">
            ${isAIRecommended ? '<div class="ai-badge">AI RECOMMENDED</div>' : ''}
            <img class="recommendation-image-horizontal" src="${imageUrl}" alt="${product.name}">
            <div class="recommendation-title-horizontal">${product.name.toUpperCase()}</div>
            <div class="product-details">
              <div><strong>Brand:</strong> ${capitalizeFirst(product.brand)}</div>
              <div><strong>Price:</strong> ₱${parseFloat(product.price).toLocaleString()}</div>
            </div>
          </div>
        `;
      }).join('');
      
      // Re-attach event listeners for recommendation cards
      attachRecommendationEventListeners();
    }
  } catch (error) {
    console.error('Error loading recommended products:', error);
  }
}

/**
 * Attach event listeners to recommendation cards
 */
function attachRecommendationEventListeners() {
  document.querySelectorAll('.recommendation-card-horizontal').forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Recommendation clicked');
      if (typeof openRecommendationModal === 'function') {
        openRecommendationModal(this);
      } else {
        console.error('openRecommendationModal function not found');
      }
    });
  });
}

// Load products when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadProductsFromDatabase();
  loadRecommendedProducts();
});
