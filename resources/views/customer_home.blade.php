<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>ADE GARAGE</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{url('Css/customer_home.css')}}"> 
  
</head>
<body>
  <nav class="navbar-custom">
    <div class="nav-inner container-fluid">
      <a class="navbar-brand" href="#" onclick="event.preventDefault(); backToShop()">ADE GARAGE</a>
      <div class="nav-right">
        <a class="nav-link" href="#" onclick="event.preventDefault(); backToShop()">SHOP</a>
        <a class="nav-link d-flex align-items-center" href="#" title="Edit Profile" id="userProfileBtn">
         <a href="{{ route('profile.show') }}" class="user-link">
    <i class="fa-solid fa-user"></i>
    <span id="usernameDisplay">{{ auth()->check() ? auth()->user()->username : 'Guest' }}</span>
</a>

  <a class="cart-icon" href="#" id="cartIcon" onclick="event.preventDefault(); showCheckoutPage()">
          <i class="fa-solid fa-shopping-cart"></i>
          <span id="cartCount">0</span>
        </a>
      </div>
    </div>
  </nav>

  <div id="shopPage" class="shop-page active">
    <div class="container-fluid">
      <div class="row gx-4 gy-4">
        <aside class="col-lg-3">
          <div class="sidebar">
            <div class="sidebar-header-custom">
              <h3 class="filter-main-title">FILTERS</h3>
              <button class="clear-filters-btn" onclick="clearAllFilters()">
                <i class="fas fa-redo"></i> Clear All
              </button>
            </div>
            
            <div class="search-wrap">
              <i class="fa-solid fa-search search-icon"></i>
              <input id="searchInput" placeholder="Search products, brands, models..." class="search-box" />
            </div>

            <div class="filter-section mb-3">
              <div class="filter-title-collapsible" onclick="toggleFilterSection('category')">
                <span>CATEGORY</span>
                <i class="fas fa-chevron-down filter-chevron" id="category-chevron"></i>
              </div>
              <div class="filter-content" id="category-content">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="brakes" data-filter-type="category">
                  <label class="form-check-label" for="brakes">Brakes</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="tires" data-filter-type="category">
                  <label class="form-check-label" for="tires">Tires</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="engine" data-filter-type="category">
                  <label class="form-check-label" for="engine">Engine</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="accessories" data-filter-type="category">
                  <label class="form-check-label" for="accessories">Accessories</label>
                </div>
              </div>
            </div>

            <div class="filter-section mb-3">
              <div class="filter-title-collapsible" onclick="toggleFilterSection('price')">
                <span>PRICE</span>
                <i class="fas fa-chevron-down filter-chevron" id="price-chevron"></i>
              </div>
              <div class="filter-content" id="price-content">
                <input id="priceRange" class="price-slider" type="range" min="50" max="15000" step="10" value="15000" />
                <div class="price-values">
                  <div class="left-min">₱50</div>
                  <div class="current" id="currentPrice">₱15,000</div>
                </div>
              </div>
            </div>

            <div class="filter-section mb-3">
              <div class="filter-title-collapsible" onclick="toggleFilterSection('brand')">
                <span>BRAND</span>
                <i class="fas fa-chevron-down filter-chevron" id="brand-chevron"></i>
              </div>
              <div class="filter-content" id="brand-content">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="aeromax" data-filter-type="brand">
                  <label class="form-check-label" for="aeromax">AeroMax</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="speedtech" data-filter-type="brand">
                  <label class="form-check-label" for="speedtech">SpeedTech</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="motopro" data-filter-type="brand">
                  <label class="form-check-label" for="motopro">MotoPro</label>
                </div>
              </div>
            </div>

            <div class="filter-section mb-3">
              <div class="filter-title-collapsible" onclick="toggleFilterSection('compatibility')">
                <span>COMPATIBILITY</span>
                <i class="fas fa-chevron-down filter-chevron" id="compatibility-chevron"></i>
              </div>
              <div class="filter-content" id="compatibility-content">
                <select id="modelSelect" class="dropdown-custom">
                  <option value="">Select Model</option>
                  <option value="suzuki">Suzuki</option>
                  <option value="yamaha">Yamaha</option>
                  <option value="honda">Honda</option>
                  <option value="kawasaki">Kawasaki</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <main class="col-lg-9">
          <div class="product-grid">
            <div class="row g-4" id="productGrid">
              <div class="col-lg-4 col-md-6 product-item" data-category="brakes" data-brand="aeromax" data-price="480" data-models='["suzuki","yamaha"]' data-stock="25">
                <div class="product-card position-relative">
                  <div class="ai-badge">AI RECOMMENDED</div>
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Brake+Pads" alt="Brake Pads">
                  <div class="product-title">Premium Brake Pads</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> AeroMax</div>
                    <div><strong>Compatibility:</strong> Suzuki, Yamaha</div>
                    <div><strong>Price:</strong> ₱480</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 product-item" data-category="tires" data-brand="speedtech" data-price="860" data-models='["honda","kawasaki"]' data-stock="12">
                <div class="product-card position-relative">
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/ff7a1f?text=All-Weather+Tires" alt="Tires">
                  <div class="product-title">All-Weather Tires</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> SpeedTech</div>
                    <div><strong>Compatibility:</strong> Honda, Kawasaki</div>
                    <div><strong>Price:</strong> ₱860</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 product-item" data-category="accessories" data-brand="motopro" data-price="350" data-models='["yamaha","honda"]' data-stock="8">
                <div class="product-card position-relative">
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/1eff8e?text=Racing+Sprocket" alt="Racing Sprocket">
                  <div class="product-title">Racing Sprocket</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> MotoPro</div>
                    <div><strong>Compatibility:</strong> Yamaha, Honda</div>
                    <div><strong>Price:</strong> ₱350</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 product-item" data-category="accessories" data-brand="aeromax" data-price="1200" data-models='["suzuki","kawasaki"]' data-stock="18">
                <div class="product-card position-relative">
                  <div class="ai-badge">AI RECOMMENDED</div>
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/ff1e8e?text=Shock+Absorber" alt="Shock Absorber">
                  <div class="product-title">Pro Shock Absorber</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> AeroMax</div>
                    <div><strong>Compatibility:</strong> Suzuki, Kawasaki</div>
                    <div><strong>Price:</strong> ₱1,200</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 product-item" data-category="engine" data-brand="speedtech" data-price="12500" data-models='["kawasaki","honda"]' data-stock="5">
                <div class="product-card position-relative">
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Performance+Engine" alt="Engine">
                  <div class="product-title">Performance Engine</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> SpeedTech</div>
                    <div><strong>Compatibility:</strong> Kawasaki, Honda</div>
                    <div><strong>Price:</strong> ₱12,500</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>

              <div class="col-lg-4 col-md-6 product-item" data-category="accessories" data-brand="motopro" data-price="180" data-models='["suzuki","yamaha","honda"]' data-stock="30">
                <div class="product-card position-relative">
                  <img class="product-image" src="https://via.placeholder.com/900x600/1a2332/ff9a46?text=Air+Filter" alt="Air Filter">
                  <div class="product-title">High-Flow Air Filter</div>
                  <div class="product-details">
                    <div><strong>Brand:</strong> MotoPro</div>
                    <div><strong>Compatibility:</strong> Suzuki, Yamaha, Honda</div>
                    <div><strong>Price:</strong> ₱180</div>
                  </div>
                  <div class="product-buttons">
                    <button class="btn-buy-now btn btn-outline-light"><i class="fa-solid fa-shopping-bag"></i> Buy Now</button>
                    <button class="btn-add-cart btn"><i class="fa-solid fa-cart-plus"></i> Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div class="recommendations-section-horizontal">
        <div class="filter-title text-center mb-4">YOU MAY ALSO LIKE</div>
        <div class="recommendations-horizontal-container">
          <button class="recommendation-nav-btn prev-btn" onclick="scrollRecommendations('left')">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <div class="recommendations-horizontal-grid" id="recommendationsGrid">
            <div class="recommendation-card-horizontal" data-product-name="Chain Kit" data-product-price="1200" data-product-brand="AeroMax" data-product-stock="20" data-product-image="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Chain+Kit">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Chain+Kit" alt="Chain Kit">
              <div class="recommendation-title-horizontal">CHAIN KIT</div>
              <div class="product-details">
                <div><strong>Brand:</strong> AeroMax</div>
                <div><strong>Price:</strong> ₱1,200</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Oil Filter" data-product-price="450" data-product-brand="SpeedTech" data-product-stock="35" data-product-image="https://via.placeholder.com/900x600/1a2332/ff7a1f?text=Oil+Filter">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/ff7a1f?text=Oil+Filter" alt="Oil Filter">
              <div class="recommendation-title-horizontal">OIL FILTER</div>
              <div class="product-details">
                <div><strong>Brand:</strong> SpeedTech</div>
                <div><strong>Price:</strong> ₱450</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Clutch Kit" data-product-price="2800" data-product-brand="MotoPro" data-product-stock="15" data-product-image="https://via.placeholder.com/900x600/1a2332/1eff8e?text=Clutch+Kit">
              <div class="ai-badge">AI RECOMMENDED</div>
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/1eff8e?text=Clutch+Kit" alt="Clutch Kit">
              <div class="recommendation-title-horizontal">CLUTCH KIT</div>
              <div class="product-details">
                <div><strong>Brand:</strong> MotoPro</div>
                <div><strong>Price:</strong> ₱2,800</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Racing Helmet" data-product-price="3500" data-product-brand="AeroMax" data-product-stock="10" data-product-image="https://via.placeholder.com/900x600/1a2332/ff1e8e?text=Racing+Helmet">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/ff1e8e?text=Racing+Helmet" alt="Racing Helmet">
              <div class="recommendation-title-horizontal">RACING HELMET</div>
              <div class="product-details">
                <div><strong>Brand:</strong> AeroMax</div>
                <div><strong>Price:</strong> ₱3,500</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Riding Gloves" data-product-price="850" data-product-brand="SpeedTech" data-product-stock="28" data-product-image="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Riding+Gloves">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Riding+Gloves" alt="Riding Gloves">
              <div class="recommendation-title-horizontal">RIDING GLOVES</div>
              <div class="product-details">
                <div><strong>Brand:</strong> SpeedTech</div>
                <div><strong>Price:</strong> ₱850</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="LED Lights" data-product-price="1600" data-product-brand="MotoPro" data-product-stock="22" data-product-image="https://via.placeholder.com/900x600/1a2332/ff9a46?text=LED+Lights">
              <div class="ai-badge">AI RECOMMENDED</div>
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/ff9a46?text=LED+Lights" alt="LED Lights">
              <div class="recommendation-title-horizontal">LED LIGHTS</div>
              <div class="product-details">
                <div><strong>Brand:</strong> MotoPro</div>
                <div><strong>Price:</strong> ₱1,600</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Brake Pads" data-product-price="480" data-product-brand="AeroMax" data-product-stock="25" data-product-image="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Brake+Pads">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/1ee0ff?text=Brake+Pads" alt="Brake Pads">
              <div class="recommendation-title-horizontal">BRAKE PADS</div>
              <div class="product-details">
                <div><strong>Brand:</strong> AeroMax</div>
                <div><strong>Price:</strong> ₱480</div>
              </div>
            </div>
            <div class="recommendation-card-horizontal" data-product-name="Air Filter" data-product-price="180" data-product-brand="MotoPro" data-product-stock="30" data-product-image="https://via.placeholder.com/900x600/1a2332/1eff8e?text=Air+Filter">
              <img class="recommendation-image-horizontal" src="https://via.placeholder.com/900x600/1a2332/1eff8e?text=Air+Filter" alt="Air Filter">
              <div class="recommendation-title-horizontal">AIR FILTER</div>
              <div class="product-details">
                <div><strong>Brand:</strong> MotoPro</div>
                <div><strong>Price:</strong> ₱180</div>
              </div>
            </div>
          </div>
          <button class="recommendation-nav-btn next-btn" onclick="scrollRecommendations('right')">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="productModal">
    <div class="modal-content">
      <div class="modal-close" onclick="closeModal()">
        <i class="fa-solid fa-times"></i>
      </div>
      
      <div class="modal-left">
        <img class="modal-product-image" id="modalProductImage" src="/placeholder.svg" alt="Product">
        
        <div class="product-description">
          <h4>Product Description</h4>
          <p id="productDescriptionText">
            High-performance motorcycle parts engineered for superior durability and optimal performance. 
            Manufactured with premium materials and precision engineering to meet the highest industry standards. 
            Perfect for both daily commuting and high-performance racing applications.
          </p>
        </div>

        <div class="accordion-section">
          <div class="accordion-header" onclick="toggleAccordion('specs')">
            <span class="accordion-title">Specifications</span>
            <i class="fas fa-chevron-down accordion-chevron" id="specs-chevron"></i>
          </div>
          <div class="accordion-content" id="specs-content">
            <div class="accordion-body">
              <table class="specs-table">
                <tr>
                  <td>Materials</td>
                  <td>High-Grade Ceramic Composite</td>
                </tr>
                <tr>
                  <td>Diameter</td>
                  <td>280mm</td>
                </tr>
                <tr>
                  <td>Thickness</td>
                  <td>12mm</td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>850g per unit</td>
                </tr>
                <tr>
                  <td>Compatibility</td>
                  <td>Universal fit for most models</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

      
        <div class="accordion-section">
          <div class="accordion-header" onclick="toggleAccordion('reviews')">
            <span class="accordion-title">Reviews</span>
            <i class="fas fa-chevron-down accordion-chevron" id="reviews-chevron"></i>
          </div>
          <div class="accordion-content" id="reviews-content">
            <div class="accordion-body">
              <div class="rating-row">
                <span class="rating-label">Shop Ratings</span>
                <div class="rating-value">
                  <span class="rating-stars-display">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star-half-alt"></i>
                  </span>
                  <span class="rating-score">4.5</span>
                </div>
              </div>
              <div class="rating-row">
                <span class="rating-label">Appearance</span>
                <div class="rating-value">
                  <span class="rating-stars-display">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </span>
                  <span class="rating-score">4.8 / 5.0</span>
                </div>
              </div>
              <div class="rating-row">
                <span class="rating-label">Sustainability</span>
                <div class="rating-value">
                  <span class="rating-stars-display">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="far fa-star"></i>
                  </span>
                  <span class="rating-score">4.2 / 5.0</span>
                </div>
              </div>
              <div class="rating-row">
                <span class="rating-label">Quality</span>
                <div class="rating-value">
                  <span class="rating-stars-display">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </span>
                  <span class="rating-score">4.6 / 5.0</span>
                </div>
              </div>

              <div id="reviewsList" style="margin-top: 20px;">
             
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-section">
          <div class="accordion-header" onclick="toggleAccordion('warranty')">
            <span class="accordion-title">Warranty</span>
            <i class="fas fa-chevron-down accordion-chevron" id="warranty-chevron"></i>
          </div>
          <div class="accordion-content" id="warranty-content">
            <div class="accordion-body">
              <div class="warranty-item">
                <span class="warranty-label">Warranty Period:</span>
                <span>6 months to 2 years (based on selection)</span>
              </div>
              <div class="warranty-item">
                <i class="fas fa-check"></i>
                <span><strong>Coverage:</strong> Manufacturing defects and material failures</span>
              </div>
              <div class="warranty-item">
                <i class="fas fa-check"></i>
                <span><strong>Coverage:</strong> Performance degradation under normal use</span>
              </div>
              <div class="warranty-item">
                <i class="fas fa-times"></i>
                <span><strong>Exclusions:</strong> Damage from improper installation</span>
              </div>
              <div class="warranty-item">
                <i class="fas fa-times"></i>
                <span><strong>Exclusions:</strong> Normal wear and tear from racing use</span>
              </div>
              <div class="warranty-item">
                <i class="fas fa-times"></i>
                <span><strong>Exclusions:</strong> Modifications or alterations to the product</span>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-section">
          <div class="accordion-header" onclick="toggleAccordion('inbox')">
            <span class="accordion-title">In The Box</span>
            <i class="fas fa-chevron-down accordion-chevron" id="inbox-chevron"></i>
          </div>
          <div class="accordion-content" id="inbox-content">
            <div class="accordion-body">
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>1x Premium Brake Pad Set (2 pieces)</span>
              </div>
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>Installation Hardware Kit</span>
              </div>
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>Anti-Squeal Shims</span>
              </div>
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>Installation Guide & Manual</span>
              </div>
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>Warranty Card</span>
              </div>
              <div class="box-item">
                <i class="fas fa-check-circle"></i>
                <span>Quality Inspection Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-right">
        <div class="modal-title" id="modalProductTitle">Product Details</div>
        
        <div class="modal-price" id="modalProductPrice">₱480</div>
        
        <div class="modal-section">
          <div class="stock-status in-stock" id="modalStockStatus">
            <i class="fa-solid fa-check-circle"></i>
            <span id="modalStockText">In Stock (25 units)</span>
          </div>
          
    
          <div class="product-ratings">
            <div class="rating-stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star-half-alt"></i>
            </div>
            <span class="rating-score">4.4</span>
            <span class="rating-sold">17K sold</span>
          </div>
        </div>

        <div class="modal-section">
          <div class="modal-section-title">Size</div>
          <div class="variation-group" id="sizeOptions">
            <div class="variation-option selected" data-variation="size" data-value="small" data-price="0" data-image-suffix="small">Small</div>
            <div class="variation-option" data-variation="size" data-value="medium" data-price="50" data-image-suffix="medium">Medium (+₱50)</div>
            <div class="variation-option" data-variation="size" data-value="large" data-price="100" data-image-suffix="large">Large (+₱100)</div>
          </div>
        </div>

        <div class="modal-section">
          <div class="modal-section-title">Material</div>
          <div class="variation-group" id="materialOptions">
            <div class="variation-option selected" data-variation="material" data-value="ceramic" data-price="0" data-image-suffix="ceramic">Ceramic</div>
            <div class="variation-option" data-variation="material" data-value="metallic" data-price="80" data-image-suffix="metallic">Metallic (+₱80)</div>
            <div class="variation-option" data-variation="material" data-value="organic" data-price="40" data-image-suffix="organic">Organic (+₱40)</div>
          </div>
        </div>

        <div class="modal-section">
          <div class="modal-section-title">Color</div>
          <div class="variation-group" id="colorOptions">
            <div class="variation-option selected" data-variation="color" data-value="black" data-price="0" data-image-suffix="black">Black</div>
            <div class="variation-option" data-variation="color" data-value="silver" data-price="30" data-image-suffix="silver">Silver (+₱30)</div>
            <div class="variation-option" data-variation="color" data-value="red" data-price="50" data-image-suffix="red">Red (+₱50)</div>
            <div class="variation-option" data-variation="color" data-value="blue" data-price="50" data-image-suffix="blue">Blue (+₱50)</div>
          </div>
        </div>

       
        <div class="modal-section">
          <div class="modal-section-title">Quantity</div>
          <div class="quantity-control">
            <button class="quantity-btn" onclick="decreaseQuantity()">
              <i class="fa-solid fa-minus"></i>
            </button>
            <div class="quantity-value" id="quantityValue">1</div>
            <button class="quantity-btn" onclick="increaseQuantity()">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        <div class="modal-action-buttons">
          <button class="modal-action-btn buy-now-action" onclick="handleBuyNow()">
            <i class="fa-solid fa-shopping-bag"></i> Buy Now
          </button>
          <button class="modal-action-btn add-cart-action" onclick="handleAddToCart()">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>

  <div id="checkoutPage" class="checkout-container">
    <div class="stepper-header">
      <div class="stepper" role="navigation" aria-label="Checkout progress">
        <div class="step" data-step="1"><div class="step-circle">1</div><div class="step-label">Product</div></div>
        <div class="step-divider"></div>
        <div class="step active" data-step="2"><div class="step-circle">2</div><div class="step-label">Cart</div></div>
        <div class="step-divider"></div>
        <div class="step" data-step="3"><div class="step-circle">3</div><div class="step-label">Checkout</div></div>
        <div class="step-divider"></div>
        <div class="step" data-step="4"><div class="step-circle">4</div><div class="step-label">Review</div></div>
        <div class="step-divider"></div>
        <div class="step" data-step="5"><div class="step-circle">5</div><div class="step-label">Done</div></div>
      </div>
    </div>
    
    <div class="main-content">
      <div class="page-section active" id="page-cart">
        <div class="cart-items-container">
          <div class="cart-items" id="cartItems"></div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 2px solid rgba(56, 189, 248, 0.2);">
            <div class="summary-row">
              <span class="summary-label">Order Total</span>
              <span class="summary-value" id="cartTotal">₱0</span>
            </div>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value" id="subtotal">₱0</span></div>
          <div class="summary-row"><span class="summary-label">Order Total</span><span class="summary-value" id="orderTotal">₱0</span></div>
          <button class="checkout-btn" onclick="goToStep(3)"><span class="btn-text">Proceed to Checkout</span></button>
        </div>
      </div>
      
      <div class="page-section" id="page-checkout">
        <div class="cart-items-container">
          <form class="checkout-form" id="checkoutForm">
            <div class="form-section">
              <h3>Shipping Information</h3>
              <button type="button" class="edit-info-btn" id="editInfoBtn" onclick="toggleEditMode()">Edit Info</button>
              <div class="form-group"><label for="fullName">Full Name</label><input type="text" id="fullName" class="form-control" required disabled></div>
              <div class="form-group"><label for="email">Email Address</label><input type="email" id="email" class="form-control" required disabled></div>
              <div class="form-group"><label for="phone">Phone Number</label><input type="tel" id="phone" class="form-control" required disabled></div>
              <div class="form-group"><label for="address">Street Address</label><input type="text" id="address" class="form-control" required disabled></div>
              <div class="row">
                <div class="col-md-6"><div class="form-group"><label for="city">City</label><input type="text" id="city" class="form-control" required disabled></div></div>
                <div class="col-md-6"><div class="form-group"><label for="zipCode">ZIP Code</label><input type="text" id="zipCode" class="form-control" required disabled></div></div>
              </div>
            </div>

            <div class="form-section">
              <h3>Payment Method</h3>
              <div class="form-group">
                <label for="paymentMethod">Select Payment Method</label>
                <select id="paymentMethod" class="form-control" required>
                  <option value="">Choose payment method</option>
                  <option value="credit">Credit Card</option>
                  <option value="debit">Debit Card</option>
                  <option value="GCash">GCash</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div class="summary-card">
          <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value" id="checkoutSubtotal">₱0</span></div>
          <div class="summary-row"><span class="summary-label">Shipping</span><span class="summary-value">₱150</span></div>
          <div class="summary-row"><span class="summary-label">Order Total</span><span class="summary-value" id="checkoutTotal">₱0</span></div>
          <button class="checkout-btn" onclick="goToStep(4)"><span class="btn-text">Review Order</span></button>
        </div>
      </div>
      
      <div class="page-section" id="page-review">
        <div class="cart-items-container">
          <div class="review-section"><h3>Order Items</h3><div id="reviewItems"></div></div>
          <div class="review-section"><h3>Shipping Information</h3><div id="reviewShipping"></div></div>
          <div class="review-section"><h3>Payment Method</h3><div id="reviewPayment"></div></div>
        </div>

        <div class="summary-card">
          <div class="summary-row"><span class="summary-label">Subtotal</span><span class="summary-value" id="reviewSubtotal">₱0</span></div>
          <div class="summary-row"><span class="summary-label">Shipping</span><span class="summary-value">₱150</span></div>
          <div class="summary-row"><span class="summary-label">Order Total</span><span class="summary-value" id="reviewTotal">₱0</span></div>
          <button class="checkout-btn" onclick="placeOrder()"><span class="btn-text">Place Order</span></button>
        </div>
      </div>
      
      <div class="page-section" id="page-done">
        <div class="cart-items-container">
          <div class="done-container">
            <div class="success-icon">✓</div>
            <h2 class="done-title">Order Placed Successfully!</h2>
            <p class="done-message">Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
            <div class="order-number">Order #<span id="orderNumber">ADE-2025-001</span></div>
            <a href="#" class="back-to-shop-btn" onclick="backToShop()"><i class="fa-solid fa-arrow-left"></i> Continue Shopping</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast-container" id="toastRoot"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{url('Js/cart.js')}}"></script>
<script src="{{url('Js/products.js')}}"></script>
<script src="{{url('Js/customer_home.js')}}"></script>
  <script>
(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="HVblQv1hHtQJ9bHFEtr0n";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
</script>
</body>
</html>