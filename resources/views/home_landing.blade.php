
<!doctype html>   
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ADE Garage</title>

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Orbitron:wght@600;800&display=swap" rel="stylesheet" />

  <!-- Bootstrap 5 -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link rel="stylesheet" href="{{url('Css/home_landing.css')}}">
    <link rel="stylesheet" href="{{url('Css/pop.css')}}">
</head>
<body>
<header class="navbar navbar-expand-lg sticky-top">
  <div class="container-fluid px-3">
    <a class="navbar-brand brand fs-3" href="#">ADE</a>
    <button class="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link" href="#">HOME</a></li>
        <li class="nav-item"><a class="nav-link" href="#">AI ASSISTANT</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">ABOUT</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">CONTACT</a></li>
      </ul>
      <div class="d-flex gap-2 ms-3">
        <button id="homeLoginBtn" class="icon-btn"><i class="bi bi-person"></i></button>
      </div>
    </div>
  </div>
</header>


<section class="hero d-flex align-items-center">
  <div class="container">
    <div class="row g-4 align-items-center">
      <div class="col-lg-7">
        <h1 class="hero-title mb-4">
          REV UP YOUR<br/>
          RIDE<br/>
          WITH ADE<br/>
          GARAGE
        </h1>
        <div class="d-flex flex-wrap gap-3">
          <a href="#" class="btn cta">Shop Now</a>
          <a href="#" class="btn cta secondary">Book Service</a>
        </div>
      </div>
      <div class="col-lg-5">
        <div class="flip">
          <div class="flip-inner">
            <div class="flip-face">
              <i class="bi bi-person-bounding-box fs-1 mb-2"></i>
              <h5 class="brand">ASK OUR<br/>AI ASSISTANT</h5>
            </div>
            <div class="flip-face flip-back">
              <i class="bi bi-cpu fs-1 mb-2"></i>
              <p>Find compatible parts.<br/>Get service advice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-5">
  <div class="container products-container">
    <h2 class="section-title section-title-small mb-4">Featured Products</h2>
    <div class="scroll-arrow scroll-left"><i class="bi bi-chevron-left"></i></div>
    <div class="scroll-arrow scroll-right"><i class="bi bi-chevron-right"></i></div>
    <div class="products-wrapper">
      <div class="products-row">
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/motortires.webp') }}" alt="motor tires"></div><div>MOTORCYCLE TIRE<div class="price">₱4450.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/carburetor.jfif') }}" alt="carburetor"></div><div>CARBURETOR<div class="price">₱950.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/epipee.jpg') }}" alt="exhaust pipe"></div><div>EXHAUST PIPE<div class="price">₱780.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/helmett.jfif') }}" alt="helmet"></div><div>HELMET<div class="price">₱3200.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/drivebelt.jfif') }}" alt="drive belt"></div><div>DRIVE BELT<div class="price">₱530.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/battery pack.jfif') }}" alt="battery pack"></div><div>BATTERY PACK<div class="price">₱860.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/toolkit.jfif') }}" alt="tool kit"></div><div>TOOL KIT<div class="price">₱1900.00</div></div></div>
        <div class="product-card"><div class="product-img"><img src="{{ asset('storage/asset/headlight.jfif') }}" alt="led headlight"></div><div>LED HEADLIGHT<div class="price">₱399</div></div></div>
      </div>
    </div>
  </div>
</section>

<section id="about" class="py-5">
  <div class="container">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <h2 class="section-title mb-4">About Us</h2>
        <p class="lead text-white">
          At ADE Garage, we are passionate about motorcycles and cars. 
          Our mission is to provide top-quality parts, trusted services, and 
          innovative AI-driven assistance to keep your ride in peak performance. 
          Whether it’s maintenance, upgrades, or expert advice—ADE Garage is here 
          to fuel your journey.
        </p>
      </div>
      <div class="col-lg-6">
        <ul class="timeline list-unstyled position-relative">
          <li class="mb-4">
            <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-info shadow">
              <strong class="text-info">2015</strong> – Founded with a mission to help riders locally.
            </div>
          </li>
          <li class="mb-4">
            <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-info shadow">
              <strong class="text-info">2019</strong> – Expanded with online services and delivery.
            </div>
          </li>
          <li>
            <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-info shadow">
              <strong class="text-info">2025</strong> – Integrating AI to assist our valued customers.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>


<section id="contact" class="py-5">
  <div class="container">
    <h2 class="section-title mb-5 text-center">Contact Us</h2>
    <div class="row g-5">
      <div class="col-lg-6">
        <div class="ratio ratio-16x9 shadow rounded-3 border border-info">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62865.23966219743!2d125.767425!3d7.447891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f9522c7e67f6f9%3A0x9f3c24c58f5dc3d7!2sPurok%206%2C%20San%20Miguel%2C%20Tagum%20City%2C%20Davao%20del%20Norte!5e0!3m2!1sen!2sph!4v1694592000000!5m2!1sen!2sph" 
            width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <div class="mt-3 text-white">
          <p><i class="bi bi-geo-alt-fill text-info"></i> Purok 6, San Miguel, Tagum City</p>
          <p><i class="bi bi-telephone-fill text-info"></i> 09657622915</p>
          <p><i class="bi bi-envelope-fill text-info"></i> ADEgarage@gmail.com</p>
        </div>
      </div>
      <div class="col-lg-6">
        <form>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="name" placeholder="Name">
            <label for="name">Name</label>
          </div>
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="email" placeholder="Email">
            <label for="email">Email</label>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" placeholder="Message" id="message" style="height: 150px"></textarea>
            <label for="message">Message</label>
          </div>
          <button class="btn cta w-100" type="submit">Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>
  <div id="authModalBackdrop" class="modal-backdrop-custom mb-hidden" role="dialog" aria-modal="true" aria-labelledby="authTitle" aria-hidden="true">
    <div class="auth-panel" id="authPanel" tabindex="-1">
      <div id="topToast" class="small-toast" role="status" aria-live="polite"></div>
      <div class="auth-top">
        <div class="brand">ADE GARAGE</div>
        <div style="display:flex; gap:12px; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <i class="bi bi-person-fill" style="color: var(--neon-cyan); font-size:1.2rem;"></i>
          </div>
          <button id="closeAuth" class="btn-ghost" aria-label="Close authentication dialog"
            style="color: var(--neon-cyan); font-size:1.0rem; border-color: var(--neon-cyan);">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="auth-tabs" role="tablist" aria-label="Authentication tabs">
        <div id="tab-login" class="auth-tab" role="tab" tabindex="0" aria-selected="true" aria-controls="panel-login">LOGIN</div>
        <div id="tab-signup" class="auth-tab" role="tab" tabindex="-1" aria-selected="false" aria-controls="panel-signup">SIGN UP</div>
      </div>

      <div style="margin-top:10px">
        @if ($errors->any())
          <div class="alert alert-danger" role="alert" style="margin-bottom: 12px;">
            {{ $errors->first() }}
          </div>
        @endif
        <section id="panel-login" role="tabpanel" aria-labelledby="tab-login" class="mb-panel">
  <h2 id="authTitle" class="auth-title">WELCOME BACK</h2>
  <p class="auth-sub">Sign in to access orders, bookings & AI recommendations.</p>

  <form id="loginForm" class="form-glass" autocomplete="on" method="POST" action="/login">
    @csrf
    <div class="mb-3">
      <label class="form-label help-text">Email</label>
      <input id="loginEmail" name="email" type="email" class="form-control" placeholder="you@your.email.com" required aria-required="true" />
      <div class="invalid-feedback">Please enter your email</div>
    </div>
            <div class="mb-3 input-with-icon">
      <label class="form-label help-text">Password</label>
      <input id="loginPassword" name="password" type="password" class="form-control" placeholder="Enter password" required aria-required="true" />
      <span id="loginPwdToggle" class="input-icon" title="Show / hide password" role="button" tabindex="0" aria-label="Toggle password visibility"><i class="bi bi-eye"></i></span>
      <div class="invalid-feedback">Please enter your password</div>
    </div>
            <div class="options-row">
              <div class="d-flex align-items-center gap-2">
                <label class="checkbox-neon d-flex align-items-center gap-2" style="cursor:pointer">
                  <input id="rememberMe" type="checkbox" aria-checked="false" />
                  <span class="help-text">Remember me</span>
                </label>
              </div>
              <div>
                <a href="#" id="openForgot" class="forgot-link">Forgot password?</a>
              </div>
            </div>
            <button id="loginBtn" type="submit" class="btn-neon">LOG IN</button>
  </form>

          <div class="micro">Or continue with</div>
          <div class="social-row" aria-hidden="false">
            <div class="social" title="Continue with Google"><a href="{{ route('oauth.google') }}"><img src="https://www.svgrepo.com/show/355037/google.svg" width="22" alt="Google"></a></div>
            <div class="social" title="Continue with Apple"><i class="bi bi-apple" style="font-size:20px;"></i></div>
            <div class="social" title="Continue with GCash"><i class="bi bi-wallet2" style="font-size:18px;"></i></div>
          </div>

          <div class="micro">Don't have an account? <a href="#" id="gotoSignUp">Sign Up</a></div>
        </section>

<section id="panel-signup" role="tabpanel" aria-labelledby="tab-signup" class="mb-panel" hidden>
          <h2 class="auth-title">CREATE ACCOUNT</h2>
          <p class="auth-sub">Create your new account by filling out the form below</p>

  <form id="signupForm" class="form-glass" autocomplete="on" action="/signup" method="POST">
    @csrf
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label help-text">username</label>
        <input id="suUsername" name="username"type="text" class="form-control" placeholder="Choose a username">
        <div class="invalid-feedback">Enter a username</div>
      </div>
              <div class="col-12">
        <label class="form-label help-text">Email</label>
        <input id="suEmail" name="email" type="email" class="form-control" placeholder="you@your.email.com" >
        <div class="invalid-feedback">Enter a valid email</div>
      </div>

      <div class="col-6">
        <label class="form-label help-text">Phone (optional)</label>
        <input id="suPhone" type="tel" class="form-control" placeholder="+63" inputmode="tel" >
      </div>
              <div class="col-6 input-with-icon">
        <label class="form-label help-text">Password</label>
        <input id="suPwd" type="password" name="password" class="form-control" placeholder="Create password">
        <span id="suPwdToggle" class="input-icon" role="button" tabindex="0" aria-label="Toggle password visibility"><i class="bi bi-eye"></i></span>
        <div class="invalid-feedback">Enter a password</div>
      </div>
      <div class="col-12">
                <div class="form-check">
                  <input id="agreeTerms" class="form-check-input" type="checkbox" />
                  <label class="form-check-label" for="agreeTerms">I agree to Terms &amp; Privacy</label>
                </div>
              </div>
            </div>
            <div style="height:12px"></div>
            <button id="signupBtn" type="submit" class="btn-orange btn-neon">SIGN UP</button>
  </form>
          <div class="micro">Or continue an account?</div>
          <div class="social-row">
            <div class="social" title="Google"><a href="{{ route('oauth.google') }}"><img src="https://www.svgrepo.com/show/355037/google.svg" width="22" alt="Google"></div></a>
            <div class="social" title="Apple"><i class="bi bi-apple" style="font-size:20px;"></i></div>
            <div class="social" title="GCash"><i class="bi bi-wallet2" style="font-size:18px;"></i></div>
          </div>

          <div class="micro">Already have an account? <a href="#" id="gotoLogin">Log In</a></div>

        </section>


        <section id="panel-forgot" role="tabpanel" aria-labelledby="openForgot" class="mb-panel" hidden>
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-sub">Enter your account email and we'll send a reset link.</p>

          <form id="forgotForm" class="form-glass" novalidate>
            <div class="mb-3">
              <label class="form-label help-text">Email</label>
              <input id="forgotEmail" type="email" class="form-control" placeholder="you@your.email.com" required />
            </div>
            <button id="forgotBtn" class="btn-neon" type="submit">SEND RESET LINK</button>
            <div style="height:12px"></div>
            <div class="micro"><a href="#" id="backToLogin">Back to Login</a></div>
          </form>
        </section>
      </div>
    </div>
  </div>
  <div aria-live="polite" aria-atomic="true" style="position:fixed; top:18px; left:50%; transform:translateX(-50%); z-index:2200;">
    <div id="globalToast" class="toast align-items-center text-bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div id="globalToastBody" class="toast-body">Message</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  </div>
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
     <script src="{{url('Js/pop.js')}}"></script>

</body>
</html>
