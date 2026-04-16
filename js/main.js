// Main JavaScript for SDG7 Energy Portal

// Check if the user is logged in
function checkAuth() {
  const isLoggedIn = localStorage.getItem("sdg7_logged_in");
  return isLoggedIn === "true";
}

// Log out the user
function logoutUser() {
  localStorage.removeItem("sdg7_logged_in");
  localStorage.removeItem("sdg7_user");
  window.location.href = "login.html";
}

// Smooth scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Toggle mobile navigation - Enhanced version
function toggleMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navOverlay = document.querySelector(".nav-overlay");

  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");

  if (navOverlay) {
    navOverlay.classList.toggle("active");
  }

  document.body.classList.toggle("no-scroll");
}

// On page load
document.addEventListener("DOMContentLoaded", function () {
  // Set up logout buttons
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logoutUser();
    });
  }

  // Redirect if not authenticated
  const isDashboard = window.location.pathname.includes("dashboard");
  if (isDashboard && !checkAuth()) {
    window.location.href = "login.html";
  }

  // Set user name if logged in
  if (checkAuth()) {
    const userName = localStorage.getItem("sdg7_user");
    const userNameElement = document.getElementById("user-name");
    if (userNameElement && userName) {
      userNameElement.textContent = userName;
    }
  }

  // Mobile menu setup - Enhanced version
  // Hamburger menu toggle
  const hamburger = document.querySelector(".hamburger");
  if (hamburger) {
    hamburger.addEventListener("click", toggleMobileNav);
  }

  // Maintain legacy support for old mobile toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-toggle");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileNav);
  }

  // Overlay click to close menu
  const navOverlay = document.querySelector(".nav-overlay");
  if (navOverlay) {
    navOverlay.addEventListener("click", toggleMobileNav);
  }

  // Menu items click handling and active state
  const menuLinks = document.querySelectorAll(".nav-links a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Remove active class from all links
      menuLinks.forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to clicked link
      this.classList.add("active");

      // If on mobile, close the menu
      if (window.innerWidth <= 768) {
        toggleMobileNav();
      }

      // If it's an anchor link on the same page, smooth scroll
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        scrollToSection(targetId);
      }
    });
  });

  // Add active class based on scroll position
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;

    document.querySelectorAll("section[id]").forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        menuLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            // Remove active class from all links
            menuLinks.forEach((item) => {
              item.classList.remove("active");
            });

            // Add active class to current section link
            link.classList.add("active");
          }
        });
      }
    });

    // Home link should be active when at the top
    if (scrollPosition < 100) {
      menuLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "index.html") {
          link.classList.add("active");
        }
      });
    }
  });

  // Initialize the flag object to be found by participants during the hackathon
  window.FLAG = {
    secret_token: "SDG7_ENERGY_ACCESS_FLAG_2025",
    found_by: null,
    timestamp: null,
  };

  // Easter egg function that can be triggered via console to reveal a flag
  window.findSecretFlag = function () {
    if (window.FLAG.found_by === null) {
      window.FLAG.found_by =
        localStorage.getItem("sdg7_user") || "Anonymous Hacker";
      window.FLAG.timestamp = new Date().toISOString();
      console.log("Congratulations! You found the flag:");
      console.log(window.FLAG);
      return "FLAG: " + window.FLAG.secret_token;
    } else {
      console.log("Flag has already been found by: " + window.FLAG.found_by);
      return "Flag already claimed!";
    }
  };
});
