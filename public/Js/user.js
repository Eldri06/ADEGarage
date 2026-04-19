const hamburgerMenu = document.getElementById("hamburgerMenu")
const sidebar = document.getElementById("sidebar")
const sidebarOverlay = document.getElementById("sidebarOverlay")

console.log("[v0] Hamburger menu elements:", { hamburgerMenu, sidebar, sidebarOverlay })

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


const sidebarItems = document.querySelectorAll(".sidebar nav ul li[data-section]")
sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      hamburgerMenu.classList.remove("active")
      sidebar.classList.remove("active")
      sidebarOverlay.classList.remove("active")
    }
  })
})


const sections = document.querySelectorAll(".section")

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((i) => i.classList.remove("active"))
    item.classList.add("active")

    const target = item.getAttribute("data-section")
    sections.forEach((sec) => {
      sec.classList.remove("active")
      if (sec.id === target) sec.classList.add("active")
    })
  })
})

const tabs = document.querySelectorAll(".tab")
const orderCards = document.querySelectorAll(".order-card")

console.log("[v0] Found tabs:", tabs.length, "Found order cards:", orderCards.length)

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    console.log("[v0] Tab clicked:", tab.dataset.tab)


    tabs.forEach((t) => t.classList.remove("active"))

    tab.classList.add("active")

    const status = tab.dataset.tab
    console.log("[v0] Filtering orders by status:", status)

    orderCards.forEach((card) => {
      const cardStatus = card.dataset.status
      console.log("[v0] Card status:", cardStatus, "Target status:", status)

      if (cardStatus === status) {
        card.style.display = "block"
        console.log("[v0] Showing card with status:", cardStatus)
      } else {
        card.style.display = "none"
        console.log("[v0] Hiding card with status:", cardStatus)
      }
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM loaded - initializing tabs")


  if (!document.querySelector(".tab.active")) {
    const firstTab = document.querySelector(".tab")
    if (firstTab) {
      firstTab.classList.add("active")
      const status = firstTab.dataset.tab


      orderCards.forEach((card) => {
        if (card.dataset.status === status) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    }
  }
})


const languageSelect = document.querySelector('select[value="en"]')
if (languageSelect) {
  languageSelect.addEventListener("change", (e) => {
    console.log("Language changed to:", e.target.value)

  })
}


const regionSelect = document.querySelector('select[value="us"]')
if (regionSelect) {
  regionSelect.addEventListener("change", (e) => {
    console.log("Region changed to:", e.target.value)

  })
}

const toggleSwitches = document.querySelectorAll(".toggle-switch input")
toggleSwitches.forEach((toggle) => {
  toggle.addEventListener("change", (e) => {
    const setting = e.target.closest(".setting-item").querySelector("label").textContent
    console.log(`${setting} ${e.target.checked ? "enabled" : "disabled"}`)

  })
})


const volumeSlider = document.querySelector(".volume-slider")
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    console.log("Volume set to:", e.target.value + "%")

  })
}


const changePasswordBtn = document.querySelector(".btn.orange")
const downloadDataBtn = document.querySelector(".btn.blue")

if (changePasswordBtn && changePasswordBtn.textContent.includes("Change Password")) {
  changePasswordBtn.addEventListener("click", () => {
    alert("Change Password functionality would be implemented here")
  })
}

if (downloadDataBtn && downloadDataBtn.textContent.includes("Download Data")) {
  downloadDataBtn.addEventListener("click", () => {
    alert("Download Data functionality would be implemented here")
  })
}


const privacySelect = document.querySelector('select option[value="public"]')
if (privacySelect && privacySelect.parentElement) {
  privacySelect.parentElement.addEventListener("change", (e) => {
    console.log("Profile visibility changed to:", e.target.value)

  })
}


const avatarEditBtn = document.getElementById("avatarEditBtn")
const avatarInput = document.getElementById("avatarInput")
const avatarImage = document.getElementById("avatarImage")

console.log("[v0] Avatar elements:", { avatarEditBtn, avatarInput, avatarImage })

if (avatarEditBtn) {
  avatarEditBtn.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("[v0] Avatar edit button clicked")
    avatarInput.click()
  })
}


if (avatarInput) {
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

        avatarImage.style.backgroundImage = `url(${event.target.result})`
        avatarImage.style.backgroundSize = "cover"
        avatarImage.style.backgroundPosition = "center"


        console.log("[v0] Avatar updated successfully")


        avatarImage.style.transform = "scale(1.05)"
        setTimeout(() => {
          avatarImage.style.transform = "scale(1)"
        }, 200)
      }

      reader.onerror = () => {
        console.error("[v0] Error reading file")
        alert("Error reading the selected file. Please try again.")
      }


      reader.readAsDataURL(file)
    }
  })
}


if (avatarImage) {
  avatarImage.addEventListener("click", () => {
    console.log("[v0] Avatar image clicked")
    avatarInput.click()
  })
}
