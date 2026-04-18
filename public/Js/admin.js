//YAWA KAHAGO
//kapoy na
//awa ubos naa koy gi comment
//
// PRODUCTS
let productsData = [
  { id: 1, name: "Carbon Fiber Brake Pads", category: "brakes", brand: "aeromax", price: 4500, stock: 45, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=BP", description: "High-performance carbon fiber brake pads for superior stopping power" },
  { id: 2, name: "Performance Tires Set", category: "tires", brand: "speedtech", price: 12000, stock: 18, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=PT", description: "Premium performance tires designed for maximum grip and durability" },
  { id: 3, name: "Turbo Kit Pro", category: "engine", brand: "motopro", price: 35000, stock: 8, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=TK", description: "Complete turbo kit for enhanced engine performance and power" },
  { id: 4, name: "LED Headlight Kit", category: "accessories", brand: "aeromax", price: 3200, stock: 32, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=LH", description: "Bright LED headlight kit with easy installation and long lifespan" },
  { id: 5, name: "Racing Exhaust System", category: "engine", brand: "speedtech", price: 18500, stock: 12, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=RE", description: "High-flow racing exhaust system for improved performance and sound" },
  { id: 6, name: "Sport Suspension Kit", category: "accessories", brand: "motopro", price: 22000, stock: 6, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=SS", description: "Adjustable sport suspension kit for better handling and comfort" },
  { id: 7, name: "Ceramic Brake Discs", category: "brakes", brand: "aeromax", price: 8900, stock: 25, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=BD", description: "Premium ceramic brake discs with excellent heat dissipation" },
  { id: 8, name: "All-Season Tires", category: "tires", brand: "speedtech", price: 9500, stock: 0, image: "https://via.placeholder.com/50/1a2332/1ee0ff?text=AT", description: "Versatile all-season tires suitable for various weather conditions" },
];
//ORDERS
const ordersData = [
  {
    id: "ADE-2025-001",
    customer: "Junaica",
    products: [{ name: "Brake Pads Set", qty: 2, image: "https://via.placeholder.com/60/1a2332/1ee0ff?text=BP" }],
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
    products: [{ name: "Engine Oil 5W-30", qty: 1, image: "https://via.placeholder.com/60/1a2332/1ee0ff?text=EO" }],
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
    products: [{ name: "Air Filter", qty: 1, image: "https://via.placeholder.com/60/1a2332/1ee0ff?text=AF" }],
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
    products: [{ name: "Spark Plugs", qty: 4, image: "https://via.placeholder.com/60/1a2332/1ee0ff?text=SP" }],
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
    products: [{ name: "Tire Set 195/65R15", qty: 4, image: "https://via.placeholder.com/60/1a2332/1ee0ff?text=TS" }],
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
let currentOrderId = null;
let currentConversationId = null;
let currentEditingProductId = null;
let salesChart = null;
let revenueChart = null;
let customerChart = null;
let nextProductId = 9; 


document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  initializeNotifications();
  initializeMessages();
  loadOrders();
  loadDashboardData();
  loadProductsData();
  loadInventoryData();
  loadAnalyticsData();
  initializeCharts();
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

function switchSection(sectionName) {
  const sections = document.querySelectorAll(".admin-section");
  sections.forEach((section) => section.classList.remove("active"));

  const targetSection = document.getElementById(`section-${sectionName}`);
  if (targetSection) {
    targetSection.classList.add("active");
  }
  
  // Update nav items
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));
  const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }
  
  // Load data for specific sections
  if (sectionName === 'orders') {
    loadOrders();
  } else if (sectionName === 'dashboard') {
    loadDashboardData();
  }
}

async function loadProductsData() {
  const productsTable = document.getElementById("productsTable");
  if (!productsTable) return;

  try {
    const response = await fetch('/api/admin/products');
    productsData = await response.json();

    let filteredProducts = productsData;

    if (currentCategoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === currentCategoryFilter);
    }

    if (currentBrandFilter !== "all") {
      filteredProducts = filteredProducts.filter(p => p.brand === currentBrandFilter);
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
      
      const imageUrl = product.image ? `/storage/${product.image}` : `https://via.placeholder.com/50/1a2332/1ee0ff?text=${product.name.substring(0, 2).toUpperCase()}`;
      
      return `
        <tr>
          <td><img src="${imageUrl}" class="product-img"></td>
          <td>${product.name}</td>
          <td>${capitalizeFirst(product.category)}</td>
          <td>${capitalizeFirst(product.brand)}</td>
          <td>₱${parseFloat(product.price).toLocaleString()}</td>
          <td>${product.stock}</td>
          <td><span class="status-badge ${stockStatus}">${stockLabel}</span></td>
          <td>
            <button class="action-btn" title="Edit" onclick="editProduct(${product.id})"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete" title="Delete" onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    }).join("");

    updateProductCount();
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

function openProductModal(productId = null) {
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("productModalTitle");
  const imagePreview = document.getElementById("imagePreview");
  const productImageInput = document.getElementById("productImage"); 
  
  if (productId) {
    const product = productsData.find(p => p.id === productId);
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
      

      if (product.image) {
        document.getElementById("previewImg").src = product.image;
        imagePreview.style.display = 'block';
      }
      
      currentEditingProductId = productId;
    }
  } else {
    // Adding new product - reset everything
    currentEditingProductId = null;
    modalTitle.textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    imagePreview.style.display = 'none';
    document.getElementById("productImageUrl").value = ""; 
    productImageInput.value = "";
  }
  
  console.log('Modal opened. Editing product ID:', currentEditingProductId);
  modal.classList.add("active");
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("active");
  document.getElementById("productForm").reset();
  document.getElementById("imagePreview").style.display = 'none';
  document.getElementById("productImageUrl").value = ""; 
  document.getElementById("productImage").value = ""; 
  currentEditingProductId = null;
}

async function saveProduct() {
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
  
  // Optional fields
  const fullDescription = document.getElementById("productFullDescription")?.value;
  
  // Build variations from predefined fields
  const variations = buildVariationsFromFields();
  const specifications = buildSpecificationsFromFields();
  
  if (fullDescription) formData.append('full_description', fullDescription);
  if (variations) formData.append('variations', variations);
  if (specifications) formData.append('specifications', specifications);
  
  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
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

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok && data.success) {
      showToast("success", data.message);
      currentEditingProductId = null; // Reset the editing ID
      closeProductModal();
      await loadProductsData();
      await loadInventoryData();
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
    showToast("error", "An error occurred: " + error.message);
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
        await loadProductsData();
        await loadInventoryData();
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

function loadMessages() {
  const messageContent = document.getElementById("messageContent");
  if (!messageContent) return;

  messageContent.innerHTML = messages.map(msg => `
    <div class="message-item ${msg.read ? '' : 'unread'}" onclick="openConversation(${msg.id})">
      <div class="message-sender">${msg.sender}</div>
      <div class="message-preview">${msg.preview}</div>
      <div class="message-time">${msg.time}</div>
    </div>
  `).join('');
}

function openConversation(id) {
  currentConversationId = id;
  const message = messages.find(m => m.id === id);
  
  if (message) {
    message.read = true;
    updateMessageCount();
    
    document.getElementById("conversationName").textContent = message.sender;
    document.getElementById("messageListView").style.display = 'none';
    document.getElementById("messageConversation").classList.add('active');
    
    loadConversationMessages(id);
  }
}

function loadConversationMessages(id) {
  const conversationMessages = document.getElementById("conversationMessages");
  if (!conversationMessages) return;
  
  const msgs = conversations[id] || [];
  
  conversationMessages.innerHTML = msgs.map(msg => `
    <div class="message-bubble ${msg.type}">
      ${msg.image ? `<img src="${msg.image}" class="message-image" alt="Sent image">` : ''}
      ${msg.text}
      <div class="message-time-stamp">${msg.time}</div>
    </div>
  `).join('');
  
  conversationMessages.scrollTop = conversationMessages.scrollHeight;
}

function backToMessageList() {
  const messageListView = document.getElementById("messageListView");
  const messageConversation = document.getElementById("messageConversation");

  if (messageListView) messageListView.style.display = 'flex';
  if (messageConversation) messageConversation.classList.remove('active');
  currentConversationId = null;
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  
  if (text && currentConversationId) {
    if (!conversations[currentConversationId]) {
      conversations[currentConversationId] = [];
    }
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    conversations[currentConversationId].push({
      type: "sent",
      text: text,
      time: timeStr
    });
    
    loadConversationMessages(currentConversationId);
    input.value = '';
    showToast("success", "Message sent");
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
  const unreadCount = messages.filter(m => !m.read).length;
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

// CHARTS LINTE
function initializeCharts() {
  initializeSalesChart();
  initializeRevenueChart();
  initializeCustomerChart();
}

function generateChartData(days) {
  const labels = [];
  const data = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    data.push(Math.floor(Math.random() * 5000) + 2000);
  }
  
  return { labels, data };
}

function initializeSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  
  const chartData = generateChartData(7);
  
  salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Sales',
        data: chartData.data,
        borderColor: '#1ee0ff',
        backgroundColor: 'rgba(30, 224, 255, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#a7c0d8',
            callback: function(value) {
              return '₱' + value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#a7c0d8'
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        }
      }
    }
  });
}

function updateSalesChart(days) {
  if (!salesChart) return;
  
  const chartData = generateChartData(parseInt(days));
  salesChart.data.labels = chartData.labels;
  salesChart.data.datasets[0].data = chartData.data;
  salesChart.update();
  
  showToast("success", "Sales chart updated");
}

function initializeRevenueChart() {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  const chartData = generateChartData(7);
  
  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Revenue',
        data: chartData.data,
        backgroundColor: 'rgba(30, 224, 255, 0.6)',
        borderColor: '#1ee0ff',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#a7c0d8',
            callback: function(value) {
              return '₱' + value.toLocaleString();
            }
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#a7c0d8'
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        }
      }
    }
  });
}

function updateRevenueChart(days) {
  if (!revenueChart) return;
  
  const chartData = generateChartData(parseInt(days));
  revenueChart.data.labels = chartData.labels;
  revenueChart.data.datasets[0].data = chartData.data;
  revenueChart.update();
  
  showToast("success", "Revenue chart updated");
}

function initializeCustomerChart() {
  const ctx = document.getElementById('customerChart');
  if (!ctx) return;
  
  const chartData = generateChartData(7);
  const customerData = chartData.data.map(val => Math.floor(val / 100));
  
  customerChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'New Customers',
        data: customerData,
        borderColor: '#1eff8e',
        backgroundColor: 'rgba(30, 255, 142, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#a7c0d8'
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        },
        x: {
          ticks: {
            color: '#a7c0d8'
          },
          grid: {
            color: 'rgba(30, 224, 255, 0.1)'
          }
        }
      }
    }
  });
}

function updateCustomerChart(days) {
  if (!customerChart) return;
  
  const chartData = generateChartData(parseInt(days));
  const customerData = chartData.data.map(val => Math.floor(val / 100));
  customerChart.data.labels = chartData.labels;
  customerChart.data.datasets[0].data = customerData;
  customerChart.update();
  
  showToast("success", "Customer chart updated");
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

  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach((tab) => {
    if (tab.dataset.status === status) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  loadOrders();
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

  const dropdown = document.getElementById("statusDropdown");
  if (dropdown) dropdown.classList.remove("active");
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
  const filteredOrders = currentFilter === "all" ? ordersData : ordersData.filter((order) => order.status === currentFilter);

  const headers = ["Order ID", "Customer", "Products", "Total", "Payment", "Status", "Date"];
  const csvContent = [
    headers.join(","),
    ...filteredOrders.map((order) =>
      [
        order.id,
        order.customer,
        `"${order.products.map((p) => `${p.name} (${p.qty})`).join("; ")}"` , // Enclose products in quotes
        order.total,
        order.payment,
        getStatusLabel(order.status),
        order.date,
      ].join(","),
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders_${currentFilter}_${new Date().toISOString().split("T")[0]}.csv`;
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
}

function loadInventoryData() {
  const inventoryTable = document.getElementById("inventoryTable");
  if (!inventoryTable) return;

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
}

function loadAnalyticsData() {
  const topProductsTable = document.getElementById("topProductsTable");
  if (!topProductsTable) return;


  const sortedProducts = [...productsData].sort((a, b) => b.stock - a.stock);
  const topProducts = sortedProducts.slice(0, 5);

  topProductsTable.innerHTML = topProducts.map((product, index) => {
    const unitsSold = Math.floor(Math.random() * (product.stock > 50 ? 200 : product.stock)) + 50;
    const revenue = unitsSold * product.price;
    const growth = Math.floor(Math.random() * 20) - 5; 
    
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name}</td>
        <td>${capitalizeFirst(product.category)}</td>
        <td>${unitsSold}</td>
        <td>₱${revenue.toLocaleString()}</td>
        <td><span class="stat-change ${growth >= 0 ? 'positive' : 'negative'}"><i class="fas fa-arrow-${growth >= 0 ? 'up' : 'down'}"></i> ${Math.abs(growth)}%</span></td>
      </tr>
    `;
  }).join("");
}


function saveStoreInfo(event) {
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


  console.log("Store Info Saved:", { storeName, storeEmail, storePhone, storeAddress, storeLocation });
  showToast("success", "Store information updated successfully!");
}

function saveNotificationSettings(event) {
  event.preventDefault();
  showToast("success", "Notification settings updated successfully!");
}

function saveBusinessHours(event) {
  event.preventDefault();
  showToast("success", "Business hours updated successfully!");
}

function changePassword(event) {
  event.preventDefault();
  showToast("success", "Password changed successfully!");
}

function refreshDashboard() {
  showToast("success", "Dashboard refreshed!");
  loadDashboardData();
  loadAnalyticsData();
}

function updateInventory() {
  showToast("success", "Inventory updated!");
  loadInventoryData(); 
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

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "/home_landing";
  }
}


function showToast(type, message) {
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
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('imagePreview');
      const previewImg = document.getElementById('previewImg');
      const imageUrl = document.getElementById('productImageUrl');
      
      previewImg.src = e.target.result;
      imageUrl.value = e.target.result; 
      if (preview) preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function openAddStockModal(productId) {
  const product = productsData.find(p => p.id === productId);
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

function confirmAddStock() {
  const productId = parseInt(document.getElementById("stockProductId").value);
  const quantityToAdd = parseInt(document.getElementById("stockQuantityToAdd").value);

  if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
    showToast("error", "Please enter a valid quantity");
    return;
  }

  const productIndex = productsData.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    productsData[productIndex].stock += quantityToAdd;
    showToast("success", `Added ${quantityToAdd} units to inventory!`);
    loadInventoryData();
    loadProductsData(); 
    closeAddStockModal();
  } else {
    showToast("error", "Product not found, cannot update stock.");
    closeAddStockModal();
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

/**
 * Load orders from database
 */
async function loadOrders() {
  try {
    console.log('Loading orders from /api/orders...');
    const response = await fetch('/api/orders');
    const data = await response.json();
    
    console.log('Orders API response:', data);
    
    if (data.success) {
      realOrdersData = data.orders;
      console.log('Orders data loaded:', realOrdersData);
      displayOrdersInTable();
    } else {
      console.error('Orders API returned success: false');
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
}

/**
 * Display orders in table
 */
function displayOrdersInTable() {
  const ordersTableBody = document.getElementById('ordersTableBody');
  const ordersGrid = document.getElementById('ordersGrid');
  
  // Support both table and grid views
  if (ordersTableBody) {
    if (realOrdersData.length === 0) {
      ordersTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No orders found</td></tr>';
      return;
    }

    ordersTableBody.innerHTML = realOrdersData.map(order => {
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
            <button class="btn-action btn-secondary" onclick="updateOrderStatus(${order.id}, '${order.status}')">
              <i class="fas fa-edit"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
  
  // Display as cards in grid view
  if (ordersGrid) {
    if (realOrdersData.length === 0) {
      ordersGrid.innerHTML = '<p style="text-align: center; padding: 40px;">No orders found</p>';
      return;
    }
    
    ordersGrid.innerHTML = realOrdersData.map(order => {
      const statusClass = getOrderStatusClass(order.status);
      const statusLabel = capitalizeFirst(order.status).toUpperCase();
      
      // Get first 3 items to display
      const itemsToShow = order.items.slice(0, 3);
      const hasMoreItems = order.items.length > 3;
      
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
              const imageUrl = item.product_image ? `/storage/${item.product_image}` : 'https://via.placeholder.com/60/1a2332/1ee0ff?text=' + item.product_name.substring(0, 2);
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
            ${hasMoreItems ? `<div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 8px;">+${order.items.length - 3} more items</div>` : ''}
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
    alert('Order not found!');
    return;
  }

  const itemsHTML = order.items.map(item => {
    const imageUrl = item.product_image ? `/storage/${item.product_image}` : 'https://via.placeholder.com/80';
    return `
      <div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e5e7eb; align-items: center;">
        <img src="${imageUrl}" alt="${item.product_name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <div style="font-weight: 600; margin-bottom: 5px;">${item.product_name}</div>
          <div style="color: #6b7280; font-size: 14px;">Brand: ${item.product_brand} | Category: ${capitalizeFirst(item.product_category)}</div>
          <div style="color: #059669; font-weight: 500; margin-top: 5px;">₱${parseFloat(item.price).toLocaleString()} × ${item.quantity} = ₱${parseFloat(item.subtotal).toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');

  const detailsHTML = `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">
        <h3 style="margin: 0;">Order #${order.order_number}</h3>
        <span class="status-badge status-${getOrderStatusClass(order.status)}">${capitalizeFirst(order.status)}</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px;">Customer Information</h4>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${order.customer_name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${order.customer_email}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.customer_phone}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px;">Shipping Address</h4>
        <p style="margin: 5px 0;">${order.shipping_address}</p>
        <p style="margin: 5px 0;">${order.city}, ${order.zip_code}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px;">Order Items</h4>
        ${itemsHTML}
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px;">Order Summary</h4>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>₱${parseFloat(order.subtotal).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Shipping:</span>
            <span>₱${parseFloat(order.shipping_cost).toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #e5e7eb;">
            <span style="font-weight: 700;">Total:</span>
            <span style="font-weight: 700; color: #059669;">₱${parseFloat(order.total).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.payment_method}</p>
        <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
      </div>
    </div>
  `;

  // Show in modal or alert
  if (confirm('Order Details:\n\n' + order.order_number + '\nCustomer: ' + order.customer_name + '\nTotal: ₱' + parseFloat(order.total).toLocaleString() + '\n\nWould you like to update the status?')) {
    updateOrderStatus(orderId, order.status);
  }
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

  const newStatus = prompt(`Current status: ${statusLabels[currentStatus]}\n\nEnter new status:\n- pending\n- processing\n- shipped\n- delivered\n- cancelled`, currentStatus);

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
 * Filter orders by status
 */
function filterOrdersByStatus(status) {
  // Temporarily store filtered data
  const originalData = realOrdersData;
  
  if (status === 'all') {
    realOrdersData = originalData;
  } else {
    realOrdersData = originalData.filter(order => order.status === status);
  }
  
  // Redisplay orders
  displayOrdersInTable();
  
  // Restore original data
  realOrdersData = originalData;
  
  // Update active tab
  document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
}

// Load notifications from recent orders
async function loadNotifications() {
  try {
    console.log('Loading notifications...');
    const response = await fetch('/api/orders');
    const data = await response.json();
    console.log('Notifications data:', data);
    
    if (data.success) {
      const orders = data.orders;
      console.log('Total orders:', orders.length);
      
      // Get recent orders (last 5) as notifications
      const recentOrders = orders.slice(0, 5);
      console.log('Recent orders for notifications:', recentOrders.length);
      
      // Update notification count
      const notificationCount = document.getElementById('notificationCount');
      if (notificationCount) {
        notificationCount.textContent = recentOrders.length;
        console.log('Updated notification count to:', recentOrders.length);
      }
      
      // Update notification panel content
      const notificationContent = document.getElementById('notificationContent');
      console.log('Notification content element:', notificationContent);
      
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
        console.log('Notification content updated');
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
    // Load orders to calculate stats
    const ordersResponse = await fetch('/api/orders');
    const ordersData = await ordersResponse.json();
    
    // Load products count
    const productsResponse = await fetch('/api/admin/products');
    const productsData = await productsResponse.json();
    
    // Load users count (customers)
    const usersResponse = await fetch('/api/admin/users');
    let usersCount = 0;
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      usersCount = usersData.length || 0;
    }
    
    if (ordersData.success) {
      const orders = ordersData.orders;
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toLocaleString()}`;
      
      // Total orders
      document.getElementById('totalOrders').textContent = orders.length.toLocaleString();
      
      // Update change indicators (simplified - just show current data)
      document.getElementById('revenueChange').innerHTML = '<i class="fas fa-check"></i> Current total';
      document.getElementById('ordersChange').innerHTML = '<i class="fas fa-check"></i> Total orders';
    }
    
    // Total customers
    document.getElementById('totalCustomers').textContent = usersCount.toLocaleString();
    document.getElementById('customersChange').innerHTML = '<i class="fas fa-check"></i> Registered users';
    
    // Total products
    document.getElementById('totalProducts').textContent = productsData.length.toLocaleString();
    document.getElementById('productsChange').innerHTML = '<i class="fas fa-check"></i> In catalog';
    
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Load orders when switching to orders section
document.addEventListener('DOMContentLoaded', () => {
  const ordersNav = document.querySelector('[data-section="orders"]');
  if (ordersNav) {
    ordersNav.addEventListener('click', () => {
      loadOrders();
    });
  }
  
  // Load orders if on orders page
  if (document.getElementById('ordersTableBody') || document.getElementById('ordersGrid')) {
    loadOrders();
  }
  
  // Load dashboard data when switching to dashboard
  const dashboardNav = document.querySelector('[data-section="dashboard"]');
  if (dashboardNav) {
    dashboardNav.addEventListener('click', () => {
      loadDashboardData();
      loadDashboardStats();
    });
  }
  
  // Load dashboard data on page load if dashboard is active
  if (document.getElementById('recentOrdersTable')) {
    loadDashboardData();
    loadDashboardStats();
  }
  
  // Setup notification button
  const notificationBtn = document.getElementById('notificationBtn');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', toggleNotificationPanel);
  }
  
  // Load notifications on page load
  loadNotifications();
  
  // Refresh notifications every 30 seconds
  setInterval(loadNotifications, 30000);
});