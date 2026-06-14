(function () {
  const state = {
    requests: 0,
    pageTimer: null,
    loader: null,
    progress: null,
    toastRoot: null,
  };

  const typeConfig = {
    success: { icon: 'fa-check-circle', bootstrapIcon: 'bi-check-circle-fill', label: 'Success' },
    error: { icon: 'fa-circle-exclamation', bootstrapIcon: 'bi-exclamation-circle-fill', label: 'Error' },
    danger: { icon: 'fa-circle-exclamation', bootstrapIcon: 'bi-exclamation-circle-fill', label: 'Error' },
    warning: { icon: 'fa-triangle-exclamation', bootstrapIcon: 'bi-exclamation-triangle-fill', label: 'Warning' },
    info: { icon: 'fa-circle-info', bootstrapIcon: 'bi-info-circle-fill', label: 'Info' },
  };

  function ensureProgress() {
    if (!state.progress) {
      state.progress = document.createElement('div');
      state.progress.className = 'app-progress';
      document.body.appendChild(state.progress);
    }
    return state.progress;
  }

  function ensurePageLoader() {
    if (!state.loader) {
      state.loader = document.createElement('div');
      state.loader.className = 'app-page-loader';
      state.loader.setAttribute('role', 'status');
      state.loader.setAttribute('aria-live', 'polite');
      state.loader.innerHTML = `
        <div class="app-page-loader__panel">
          <span class="app-spinner" aria-hidden="true"></span>
          <span class="app-page-loader__text">Loading...</span>
        </div>
      `;
      document.body.appendChild(state.loader);
    }
    return state.loader;
  }

  function ensureToastRoot() {
    state.toastRoot = document.getElementById('toastRoot') || document.getElementById('globalToastRoot');
    if (!state.toastRoot) {
      state.toastRoot = document.createElement('div');
      state.toastRoot.id = 'toastRoot';
      state.toastRoot.className = 'toast-container';
      document.body.appendChild(state.toastRoot);
    }
    return state.toastRoot;
  }

  function setProgress(isLoading) {
    const progress = ensureProgress();
    progress.classList.toggle('is-loading', isLoading);
    if (!isLoading) {
      progress.style.transform = 'scaleX(1)';
      setTimeout(() => {
        progress.style.transform = '';
      }, 180);
    }
  }

  function showPageLoader(message = 'Loading...') {
    const loader = ensurePageLoader();
    const text = loader.querySelector('.app-page-loader__text');
    if (text) text.textContent = message;
    loader.classList.add('is-visible');
  }

  function hidePageLoader() {
    ensurePageLoader().classList.remove('is-visible');
  }

  function beginRequest(options = {}) {
    if (options.silent) return () => {};
    state.requests += 1;
    setProgress(true);
    clearTimeout(state.pageTimer);
    if (options.overlay) {
      state.pageTimer = setTimeout(() => showPageLoader(options.message || 'Loading...'), 180);
    }
    return () => endRequest(options);
  }

  function endRequest(options = {}) {
    if (options.silent) return;
    state.requests = Math.max(0, state.requests - 1);
    if (state.requests === 0) {
      clearTimeout(state.pageTimer);
      setProgress(false);
      hidePageLoader();
    }
  }

  function setButtonLoading(button, isLoading, label) {
    if (!button) return;
    if (!button.dataset.defaultHtml) {
      button.dataset.defaultHtml = button.innerHTML;
    }
    button.disabled = Boolean(isLoading);
    button.setAttribute('aria-busy', String(Boolean(isLoading)));
    button.classList.toggle('is-button-loading', Boolean(isLoading));
    button.innerHTML = isLoading
      ? `<span class="button-spinner" aria-hidden="true"></span>${label || 'Loading...'}`
      : button.dataset.defaultHtml;
  }

  function iconMarkup(type) {
    const config = typeConfig[type] || typeConfig.info;
    if (document.querySelector('link[href*="bootstrap-icons"]')) {
      return `<i class="bi ${config.bootstrapIcon} alert-icon" aria-hidden="true"></i>`;
    }
    return `<i class="fas ${config.icon} alert-icon" aria-hidden="true"></i>`;
  }

  function setAlert(element, type, message) {
    if (!element) return;
    const normalizedType = type === 'danger' ? 'error' : (type || 'info');
    element.className = `app-alert app-alert-${normalizedType}`;
    element.innerHTML = `${iconMarkup(normalizedType)}<span>${escapeHtml(message || '')}</span>`;
    element.classList.toggle('d-none', !message);
    element.hidden = !message;
  }

  function showToast(type, message, options = {}) {
    const normalizedType = type === 'danger' ? 'error' : (type || 'info');
    const root = ensureToastRoot();
    const toast = document.createElement('div');
    toast.className = `app-toast ${normalizedType}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="toast-icon ${normalizedType}">${iconMarkup(normalizedType)}</span>
      <span>${escapeHtml(message || '')}</span>
    `;
    root.appendChild(toast);
    setTimeout(() => toast.remove(), options.duration || 3200);
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function skeletonCards(count = 6, columnClass = 'col-lg-4 col-md-6') {
    return Array.from({ length: count }, () => `
      <div class="${columnClass}">
        <div class="skeleton-card"></div>
      </div>
    `).join('');
  }

  function skeletonRows(columns = 6, rows = 5) {
    return Array.from({ length: rows }, () => `
      <tr class="table-skeleton-row">
        ${Array.from({ length: columns }, () => '<td class="table-skeleton-cell"><div class="skeleton-line"></div></td>').join('')}
      </tr>
    `).join('');
  }

  function skeletonOrderCards(count = 4) {
    return Array.from({ length: count }, () => `
      <div class="skeleton-card" style="min-height:190px;"></div>
    `).join('');
  }

  function navigateWithLoading(url, message = 'Loading page...') {
    if (!url || url === '#') return;
    showPageLoader(message);
    setProgress(true);
    window.location.assign(url);
  }

  function friendlyAuthMessage(payload, fallback = 'Something went wrong. Please try again.') {
    const raw = typeof payload === 'string'
      ? payload
      : payload?.message || payload?.error || Object.values(payload?.errors || {}).flat()[0] || fallback;
    const message = String(raw || fallback).toLowerCase();

    if (message.includes('otp') || message.includes('code')) {
      if (message.includes('expired')) return 'That verification code has expired. Request a new code and try again.';
      if (message.includes('invalid') || message.includes('incorrect')) return 'The verification code is invalid. Check the latest code and try again.';
      if (message.includes('sent')) return raw;
    }
    if (message.includes('email') && (message.includes('exist') || message.includes('taken') || message.includes('registered'))) {
      return 'This email is already registered. Log in or use a different email.';
    }
    if (message.includes('credential') || message.includes('password') || message.includes('login')) {
      return 'The email or password is incorrect. Please check your details and try again.';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network connection failed. Check your internet and try again.';
    }
    return raw || fallback;
  }

  const originalFetch = window.fetch ? window.fetch.bind(window) : null;
  if (originalFetch && !window.__adeFetchWrapped) {
    window.__adeFetchWrapped = true;
    window.fetch = async function wrappedFetch(input, init = {}) {
      const url = typeof input === 'string' ? input : input?.url || '';
      const isApi = url.includes('/api/') || url.includes('/signup') || url.includes('/login') || url.includes('/logout');
      const end = beginRequest({ silent: init.adeSilent || !isApi, overlay: init.adeOverlay, message: init.adeMessage });
      try {
        return await originalFetch(input, init);
      } finally {
        end();
      }
    };
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-loading-link]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    event.preventDefault();
    navigateWithLoading(href, link.dataset.loadingMessage || 'Loading page...');
  });

  // Handle cancel button navigation with proper loading state
  document.addEventListener('click', (event) => {
    const cancelBtn = event.target.closest('button.btn.blue[type="button"]');
    if (!cancelBtn) return;
    const hasLoadingLink = cancelBtn.hasAttribute('data-loading-link');
    const hasCancelOnclick = cancelBtn.getAttribute('onclick')?.includes('customer_home');
    if (hasLoadingLink || hasCancelOnclick) {
      event.preventDefault();
      AppLoading.showPageLoader('Returning to shop...');
      setTimeout(() => {
        window.location.href = cancelBtn.dataset.href || '{{ route('customer_home') }}';
      }, 150);
    }
  });

  window.AppLoading = {
    beginRequest,
    endRequest,
    showPageLoader,
    hidePageLoader,
    setButtonLoading,
    setAlert,
    showToast,
    skeletonCards,
    skeletonRows,
    skeletonOrderCards,
    navigateWithLoading,
    friendlyAuthMessage,
    escapeHtml,
  };
})();
