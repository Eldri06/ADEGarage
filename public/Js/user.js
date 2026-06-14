(function() {
  document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.getElementById("hamburgerMenu")
    const sidebar = document.getElementById("sidebar")
    const sidebarOverlay = document.getElementById("sidebarOverlay")

    console.log("[v0] Hamburger menu elements:", { hamburgerMenu, sidebar, sidebarOverlay })

    if (hamburgerMenu && sidebar && sidebarOverlay) {
      hamburgerMenu.addEventListener("click", () => {
        console.log("[v0] Hamburger menu clicked")
        hamburgerMenu.classList.toggle("active")
        sidebar.classList.toggle("active")
        sidebarOverlay.classList.toggle("active")
        console.log("[v0] Sidebar active:", sidebar.classList.contains("active"))
      })

      hamburgerMenu.addEventListener("mouseenter", () => {
        console.log("[v0] Hamburger menu hovered")
        sidebar.classList.add("active")
        sidebarOverlay.classList.add("active")
      })

      sidebar.addEventListener("mouseenter", () => {
        sidebar.classList.add("active")
        sidebarOverlay.classList.add("active")
      })

      sidebar.addEventListener("mouseleave", () => {
        if (!hamburgerMenu.classList.contains("active")) {
          sidebar.classList.remove("active")
          sidebarOverlay.classList.remove("active")
        }
      })

      hamburgerMenu.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!sidebar.matches(":hover") && !hamburgerMenu.classList.contains("active")) {
            sidebar.classList.remove("active")
            sidebarOverlay.classList.remove("active")
          }
        }, 100)
      })

      sidebarOverlay.addEventListener("click", () => {
        console.log("[v0] Overlay clicked - closing sidebar")
        hamburgerMenu.classList.remove("active")
        sidebar.classList.remove("active")
        sidebarOverlay.classList.remove("active")
      })
    }


    const sidebarItems = document.querySelectorAll(".sidebar nav ul li[data-section]")
    const sections = document.querySelectorAll(".section")

    sidebarItems.forEach((item) => {
      item.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          hamburgerMenu.classList.remove("active")
          sidebar.classList.remove("active")
          sidebarOverlay.classList.remove("active")
        }

        sidebarItems.forEach((i) => i.classList.remove("active"))
        item.classList.add("active")

        const target = item.getAttribute("data-section")
        sections.forEach((sec) => {
          sec.classList.remove("active")
          if (sec.id === target) sec.classList.add("active")
        })

        // Reload purchases fresh from server whenever the user switches to that tab
        if (target === "purchases") {
          loadMyOrders();
        }
      })
    })

    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"))
        tab.classList.add("active")
        filterOrdersByActiveTab();
      })
    })

    const avatarEditBtn = document.getElementById("avatarEditBtn")
    const avatarInput = document.getElementById("avatarInput")
    const avatarImage = document.getElementById("avatarImage")

    console.log("[v0] Avatar elements:", { avatarEditBtn, avatarInput, avatarImage })

    if (avatarEditBtn && avatarInput) {
      avatarEditBtn.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("[v0] Avatar edit button clicked")
        avatarInput.click()
      })
    }

    if (avatarInput && avatarImage) {
      avatarInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        console.log("[v0] Avatar file selected:", file)

        if (file) {
          if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.")
            return
          }
          if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5MB.")
            return
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            console.log("[v0] Image loaded successfully")
            
            // Handle new img element based preview
            let img = avatarImage.querySelector('img');
            const initials = avatarImage.querySelector('.avatar-initials');
            
            if (!img) {
              img = document.createElement('img');
              img.id = 'avatarImgElement';
              img.style.width = '100%';
              img.style.height = '100%';
              img.style.borderRadius = '50%';
              img.style.objectFit = 'cover';
              avatarImage.prepend(img);
            }
            
            img.src = event.target.result;
            img.style.display = 'block';
            
            if (initials) initials.style.display = 'none';
          }
          reader.readAsDataURL(file)
        }
      })
    }

    const cancelBtn = document.getElementById('cancelProfileBtn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        window.AppLoading?.showPageLoader?.('Returning to shop...');
        setTimeout(() => { window.location.href = '/customer_home'; }, 150);
      });
    }

    loadUserSettings();
  });

  async function saveUserSettings() {
    const settings = {
      language: document.getElementById('settingLanguage')?.value || 'en',
      region: document.getElementById('settingRegion')?.value || 'us',
      emailNotif: document.getElementById('settingEmailNotif')?.checked ?? true,
      pushNotif: document.getElementById('settingPushNotif')?.checked ?? false,
      smsNotif: document.getElementById('settingSmsNotif')?.checked ?? true,
      soundEffects: document.getElementById('settingSoundEffects')?.checked ?? true,
      volume: document.getElementById('settingVolume')?.value || '75',
      twoFA: document.getElementById('setting2FA')?.checked ?? false,
      profileVisibility: document.getElementById('settingProfileVisibility')?.value || 'public'
    };

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || ''
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('adeUserSettings', JSON.stringify(settings));
        window.AppLoading?.showToast?.('success', 'Settings saved successfully!');
      } else {
        window.AppLoading?.showToast?.('error', data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving user settings:', error);
      window.AppLoading?.showToast?.('error', 'Network error while saving settings');
    }
  }

  async function loadUserSettings() {
    try {
      const response = await fetch('/api/user/settings', { adeSilent: true });
      if (response.ok) {
        const settings = await response.json();
        applySettingsToUI(settings);
        localStorage.setItem('adeUserSettings', JSON.stringify(settings));
        return;
      }
    } catch(e) {
      console.error("Error loading user settings from server:", e);
    }

    try {
      const saved = localStorage.getItem('adeUserSettings');
      if (saved) applySettingsToUI(JSON.parse(saved));
    } catch(e) {
      console.error("Error loading settings from localStorage:", e);
    }
  }

  function applySettingsToUI(settings) {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    const setCheck = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };

    setVal('settingLanguage', settings.language || 'en');
    setVal('settingRegion', settings.region || 'us');
    setCheck('settingEmailNotif', settings.emailNotif ?? true);
    setCheck('settingPushNotif', settings.pushNotif ?? false);
    setCheck('settingSmsNotif', settings.smsNotif ?? true);
    setCheck('settingSoundEffects', settings.soundEffects ?? true);
    setVal('settingVolume', settings.volume || '75');
    setCheck('setting2FA', settings.twoFA ?? false);
    setVal('settingProfileVisibility', settings.profileVisibility || 'public');
  }

  window.saveUserSettings = saveUserSettings;
})();
