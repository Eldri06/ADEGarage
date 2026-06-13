(function () {
  const FOCUSABLE = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/placeholder.png';
  const RESEND_COOLDOWN_SECONDS = 60;
  let releaseFocusTrapHandler = null;
  let lastFocusedElement = null;
  let resendCooldownTimer = null;

  function getElements() {
    return {
      backdrop: document.getElementById('authModalBackdrop'),
      panel: document.getElementById('authPanel'),
      homeLoginBtn: document.getElementById('homeLoginBtn'),
      closeBtn: document.getElementById('closeAuth'),
      tabLogin: document.getElementById('tab-login'),
      tabSignup: document.getElementById('tab-signup'),
      panelLogin: document.getElementById('panel-login'),
      panelSignup: document.getElementById('panel-signup'),
      panelVerify: document.getElementById('panel-verify'),
      panelForgot: document.getElementById('panel-forgot'),
      gotoSignUp: document.getElementById('gotoSignUp'),
      gotoLogin: document.getElementById('gotoLogin'),
      restartSignup: document.getElementById('restartSignup'),
      openForgot: document.getElementById('openForgot'),
      backToLogin: document.getElementById('backToLogin'),
      authServerError: document.getElementById('authServerError'),
      signupEmailForm: document.getElementById('signupEmailForm'),
      loginForm: document.getElementById('loginForm'),
      signupForm: document.getElementById('signupForm'),
      verifySignupForm: document.getElementById('verifySignupForm'),
      resendCodeBtn: document.getElementById('resendCodeBtn'),
      resendCountdown: document.getElementById('resendCountdown'),
      verifyCodeMessage: document.getElementById('verifyCodeMessage'),
      loginBtn: document.getElementById('loginBtn'),
      sendSignupCodeBtn: document.getElementById('sendSignupCodeBtn'),
      signupBtn: document.getElementById('signupBtn'),
      verifySignupBtn: document.getElementById('verifySignupBtn'),
      signupVerifiedEmail: document.getElementById('signupVerifiedEmail'),
      signupVerifiedEmailDisplay: document.getElementById('signupVerifiedEmailDisplay'),
    };
  }

  function setAuthError(message = '') {
    const { authServerError } = getElements();
    if (!authServerError) {
      return;
    }

    if (message) {
      authServerError.textContent = message;
      authServerError.classList.remove('d-none');
      return;
    }

    authServerError.textContent = '';
    authServerError.classList.add('d-none');
  }

  function setVerifyMessage(message = '', isError = false) {
    const { verifyCodeMessage } = getElements();
    if (!verifyCodeMessage) {
      return;
    }

    verifyCodeMessage.textContent = message;
    verifyCodeMessage.style.color = isError ? 'var(--neon-orange)' : 'var(--neutral-gray)';
  }

  function activateTab(tabName = 'login') {
    const { tabLogin, tabSignup, panelLogin, panelSignup, panelVerify, panelForgot } = getElements();
    if (!tabLogin || !tabSignup || !panelLogin || !panelSignup || !panelVerify || !panelForgot) {
      return;
    }

    const isSignup = tabName === 'signup';
    const isVerify = tabName === 'verify';
    const isForgot = tabName === 'forgot';

    tabLogin.setAttribute('aria-selected', String(!isSignup && !isVerify && !isForgot));
    tabLogin.setAttribute('tabindex', !isSignup && !isVerify && !isForgot ? '0' : '-1');
    tabSignup.setAttribute('aria-selected', String(isSignup || isVerify));
    tabSignup.setAttribute('tabindex', isSignup || isVerify ? '0' : '-1');

    [panelLogin, panelSignup, panelVerify, panelForgot].forEach((section) => {
      section.hidden = true;
      section.classList.remove('fade-in', 'shake');
    });

    const activePanel = isForgot ? panelForgot : isVerify ? panelVerify : isSignup ? panelSignup : panelLogin;
    activePanel.hidden = false;
    activePanel.classList.add('fade-in');
  }

  function trapFocus(panel) {
    if (!panel) {
      return;
    }

    releaseFocusTrap();
    releaseFocusTrapHandler = (event) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = Array.from(panel.querySelectorAll(FOCUSABLE))
        .filter((element) => !element.hasAttribute('disabled') && !element.getAttribute('aria-hidden'));

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', releaseFocusTrapHandler);
  }

  function releaseFocusTrap() {
    if (releaseFocusTrapHandler) {
      document.removeEventListener('keydown', releaseFocusTrapHandler);
      releaseFocusTrapHandler = null;
    }
  }

  function openAuth(tabName = 'login') {
    const { backdrop, panel } = getElements();
    if (!backdrop || !panel) {
      return;
    }

    lastFocusedElement = document.activeElement;
    backdrop.classList.remove('mb-hidden');
    backdrop.classList.add('mb-show');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    activateTab(tabName);
    trapFocus(panel);

    requestAnimationFrame(() => {
      panel.focus();
    });
  }

  function closeAuth() {
    const { backdrop } = getElements();
    if (!backdrop) {
      return;
    }

    backdrop.classList.remove('mb-show');
    backdrop.classList.add('mb-hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    releaseFocusTrap();

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function wirePwdToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);
    if (!toggle || !input) {
      return;
    }

    const handleToggle = () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.innerHTML = isPassword ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
    };

    toggle.addEventListener('click', handleToggle);
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleToggle();
      }
    });
  }

  function setButtonLoading(button, loadingText, isLoading) {
    if (!button) {
      return;
    }

    if (!button.dataset.defaultLabel) {
      button.dataset.defaultLabel = button.textContent.trim();
    }

    button.disabled = isLoading;
    button.textContent = isLoading ? loadingText : button.dataset.defaultLabel;
  }

  function startResendCooldown(seconds = RESEND_COOLDOWN_SECONDS) {
    const { resendCodeBtn, resendCountdown } = getElements();
    if (!resendCodeBtn || !resendCountdown) {
      return;
    }

    clearInterval(resendCooldownTimer);
    let remaining = seconds;
    if (resendCodeBtn.dataset.defaultLabel) {
      resendCodeBtn.textContent = resendCodeBtn.dataset.defaultLabel;
    }
    resendCodeBtn.disabled = true;

    const render = () => {
      resendCountdown.textContent = remaining > 0
        ? `You can resend a code in ${remaining}s.`
        : '';
      resendCodeBtn.disabled = remaining > 0;
      remaining -= 1;

      if (remaining < 0) {
        clearInterval(resendCooldownTimer);
        resendCooldownTimer = null;
      }
    };

    render();
    resendCooldownTimer = setInterval(render, 1000);
  }

  function setSignupDetailsEnabled(isEnabled) {
    ['suUsername', 'suPwd', 'agreeTerms'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.disabled = !isEnabled;
      }
    });
  }

  function unlockSignupDetails(email) {
    const { signupEmailForm, signupForm, signupVerifiedEmail, signupVerifiedEmailDisplay } = getElements();
    if (signupEmailForm) {
      signupEmailForm.hidden = true;
    }
    if (signupForm) {
      signupForm.hidden = false;
    }
    if (signupVerifiedEmail) {
      signupVerifiedEmail.value = email;
    }
    if (signupVerifiedEmailDisplay) {
      signupVerifiedEmailDisplay.value = email;
    }

    setSignupDetailsEnabled(true);
    activateTab('signup');
    document.getElementById('suUsername')?.focus();
  }

  function resetManualSignup() {
    const { signupEmailForm, signupForm, verifySignupForm } = getElements();
    if (signupEmailForm) {
      signupEmailForm.hidden = false;
    }
    if (signupForm) {
      signupForm.hidden = true;
      signupForm.reset();
    }
    if (verifySignupForm) {
      verifySignupForm.reset();
    }

    setSignupDetailsEnabled(false);
    setVerifyMessage('');
    clearInterval(resendCooldownTimer);
    resendCooldownTimer = null;
  }

  function extractErrorMessage(payload) {
    if (!payload || typeof payload !== 'object') {
      return 'Something went wrong. Please try again.';
    }

    if (payload.message) {
      return payload.message;
    }

    if (payload.error) {
      return payload.error;
    }

    if (payload.errors && typeof payload.errors === 'object') {
      return Object.values(payload.errors).flat().join(', ');
    }

    return 'Something went wrong. Please try again.';
  }

  async function submitAuthForm(form, button, tabName, loadingText) {
    if (!form || !button) {
      return;
    }

    if (!form.reportValidity()) {
      openAuth(tabName);
      return;
    }

    setAuthError('');
    openAuth(tabName);
    setButtonLoading(button, loadingText, true);

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload.success && payload.redirect) {
        window.location.assign(payload.redirect);
        return;
      }

      if (response.ok && payload.success && payload.needs_verification) {
        const signupEmail = document.getElementById('suEmail')?.value || '';
        const verifyEmail = document.getElementById('verifyEmail');
        if (verifyEmail) {
          verifyEmail.value = payload.email || signupEmail;
        }

        const { signupEmailForm } = getElements();
        if (signupEmailForm) {
          signupEmailForm.hidden = true;
        }

        setAuthError(payload.message || `Verification code sent to ${payload.email || signupEmail}`);
        setVerifyMessage(payload.message || 'Check your email for the latest verification code.');
        activateTab('verify');
        startResendCooldown();
        document.getElementById('verifyCode')?.focus();
        return;
      }

      if (response.ok && payload.success && payload.email_verified) {
        setAuthError(payload.message || 'Verification successful.');
        setVerifyMessage(payload.message || 'Verification successful.');
        unlockSignupDetails(payload.email || document.getElementById('verifyEmail')?.value || '');
        return;
      }

      const message = extractErrorMessage(payload);
      setAuthError(message);
      if (tabName === 'verify') {
        setVerifyMessage(message, true);
      }
      activateTab(tabName);
    } catch (error) {
      console.error('Authentication request failed:', error);
      setAuthError('Network error. Please try again.');
      activateTab(tabName);
    } finally {
      setButtonLoading(button, loadingText, false);
    }
  }

  function initializeTimelineAnimation() {
    const items = document.querySelectorAll('.timeline li');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.2 });

    items.forEach((item) => observer.observe(item));
  }

  async function loadFeaturedProducts() {
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      const featuredProducts = products.filter((product) => product.ml_tier === 'Fast-Moving' || product.ml_tier === 'Premium');
      const productsRow = document.querySelector('.products-row');

      if (!productsRow || !featuredProducts.length) {
        return;
      }

      const htmlContent = featuredProducts.map((product) => {
        let imageUrl = product.image_url || null;

        if (!imageUrl && product.image) {
          imageUrl = /^https?:\/\//i.test(product.image) || product.image.startsWith('/')
            ? product.image
            : `/storage/${product.image}`;
        }

        if (!imageUrl) {
          imageUrl = PRODUCT_PLACEHOLDER_IMAGE;
        }

        return `
          <div class="product-card position-relative">
            <div style="position:absolute; top:10px; right:10px; width:12px; height:12px; background:#1eff8e; border-radius:50%; box-shadow: 0 0 8px #1eff8e;" title="High Selling"></div>
            <div class="product-img">
              <img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 6px;">
            </div>
            <div style="margin-top: 10px;">
              <div style="font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.name.toUpperCase()}</div>
              <div class="price" style="color: #1ee0ff; font-weight: bold; margin-top: 5px;">₱${parseFloat(product.price).toLocaleString()}</div>
            </div>
          </div>
        `;
      }).join('');

      productsRow.innerHTML = htmlContent + htmlContent;
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const {
      backdrop,
      homeLoginBtn,
      closeBtn,
      tabLogin,
      tabSignup,
      gotoSignUp,
      gotoLogin,
      restartSignup,
      openForgot,
      backToLogin,
      loginForm,
      signupEmailForm,
      signupForm,
      verifySignupForm,
      resendCodeBtn,
      loginBtn,
      sendSignupCodeBtn,
      signupBtn,
      verifySignupBtn,
    } = getElements();

    initializeTimelineAnimation();
    loadFeaturedProducts();
    wirePwdToggle('loginPwdToggle', 'loginPassword');
    wirePwdToggle('suPwdToggle', 'suPwd');

    if (homeLoginBtn) {
      homeLoginBtn.addEventListener('click', () => {
        setAuthError('');
        openAuth('login');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeAuth);
    }

    if (backdrop) {
      backdrop.addEventListener('click', (event) => {
        if (event.target === backdrop) {
          closeAuth();
        }
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && backdrop && backdrop.classList.contains('mb-show')) {
        closeAuth();
      }
    });

    tabLogin?.addEventListener('click', () => activateTab('login'));
    tabSignup?.addEventListener('click', () => activateTab('signup'));
    gotoSignUp?.addEventListener('click', (event) => {
      event.preventDefault();
      resetManualSignup();
      activateTab('signup');
    });
    gotoLogin?.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab('login');
    });
    restartSignup?.addEventListener('click', (event) => {
      event.preventDefault();
      setAuthError('');
      resetManualSignup();
      activateTab('signup');
      document.getElementById('suEmail')?.focus();
    });
    openForgot?.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab('forgot');
    });
    backToLogin?.addEventListener('click', (event) => {
      event.preventDefault();
      activateTab('login');
    });

    loginForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthForm(loginForm, loginBtn, 'login', 'LOGGING IN...');
    });

    signupEmailForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthForm(signupEmailForm, sendSignupCodeBtn, 'signup', 'SENDING CODE...');
    });

    signupForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitAuthForm(signupForm, signupBtn, 'signup', 'CREATING ACCOUNT...');
    });

    verifySignupForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      setVerifyMessage('');
      await submitAuthForm(verifySignupForm, verifySignupBtn, 'verify', 'VERIFYING...');
    });

    resendCodeBtn?.addEventListener('click', async () => {
      if (!verifySignupForm || !resendCodeBtn) {
        return;
      }

      const verifyEmail = document.getElementById('verifyEmail');
      if (!verifyEmail?.reportValidity()) {
        return;
      }

      setAuthError('');
      setVerifyMessage('');
      setButtonLoading(resendCodeBtn, 'SENDING...', true);

      try {
        const formData = new FormData(verifySignupForm);
        const response = await fetch(resendCodeBtn.dataset.action || '/signup/resend', {
          method: 'POST',
          body: formData,
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        const payload = await response.json().catch(() => ({}));
        const message = extractErrorMessage(payload);

        if (response.ok && payload.success) {
          setVerifyMessage(payload.message || 'We sent a new verification code.');
          startResendCooldown();
          document.getElementById('verifyCode')?.focus();
          return;
        }

        setVerifyMessage(message, true);
        setAuthError(message);
      } catch (error) {
        console.error('Resend code request failed:', error);
        setVerifyMessage('Network error. Please try again.', true);
      } finally {
        if (!resendCooldownTimer) {
          setButtonLoading(resendCodeBtn, 'SENDING...', false);
        }
      }
    });

    if (backdrop?.dataset.openOnError === 'true') {
      openAuth(backdrop.dataset.activeTab || 'login');
    }
  });
})();

