window.productsData = [];
const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/placeholder.png';

function hideAppLoader() {
  const el = document.getElementById('appPageLoader');
  if (el) {
    el.classList.add('hidden');
    setTimeout(() => el.remove(), 380);
  }
  // also call AppLoading helper if it exists
  window.AppLoading?.hidePageLoader?.();
}

function normalizeValue(value) {
  return String(value ?? '').trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatLabel(value) {
  const cleaned = String(value ?? '').trim();
  return cleaned || 'Uncategorized';
}

function buildFilterMap(products, field) {
  const uniqueValues = new Map();

  products.forEach((product) => {
    const rawValue = String(product?.[field] ?? '').trim();
    const key = normalizeValue(rawValue);
    if (key && !uniqueValues.has(key)) {
      uniqueValues.set(key, formatLabel(rawValue));
    }
  });

  return [...uniqueValues.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([key, label]) => ({ key, label }));
}

function capitalizeFirst(str) {
  const value = String(str ?? '').trim();
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
}

function getMappedProductImage(product) {
  const name = normalizeValue(product.name);
  const brand = normalizeValue(product.brand);
  const category = normalizeValue(product.category);

  if (name.includes('xrm 110 cowling / headlight case') && name.includes('red')) {
    return '/images/products/xrm110_headlight_case_red.png';
  }

  if (brand === 'honda' && category.includes('fender')) {
    return '/images/products/honda_yellow_fender.png';
  }

  if (brand === 'yamaha' && (category.includes('panel') || category.includes('cover') || category.includes('cowling'))) {
    return '/images/products/yamaha_yellow_cover.png';
  }

  if (name.includes('cam chain') || name.includes('slipper')) {
    return '/images/products/cam_chain_slipper.png';
  }

  if (name.includes('bolt') && (name.includes('hinge') || name.includes('seat'))) {
    return '/images/products/bolt_seat_hinge_kpg900.png';
  }

  return null;
}

function getProductImageUrl(product) {
  if (product.image_url) {
    return product.image_url;
  }

  if (product.image) {
    if (/^https?:\/\//i.test(product.image)) {
      return product.image;
    }

    if (product.image.startsWith('/')) {
      return product.image;
    }

    return `/storage/${product.image}`;
  }

  const mappedImage = getMappedProductImage(product);
  if (mappedImage) {
    return mappedImage;
  }

  return PRODUCT_PLACEHOLDER_IMAGE;
}

function renderProductGrid(products) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) {
    return;
  }

  if (!products.length) {
    productGrid.innerHTML = '';
    return;
  }

  productGrid.innerHTML = products.map((product, index) => {
    const imageUrl = getProductImageUrl(product);
    const category = formatLabel(product.category);
    const brand = formatLabel(product.brand);
    const categoryKey = normalizeValue(product.category);
    const brandKey = normalizeValue(product.brand);
    const searchable = [
      product.name,
      product.brand,
      product.category,
      Array.isArray(product.models) ? product.models.join(' ') : '',
    ].join(' ');
    const popularTiers = ['fast-moving', 'premium', 'star'];
    const showBadge = popularTiers.includes(normalizeValue(product.ml_tier));

    return `
      <div class="col-lg-4 col-md-6 product-item"
        data-product-id="${escapeHtml(product.id)}"
        data-product-index="${index}"
        data-category="${escapeHtml(category)}"
        data-category-key="${escapeHtml(categoryKey)}"
        data-brand="${escapeHtml(brand)}"
        data-brand-key="${escapeHtml(brandKey)}"
        data-price="${escapeHtml(product.price)}"
        data-stock="${escapeHtml(product.stock)}"
        data-search="${escapeHtml(searchable)}">
        <div class="product-card position-relative" data-product-index="${index}">
          ${showBadge ? '<div class="ai-badge">POPULAR CHOICE</div>' : ''}
          <img class="product-image" src="${imageUrl}" alt="${escapeHtml(product.name)}">
          <div class="product-title">${escapeHtml(product.name)}</div>
          <div class="product-details">
            <div><strong>Brand:</strong> ${escapeHtml(capitalizeFirst(brand))}</div>
            <div><strong>Category:</strong> ${escapeHtml(category)}</div>
            <div><strong>Price:</strong> ₱${Number(product.price || 0).toLocaleString()}</div>
          </div>
          <div class="product-buttons">
            <button class="btn-buy-now btn btn-outline-light" onclick="window.clickProductCardAction?.(this, 'buyNow')">
              <i class="fa-solid fa-shopping-bag"></i> Buy Now
            </button>
            <button class="btn-add-cart btn" onclick="window.clickProductCardAction?.(this, 'addToCart')">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function populateFilterOptions(products) {
  const categories = buildFilterMap(products, 'category');
  const brands = buildFilterMap(products, 'brand');

  const categoryContent = document.getElementById('category-content');
  if (categoryContent) {
    categoryContent.innerHTML = categories.map((category, index) => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="cat_${index}" value="${escapeHtml(category.key)}" data-filter-type="category">
        <label class="form-check-label" for="cat_${index}">${escapeHtml(category.label)}</label>
      </div>
    `).join('');
  }

  const brandContent = document.getElementById('brand-content');
  if (brandContent) {
    brandContent.innerHTML = brands.map((brand, index) => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="brand_${index}" value="${escapeHtml(brand.key)}" data-filter-type="brand">
        <label class="form-check-label" for="brand_${index}">${escapeHtml(brand.label)}</label>
      </div>
    `).join('');
  }
}

function syncPriceSlider(products) {
  const priceSlider = document.getElementById('priceRange');
  const currentPrice = document.getElementById('currentPrice');
  if (!priceSlider) {
    return;
  }

  const highestPrice = Math.max(...products.map((product) => Number(product.price) || 0), 0);
  const maxAllowedPrice = Math.max(50, Math.ceil(highestPrice));

  priceSlider.max = maxAllowedPrice;
  priceSlider.value = maxAllowedPrice;

  if (currentPrice) {
    currentPrice.textContent = '₱' + maxAllowedPrice.toLocaleString();
  }
}

async function loadProductsFromDatabase() {
  const productGrid = document.getElementById('productGrid');
  if (productGrid) {
    productGrid.innerHTML = window.AppLoading?.skeletonCards?.(6) || '';
  }
  try {
    const response = await fetch('/api/products', { adeSilent: true });
    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.status}`);
    }

    const products = await response.json();
    window.productsData = Array.isArray(products) ? products : [];
    renderProductGrid(window.productsData);
    populateFilterOptions(window.productsData);
    syncPriceSlider(window.productsData);

    if (typeof filterProducts === 'function') {
      filterProducts();
    }

    setTimeout(() => {
      hideAppLoader();
    }, 600);
  } catch (error) {
    console.error('Error loading products:', error);
    if (productGrid) {
      productGrid.innerHTML = '<div class="col-12"><div class="app-alert app-alert-error"><span>Unable to load products. Please refresh and try again.</span></div></div>';
    }
    window.AppLoading?.showToast?.('error', 'Unable to load products. Please try again.');
    hideAppLoader();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProductsFromDatabase();
});
