<script setup>
import { ref, onMounted } from 'vue'
import SignupPage from './components/SignupPage.vue'

// Configure your hero image here. Put your image under src/assets and update the file name if needed.
const heroImage = new URL('./assets/home-hero.jpg', import.meta.url).href

// Page routing
const currentPage = ref('home')

const navigateTo = (page) => {
  currentPage.value = page
}

// Mobile menu toggle
onMounted(() => {
  const toggler = document.querySelector('.navbar-toggler')
  const navLinks = document.querySelector('.nav-links')
  
  if (toggler && navLinks) {
    toggler.addEventListener('click', () => {
      navLinks.classList.toggle('show')
    })
    
    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('.nav-link')
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show')
      })
    })
  }
})
</script>

<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <!-- Mobile Toggle Button -->
        <button 
          class="navbar-toggler" 
          type="button" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navigation Links -->
        <div class="nav-links" id="navbarNav">
          <a href="#" class="nav-link" @click.prevent="navigateTo('home')">Home</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('health-info')">Health Info</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('health-assessment')">Health Assessment</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('fitness')">Fitness & Exercise</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('nutrition')">Nutrition & Diet</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('community')">Community & Story</a>
          <a href="#" class="nav-link" @click.prevent="navigateTo('about')">About Us</a>
        </div>
        <div class="nav-controls">
          <button class="search-btn">🔍</button>
          <div class="separator"></div>
          <a href="#" class="login-link" @click.prevent="navigateTo('login')">Log In</a>
          <button class="signup-btn" @click="navigateTo('signup')">Sign up</button>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <div v-if="currentPage === 'home'">
      <!-- Hero Section using Bootstrap responsive classes -->
      <section class="hero">
        <div class="hero-stage">
          <img :src="heroImage" alt="hero" class="hero-img" />
          <div class="hero-overlay"></div>

          <div class="hero-content">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-12 col-md-10 col-lg-8 text-center">
                  <div class="hero-text mb-4">
                    <h1 class="display-1 fw-bold text-dark">
                      <span class="d-block">We help mens</span>
                      <span class="d-block">have healthier</span>
                      <span class="d-block">lives</span>
                    </h1>
                  </div>
                  <button class="btn btn-dark btn-lg px-4 py-3 rounded-pill">
                    Start analyzing your health
                    <span class="ms-2">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Signup Page -->
    <div v-else-if="currentPage === 'signup'">
      <SignupPage />
    </div>

    <!-- Other pages placeholder -->
    <div v-else class="page-placeholder">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 text-center">
            <h1 class="display-4 fw-bold text-white mb-3">
              {{ currentPage.charAt(0).toUpperCase() + currentPage.slice(1) }} Page
            </h1>
            <p class="lead text-white-50 mb-4">This page is under construction.</p>
            <button @click="navigateTo('home')" class="btn btn-light btn-lg">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base styles */
.app {
  font-family: 'Arial', sans-serif;
  min-height: 100vh;
}

/* Navigation Bar */
.navbar {
  background: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-links { 
  display: flex; 
  gap: 30px; 
}

.nav-link { 
  text-decoration: none; 
  color: #333; 
  font-weight: 700; 
  font-size: 14px; 
  transition: color 0.3s ease; 
  cursor: pointer; 
}

.nav-link:hover { 
  color: #667eea; 
}

.nav-controls { 
  display: flex; 
  align-items: center; 
  gap: 15px; 
}

.search-btn { 
  background: none; 
  border: none; 
  font-size: 16px; 
  cursor: pointer; 
  padding: 5px; 
}

.separator { 
  width: 1px; 
  height: 20px; 
  background: #ddd; 
}

.login-link { 
  text-decoration: none; 
  color: #333; 
  font-weight: 700; 
  font-size: 14px; 
  cursor: pointer; 
}

.signup-btn { 
  background: white; 
  border: 1px solid #333; 
  color: #333; 
  padding: 8px 16px; 
  border-radius: 4px; 
  font-size: 14px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  font-weight: 700; 
}

.signup-btn:hover { 
  background: #333; 
  color: white; 
}

/* Mobile Toggle Button */
.navbar-toggler {
  display: none;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.navbar-toggler-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: #333;
  position: relative;
  transition: all 0.3s ease;
}

.navbar-toggler-icon::before,
.navbar-toggler-icon::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: #333;
  transition: all 0.3s ease;
}

.navbar-toggler-icon::before {
  top: -6px;
}

.navbar-toggler-icon::after {
  bottom: -6px;
}

/* Hero Section */
.hero { 
  margin-top: 60px; /* Match navbar height */
}

/* Stage fills viewport height and covers with image */
.hero-stage {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px); /* full screen minus navbar */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Image fills entire stage and covers */
.hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;         /* fill and crop as needed */
  object-position: center;   /* center focus */
}

/* Light overlay for readability */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0.32) 100%);
}

/* Content container */
.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-text { margin-bottom: 28px; }

/* Page Placeholder */
.page-placeholder {
  margin-top: 60px;
  padding: 4rem 0;
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .navbar-toggler {
    display: block;
  }
  
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    gap: 15px;
  }
  
  .nav-links.show {
    display: flex;
  }
  
  .nav-controls {
    gap: 10px;
  }
  
  .search-btn {
    font-size: 14px;
  }
  
  .login-link,
  .signup-btn {
    font-size: 12px;
  }
  
  .signup-btn {
    padding: 6px 12px;
  }
  
  .hero-stage {
    height: calc(100vh - 66px);
  }
  
  .hero {
    margin-top: 66px;
  }
  
  .page-placeholder {
    margin-top: 66px;
    padding: 2rem 0;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .hero-stage {
    height: calc(100vh - 72px);
  }
  
  .hero {
    margin-top: 72px;
  }
  
  .page-placeholder {
    margin-top: 72px;
  }
}
</style>
