//YAWA KAHAGO
//kapoy na
//awa ubos naa koy gi comment
//
// PRODUCTS
let productsData = [];
let salesAvgData = [];
//ORDERS
const ordersData = [
  {
    id: "ADE-2025-001",
    customer: "Junaica",
    products: [{ name: "Brake Pads Set", qty: 2, image: "/images/products/placeholder.png" }],
    total: 2500,
    subtotal: 2400,
    shippingFee: 100,
    payment: "GCash",
    shipping: "J&T Express - Pick Up",
    trackingNumber: "JT73116575",
    estimatedDelivery: "January 15-17, 2025",
    status: "to-ship",
    date: "January 10, 2025",
  },
  {
    id: "ADE-2025-002",
    customer: "Mels",
    products: [{ name: "Engine Oil 5W-30", qty: 1, image: "/images/products/placeholder.png" }],
    total: 1200,
    subtotal: 1100,
    shippingFee: 100,
    payment: "COD",
    shipping: "J&T Express - Drop Off",
    trackingNumber: "JT73116576",
    estimatedDelivery: "January 16-18, 2025",
    status: "shipping",
    date: "January 11, 2025",
  },
  {
    id: "ADE-2025-003",
    customer: "Chris Brown",
    products: [{ name: "Air Filter", qty: 1, image: "/images/products/placeholder.png" }],
    total: 850,
    subtotal: 750,
    shippingFee: 100,
    payment: "Bank Transfer",
    shipping: "J&T Express - Pick Up",
    trackingNumber: "JT73116577",
    estimatedDelivery: "January 14-16, 2025",
    status: "completed",
    date: "January 9, 2025",
  },
  {
    id: "ADE-2025-004",
    customer: "Rose",
    products: [{ name: "Spark Plugs", qty: 4, image: "/images/products/placeholder.png" }],
    total: 1680,
    subtotal: 1580,
    shippingFee: 100,
    payment: "GCash",
    shipping: "J&T Express - Drop Off",
    trackingNumber: "JT73116578",
    estimatedDelivery: "January 17-19, 2025",
    status: "unpaid",
    date: "January 12, 2025",
  },
  {
    id: "ADE-2025-005",
    customer: "Jennie",
    products: [{ name: "Tire Set 195/65R15", qty: 4, image: "/images/products/placeholder.png" }],
    total: 12000,
    subtotal: 11900,
    shippingFee: 100,
    payment: "Credit Card",
    shipping: "J&T Express - Pick Up",
    trackingNumber: "JT73116579",
    estimatedDelivery: "January 18-20, 2025",
    status: "to-ship",
    date: "January 13, 2025",
  },
];


let notifications = [
  { id: 1, title: "New Order Received", text: "Order #ADE-2025-006 has been placed", time: "5 min ago", read: false },
  { id: 2, title: "Low Stock Alert", text: "Racing Sprocket is running low on stock", time: "1 hour ago", read: false },
  { id: 3, title: "Payment Received", text: "Payment for Order #ADE-2025-005 confirmed", time: "2 hours ago", read: false },
  { id: 4, title: "Product Updated", text: "Premium Brake Pads details updated", time: "3 hours ago", read: true },
  { id: 5, title: "New Customer", text: "New customer registration: Lisa Wong", time: "5 hours ago", read: true },
];

//MESSAGE
const messages = [
  { id: 1, sender: "Junaica Layno", preview: "When will my order arrive?", time: "10 min ago", read: false },
  { id: 2, sender: "Kristina Melquery", preview: "Do you have this in different colors?", time: "30 min ago", read: false },
  { id: 3, sender: "Shayne Silagan", preview: "Thank you for the fast delivery!", time: "1 hour ago", read: false },
  { id: 4, sender: "Jay Capoy", preview: "Can I cancel my order?", time: "2 hours ago", read: false },
  { id: 5, sender: "Karyll Salipot", preview: "Is this compatible with my bike?", time: "3 hours ago", read: false },
];
// isulat nalang sa ron unsa ang i database n
//wait ask nako sila
const conversations = {
  1: [
    { type: "received", text: "When will my order arrive?", time: "10:00 AM" },
    { type: "sent", text: "Your order will arrive in 2-3 business days.", time: "10:05 AM" },
  ],
  2: [
    { type: "received", text: "Do you have this in different colors?", time: "9:30 AM" },
    { type: "sent", text: "Yes, we have it in red, blue, and black.", time: "9:35 AM" },
  ],
  3: [{ type: "received", text: "Thank you for the fast delivery!", time: "Yesterday" }],
  4: [
    { type: "received", text: "Can I cancel my order?", time: "Yesterday" },
    { type: "sent", text: "Yes, I can help you with that. Let me check the status.", time: "Yesterday" },
  ],
  5: [{ type: "received", text: "Is this compatible with my bike?", time: "2 days ago" }],
};

let currentFilter = "all";
let currentCategoryFilter = "all";
let currentBrandFilter = "all";
let currentSearchQuery = "";
let currentOrderId = null;
let currentConversationId = null;
let currentEditingProductId = null;
let liveMessages = [];
let salesChart = null;
let revenueChart = null;
let customerChart = null;
let demandChart = null;
let nextProductId = 9; 
let currentAdminSection = "dashboard";
let dashboardSummaryData = {};
let dashboardStatActionSection = "dashboard";
const ADMIN_CACHE_TTL = 30000;
const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/placeholder.png';
let productsLoadedAt = 0;
let ordersLoadedAt = 0;
const analyticsCache = {
  revenueTrend: [],
  partTypeBreakdown: [],
  brandMargins: [],
  tierDistribution: [],
  topProducts: [],
  deadStock: []
};

function getActiveAdminSection() {
  const activeSection = document.querySelector(".admin-section.active");
  return activeSection?.id?.replace("section-", "") || currentAdminSection;
}

function setProductImagePreview(imageUrl = "") {
  const preview = document.getElementById("imagePreview");
  const previewImg = document.getElementById("previewImg");
  const imageUrlField = document.getElementById("productImageUrl");

  if (!preview || !previewImg || !imageUrlField) {
    return;
  }

  if (imageUrl) {
    previewImg.src = imageUrl;
    imageUrlField.value = imageUrl;
    preview.style.display = "block";
    return;
  }

  previewImg.removeAttribute("src");
  imageUrlField.value = "";
  preview.style.display = "none";
}

function destroyAnalyticsCharts() {
  [revenueChart, partTypeChart, brandMarginsChart, tierDistChart, demandChart].forEach((chartInstance) => {
    if (chartInstance && typeof chartInstance.destroy === "function") {
      chartInstance.destroy();
    }
  });

  revenueChart = null;
  partTypeChart = null;
  brandMarginsChart = null;
  tierDistChart = null;
  demandChart = null;
}

async function refreshAdminSection(sectionName = getActiveAdminSection()) {
  currentAdminSection = sectionName;

  if (sectionName === "dashboard") {
    loadOrders();
    await Promise.all([loadDashboardData(), loadDashboardStats(), loadNotifications()]);
    return;
  }

  if (sectionName === "products") {
    await loadProductsData();
    return;
  }

  if (sectionName === "inventory") {
    await loadProductsData();
    loadInventoryData();
    return;
  }

  if (sectionName === "orders") {
    await loadOrders();
    return;
  }

  if (sectionName === "analytics") {
    await Promise.all([loadProductsData(), loadAnalyticsData(), loadSalesAvgData()]);
    populatePredictDropdowns();
    destroyAnalyticsCharts();
    await initializeCharts();
  }
}

function normalizeAdminValue(value) {
  return String(value ?? '').trim().toLowerCase();
}

function escapeAdminHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMappedProductImage(product) {
  const name = normalizeAdminValue(product.name);
  const brand = normalizeAdminValue(product.brand);
  const category = normalizeAdminValue(product.category);

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

function resolveProductImageUrl(productOrPath) {
  if (productOrPath && typeof productOrPath === 'object') {
    if (productOrPath.image_url) {
      return productOrPath.image_url;
    }

    const image = productOrPath.image;
    if (image && (/^https?:\/\//i.test(image) || image.startsWith('/'))) {
      return image;
    }

    if (image) {
      return `/storage/${image}`;
    }

    const mappedImage = getMappedProductImage(productOrPath);
    if (mappedImage) {
      return mappedImage;
    }

    return buildCategoryFallbackImage(productOrPath);
  }

  const image = String(productOrPath || '');
  if (!image) {
    return PRODUCT_PLACEHOLDER_IMAGE;
  }

  if (/^https?:\/\//i.test(image) || image.startsWith('/')) {
    return image;
  }

  return `/storage/${image}`;
}

function buildCategoryFallbackImage(product) {
  return PRODUCT_PLACEHOLDER_IMAGE;
}

function populateAdminProductFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const brandFilter = document.getElementById('brandFilter');
  const productCategory = document.getElementById('productCategory');
  const productBrand = document.getElementById('productBrand');
  const categories = [...new Set(productsData.map(product => String(product.category || '').trim()).filter(Boolean))].sort();
  const brands = [...new Set(productsData.map(product => String(product.brand || '').trim()).filter(Boolean))].sort();

  if (categoryFilter) {
    categoryFilter.innerHTML = ['<option value="all">All Categories</option>']
      .concat(categories.map(category => `<option value="${escapeAdminHtml(category)}">${escapeAdminHtml(capitalizeFirst(category))}</option>`))
      .join('');
    categoryFilter.value = currentCategoryFilter;
  }

  if (brandFilter) {
    brandFilter.innerHTML = ['<option value="all">All Brands</option>']
      .concat(brands.map(brand => `<option value="${escapeAdminHtml(brand)}">${escapeAdminHtml(capitalizeFirst(brand))}</option>`))
      .join('');
    brandFilter.value = currentBrandFilter;
  }

  if (productCategory) {
    productCategory.innerHTML = categories
      .map(category => `<option value="${escapeAdminHtml(category)}">${escapeAdminHtml(capitalizeFirst(category))}</option>`)
      .join('');
  }

  if (productBrand) {
    productBrand.innerHTML = brands
      .map(brand => `<option value="${escapeAdminHtml(brand)}">${escapeAdminHtml(capitalizeFirst(brand))}</option>`)
      .join('');
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  window.AppLoading?.showPageLoader?.('Loading dashboard...');
  initializeSidebar();
  initializeAdminSearch();
  initializeNotifications();
  initializeMessages();
  try {
    await refreshAdminSection("dashboard");
  } finally {
    window.AppLoading?.hidePageLoader?.();
    // hide the hardcoded loader too
    const el = document.getElementById('appPageLoader');
    if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 320); }
  }
});

function initializeSidebar() {
  const navItems = document.querySelectorAll(".nav-item[data-section]");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarOverlay");

  navItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const section = this.dataset.section;
      switchSection(section);

      navItems.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
      
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
    });
  });

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

async function switchSection(sectionName) {
  window.AppLoading?.showPageLoader?.(`Loading ${sectionName}...`);

  const sections = document.querySelectorAll(".admin-section");
  sections.forEach((section) => section.classList.remove("active"));

  const targetSection = document.getElementById(`section-${sectionName}`);
  if (targetSection) targetSection.classList.add("active");

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));
  const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeNav) activeNav.classList.add("active");

  try {
    await refreshAdminSection(sectionName);
    applyAdminSearch();
  } finally {
    window.AppLoading?.hidePageLoader?.();
  }
}

async function loadProductsData() {
  const productsTable = document.getElementById("productsTable");
  if (!productsTable) return;

  try {
    const response = await fetch('/api/admin/products');
    productsData = await response.json();
    populateAdminProductFilters();

    let filteredProducts = productsData;

    if (currentCategoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(p => normalizeAdminValue(p.category) === normalizeAdminValue(currentCategoryFilter));
    }

    if (currentBrandFilter !== "all") {
      filteredProducts = filteredProducts.filter(p => normalizeAdminValue(p.brand) === normalizeAdminValue(currentBrandFilter));
    }

    productsTable.innerHTML = filteredProducts.map(product => {
      let stockStatus, stockLabel;
      if (product.stock === 0) {
        stockStatus = 'out-of-stock';
        stockLabel = 'Out of Stock';
      } else if (product.stock <= 20) {
        stockStatus = 'low-stock';
        stockLabel = 'Low Stock';
      } else {
        stockStatus = 'in-stock';
        stockLabel = 'In Stock';
      }
      
      const imageUrl = resolveProductImageUrl(product);
      
      let tierBadge = '<span class="status-badge" style="background:#1e2a38;color:#64748b;">Unclassified</span>';
      if (product.ml_tier === 'Premium') {
        tierBadge = '<span class="status-badge" style="background:rgba(250, 204, 21, 0.15);color:#facc15;border:1px solid rgba(250, 204, 21, 0.3);"><i class="fas fa-crown"></i> Premium</span>';
      } else if (product.ml_tier === 'Fast-Moving') {
        tierBadge = '<span class="status-badge" style="background:rgba(30, 255, 142, 0.15);color:#1eff8e;border:1px solid rgba(30, 255, 142, 0.3);"><i class="fas fa-bolt"></i> Fast-Moving</span>';
      } else if (product.ml_tier === 'Standard') {
        tierBadge = '<span class="status-badge" style="background:rgba(30, 224, 255, 0.15);color:#1ee0ff;border:1px solid rgba(30, 224, 255, 0.3);"><i class="fas fa-box"></i> Standard</span>';
      }

      return `
        <tr>
          <td><img src="${imageUrl}" class="product-img"></td>
          <td>${product.name}</td>
          <td>${capitalizeFirst(product.category)}</td>
          <td>${capitalizeFirst(product.brand)}</td>
          <td>₱${parseFloat(product.price).toLocaleString()}</td>
          <td>${product.stock}</td>
          <td><span class="status-badge ${stockStatus}">${stockLabel}</span></td>
          <td>${tierBadge}</td>
          <td>
            <button class="action-btn" title="Edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" title="Delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join("");

    updateProductCount();
    applyAdminSearchToSection("products");
  } catch (error) {
    console.error('Error loading products:', error);
    showToast("error", "Failed to load products");
  }
}

function filterProductsByCategory(category) {
  currentCategoryFilter = category;
  loadProductsData();
}

function filterProductsByBrand(brand) {
  currentBrandFilter = brand;
  loadProductsData();
}

async function ensureProductsData(force = false) {
  if (!force && productsData.length > 0 && Date.now() - productsLoadedAt < ADMIN_CACHE_TTL) {
    return productsData;
  }

  const response = await fetch('/api/admin/products');
  productsData = await response.json();
  productsLoadedAt = Date.now();
  populateAdminProductFilters();
  return productsData;
}

function productMatchesFilterValue(actualValue, filterValue) {
  if (filterValue === "all") return true;

  const actual = normalizeAdminValue(actualValue);
  const selected = normalizeAdminValue(filterValue);
  return actual === selected;
}

function renderProductsData() {
  const productsTable = document.getElementById("productsTable");
  if (!productsTable) return;

  const filteredProducts = productsData.filter((product) =>
    productMatchesFilterValue(product.category, currentCategoryFilter) &&
    productMatchesFilterValue(product.brand, currentBrandFilter)
  );

  if (filteredProducts.length === 0) {
    productsTable.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:#64748b;">No products match the selected filters</td></tr>';
    updateProductCount();
    return;
  }

  productsTable.innerHTML = filteredProducts.map(product => {
    let stockStatus, stockLabel;
    if (Number(product.stock) === 0) {
      stockStatus = 'out-of-stock';
      stockLabel = 'Out of Stock';
    } else if (Number(product.stock) <= 20) {
      stockStatus = 'low-stock';
      stockLabel = 'Low Stock';
    } else {
      stockStatus = 'in-stock';
      stockLabel = 'In Stock';
    }

    const imageUrl = resolveProductImageUrl(product);
    let tierBadge = '<span class="status-badge" style="background:#1e2a38;color:#64748b;">Unclassified</span>';
    if (product.ml_tier === 'Premium') {
      tierBadge = '<span class="status-badge" style="background:rgba(250, 204, 21, 0.15);color:#facc15;border:1px solid rgba(250, 204, 21, 0.3);"><i class="fas fa-crown"></i> Premium</span>';
    } else if (product.ml_tier === 'Fast-Moving') {
      tierBadge = '<span class="status-badge" style="background:rgba(30, 255, 142, 0.15);color:#1eff8e;border:1px solid rgba(30, 255, 142, 0.3);"><i class="fas fa-bolt"></i> Fast-Moving</span>';
    } else if (product.ml_tier === 'Standard') {
      tierBadge = '<span class="status-badge" style="background:rgba(30, 224, 255, 0.15);color:#1ee0ff;border:1px solid rgba(30, 224, 255, 0.3);"><i class="fas fa-box"></i> Standard</span>';
    }

    return `
      <tr>
        <td><img src="${imageUrl}" class="product-img"></td>
        <td>${escapeAdminHtml(product.name)}</td>
        <td>${escapeAdminHtml(capitalizeFirst(product.category || ""))}</td>
        <td>${escapeAdminHtml(capitalizeFirst(product.brand || ""))}</td>
        <td>${formatCurrency(product.price)}</td>
        <td>${Number(product.stock || 0).toLocaleString()}</td>
        <td><span class="status-badge ${stockStatus}">${stockLabel}</span></td>
        <td>${tierBadge}</td>
        <td>
          <button class="action-btn" title="Edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" title="Delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join("");

  updateProductCount();
  applyAdminSearchToSection("products");
}

async function loadProductsData(force = false) {
  const productsTable = document.getElementById("productsTable");
  if (productsTable) {
    productsTable.innerHTML = window.window.AppLoading?.skeletonRows?.(9, 6) || '';
  }
  try {
    await ensureProductsData(force);
    renderProductsData();
  } catch (error) {
    console.error('Error loading products:', error);
    showToast("error", "Failed to load products");
  }
}

async function loadSalesAvgData() {
  try {
    const resp = await fetch('/api/admin/products/sales-avg');
    if (!resp.ok) throw new Error('Failed to fetch sales averages');
    salesAvgData = await resp.json();
  } catch (error) {
    console.error('Error loading sales averages:', error);
    salesAvgData = [];
  }
}

let predictDropdownsInitialized = false;

function populatePredictDropdowns() {
  const source = salesAvgData.length ? salesAvgData : productsData;
  if (!source.length) return;
  const brandSet = new Set();
  const typeSet = new Set();
  source.forEach(p => {
    if (p.brand) brandSet.add(p.brand);
    if (p.category) typeSet.add(p.category);
  });
  const brandSel = document.getElementById('pd_brand');
  const typeSel = document.getElementById('pd_part_type');
  if (!brandSel || !typeSel) return;
  const currentBrand = brandSel.value;
  const currentType = typeSel.value;
  brandSel.innerHTML = '<option value="">Select Brand</option>' +
    [...brandSet].sort().map(b => `<option value="${b}">${b}</option>`).join('');
  typeSel.innerHTML = '<option value="">Select Part Type</option>' +
    [...typeSet].sort().map(t => `<option value="${t}">${t}</option>`).join('');
  if (currentBrand) brandSel.value = currentBrand;
  if (currentType) typeSel.value = currentType;
  if (!predictDropdownsInitialized) {
    predictDropdownsInitialized = true;
    const clearSearch = () => {
      const input = document.getElementById('productSearchInput');
      if (input) input.value = '';
    };
    ['pd_brand','pd_part_type'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', clearSearch);
    });
    ['pd_price','pd_profit'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', clearSearch);
    });
  }
}

function filterProductsByCategory(category) {
  currentCategoryFilter = category;
  renderProductsData();
}

function filterProductsByBrand(brand) {
  currentBrandFilter = brand;
  renderProductsData();
}

function openProductModal(productId = null) {
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("productModalTitle");
  const productImageInput = document.getElementById("productImage"); 
  
  if (productId) {
    const product = productsData.find(p => String(p.id) === String(productId));
    if (product) {
      modalTitle.textContent = "Edit Product";
      document.getElementById("productId").value = product.id;
      document.getElementById("productName").value = product.name;
      document.getElementById("productDescription").value = product.description || "";
      document.getElementById("productCategory").value = product.category;
      document.getElementById("productBrand").value = product.brand;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productStock").value = product.stock;
      document.getElementById("productImageUrl").value = product.image; 
      document.getElementById("productFullDescription").value = product.full_description || "";
      document.getElementById("productVariations").value = product.variations ? JSON.stringify(product.variations, null, 2) : "";
      document.getElementById("productSpecifications").value = product.specifications ? JSON.stringify(product.specifications, null, 2) : "";

      setProductImagePreview(resolveProductImageUrl(product));
      
      currentEditingProductId = productId;
    }
  } else {
    // Adding new product - reset everything
    currentEditingProductId = null;
    modalTitle.textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    setProductImagePreview();
    productImageInput.value = "";
  }
  
  console.log('Modal opened. Editing product ID:', currentEditingProductId);
  modal.classList.add("active");
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  document.getElementById("productForm").reset();
  setProductImagePreview();
  document.getElementById("productImage").value = ""; 
  currentEditingProductId = null;
}

async function saveProduct() {
  const saveButton = document.querySelector('#productModal .modal-footer .btn-primary');
  const name = document.getElementById("productName").value;
  const description = document.getElementById("productDescription").value;
  const category = document.getElementById("productCategory").value;
  const brand = document.getElementById("productBrand").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const stock = parseInt(document.getElementById("productStock").value);
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || !description || !category || !brand || isNaN(price) || isNaN(stock)) {
    showToast("error", "Please fill in all fields correctly");
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('brand', brand);
  formData.append('price', price);
  formData.append('stock', stock);
  formData.append('status', 'active');
  
  const fullDescription = document.getElementById("productFullDescription")?.value;
  const variationsInput = document.getElementById("productVariations")?.value?.trim();
  const specificationsInput = document.getElementById("productSpecifications")?.value?.trim();
  let variations = null;
  let specifications = null;

  if (variationsInput) {
    try {
      variations = JSON.stringify(JSON.parse(variationsInput));
    } catch (error) {
      showToast("error", "Variations must be valid JSON");
      return;
    }
  }

  if (specificationsInput) {
    try {
      specifications = JSON.stringify(JSON.parse(specificationsInput));
    } catch (error) {
      showToast("error", "Specifications must be valid JSON");
      return;
    }
  }
  
  if (fullDescription) formData.append('full_description', fullDescription);
  if (variations) formData.append('variations', variations);
  if (specifications) formData.append('specifications', specifications);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    window.AppLoading?.setButtonLoading?.(saveButton, true, currentEditingProductId ? 'Updating...' : 'Saving...');
    let url = '/api/products';
    let method = 'POST';

    if (currentEditingProductId) {
      url = `/api/products/${currentEditingProductId}`;
    }

    console.log('Current editing ID:', currentEditingProductId);
    console.log('Sending request to:', url);
    console.log('Form data:', {name, description, category, brand, price, stock});

    const response = await fetch(url, {
      method: method,
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast("success", data.message);
      currentEditingProductId = null; // Reset the editing ID
      closeProductModal();
      productsLoadedAt = 0;
      await loadProductsData(true);
    } else {
      // Show detailed error message
      let errorMsg = data.message || "Failed to save product";
      if (data.errors) {
        // Show validation errors
        const errorList = Object.values(data.errors).flat().join(', ');
        errorMsg += ': ' + errorList;
      }
      showToast("error", errorMsg);
      console.error('Server error:', data);
    }
  } catch (error) {
    console.error('Error saving product:', error);
    showToast("error", "Network connection failed while saving the product. Please try again.");
  } finally {
    window.AppLoading?.setButtonLoading?.(saveButton, false);
  }
}

function editProduct(productId) {
  openProductModal(productId);
}

async function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        showToast("success", data.message);
        productsLoadedAt = 0;
        await loadProductsData(true);
      } else {
        showToast("error", "Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast("error", "An error occurred while deleting the product");
    }
  }
}

function updateProductCount() {
  const countElement = document.getElementById("totalProductsCount");
  if (countElement) {
    countElement.textContent = productsData.length;
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAdminSearchQuery() {
  return normalizeAdminValue(currentSearchQuery);
}

function matchesAdminSearch(text) {
  const query = getAdminSearchQuery();
  if (!query) {
    return true;
  }

  return normalizeAdminValue(text).includes(query);
}

function applySearchToRows(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const rows = Array.from(container.querySelectorAll("tr"));
  rows.forEach((row) => {
    row.style.display = matchesAdminSearch(row.textContent) ? "" : "none";
  });
}

function applySearchToCards(containerSelector) {
  const cards = document.querySelectorAll(containerSelector);
  cards.forEach((card) => {
    card.style.display = matchesAdminSearch(card.textContent) ? "" : "none";
  });
}

function applySearchToSettings() {
  const cards = document.querySelectorAll("#section-settings .settings-grid .data-card");
  cards.forEach((card) => {
    card.style.display = matchesAdminSearch(card.textContent) ? "" : "none";
  });
}

function applySearchToAnalytics() {
  applySearchToRows("topProductsTable");
  applySearchToRows("deadStockTable");
}

function applyAdminSearchToSection(sectionName = getActiveAdminSection()) {
  if (sectionName === "dashboard") {
    applySearchToRows("recentOrdersTable");
    return;
  }

  if (sectionName === "products") {
    applySearchToRows("productsTable");
    return;
  }

  if (sectionName === "orders") {
    applySearchToCards("#ordersGrid .order-card");
    return;
  }

  if (sectionName === "inventory") {
    applySearchToRows("inventoryTable");
    return;
  }

  if (sectionName === "analytics") {
    applySearchToAnalytics();
    return;
  }

  if (sectionName === "settings") {
    applySearchToSettings();
  }
}

function applyAdminSearch() {
  applyAdminSearchToSection(getActiveAdminSection());
}

function initializeAdminSearch() {
  const searchInput = document.getElementById("adminSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", (event) => {
    currentSearchQuery = event.target.value || "";
    applyAdminSearch();
  });
}

function formatCurrency(value) {
  return `₱${Number(value || 0).toLocaleString()}`;
}

function formatDateOnly(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}


function initializeNotifications() {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationPanel = document.getElementById("notificationPanel");

  notificationBtn.addEventListener("click", () => {
    notificationPanel.classList.toggle("active");
    closeMessagePanel(); 
    loadNotifications();
  });
  
  updateNotificationCount();
}

function loadNotifications() {
  const notificationContent = document.getElementById("notificationContent");
  if (!notificationContent) return;

  notificationContent.innerHTML = notifications.map(notif => `
    <div class="notification-item ${notif.read ? '' : 'unread'}" data-id="${notif.id}">
      <div class="notification-title">${notif.title}</div>
      <div class="notification-text">${notif.text}</div>
      <div class="notification-time">${notif.time}</div>
      <div class="notification-actions">
        ${!notif.read ? `<button class="notification-action-btn" onclick="markNotificationRead(${notif.id})">Mark as Read</button>` : ''}
        <button class="notification-action-btn delete" onclick="deleteNotification(${notif.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function markNotificationRead(id) {
  const notif = notifications.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    loadNotifications();
    updateNotificationCount();
    showToast("success", "Notification marked as read");
  }
}

function deleteNotification(id) {
  notifications = notifications.filter(n => n.id !== id);
  loadNotifications();
  updateNotificationCount();
  showToast("success", "Notification deleted");
}

function updateNotificationCount() {
  const unreadCount = notifications.filter(n => !n.read).length;
  const badge = document.getElementById("notificationCount");
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function closeNotificationPanel() {
  const notificationPanel = document.getElementById("notificationPanel");
  if (notificationPanel) {
    notificationPanel.classList.remove("active");
  }
}


function initializeMessages() {
  const messageBtn = document.getElementById("messageBtn");
  const messagePanel = document.getElementById("messagePanel");

  messageBtn.addEventListener("click", () => {
    messagePanel.classList.toggle("active");
    closeNotificationPanel(); 
    loadMessages();
  });
  
  updateMessageCount();
}

async function loadMessages() {
  const messageContent = document.getElementById("messageContent");
  if (!messageContent) return;

  messageContent.innerHTML = '<div style="padding: 20px; color: #a7c0d8;">Loading messages...</div>';

  try {
    const response = await fetch('/api/admin/messages', { adeSilent: true });
    const data = await response.json();
    liveMessages = data.success && Array.isArray(data.messages) ? data.messages : [];
  } catch (error) {
    console.error('Error loading messages:', error);
    messageContent.innerHTML = '<div style="padding: 20px; color: #ff1e8e;">Unable to load messages</div>';
    return;
  }

  updateMessageCount();

  if (!liveMessages.length) {
    messageContent.innerHTML = '<div style="padding: 20px; color: #a7c0d8;">No messages yet</div>';
    return;
  }

  messageContent.innerHTML = liveMessages.map(msg => `
    <div class="message-item ${msg.read ? '' : 'unread'}" onclick="openConversation(${msg.id})">
      <div class="message-sender">${escapeAdminHtml(msg.sender_name || 'Customer')}</div>
      <div class="message-preview">${escapeAdminHtml(msg.body || '')}</div>
      <div class="message-time">${formatDateTime(msg.created_at)}</div>
    </div>
  `).join('');
}

async function openConversation(id) {
  currentConversationId = id;
  const message = liveMessages.find(m => Number(m.id) === Number(id));
  
  if (message) {
    message.read = true;
    updateMessageCount();
    fetch(`/api/admin/messages/${id}/read`, {
      method: 'PUT',
      adeSilent: true,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      }
    }).catch((error) => console.error('Error marking message read:', error));
    
    document.getElementById("conversationName").textContent = message.sender_name || 'Customer';
    document.getElementById("messageListView").style.display = 'none';
    document.getElementById("messageConversation").classList.add('active');
    
    loadConversationMessages(id);
  }
}

async function loadConversationMessages(id) {
  const conversationMessages = document.getElementById("conversationMessages");
  if (!conversationMessages) return;

  conversationMessages.innerHTML = '<div style="padding: 20px; color: #a7c0d8;">Loading...</div>';

  try {
    const response = await fetch(`/api/admin/messages/${id}/thread`, { adeSilent: true });
    const data = await response.json();

    if (!data.success || !Array.isArray(data.messages)) {
      conversationMessages.innerHTML = '<div style="padding: 20px; color: #ff1e8e;">Failed to load conversation</div>';
      return;
    }

    const msgs = data.messages.map(msg => ({
      type: msg.sender_id ? "sent" : "received",
      text: msg.body,
      time: formatDateTime(msg.created_at)
    }));

    conversationMessages.innerHTML = msgs.map(msg => `
      <div class="message-bubble ${msg.type}">
        ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Sent image">` : ''}
        ${escapeAdminHtml(msg.text)}
        <div class="message-time-stamp">${msg.time}</div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading conversation thread:', error);
    conversationMessages.innerHTML = '<div style="padding: 20px; color: #ff1e8e;">Network error loading conversation</div>';
  }

  conversationMessages.scrollTop = conversationMessages.scrollHeight;
}

function backToMessageList() {
  const messageListView = document.getElementById("messageListView");
  const messageConversation = document.getElementById("messageConversation");

  if (messageListView) messageListView.style.display = 'flex';
  if (messageConversation) messageConversation.classList.remove('active');
  currentConversationId = null;
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  
  if (text && currentConversationId) {
    try {
      const response = await fetch(`/api/admin/messages/${currentConversationId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        showToast("error", data.message || "Failed to send message");
        return;
      }

      liveMessages.unshift(data.data);
      loadConversationMessages(currentConversationId);
      input.value = '';
      showToast("success", "Message sent");
    } catch (error) {
      console.error('Error sending message:', error);
      showToast("error", "Network error while sending message");
    }
  }
}
function handleMessageKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function handleImageSelect(event) {
  const file = event.target.files[0];
  if (file && currentConversationId) {
    const reader = new FileReader();
    reader.onload = function(e) {
      if (!conversations[currentConversationId]) {
        conversations[currentConversationId] = [];
      }
      
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      
      conversations[currentConversationId].push({
        type: "sent",
        text: "Sent an image",
        image: e.target.result,
        time: timeStr
      });
      
      loadConversationMessages(currentConversationId);
      showToast("success", "Image sent");
    };
    reader.readAsDataURL(file);
  }
}

function updateMessageCount() {
  const sourceMessages = liveMessages.length ? liveMessages : messages;
  const unreadCount = sourceMessages.filter(m => !m.read).length;
  const badge = document.getElementById("messageCount");
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function closeMessagePanel() {
  const messagePanel = document.getElementById("messagePanel");
  if (messagePanel) {
    messagePanel.classList.remove("active");
    backToMessageList();
  }
}

// CHARTS — Real data from API
async function initializeCharts() {
  if (window.Chart) {
    Chart.defaults.color = chartColors.text;
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(8, 13, 20, 0.94)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(30, 224, 255, 0.35)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
  }

  await Promise.all([
    initializeRevenueChart(),
    initializePartTypeChart(),
    initializeBrandMarginsChart(),
    initializeTierDistChart(),
    initializeRevenueForecastChart()
  ]);
}

// ---- Theme colors ----
const chartColors = {
  cyan:    '#1ee0ff',
  green:   '#1eff8e',
  orange:  '#ff7a1f',
  pink:    '#ff1e8e',
  purple:  '#a855f7',
  yellow:  '#facc15',
  teal:    '#14b8a6',
  grid:    'rgba(30, 224, 255, 0.1)',
  text:    '#a7c0d8',
};

const tierColors = {
  'Standard':    { bg: 'rgba(30, 224, 255, 0.7)',  border: '#1ee0ff'  },
  'Fast-Moving': { bg: 'rgba(30, 255, 142, 0.7)',  border: '#1eff8e'  },
  'Premium':     { bg: 'rgba(250, 204, 21, 0.7)',  border: '#facc15'  },
};

function chartGridOptions() {
  return {
    color: 'rgba(167, 192, 216, 0.08)',
    drawBorder: false
  };
}

// ---- Revenue Trend (bar chart from real monthly data) ----
async function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;

  try {
    const res = await fetch('/api/admin/analytics/revenue-trend');
    const data = await res.json();
    analyticsCache.revenueTrend = Array.isArray(data) ? data : [];

    const labels = analyticsCache.revenueTrend.map(d => d.month_name);
    const revenue = analyticsCache.revenueTrend.map(d => parseFloat(d.revenue));
    const profit = analyticsCache.revenueTrend.map(d => parseFloat(d.profit));

    const revenueGradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, 'rgba(30, 224, 255, 0.36)');
    revenueGradient.addColorStop(1, 'rgba(30, 224, 255, 0.02)');

    revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenue,
            backgroundColor: revenueGradient,
            borderColor: chartColors.cyan,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#0f1720',
            pointBorderColor: chartColors.cyan,
            pointBorderWidth: 2,
            tension: 0.35,
            fill: true,
          },
          {
            label: 'Profit',
            data: profit,
            backgroundColor: 'rgba(30, 255, 142, 0.08)',
            borderColor: chartColors.green,
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#0f1720',
            pointBorderColor: chartColors.green,
            pointBorderWidth: 2,
            tension: 0.35,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { color: chartColors.text, usePointStyle: true } },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: chartColors.text, callback: v => '₱' + v.toLocaleString() },
            grid: chartGridOptions()
          },
          x: {
            ticks: { color: chartColors.text },
            grid: { display: false }
          }
        }
      }
    });
  } catch (e) {
    console.error('Error loading revenue chart:', e);
  }
}

// ---- Part Type Breakdown (doughnut) ----
let partTypeChart = null;
async function initializePartTypeChart() {
  const ctx = document.getElementById('partTypeChart');
  if (!ctx) return;

  try {
    const res = await fetch('/api/admin/analytics/part-type-breakdown');
    const data = await res.json();
    analyticsCache.partTypeBreakdown = Array.isArray(data) ? data : [];

    const colors = [chartColors.cyan, chartColors.green, chartColors.orange, chartColors.pink, chartColors.purple, chartColors.yellow, chartColors.teal, '#6366f1', '#ec4899', '#84cc16'];

    partTypeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: analyticsCache.partTypeBreakdown.map(d => d.part_type || 'Other'),
        datasets: [{
          data: analyticsCache.partTypeBreakdown.map(d => parseFloat(d.total_revenue)),
          backgroundColor: analyticsCache.partTypeBreakdown.map((_, i) => colors[i % colors.length]),
          borderColor: '#0f1720',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: chartColors.text, font: { size: 11 }, padding: 14, usePointStyle: true }
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.label}: ₱${parseFloat(ctx.raw).toLocaleString()}`
            }
          }
        }
      }
    });
  } catch (e) {
    console.error('Error loading part type chart:', e);
  }
}

// ---- Brand Profit Margins (horizontal bar) ----
let brandMarginsChart = null;
async function initializeBrandMarginsChart() {
  const ctx = document.getElementById('brandMarginsChart');
  if (!ctx) return;

  try {
    const res = await fetch('/api/admin/analytics/brand-margins');
    const data = await res.json();
    analyticsCache.brandMargins = Array.isArray(data) ? data : [];

    // Take top 10 brands
    const top = analyticsCache.brandMargins.slice(0, 10);

    brandMarginsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top.map(d => d.brand),
        datasets: [{
          label: 'Profit Margin %',
          data: top.map(d => d.profit_margin),
          backgroundColor: top.map(d =>
            d.profit_margin >= 30 ? 'rgba(30, 255, 142, 0.7)' :
            d.profit_margin >= 15 ? 'rgba(30, 224, 255, 0.7)' :
            'rgba(255, 122, 31, 0.7)'
          ),
          borderColor: top.map(d =>
            d.profit_margin >= 30 ? chartColors.green :
            d.profit_margin >= 15 ? chartColors.cyan :
            chartColors.orange
          ),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `Margin: ${ctx.raw}% | Revenue: ₱${top[ctx.dataIndex].total_revenue.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: chartColors.text, callback: v => v + '%' },
            grid: chartGridOptions()
          },
          y: {
            ticks: { color: chartColors.text, font: { size: 11 } },
            grid: { display: false }
          }
        }
      }
    });
  } catch (e) {
    console.error('Error loading brand margins chart:', e);
  }
}

// ---- ML Tier Distribution (doughnut) ----
let tierDistChart = null;
async function initializeTierDistChart() {
  const ctx = document.getElementById('tierDistChart');
  if (!ctx) return;

  try {
    const res = await fetch('/api/admin/analytics/tier-distribution');
    const data = await res.json();
    analyticsCache.tierDistribution = Array.isArray(data) ? data : [];

    if (analyticsCache.tierDistribution.length === 0) {
      // No ML data yet — show placeholder
      ctx.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-size:14px;text-align:center;padding:20px;">Run <code style="color:#1ee0ff;">php artisan ml:classify-products</code> to generate tier data</div>';
      return;
    }

    const labels = analyticsCache.tierDistribution.map(d => d.ml_tier || 'Unclassified');
    const counts = analyticsCache.tierDistribution.map(d => d.count);
    const bgColors = labels.map(l => (tierColors[l] || { bg: 'rgba(148,163,184,0.5)' }).bg);
    const bdColors = labels.map(l => (tierColors[l] || { border: '#94a3b8' }).border);

    tierDistChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: bgColors,
          borderColor: '#0f1720',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '58%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: chartColors.text, font: { size: 12 }, padding: 14, usePointStyle: true }
          }
        }
      }
    });
  } catch (e) {
    console.error('Error loading tier dist chart:', e);
  }
}

async function initializeRevenueForecastChart() {
  const ctx = document.getElementById('demandForecastChart');
  if (!ctx) return;

  try {
    const res = await fetch('/api/admin/analytics/revenue');
    let data = await res.json();
    
    // Safety check just in case endpoint fails or empty
    if (!Array.isArray(data)) return;

    data = data.slice(0, 10); // Limit to top 10
    const labels = data.map(d => String(d.name || d.product_name).substring(0, 15) + '...');
    const values = data.map(d => parseFloat(d.demand_score || 0).toFixed(2));
    
    demandChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Top 10 Products by Estimated Revenue Tomorrow',
          data: values,
          backgroundColor: chartColors.teal,
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.x !== null) {
                  label += '₱' + context.parsed.x.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: Object.assign({ beginAtZero: true }, chartGridOptions()),
          y: chartGridOptions()
        }
      }
    });

  } catch (e) {
    console.error('Error loading demand forecast chart:', e);
  }
}

function filterPredictProducts(query) {
  const dropdown = document.getElementById('productSearchDropdown');
  if (!dropdown) return;

  if (!query || query.length < 1) {
    dropdown.style.display = 'none';
    return;
  }

  const source = salesAvgData.length ? salesAvgData : productsData;
  const q = query.toLowerCase();
  const matches = source.filter(p =>
    (p.name && p.name.toLowerCase().includes(q)) ||
    (p.brand && p.brand.toLowerCase().includes(q)) ||
    (p.category && p.category.toLowerCase().includes(q))
  ).slice(0, 10);

  if (matches.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  dropdown.innerHTML = matches.map((p, idx) => {
    const displayPrice = p.avg_price || p.price || 0;
    const displayProfit = p.avg_profit || 0;
    return `
      <div data-index="${idx}" onclick="selectPredictProduct(this)" style="padding: 10px 15px; cursor: pointer; border-bottom: 1px solid rgba(30, 224, 255, 0.1); color: #e2e8f0; transition: background 0.2s;"
           onmouseover="this.style.background='rgba(30,224,255,0.1)'" onmouseout="this.style.background='transparent'">
        <div style="font-weight: 500;">${p.name}</div>
        <div style="font-size: 12px; color: #94a3b8;">${capitalizeFirst(p.brand || '')} — ${capitalizeFirst(p.category || '')} — ₱${Number(displayPrice).toLocaleString()} | Profit: ₱${Number(displayProfit).toLocaleString()}</div>
      </div>
    `;
  }).join('');
  dropdown.style.display = 'block';
}

function selectPredictProduct(el) {
  const idx = parseInt(el.dataset.index);
  const source = salesAvgData.length ? salesAvgData : productsData;
  const product = source[idx];
  if (!product) return;

  const input = document.getElementById('productSearchInput');
  const dropdown = document.getElementById('productSearchDropdown');

  input.value = product.name;
  dropdown.style.display = 'none';

  document.getElementById('pd_price').value = product.avg_price || product.price || 0;
  document.getElementById('pd_profit').value = product.avg_profit || (document.getElementById('pd_price').value * 0.5);
  const brandSel = document.getElementById('pd_brand');
  const typeSel = document.getElementById('pd_part_type');
  if (brandSel) brandSel.value = product.brand || '';
  if (typeSel) typeSel.value = product.category || '';
}

async function handlePredictRevenue() {
  const btn = document.querySelector('[onclick="handlePredictRevenue()"]');
  const resultDiv = document.getElementById('demandPredictionResult');
  const scoreVal = document.getElementById('demandScoreValue');
  const inputsDiv = document.getElementById('predictionInputs');

  const price = document.getElementById('pd_price').value;
  const profit = document.getElementById('pd_profit').value;
  const brand = document.getElementById('pd_brand').value;
  const partType = document.getElementById('pd_part_type').value;
  const productName = document.getElementById('productSearchInput')?.value || '';

  if (!price || !profit || !brand || !partType) {
    showToast('error', 'Please select a product or fill in brand, part type, price, and profit');
    return;
  }

  if (window.AppLoading && typeof window.AppLoading.setButtonLoading === 'function') {
    window.AppLoading.setButtonLoading(btn, true, 'Predicting...');
  } else if (btn) {
    btn.disabled = true;
    btn.textContent = 'Predicting...';
  }

  const monthVal = parseInt(document.getElementById('pd_month').value);
  const dayOfWeekVal = parseInt(document.getElementById('pd_day_of_week').value);

  const monthNames = ['', 'January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  inputsDiv.innerHTML = `
    <strong>${productName}</strong><br>
    ${capitalizeFirst(brand)} — ${capitalizeFirst(partType)}<br>
    Avg Price: ₱${Number(price).toLocaleString()} &nbsp;|&nbsp; Avg Profit: ₱${Number(profit).toLocaleString()}<br>
    ${monthNames[monthVal]} — ${dayNames[dayOfWeekVal]}
  `;

  const payload = {
    avg_price: parseFloat(price),
    avg_profit: parseFloat(profit),
    month: monthVal,
    day_of_week: dayOfWeekVal,
    brand: brand,
    part_type: partType
  };

  try {
    const res = await fetch('/api/admin/ml/predict-revenue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      let revenueVal = parseFloat(data.predicted_revenue_php || 0);
      scoreVal.textContent = '₱' + revenueVal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      resultDiv.style.display = 'block';
      showToast('success', 'Revenue prediction complete');
    } else {
      showToast('error', data.error || 'Prediction failed');
      resultDiv.style.display = 'none';
    }
  } catch (error) {
    console.error('Prediction error:', error);
    showToast('error', 'Failed to connect to prediction server');
    resultDiv.style.display = 'none';
  } finally {
    if (window.AppLoading && typeof window.AppLoading.setButtonLoading === 'function') {
      window.AppLoading.setButtonLoading(btn, false);
    } else if (btn) {
      btn.disabled = false;
      btn.textContent = 'Predict Revenue for Tomorrow';
    }
  }
}



// ---- Top Products Monthly (table) ----
async function loadTopProductsMonthly(month) {
  const table = document.getElementById('topProductsTable');
  if (!table) return;
  table.innerHTML = window.window.AppLoading?.skeletonRows?.(7, 5) || '';

  try {
    let url = '/api/admin/analytics/top-products-monthly';
    if (month) url += `?month=${month}`;

    const res = await fetch(url);
    const data = await res.json();

    // Flatten all months into one list
    let allProducts = [];
    if (Array.isArray(data)) {
      allProducts = data;
    } else {
      Object.values(data).forEach(products => {
        allProducts = allProducts.concat(products);
      });
    }

    // Sort by total quantity and take top 15
    allProducts.sort((a, b) => b.total_quantity - a.total_quantity);
    const top = allProducts.slice(0, 15);
    analyticsCache.topProducts = top;

    if (top.length === 0) {
      table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#64748b;">No data for selected month</td></tr>';
      applyAdminSearchToSection("analytics");
      return;
    }

    table.innerHTML = top.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.product}</td>
        <td>${p.brand || '-'}</td>
        <td>${p.part_type || '-'}</td>
        <td>${parseInt(p.total_quantity).toLocaleString()}</td>
        <td>₱${parseFloat(p.total_revenue).toLocaleString()}</td>
        <td>₱${parseFloat(p.total_profit).toLocaleString()}</td>
      </tr>
    `).join('');
    applyAdminSearchToSection("analytics");
  } catch (e) {
    console.error('Error loading top products:', e);
    table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#ff1e8e;">Unable to load top products</td></tr>';
    showToast("error", "Failed to load top products");
  }
}

// ---- Dead Stock Alert (table) ----
async function loadDeadStock() {
  const table = document.getElementById('deadStockTable');
  if (!table) return;
  table.innerHTML = window.window.AppLoading?.skeletonRows?.(7, 4) || '';

  try {
    const res = await fetch('/api/admin/analytics/dead-stock');
    const data = await res.json();
    analyticsCache.deadStock = Array.isArray(data) ? data : [];

    if (analyticsCache.deadStock.length === 0) {
      table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#1eff8e;"><i class="fas fa-check-circle"></i> No dead stock detected</td></tr>';
      applyAdminSearchToSection("analytics");
      return;
    }

    table.innerHTML = analyticsCache.deadStock.map(d => {
      const qty = parseInt(d.total_quantity);
      const statusClass = qty === 0 ? 'out-of-stock' : qty <= 1 ? 'low-stock' : 'low-stock';
      const statusLabel = qty === 0 ? 'No Sales' : qty <= 1 ? 'Critical' : 'Slow Moving';

      return `
        <tr>
          <td>${d.product}</td>
          <td>${d.brand || '-'}</td>
          <td>${d.part_type || '-'}</td>
          <td>${qty}</td>
          <td>₱${parseFloat(d.total_revenue).toLocaleString()}</td>
          <td>${d.last_sale_date || '-'}</td>
          <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        </tr>
      `;
    }).join('');
    applyAdminSearchToSection("analytics");
  } catch (e) {
    console.error('Error loading dead stock:', e);
    table.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#ff1e8e;">Unable to load dead stock data</td></tr>';
    showToast("error", "Failed to load dead stock data");
  }
}


function loadOrders() {
  const ordersGrid = document.getElementById("ordersGrid");
  if (!ordersGrid) return;

  const filteredOrders = currentFilter === "all" ? ordersData : ordersData.filter((order) => order.status === currentFilter);

  ordersGrid.innerHTML = filteredOrders.map(order => `
    <div class="order-card" onclick="openOrderDetail('${order.id}')">
      <div class="order-card-header">
        <div class="order-id">${order.id}</div>
        <span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span>
      </div>
      
      <div class="order-customer">
        <i class="fas fa-user"></i>
        <span>${order.customer}</span>
      </div>
      
      <div class="order-products">
        ${order.products.map(product => `
          <div class="order-product-item">
            <img src="${product.image}" alt="${product.name}" class="order-product-img">
            <div class="order-product-details">
              <div class="order-product-name">${product.name}</div>
              <div class="order-product-qty">Qty: ${product.qty}</div>
            </div>
          </div>
        `).join("")}
      </div>
      
      <div class="order-footer">
        <div>
          <div class="order-total-label">Total:</div>
          <div class="order-total-amount">₱${order.total.toLocaleString()}</div>
        </div>
        <div style="text-align: right;">
          <div class="order-payment">Payment: ${order.payment}</div>
          <div class="order-shipping">
            <i class="fas fa-truck"></i>
            <span>${order.shipping}</span>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function filterOrders(status) {
  currentFilter = status;
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.status === status);
  });
  displayOrdersInTable();
}

async function viewAllRecentOrders() {
  currentFilter = "all";
  await switchSection("orders");
  filterOrders("all");
}

function getStatusLabel(status) {
  const labels = {
    unpaid: "UNPAID",
    "to-ship": "TO SHIP",
    shipping: "SHIPPING",
    completed: "COMPLETED",
    "return-refund": "RETURN/REFUND",
    cancel: "CANCEL",
  };
  return labels[status] || status.toUpperCase();
}

function openOrderDetail(orderId) {
  currentOrderId = orderId;
  const order = ordersData.find((o) => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("orderDetailModal");

  document.getElementById("orderDetailId").textContent = order.id;
  document.getElementById("detailOrderId").textContent = order.id;
  document.getElementById("detailCustomer").textContent = order.customer;
  document.getElementById("detailStatus").innerHTML = `<span class="status-badge ${order.status}">${getStatusLabel(order.status)}</span>`;
  document.getElementById("detailDate").textContent = order.date;

  const productsHtml = order.products.map(product => `
    <div class="detail-product-item">
      <img src="${product.image}" alt="${product.name}" class="detail-product-img">
      <div class="detail-product-info">
        <div class="detail-product-name">${product.name}</div>
        <div class="detail-product-qty">Quantity: ${product.qty}</div>
      </div>
    </div>
  `).join("");
  document.getElementById("detailProducts").innerHTML = productsHtml;

  document.getElementById("detailPaymentMethod").textContent = order.payment;
  document.getElementById("detailSubtotal").textContent = `₱${order.subtotal.toLocaleString()}`;
  document.getElementById("detailShippingFee").textContent = `₱${order.shippingFee}`;
  document.getElementById("detailTotal").textContent = `₱${order.total.toLocaleString()}`;

  document.getElementById("detailShippingMethod").textContent = order.shipping;
  document.getElementById("detailTrackingNumber").textContent = order.trackingNumber;
  document.getElementById("detailEstimatedDelivery").textContent = order.estimatedDelivery;

  modal.classList.add("active");
}

function closeOrderDetail() {
  const modal = document.getElementById("orderDetailModal");
  if (modal) modal.classList.remove("active");
  closeOrderStatusModal();
}

function toggleStatusDropdown() {
  const dropdown = document.getElementById("statusDropdown");
  if (dropdown) dropdown.classList.toggle("active");
}

function updateOrderStatus(newStatus) {
  if (!currentOrderId) return;

  const order = ordersData.find((o) => o.id === currentOrderId);
  if (order) {
    order.status = newStatus;

    const detailStatusElement = document.getElementById("detailStatus");
    if (detailStatusElement) {
      detailStatusElement.innerHTML = `<span class="status-badge ${newStatus}">${getStatusLabel(newStatus)}</span>`;
    }

    const dropdown = document.getElementById("statusDropdown");
    if (dropdown) dropdown.classList.remove("active");

    loadOrders();
    showToast("success", `Order status updated to ${getStatusLabel(newStatus)}`);
  }
}

function printOrder() {
  if (!currentOrderId) return;

  const realOrder = realOrdersData.find((order) => String(order.id) === String(currentOrderId));
  if (realOrder) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order ${realOrder.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #0f1720; }
            h1 { color: #0891b2; }
            .section { margin: 20px 0; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Order ${realOrder.order_number}</h1>
          <div class="section">
            <p><span class="label">Customer:</span> ${realOrder.customer_name || "Guest"}</p>
            <p><span class="label">Email:</span> ${realOrder.customer_email || "N/A"}</p>
            <p><span class="label">Phone:</span> ${realOrder.customer_phone || "N/A"}</p>
            <p><span class="label">Date:</span> ${formatDateTime(realOrder.created_at)}</p>
            <p><span class="label">Status:</span> ${capitalizeFirst(realOrder.status || "pending")}</p>
          </div>
          <div class="section">
            <h2>Products</h2>
            <table>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                ${realOrder.items.map((item) => `
                  <tr>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.subtotal)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <div class="section">
            <h2>Payment Details</h2>
            <p><span class="label">Payment Method:</span> ${realOrder.payment_method || "N/A"}</p>
            <p><span class="label">Subtotal:</span> ${formatCurrency(realOrder.subtotal)}</p>
            <p><span class="label">Shipping Fee:</span> ${formatCurrency(realOrder.shipping_cost)}</p>
            <p><span class="label">Total:</span> ${formatCurrency(realOrder.total)}</p>
          </div>
          <div class="section">
            <h2>Delivery Details</h2>
            <p><span class="label">Address:</span> ${realOrder.shipping_address || "N/A"}</p>
            <p><span class="label">City:</span> ${realOrder.city || "N/A"}</p>
            <p><span class="label">Postal Code:</span> ${realOrder.zip_code || "N/A"}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    return;
  }

  const order = ordersData.find((o) => o.id === currentOrderId);
  if (!order) return;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Order ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #1ee0ff; }
          .section { margin: 20px 0; }
          .label { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Order ${order.id}</h1>
        <div class="section">
          <p><span class="label">Customer:</span> ${order.customer}</p>
          <p><span class="label">Date:</span> ${order.date}</p>
          <p><span class="label">Status:</span> ${getStatusLabel(order.status)}</p>
        </div>
        <div class="section">
          <h2>Products</h2>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              ${order.products.map((p) => `<tr><td>${p.name}</td><td>${p.qty}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="section">
          <h2>Payment Details</h2>
          <p><span class="label">Payment Method:</span> ${order.payment}</p>
          <p><span class="label">Subtotal:</span> ₱${order.subtotal.toLocaleString()}</p>
          <p><span class="label">Shipping Fee:</span> ₱${order.shippingFee}</p>
          <p><span class="label">Total:</span> ₱${order.total.toLocaleString()}</p>
        </div>
        <div class="section">
          <h2>Shipping Information</h2>
          <p><span class="label">Shipping Method:</span> ${order.shipping}</p>
          <p><span class="label">Tracking Number:</span> ${order.trackingNumber}</p>
          <p><span class="label">Estimated Delivery:</span> ${order.estimatedDelivery}</p>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function exportOrders() {
  const filteredOrders = getFilteredLiveOrders();
  const headers = ["Order ID", "Customer", "Email", "Phone", "Products", "Total", "Payment", "Status", "Date"];
  const csvContent = [
    headers.join(","),
    ...filteredOrders.map((order) =>
      [
        order.order_number,
        `"${String(order.customer_name || "Guest").replace(/"/g, '""')}"`,
        `"${String(order.customer_email || "").replace(/"/g, '""')}"`,
        `"${String(order.customer_phone || "").replace(/"/g, '""')}"`,
        `"${(Array.isArray(order.items) ? order.items : []).map((item) => `${item.product_name} (${item.quantity})`).join("; ").replace(/"/g, '""')}"`,
        Number(order.total || 0),
        `"${String(order.payment_method || "").replace(/"/g, '""')}"`,
        capitalizeFirst(order.status || "pending"),
        formatDateTime(order.created_at),
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${currentFilter || "all"}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("success", "Orders exported successfully!");
}

// DASHBOARD
async function loadDashboardData() {
  const recentOrdersTable = document.getElementById("recentOrdersTable");
  if (!recentOrdersTable) return;
  recentOrdersTable.innerHTML = window.window.AppLoading?.skeletonRows?.(6, 5) || '';

  // Load orders from database if not already loaded
  if (realOrdersData.length === 0) {
    await loadOrders();
  }

  // Get the 5 most recent orders
  const recentOrders = realOrdersData.slice(0, 5);
  
  if (recentOrders.length === 0) {
    recentOrdersTable.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #64748b;">No orders yet</td></tr>';
    return;
  }

  recentOrdersTable.innerHTML = recentOrders.map(order => {
    const statusClass = getOrderStatusClass(order.status);
    const productNames = order.items.map(item => item.product_name).join(", ");
    
    return `
      <tr onclick="viewOrderDetails(${order.id})" style="cursor: pointer;">
        <td><strong>${order.order_number}</strong></td>
        <td>${order.customer_name}</td>
        <td>${productNames}</td>
        <td><strong>₱${parseFloat(order.total).toLocaleString()}</strong></td>
        <td><span class="status-badge status-${statusClass}">${capitalizeFirst(order.status)}</span></td>
        <td>${new Date(order.created_at).toLocaleDateString()}</td>
      </tr>
    `;
  }).join("");
  applyAdminSearchToSection("dashboard");
}

function loadInventoryData() {
  const inventoryTable = document.getElementById("inventoryTable");
  if (!inventoryTable) return;

  if (!productsData.length) {
    inventoryTable.innerHTML = window.window.AppLoading?.skeletonRows?.(6, 5) || '';
    return;
  }

  inventoryTable.innerHTML = productsData.map(product => {
    const minRequired = 20;
    let stockStatus, stockLabel;
    
    if (product.stock === 0) {
      stockStatus = 'out-of-stock';
      stockLabel = 'Out of Stock';
    } else if (product.stock <= minRequired) {
      stockStatus = 'low-stock';
      stockLabel = 'Low Stock';
    } else {
      stockStatus = 'in-stock';
      stockLabel = 'In Stock';
    }
    
    return `
      <tr>
        <td>${product.name}</td>
        <td>${capitalizeFirst(product.category)}</td>
        <td>${product.stock}</td>
        <td>${minRequired}</td>
        <td><span class="status-badge ${stockStatus}">${stockLabel}</span></td>
        <td>
          <button class="action-btn" title="Add Stock" onclick="openAddStockModal(${product.id})" style="color: #1eff8e;">
            <i class="fas fa-plus"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
  applyAdminSearchToSection("inventory");
}

async function loadAnalyticsData() {
  await Promise.all([
    loadTopProductsMonthly(''),
    loadDeadStock()
  ]);
}

async function saveStoreInfo(event) {
  event.preventDefault();
  const storeName = document.getElementById("storeName").value;
  const storeEmail = document.getElementById("storeEmail").value;
  const storePhone = document.getElementById("storePhone").value;
  const storeAddress = document.getElementById("storeAddress").value;
  const storeLocation = document.getElementById("storeLocation").value;

  if (!storeName || !storeEmail || !storePhone || !storeAddress || !storeLocation) {
    showToast("error", "Please fill in all store information fields");
    return;
  }

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({ store_info: { storeName, storeEmail, storePhone, storeAddress, storeLocation } })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('adeAdminStoreInfo', JSON.stringify({ storeName, storeEmail, storePhone, storeAddress, storeLocation }));
      showToast("success", "Store information updated successfully!");
    } else {
      showToast("error", data.message || "Failed to save store information");
    }
  } catch (error) {
    console.error('Error saving store info:', error);
    showToast("error", "Network error while saving store information");
  }
}

async function saveNotificationSettings(event) {
  event.preventDefault();
  const settings = {
    emailNotif: document.getElementById("emailNotif")?.checked ?? true,
    orderNotif: document.getElementById("orderNotif")?.checked ?? true,
    stockNotif: document.getElementById("stockNotif")?.checked ?? true,
    customerNotif: document.getElementById("customerNotif")?.checked ?? false
  };

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({ notification_settings: settings })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('adeAdminNotifSettings', JSON.stringify(settings));
      showToast("success", "Notification settings updated successfully!");
    } else {
      showToast("error", data.message || "Failed to save notification settings");
    }
  } catch (error) {
    console.error('Error saving notification settings:', error);
    showToast("error", "Network error while saving notification settings");
  }
}

async function saveBusinessHours(event) {
  event.preventDefault();
  const settings = {
    openingTime: document.getElementById("openingTime")?.value || "09:00",
    closingTime: document.getElementById("closingTime")?.value || "18:00",
    weekendOpen: document.getElementById("weekendOpen")?.checked ?? true
  };

  try {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      },
      body: JSON.stringify({ business_hours: settings })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('adeAdminBusinessHours', JSON.stringify(settings));
      showToast("success", "Business hours updated successfully!");
    } else {
      showToast("error", data.message || "Failed to save business hours");
    }
  } catch (error) {
    console.error('Error saving business hours:', error);
    showToast("error", "Network error while saving business hours");
  }
}

async function changePassword(event) {
  event.preventDefault();
  const current = document.getElementById('currentPassword')?.value;
  const newPass = document.getElementById('newPassword')?.value;
  const confirmPass = document.getElementById('confirmPassword')?.value;
  if (!current || !newPass || !confirmPass) {
    showToast("error", "Please fill in all password fields.");
    return;
  }
  if (newPass !== confirmPass) {
    showToast("error", "New passwords do not match.");
    return;
  }

  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/profile/password';
    form.style.display = 'none';

    const csrfInput = document.createElement('input');
    csrfInput.name = '_token';
    csrfInput.value = document.querySelector('meta[name="csrf-token"]')?.content || '';
    form.appendChild(csrfInput);

    const methodInput = document.createElement('input');
    methodInput.name = '_method';
    methodInput.value = 'PUT';
    form.appendChild(methodInput);

    const currentInput = document.createElement('input');
    currentInput.name = 'current_password';
    currentInput.value = current;
    form.appendChild(currentInput);

    const newInput = document.createElement('input');
    newInput.name = 'password';
    newInput.value = newPass;
    form.appendChild(newInput);

    const confirmInput = document.createElement('input');
    confirmInput.name = 'password_confirmation';
    confirmInput.value = confirmPass;
    form.appendChild(confirmInput);

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error('Error changing password:', error);
    showToast("error", "Failed to change password");
  }
}

async function loadAdminSettings() {
  try {
    const response = await fetch('/api/admin/settings', { adeSilent: true });
    if (!response.ok) return;

    const data = await response.json();

    if (data.store_info) {
      const info = data.store_info;
      if (document.getElementById("storeName")) document.getElementById("storeName").value = info.storeName || "";
      if (document.getElementById("storeEmail")) document.getElementById("storeEmail").value = info.storeEmail || "";
      if (document.getElementById("storePhone")) document.getElementById("storePhone").value = info.storePhone || "";
      if (document.getElementById("storeAddress")) document.getElementById("storeAddress").value = info.storeAddress || "";
      if (document.getElementById("storeLocation")) document.getElementById("storeLocation").value = info.storeLocation || "";
      localStorage.setItem('adeAdminStoreInfo', JSON.stringify(info));
    }

    if (data.notification_settings) {
      const notif = data.notification_settings;
      if (document.getElementById("emailNotif")) document.getElementById("emailNotif").checked = notif.emailNotif ?? true;
      if (document.getElementById("orderNotif")) document.getElementById("orderNotif").checked = notif.orderNotif ?? true;
      if (document.getElementById("stockNotif")) document.getElementById("stockNotif").checked = notif.stockNotif ?? true;
      if (document.getElementById("customerNotif")) document.getElementById("customerNotif").checked = notif.customerNotif ?? false;
      localStorage.setItem('adeAdminNotifSettings', JSON.stringify(notif));
    }

    if (data.business_hours) {
      const biz = data.business_hours;
      if (document.getElementById("openingTime")) document.getElementById("openingTime").value = biz.openingTime || "09:00";
      if (document.getElementById("closingTime")) document.getElementById("closingTime").value = biz.closingTime || "18:00";
      if (document.getElementById("weekendOpen")) document.getElementById("weekendOpen").checked = biz.weekendOpen ?? true;
      localStorage.setItem('adeAdminBusinessHours', JSON.stringify(biz));
    }
  } catch(e) {
    console.error("Error loading admin settings from server, using localStorage:", e);
    try {
      const storeInfo = localStorage.getItem('adeAdminStoreInfo');
      if (storeInfo) {
        const data = JSON.parse(storeInfo);
        if (document.getElementById("storeName")) document.getElementById("storeName").value = data.storeName || "";
        if (document.getElementById("storeEmail")) document.getElementById("storeEmail").value = data.storeEmail || "";
        if (document.getElementById("storePhone")) document.getElementById("storePhone").value = data.storePhone || "";
        if (document.getElementById("storeAddress")) document.getElementById("storeAddress").value = data.storeAddress || "";
        if (document.getElementById("storeLocation")) document.getElementById("storeLocation").value = data.storeLocation || "";
      }

      const notifInfo = localStorage.getItem('adeAdminNotifSettings');
      if (notifInfo) {
        const data = JSON.parse(notifInfo);
        if (document.getElementById("emailNotif")) document.getElementById("emailNotif").checked = data.emailNotif;
        if (document.getElementById("orderNotif")) document.getElementById("orderNotif").checked = data.orderNotif;
        if (document.getElementById("stockNotif")) document.getElementById("stockNotif").checked = data.stockNotif;
        if (document.getElementById("customerNotif")) document.getElementById("customerNotif").checked = data.customerNotif;
      }

      const bizInfo = localStorage.getItem('adeAdminBusinessHours');
      if (bizInfo) {
        const data = JSON.parse(bizInfo);
        if (document.getElementById("openingTime")) document.getElementById("openingTime").value = data.openingTime;
        if (document.getElementById("closingTime")) document.getElementById("closingTime").value = data.closingTime;
        if (document.getElementById("weekendOpen")) document.getElementById("weekendOpen").checked = data.weekendOpen;
      }
    } catch(le) {
      console.error("Error loading admin settings from localStorage:", le);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadAdminSettings);

async function refreshDashboard() {
  const button = typeof event !== 'undefined' ? event?.target?.closest?.('button') : null;
  window.AppLoading?.setButtonLoading?.(button, true, 'Refreshing...');
  await loadOrders(true);
  await Promise.all([loadDashboardData(), loadDashboardStats(), loadNotifications()]);
  showToast("success", "Dashboard refreshed!");
  window.AppLoading?.setButtonLoading?.(button, false);
}

async function updateInventory() {
  const button = typeof event !== 'undefined' ? event?.target?.closest?.('button') : null;
  window.AppLoading?.setButtonLoading?.(button, true, 'Updating...');
  await loadProductsData(true);
  loadInventoryData();
  showToast("success", "Inventory updated!");
  window.AppLoading?.setButtonLoading?.(button, false);
}

function generateReport() {
  const reportData = {
    date: new Date().toLocaleDateString(),
    totalProducts: productsData.length,
    totalRevenue: productsData.reduce((sum, p) => sum + (p.price * p.stock), 0),
    lowStockItems: productsData.filter(p => p.stock <= 20 && p.stock > 0).length,
    outOfStockItems: productsData.filter(p => p.stock === 0).length,
    topProducts: [...productsData].sort((a, b) => (b.price * b.stock) - (a.price * a.stock)).slice(0, 5).map(p => ({
      name: p.name,
      stock: p.stock,
      value: p.price * p.stock
    }))
  };

  //NOTE
  let reportContent = `
ADE GARAGE - ANALYTICS REPORT
Generated: ${reportData.date}
================================

SUMMARY
-------
Total Products: ${reportData.totalProducts}
Total Inventory Value: ₱${reportData.totalRevenue.toLocaleString()}
Low Stock Items: ${reportData.lowStockItems}
Out of Stock Items: ${reportData.outOfStockItems}

TOP PRODUCTS (by Inventory Value)
------------
`;

  reportData.topProducts.forEach((product, index) => {
    reportContent += `${index + 1}. ${product.name}\n   Stock: ${product.stock} | Value: ₱${product.value.toLocaleString()}\n\n`;
  });

  // TEXT
  const blob = new Blob([reportContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ADE-Garage-Report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("success", "Report generated and downloaded!");
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(filename, headers, rows) {
  const csvContent = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => row.map(csvEscape).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function exportDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const summary = dashboardSummaryData || {};
  const recentOrders = realOrdersData.slice(0, 5);
  const rows = [
    ['Total Revenue', summary.totalRevenue || 0],
    ['Total Orders', summary.totalOrders || realOrdersData.length],
    ['Total Customers', summary.totalCustomers || 0],
    ['Total Products', summary.totalProducts || productsData.length],
    ['Recent Orders Shown', recentOrders.length],
  ];

  downloadCsv(`ADE-Garage-Dashboard-${today}.csv`, ['Metric', 'Value'], rows);
  showToast("success", "Dashboard exported successfully!");
}

function exportProducts() {
  const filteredProducts = productsData.filter((product) =>
    productMatchesFilterValue(product.category, currentCategoryFilter) &&
    productMatchesFilterValue(product.brand, currentBrandFilter)
  );
  const rows = filteredProducts.map((product) => [
    product.name,
    capitalizeFirst(product.category || ""),
    capitalizeFirst(product.brand || ""),
    Number(product.price || 0),
    Number(product.stock || 0),
    product.ml_tier || 'Unclassified',
    product.description || ''
  ]);

  downloadCsv(
    `ADE-Garage-Products-${new Date().toISOString().split('T')[0]}.csv`,
    ['Name', 'Category', 'Brand', 'Price', 'Stock', 'Smart Rating', 'Description'],
    rows
  );
  showToast("success", "Products exported successfully!");
}

function exportInventory() {
  const rows = productsData.map((product) => {
    const stock = Number(product.stock || 0);
    const minRequired = 20;
    const status = stock === 0 ? 'Out of Stock' : stock <= minRequired ? 'Low Stock' : 'In Stock';
    return [
      product.name,
      capitalizeFirst(product.category || ""),
      stock,
      minRequired,
      status,
      Number(product.price || 0) * stock
    ];
  });

  downloadCsv(
    `ADE-Garage-Inventory-${new Date().toISOString().split('T')[0]}.csv`,
    ['Product', 'Category', 'Current Stock', 'Min Required', 'Status', 'Inventory Value'],
    rows
  );
  showToast("success", "Inventory exported successfully!");
}

function exportAnalytics() {
  //CSV
  let csvContent = "Product Name,Category,Brand,Price,Stock,Status,Inventory Value\n";
  
  productsData.forEach(product => {
    let status;
    if (product.stock === 0) {
      status = 'Out of Stock';
    } else if (product.stock <= 20) {
      status = 'Low Stock';
    } else {
      status = 'In Stock';
    }
    
    const inventoryValue = product.price * product.stock;
    const productNameEscaped = product.name.replace(/"/g, '""');
    const categoryEscaped = capitalizeFirst(product.category).replace(/"/g, '""');
    const brandEscaped = capitalizeFirst(product.brand).replace(/"/g, '""');

    csvContent += `"${productNameEscaped}","${categoryEscaped}","${brandEscaped}",${product.price},${product.stock},"${status}",${inventoryValue}\n`;
  });

 
  csvContent += "\n\nSUMMARY\n";
  csvContent += `Total Products,${productsData.length}\n`;
  csvContent += `Total Inventory Value,${productsData.reduce((sum, p) => sum + (p.price * p.stock), 0)}\n`;
  csvContent += `In Stock Items,${productsData.filter(p => p.stock > 20).length}\n`;
  csvContent += `Low Stock Items,${productsData.filter(p => p.stock <= 20 && p.stock > 0).length}\n`;
  csvContent += `Out of Stock Items,${productsData.filter(p => p.stock === 0).length}\n`;

  // CSV NGANI
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ADE-Garage-Analytics-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("success", "Analytics data exported successfully!");
}

async function ensureAnalyticsExportData() {
  if (
    analyticsCache.revenueTrend.length &&
    analyticsCache.partTypeBreakdown.length &&
    analyticsCache.brandMargins.length &&
    analyticsCache.topProducts.length
  ) {
    return;
  }

  await loadAnalyticsData();
  await Promise.all([
    initializeRevenueChart(),
    initializePartTypeChart(),
    initializeBrandMarginsChart(),
    initializeTierDistChart()
  ]);
}

async function generateReport() {
  await ensureAnalyticsExportData();

  const totalRevenue = analyticsCache.revenueTrend.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
  const totalProfit = analyticsCache.revenueTrend.reduce((sum, row) => sum + Number(row.profit || 0), 0);
  const totalUnits = analyticsCache.revenueTrend.reduce((sum, row) => sum + Number(row.units || 0), 0);
  let reportContent = `ADE GARAGE - ANALYTICS REPORT
Generated: ${new Date().toLocaleString()}
================================

SUMMARY
-------
Revenue Shown in Charts: PHP ${totalRevenue.toLocaleString()}
Profit Shown in Charts: PHP ${totalProfit.toLocaleString()}
Units Sold Shown in Charts: ${totalUnits.toLocaleString()}

TOP PRODUCTS
------------
`;

  analyticsCache.topProducts.slice(0, 10).forEach((product, index) => {
    reportContent += `${index + 1}. ${product.product || "Unknown"}\n   Month: ${product.month_name || "-"} | Units: ${Number(product.total_quantity || 0).toLocaleString()} | Revenue: PHP ${Number(product.total_revenue || 0).toLocaleString()} | Profit: PHP ${Number(product.total_profit || 0).toLocaleString()}\n\n`;
  });

  reportContent += `\nSALES BY PART TYPE\n------------------\n`;
  analyticsCache.partTypeBreakdown.slice(0, 10).forEach((part, index) => {
    reportContent += `${index + 1}. ${part.part_type || "Other"} | Units: ${Number(part.total_quantity || 0).toLocaleString()} | Revenue: PHP ${Number(part.total_revenue || 0).toLocaleString()}\n`;
  });

  reportContent += `\nBRAND PROFIT MARGINS\n--------------------\n`;
  analyticsCache.brandMargins.slice(0, 10).forEach((brand, index) => {
    reportContent += `${index + 1}. ${brand.brand || "Unknown"} | Revenue: PHP ${Number(brand.total_revenue || 0).toLocaleString()} | Margin: ${Number(brand.profit_margin || 0).toLocaleString()}%\n`;
  });

  reportContent += `\nDEAD STOCK ALERT\n----------------\n`;
  analyticsCache.deadStock.slice(0, 10).forEach((item, index) => {
    reportContent += `${index + 1}. ${item.product || "Unknown"} | Units Sold: ${Number(item.total_quantity || 0).toLocaleString()} | Last Sale: ${item.last_sale_date || "-"}\n`;
  });

  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ADE-Garage-Analytics-Report-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("success", "Analytics report generated!");
}

async function exportAnalytics() {
  await ensureAnalyticsExportData();

  const rows = [
    ...analyticsCache.revenueTrend.map((row) => [
      'Monthly Revenue Trend',
      row.month_name,
      '',
      '',
      Number(row.units || 0),
      Number(row.revenue || 0),
      Number(row.profit || 0),
      ''
    ]),
    ...analyticsCache.partTypeBreakdown.map((row) => [
      'Sales by Part Type',
      row.part_type || 'Other',
      '',
      '',
      Number(row.total_quantity || 0),
      Number(row.total_revenue || 0),
      Number(row.total_profit || 0),
      ''
    ]),
    ...analyticsCache.brandMargins.map((row) => [
      'Brand Profit Margins',
      row.brand || 'Unknown',
      '',
      '',
      Number(row.total_units || 0),
      Number(row.total_revenue || 0),
      Number(row.total_profit || 0),
      `${Number(row.profit_margin || 0)}%`
    ]),
    ...analyticsCache.tierDistribution.map((row) => [
      'Smart Product Ratings Distribution',
      row.ml_tier || 'Unclassified',
      '',
      '',
      Number(row.count || 0),
      '',
      '',
      ''
    ]),
    ...analyticsCache.topProducts.map((row) => [
      'Top Products per Month',
      row.product || 'Unknown',
      row.brand || '',
      row.part_type || '',
      Number(row.total_quantity || 0),
      Number(row.total_revenue || 0),
      Number(row.total_profit || 0),
      row.month_name || ''
    ]),
    ...analyticsCache.deadStock.map((row) => [
      'Dead Stock Alert',
      row.product || 'Unknown',
      row.brand || '',
      row.part_type || '',
      Number(row.total_quantity || 0),
      Number(row.total_revenue || 0),
      '',
      row.last_sale_date || ''
    ])
  ];

  downloadCsv(
    `ADE-Garage-Analytics-${new Date().toISOString().split('T')[0]}.csv`,
    ['Section', 'Name', 'Brand', 'Part Type', 'Units/Count', 'Revenue', 'Profit', 'Extra'],
    rows
  );

  showToast("success", "Analytics data exported successfully!");
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.AppLoading?.navigateWithLoading?.("/home_landing", "Logging out...");
  }
}


function showToast(type, message) {
  if (window.window.AppLoading?.showToast) {
    window.AppLoading.showToast(type, message);
    return;
  }
  const toastContainer = document.getElementById("toastRoot");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-exclamation-triangle";

  toast.innerHTML = `
    <i class="fas ${icon} toast-icon"></i>
    <div class="toast-message">${message}</div>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 3000);
}


function previewProductImage(event) {
  const file = event.target.files[0];
  if (file) {
    setProductImagePreview(URL.createObjectURL(file));
    return;
  }

  setProductImagePreview(currentEditingProductId
    ? resolveProductImageUrl(productsData.find((product) => String(product.id) === String(currentEditingProductId)))
    : "");
}

function openAddStockModal(productId) {
  const product = productsData.find(p => String(p.id) === String(productId));
  if (!product) return;

  const modal = document.getElementById("addStockModal");
  document.getElementById("stockProductId").value = product.id;
  document.getElementById("stockProductName").value = product.name;
  document.getElementById("stockCurrentAmount").value = product.stock;
  document.getElementById("stockQuantityToAdd").value = "";
  document.getElementById("stockNewTotal").value = product.stock;

  
  const quantityInput = document.getElementById("stockQuantityToAdd");
  quantityInput.oninput = function() {
    const currentStock = parseInt(document.getElementById("stockCurrentAmount").value);
    const addAmount = parseInt(this.value) || 0;
    document.getElementById("stockNewTotal").value = currentStock + addAmount;
  };

  if (modal) modal.classList.add("active");
}

function closeAddStockModal() {
  const modal = document.getElementById("addStockModal");
  if (modal) modal.classList.remove("active");
  const form = document.getElementById("addStockForm");
  if (form) form.reset();
}

async function confirmAddStock() {
  const button = typeof event !== 'undefined' ? event?.target?.closest?.('button') : null;
  const productId = parseInt(document.getElementById("stockProductId").value);
  const quantityToAdd = parseInt(document.getElementById("stockQuantityToAdd").value);

  if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
    showToast("error", "Please enter a valid quantity");
    return;
  }

  const product = productsData.find(p => p.id === productId);
  if (!product) {
    showToast("error", "Product not found, cannot update stock.");
    closeAddStockModal();
    return;
  }

  try {
    window.AppLoading?.setButtonLoading?.(button, true, 'Adding...');
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('brand', product.brand);
    formData.append('price', product.price);
    formData.append('stock', Number(product.stock) + quantityToAdd);
    if (product.models) formData.append('models', JSON.stringify(product.models));

    const response = await fetch(`/api/products/${productId}`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
      },
      body: formData
    });

    const data = await response.json();
    if (response.ok && data.success) {
      const index = productsData.findIndex((entry) => String(entry.id) === String(productId));
      if (index !== -1) {
        productsData[index] = data.product || {
          ...productsData[index],
          stock: Number(product.stock) + quantityToAdd
        };
      }
      productsLoadedAt = 0;
      renderProductsData();
      loadInventoryData();
      showToast("success", `Added ${quantityToAdd} units to inventory!`);
      closeAddStockModal();
      await loadProductsData(true);
      if (getActiveAdminSection() === "inventory") {
        loadInventoryData();
      }
    } else {
      showToast("error", data.message || "Failed to update stock");
    }
  } catch (error) {
    console.error('Error adding stock:', error);
    showToast("error", "Failed to update stock");
  } finally {
    window.AppLoading?.setButtonLoading?.(button, false);
  }
}

// Helper function to build variations JSON from predefined fields
function buildVariationsFromFields() {
  const sizeOptions = document.getElementById("productSizeOptions")?.value;
  const materialOptions = document.getElementById("productMaterialOptions")?.value;
  const colorOptions = document.getElementById("productColorOptions")?.value;
  
  const variations = {};
  
  if (sizeOptions && sizeOptions.trim()) {
    variations.size = sizeOptions.split(',').map(s => s.trim()).filter(s => s);
  }
  
  if (materialOptions && materialOptions.trim()) {
    variations.material = materialOptions.split(',').map(s => s.trim()).filter(s => s);
  }
  
  if (colorOptions && colorOptions.trim()) {
    variations.color = colorOptions.split(',').map(s => s.trim()).filter(s => s);
  }
  
  return Object.keys(variations).length > 0 ? JSON.stringify(variations) : null;
}

// Helper function to build specifications JSON from predefined fields
function buildSpecificationsFromFields() {
  const material = document.getElementById("specMaterial")?.value;
  const dimensions = document.getElementById("specDimensions")?.value;
  const weight = document.getElementById("specWeight")?.value;
  const compatibility = document.getElementById("specCompatibility")?.value;
  
  const specifications = {};
  
  if (material && material.trim()) specifications.Material = material.trim();
  if (dimensions && dimensions.trim()) specifications.Dimensions = dimensions.trim();
  if (weight && weight.trim()) specifications.Weight = weight.trim();
  if (compatibility && compatibility.trim()) specifications.Compatibility = compatibility.trim();
  
  return Object.keys(specifications).length > 0 ? JSON.stringify(specifications) : null;
}

// ============================================
// ORDERS MANAGEMENT FROM DATABASE
// ============================================

let realOrdersData = [];

function getFilteredLiveOrders() {
  const query = getAdminSearchQuery();

  return realOrdersData.filter((order) => {
    const matchesStatus = currentFilter === "all" || order.status === currentFilter;
    if (!matchesStatus) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchText = [
      order.order_number,
      order.customer_name,
      order.customer_email,
      order.customer_phone,
      order.status,
      order.payment_method,
      order.shipping_address,
      order.city,
      order.zip_code,
      ...(Array.isArray(order.items) ? order.items : []).flatMap((item) => [
        item.product_name,
        item.product_brand,
        item.product_category
      ])
    ].join(" ");

    return matchesAdminSearch(searchText);
  });
}

/**
 * Load orders from database
 */
async function loadOrders(force = false) {
  const ordersGrid = document.getElementById('ordersGrid');
  const ordersTableBody = document.getElementById('ordersTableBody');
  try {
    if (!force && realOrdersData.length > 0 && Date.now() - ordersLoadedAt < ADMIN_CACHE_TTL) {
      displayOrdersInTable();
      return;
    }

    if (ordersGrid) {
      ordersGrid.innerHTML = window.window.AppLoading?.skeletonOrderCards?.(4) || '';
    }
    if (ordersTableBody) {
      ordersTableBody.innerHTML = window.window.AppLoading?.skeletonRows?.(8, 5) || '';
    }

    const response = await fetch('/api/orders', { adeSilent: true });
    const data = await response.json();
    
    if (data.success) {
      realOrdersData = data.orders;
      ordersLoadedAt = Date.now();
      displayOrdersInTable();
    } else {
      console.error('Orders API returned success: false');
      showToast("error", "Failed to load orders");
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    showToast("error", "Network connection failed while loading orders");
  }
}

/**
 * Display orders in table
 */
function displayOrdersInTable() {
  const ordersTableBody = document.getElementById('ordersTableBody');
  const ordersGrid = document.getElementById('ordersGrid');
  const filteredOrders = getFilteredLiveOrders();
  
  // Support both table and grid views
  if (ordersTableBody) {
    if (filteredOrders.length === 0) {
      ordersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
    } else {
      ordersTableBody.innerHTML = filteredOrders.map(order => {
        const statusClass = getOrderStatusClass(order.status);
        
        return `
          <tr>
            <td><strong>${order.order_number}</strong></td>
            <td>${order.customer_name}</td>
            <td>${order.customer_email}</td>
            <td>${order.customer_phone}</td>
            <td><strong>₱${parseFloat(order.total).toLocaleString()}</strong></td>
            <td>
              <span class="status-badge status-${statusClass}">${capitalizeFirst(order.status)}</span>
            </td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>
              <button class="btn-action btn-primary" onclick="viewOrderDetails(${order.id})" style="margin-right: 5px;">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn-action btn-secondary" onclick="openOrderStatusModal(${order.id})">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
  
  // Display as cards in grid view
  if (ordersGrid) {
    if (filteredOrders.length === 0) {
      ordersGrid.innerHTML = '<p style="text-align: center; padding: 40px;">No orders found</p>';
    } else {
      ordersGrid.innerHTML = filteredOrders.map(order => {
        const statusLabel = capitalizeFirst(order.status).toUpperCase();
        
        const orderItems = Array.isArray(order.items) ? order.items : [];
        const itemsToShow = orderItems.slice(0, 3);
        const hasMoreItems = orderItems.length > 3;
        
        return `
          <div class="order-card" onclick="viewOrderDetails(${order.id})" style="cursor: pointer;">
            <div class="order-card-header">
              <div class="order-id">${order.order_number}</div>
              <span class="status-badge ${order.status}">${statusLabel}</span>
            </div>
            
            <div class="order-customer">
              <i class="fas fa-user"></i>
              <span>${order.customer_name}</span>
            </div>
            
            <div class="order-products">
              ${itemsToShow.map(item => {
        const imageUrl = resolveProductImageUrl(item.product_image || PRODUCT_PLACEHOLDER_IMAGE);
                return `
                  <div class="order-product-item">
                    <img src="${imageUrl}" alt="${item.product_name}" class="order-product-img">
                    <div class="order-product-details">
                      <div class="order-product-name">${item.product_name}</div>
                      <div class="order-product-qty">Qty: ${item.quantity}</div>
                    </div>
                  </div>
                `;
              }).join('')}
              ${hasMoreItems ? `<div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 8px;">+${orderItems.length - 3} more items</div>` : ''}
            </div>
            
            <div class="order-footer">
              <div>
                <div class="order-total-label">Total:</div>
                <div class="order-total-amount">₱${parseFloat(order.total).toLocaleString()}</div>
              </div>
              <div style="text-align: right;">
                <div class="order-payment">Payment: ${order.payment_method}</div>
                <div class="order-shipping">
                  <i class="fas fa-calendar"></i>
                  <span>${new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
      applyAdminSearchToSection("orders");
    }
  }
}

/**
 * Get status class for styling
 */
function getOrderStatusClass(status) {
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
  const order = realOrdersData.find(o => o.id === orderId);
  if (!order) {
    showToast("error", "Order not found");
    return;
  }

  currentOrderId = order.id;

  document.getElementById("orderDetailId").textContent = `Order #${order.order_number}`;
  document.getElementById("orderDetailMeta").textContent = `Placed ${formatDateTime(order.created_at)}`;
  document.getElementById("detailOrderId").textContent = order.order_number;
  document.getElementById("detailCustomer").textContent = order.customer_name || "Guest";
  document.getElementById("detailStatus").innerHTML = `<span class="status-badge status-${getOrderStatusClass(order.status)}">${escapeAdminHtml(capitalizeFirst(order.status || "pending"))}</span>`;
  document.getElementById("detailDate").textContent = formatDateTime(order.created_at);
  document.getElementById("detailCustomerEmail").textContent = order.customer_email || "N/A";
  document.getElementById("detailCustomerPhone").textContent = order.customer_phone || "N/A";
  document.getElementById("detailShippingAddress").textContent = order.shipping_address || "Not provided";
  document.getElementById("detailShippingCity").textContent = order.city || "N/A";
  document.getElementById("detailZipCode").textContent = order.zip_code || "N/A";
  document.getElementById("detailPaymentMethod").textContent = order.payment_method || "N/A";
  document.getElementById("detailSubtotal").textContent = formatCurrency(order.subtotal);
  document.getElementById("detailShippingFee").textContent = formatCurrency(order.shipping_cost);
  document.getElementById("detailTotal").textContent = formatCurrency(order.total);
  document.getElementById("detailShippingMethod").textContent = order.shipping_method || "Standard Delivery";
  document.getElementById("detailTrackingNumber").textContent = order.tracking_number || "To be assigned";
  document.getElementById("detailEstimatedDelivery").textContent = order.estimated_delivery
    ? formatDateOnly(order.estimated_delivery)
    : "To be scheduled";

  const detailProducts = document.getElementById("detailProducts");
  const orderItems = Array.isArray(order.items) ? order.items : [];
  detailProducts.innerHTML = orderItems.map((item) => {
    const imageUrl = resolveProductImageUrl(item.product_image || PRODUCT_PLACEHOLDER_IMAGE);
    return `
      <div class="detail-product-item">
        <img src="${imageUrl}" alt="${escapeAdminHtml(item.product_name)}" class="detail-product-img">
        <div class="detail-product-info">
          <div class="detail-product-name">${escapeAdminHtml(item.product_name)}</div>
          <div class="detail-product-meta">${escapeAdminHtml(item.product_brand || "No brand")} · ${escapeAdminHtml(capitalizeFirst(item.product_category || "uncategorized"))}</div>
          <div class="detail-product-qty">Quantity: ${Number(item.quantity || 0).toLocaleString()}</div>
          <div class="detail-product-price">${formatCurrency(item.price)} each · ${formatCurrency(item.subtotal)} total</div>
        </div>
      </div>
    `;
  }).join("") || '<div class="detail-product-item"><div class="detail-product-info"><div class="detail-product-name">No items found for this order</div></div></div>';

  document.getElementById("orderDetailModal").classList.add("active");
  closeOrderStatusModal();
}

/**
 * Update order status
 */
function openOrderStatusModal(orderId = currentOrderId) {
  const order = realOrdersData.find((entry) => String(entry.id) === String(orderId));
  if (!order) {
    showToast("error", "Unable to find this order");
    return;
  }

  currentOrderId = order.id;
  document.getElementById("orderStatusOrderNumber").textContent = `#${order.order_number}`;
  document.getElementById("orderStatusCurrentBadge").innerHTML = `
    <span class="status-badge status-${getOrderStatusClass(order.status)}">${escapeAdminHtml(capitalizeFirst(order.status || "pending"))}</span>
    <span class="info-label">Current status</span>
  `;
  document.getElementById("orderStatusSelect").value = order.status || "pending";
  document.getElementById("orderStatusModal").classList.add("active");
}

function closeOrderStatusModal() {
  const modal = document.getElementById("orderStatusModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

async function submitOrderStatusUpdate(event) {
  if (event) {
    event.preventDefault();
  }

  const order = realOrdersData.find((entry) => String(entry.id) === String(currentOrderId));
  const statusSelect = document.getElementById("orderStatusSelect");
  const saveButton = document.getElementById("saveOrderStatusBtn");
  const newStatus = statusSelect?.value;

  if (!order || !newStatus) {
    showToast("error", "Please select a valid order and status");
    return;
  }

  window.AppLoading?.setButtonLoading?.(saveButton, true, 'Saving...');

  try {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const response = await fetch(`/api/orders/${order.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken || ''
      },
      body: JSON.stringify({ status: newStatus.toLowerCase() })
    });

    const data = await response.json();

    if (data.success) {
      closeOrderStatusModal();
      await loadOrders(true);
      await loadDashboardData();
      await loadDashboardStats();
      await loadNotifications();
      viewOrderDetails(order.id);
      showToast("success", `Order updated to ${capitalizeFirst(newStatus)}`);
    } else {
      showToast("error", data.message || "Failed to update order status");
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast("error", "An error occurred while updating order status");
  } finally {
    window.AppLoading?.setButtonLoading?.(saveButton, false);
  }
}

/**
 * Filter orders by status
 */
function filterOrdersByStatus(status) {
  filterOrders(status);
}

// Load notifications from recent orders
async function loadNotifications(force = false) {
  try {
    if (force || realOrdersData.length === 0 || Date.now() - ordersLoadedAt >= ADMIN_CACHE_TTL) {
      await loadOrders(force);
    }

    const orders = realOrdersData;
      
      // Get recent orders (last 5) as notifications
      const recentOrders = orders.slice(0, 5);
      
      // Update notification count
      const notificationCount = document.getElementById('notificationCount');
      if (notificationCount) {
        notificationCount.textContent = recentOrders.length;
      }
      
      // Update notification panel content
      const notificationContent = document.getElementById('notificationContent');
      
      if (notificationContent) {
        if (recentOrders.length === 0) {
          notificationContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #a7c0d8;">No new notifications</div>';
        } else {
          notificationContent.innerHTML = recentOrders.map(order => {
            const timeAgo = getTimeAgo(new Date(order.created_at));
            const statusClass = getOrderStatusClass(order.status);
            
            return `
              <div class="notification-item" onclick="viewOrderDetails(${order.id})" style="cursor: pointer;">
                <div class="notification-icon ${statusClass}">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="notification-content">
                  <div class="notification-title">New Order #${order.order_number}</div>
                  <div class="notification-text">${order.customer_name} placed an order for ₱${parseFloat(order.total).toLocaleString()}</div>
                  <div class="notification-time">${timeAgo}</div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
  } catch (error) {
    console.error('Error loading notifications:', error);
  }
}

// Get time ago string
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Toggle notification panel
function toggleNotificationPanel() {
  console.log('Notification button clicked');
  const panel = document.getElementById('notificationPanel');
  console.log('Notification panel:', panel);
  
  if (panel) {
    const isActive = panel.classList.contains('active');
    console.log('Panel is currently active:', isActive);
    
    panel.classList.toggle('active');
    console.log('Panel toggled, now active:', panel.classList.contains('active'));
    
    // Close message panel if open
    const messagePanel = document.getElementById('messagePanel');
    if (messagePanel) {
      messagePanel.classList.remove('active');
    }
  } else {
    console.error('Notification panel not found!');
  }
}

// Close notification panel
function closeNotificationPanel() {
  const panel = document.getElementById('notificationPanel');
  if (panel) {
    panel.classList.remove('active');
  }
}

// Load dashboard statistics
async function loadDashboardStats() {
  try {
    const response = await fetch('/api/admin/analytics');
    const summary = response.ok ? await response.json() : {};

    const totalRevenue = Number(summary.combined_revenue || 0);
    const totalOrders = Number(summary.combined_orders || 0);
    const totalCustomers = Number(summary.total_customers || 0);
    const totalProducts = Number(summary.total_products || 0);
    const historicalRevenue = Number(summary.historical_revenue || 0);
    const liveRevenue = Number(summary.live_revenue || 0);
    const historicalOrders = Number(summary.historical_orders || 0);
    const liveOrders = Number(summary.live_orders || 0);
    const upcomingOrders = Number(summary.upcoming_orders || 0);
    dashboardSummaryData = {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      historicalRevenue,
      liveRevenue,
      historicalOrders,
      liveOrders,
      upcomingOrders
    };

    document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toLocaleString()}`;
    document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
    document.getElementById('totalCustomers').textContent = totalCustomers.toLocaleString();
    document.getElementById('totalProducts').textContent = totalProducts.toLocaleString();

    document.getElementById('revenueChange').innerHTML = `<i class="fas fa-check"></i> History ₱${historicalRevenue.toLocaleString()} + live ₱${liveRevenue.toLocaleString()}`;
    document.getElementById('ordersChange').innerHTML = `<i class="fas fa-check"></i> ${historicalOrders.toLocaleString()} history + ${liveOrders.toLocaleString()} site orders (${upcomingOrders.toLocaleString()} upcoming)`;
    document.getElementById('customersChange').innerHTML = '<i class="fas fa-check"></i> Registered customer accounts';
    document.getElementById('productsChange').innerHTML = '<i class="fas fa-check"></i> Live catalog synced';
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
    document.getElementById('revenueChange').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load';
    document.getElementById('ordersChange').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load';
    document.getElementById('customersChange').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load';
    document.getElementById('productsChange').innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to load';
  }
}

function handleDashboardCardKey(event, metric) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openDashboardStatModal(metric);
  }
}

function buildDashboardStatConfig(metric) {
  const recentOrders = realOrdersData.slice(0, 5);
  const recentUniqueCustomers = new Set(
    recentOrders.map((order) => order.customer_email || order.customer_name).filter(Boolean)
  ).size;
  const orderStatusCount = (status) => realOrdersData.filter((order) => order.status === status).length;
  const categories = new Set(productsData.map((product) => product.category).filter(Boolean));
  const brands = new Set(productsData.map((product) => product.brand).filter(Boolean));
  const lowStockCount = productsData.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 20).length;
  const outOfStockCount = productsData.filter((product) => Number(product.stock) === 0).length;
  const topStockedProduct = [...productsData].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0))[0];
  const latestOrder = realOrdersData[0];
  const topRecentOrder = [...recentOrders].sort((a, b) => Number(b.total || 0) - Number(a.total || 0))[0];
  const averageOrderValue = dashboardSummaryData.totalOrders
    ? dashboardSummaryData.totalRevenue / dashboardSummaryData.totalOrders
    : 0;

  const configs = {
    revenue: {
      title: "Revenue Breakdown",
      kicker: "Dashboard revenue",
      value: formatCurrency(dashboardSummaryData.totalRevenue),
      description: "Combined sales from historical records and live website orders, kept inside the current admin theme.",
      icon: "fa-dollar-sign",
      actionSection: "analytics",
      actionLabel: "Open Analytics",
      cards: [
        { label: "Historical sales", value: formatCurrency(dashboardSummaryData.historicalRevenue), note: "Imported past transaction records." },
        { label: "Live website sales", value: formatCurrency(dashboardSummaryData.liveRevenue), note: "Orders placed through the current site." },
        { label: "Average order", value: formatCurrency(averageOrderValue), note: "Combined revenue divided by total orders." }
      ],
      list: [
        { label: "Top recent order", value: topRecentOrder ? formatCurrency(topRecentOrder.total) : "N/A", note: topRecentOrder ? `${topRecentOrder.order_number} from ${topRecentOrder.customer_name}` : "No recent order data yet." },
        { label: "Orders contributing", value: Number(dashboardSummaryData.totalOrders || 0).toLocaleString(), note: "Revenue is driven by both historical and current website orders." },
        { label: "Source", value: "History + Live", note: "Breakdown comes from the admin analytics endpoint." }
      ]
    },
    orders: {
      title: "Order Activity",
      kicker: "Order pipeline",
      value: Number(dashboardSummaryData.totalOrders || 0).toLocaleString(),
      description: "A quick view of where orders came from and what is still moving through fulfillment.",
      icon: "fa-shopping-cart",
      actionSection: "orders",
      actionLabel: "Open Orders",
      cards: [
        { label: "Historical orders", value: Number(dashboardSummaryData.historicalOrders || 0).toLocaleString(), note: "Past order history already counted." },
        { label: "Live site orders", value: Number(dashboardSummaryData.liveOrders || 0).toLocaleString(), note: "Current orders created in the website." },
        { label: "Upcoming", value: Number(dashboardSummaryData.upcomingOrders || 0).toLocaleString(), note: "Orders still expected to be fulfilled." }
      ],
      list: [
        { label: "Latest order", value: latestOrder ? latestOrder.order_number : "N/A", note: latestOrder ? `${latestOrder.customer_name} placed it on ${formatDateOnly(latestOrder.created_at)}` : "No order records loaded yet." },
        { label: "Processing now", value: orderStatusCount("processing").toLocaleString(), note: "Orders currently being prepared." },
        { label: "Delivered", value: orderStatusCount("delivered").toLocaleString(), note: "Orders already marked complete." }
      ]
    },
    customers: {
      title: "Customer Snapshot",
      kicker: "Customer detail",
      value: Number(dashboardSummaryData.totalCustomers || 0).toLocaleString(),
      description: "Customer totals stay tied to registered accounts, while recent order activity shows who is buying right now.",
      icon: "fa-users",
      actionSection: "orders",
      actionLabel: "Open Orders",
      cards: [
        { label: "Registered accounts", value: Number(dashboardSummaryData.totalCustomers || 0).toLocaleString(), note: "Primary customer count from analytics." },
        { label: "Recent unique buyers", value: recentUniqueCustomers.toLocaleString(), note: "Unique names or emails from the latest order feed." },
        { label: "Orders with contact info", value: realOrdersData.filter((order) => order.customer_email || order.customer_phone).length.toLocaleString(), note: "Orders containing reachable customer details." }
      ],
      list: [
        { label: "Latest buyer", value: latestOrder ? (latestOrder.customer_name || "Guest") : "N/A", note: latestOrder ? `${latestOrder.customer_email || latestOrder.customer_phone || "No contact data"}` : "No recent customer activity yet." },
        { label: "Source", value: "Accounts + Orders", note: "Totals come from customer accounts, while the activity panel uses recent orders." },
        { label: "Recent order window", value: recentOrders.length.toLocaleString(), note: "Dashboard customer activity preview uses the most recent five orders." }
      ]
    },
    products: {
      title: "Catalog Health",
      kicker: "Product inventory",
      value: Number(dashboardSummaryData.totalProducts || 0).toLocaleString(),
      description: "A quick catalog view with synced product count, stock health, and a snapshot of category coverage.",
      icon: "fa-box",
      actionSection: "products",
      actionLabel: "Open Products",
      cards: [
        { label: "Categories", value: categories.size.toLocaleString(), note: "Distinct categories currently visible in the catalog." },
        { label: "Brands", value: brands.size.toLocaleString(), note: "Brands represented in the live product list." },
        { label: "Low stock items", value: lowStockCount.toLocaleString(), note: "Products that need attention soon." }
      ],
      list: [
        { label: "Out of stock", value: outOfStockCount.toLocaleString(), note: "Products with zero available quantity." },
        { label: "Top stocked item", value: topStockedProduct ? topStockedProduct.name : "N/A", note: topStockedProduct ? `${Number(topStockedProduct.stock || 0).toLocaleString()} units available` : "No product inventory loaded yet." },
        { label: "Source", value: "Live catalog", note: "Figures come from the current admin products dataset." }
      ]
    }
  };

  return configs[metric] || configs.orders;
}

function openDashboardStatModal(metric) {
  const config = buildDashboardStatConfig(metric);
  dashboardStatActionSection = config.actionSection;

  document.getElementById("dashboardStatTitle").textContent = config.title;
  document.getElementById("dashboardStatKicker").textContent = config.kicker;
  document.getElementById("dashboardStatValue").textContent = config.value;
  document.getElementById("dashboardStatDescription").textContent = config.description;
  document.getElementById("dashboardStatBadge").innerHTML = `<i class="fas ${config.icon}"></i>`;
  document.getElementById("dashboardStatActionBtn").textContent = config.actionLabel;
  document.getElementById("dashboardStatGrid").innerHTML = config.cards.map((card) => `
    <div class="stat-modal-card">
      <div class="stat-modal-card-label">${escapeAdminHtml(card.label)}</div>
      <div class="stat-modal-card-value">${escapeAdminHtml(card.value)}</div>
      <div class="stat-modal-card-note">${escapeAdminHtml(card.note)}</div>
    </div>
  `).join("");
  document.getElementById("dashboardStatList").innerHTML = config.list.map((item) => `
    <div class="stat-modal-list-item">
      <div class="stat-modal-list-copy">
        <div class="stat-modal-list-label">${escapeAdminHtml(item.label)}</div>
        <div class="stat-modal-list-note">${escapeAdminHtml(item.note)}</div>
      </div>
      <div class="stat-modal-list-value">${escapeAdminHtml(item.value)}</div>
    </div>
  `).join("");

  document.getElementById("dashboardStatModal").classList.add("active");
}

function closeDashboardStatModal() {
  const modal = document.getElementById("dashboardStatModal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function handleDashboardStatAction() {
  closeDashboardStatModal();
  if (dashboardStatActionSection && dashboardStatActionSection !== "dashboard") {
    switchSection(dashboardStatActionSection);
  }
}

// Load orders when switching to orders section
document.addEventListener('DOMContentLoaded', () => {
  setInterval(loadNotifications, 30000);
});

// Function to trigger Laravel backend Artisan command securely
async function syncMLData() {
  const btn = document.getElementById('btnSyncMl');
  if (!btn || btn.disabled) return;

  window.AppLoading?.setButtonLoading?.(btn, true, 'Syncing...');

  try {
    const response = await fetch('/api/admin/ml/sync', {
      method: 'POST',
      adeOverlay: true,
      adeMessage: 'Refreshing smart suggestions...',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast('success', 'Smart analytics updated successfully.');
      loadDashboardData();
    } else {
      showToast('error', data.message || 'Failed to refresh smart suggestions.');
      console.error(data.output);
    }
  } catch (err) {
    console.error('Critical failure attempting to trigger the Sync handler:', err);
    showToast('error', 'Network connection failed while refreshing smart suggestions.');
  } finally {
    window.AppLoading?.setButtonLoading?.(btn, false);
  }
}

