<script setup>
import { ref, onMounted } from 'vue'
import SignupPage from './components/SignupPage.vue'
import LoginPage from './components/LoginPage.vue'
import UserManagementPage from './components/UserManagementPage.vue'
import SystemSettingsPage from './components/SystemSettingsPage.vue'
import RatingModal from './components/RatingModal.vue'
import { currentUser, isLoggedIn, initAuth, logoutUser, isAdmin } from './utils/auth.js'
import { canAccessPage, isAdminPage } from './utils/roles.js'
import { getAverageRating, getAllRatings, getUserRating } from './utils/ratings.js'

// Configure your hero image here. Put your image under src/assets and update the file name if needed.
const heroImage = new URL('./assets/home-hero.jpg', import.meta.url).href

// Page routing
const currentPage = ref('home')

// Rating modal
const showRatingModal = ref(false)
const userRating = ref(null)
const totalRatings = ref(0)

// Navigation with role-based access control
const navigateTo = (page) => {
  // Check if user can access this page
  if (!canAccessPage(page)) {
    if (!isLoggedIn.value) {
      alert('Please log in to access this page.')
      currentPage.value = 'login'
    } else if (isAdminPage(page)) {
      alert('You need administrator privileges to access this page.')
    } else {
      alert('You do not have permission to access this page.')
    }
    return
  }
  
  currentPage.value = page
}

// Mobile menu toggle and auth initialization
onMounted(() => {
  // Initialize authentication state
  initAuth()
  
  // Initialize rating stats
  updateRatingStats()
  
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

// Logout function
const handleLogout = () => {
  logoutUser()
  navigateTo('home')
}

// Rating functions
const openRatingModal = () => {
  if (!isLoggedIn.value) {
    alert('Please log in first to rate our website')
    navigateTo('login')
    return
  }
  showRatingModal.value = true
}

const closeRatingModal = () => {
  showRatingModal.value = false
  // Refresh rating stats
  updateRatingStats()
}

const updateRatingStats = () => {
  userRating.value = getUserRating()
  totalRatings.value = getAllRatings().length
}
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
          
          <!-- Admin-only links -->
          <template v-if="isAdmin()">
            <div class="nav-separator"></div>
            <a href="#" class="nav-link admin-link" @click.prevent="navigateTo('user-management')">User Management</a>
            <a href="#" class="nav-link admin-link" @click.prevent="navigateTo('system-settings')">System Settings</a>
          </template>
        </div>
        <div class="nav-controls">
          <button class="search-btn">🔍</button>
          <div class="separator"></div>
          
          <!-- Not logged in state -->
          <template v-if="!isLoggedIn">
            <a href="#" class="login-link" @click.prevent="navigateTo('login')">Log In</a>
            <button class="signup-btn" @click="navigateTo('signup')">Sign up</button>
          </template>
          
          <!-- Logged in state -->
          <template v-else>
            <span class="user-welcome">
              Welcome, {{ currentUser.name }}
              <span class="user-role" :class="currentUser.role">{{ currentUser.role.toUpperCase() }}</span>
            </span>
            <button class="logout-btn" @click="handleLogout">Logout</button>
          </template>
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

    <!-- Login Page -->
    <div v-else-if="currentPage === 'login'">
      <LoginPage />
    </div>

    <!-- User Management Page (Admin only) -->
    <div v-else-if="currentPage === 'user-management'">
      <UserManagementPage />
    </div>

    <!-- System Settings Page (Admin only) -->
    <div v-else-if="currentPage === 'system-settings'">
      <SystemSettingsPage />
    </div>

    <!-- About Us Page -->
    <div v-else-if="currentPage === 'about'" class="about-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <!-- Header -->
            <div class="page-header">
              <h1 class="display-4 fw-bold text-white mb-3">About Us</h1>
              <p class="lead text-white-50 mb-4">Learn more about our mission and values</p>
            </div>

            <!-- About Content -->
            <div class="about-content">
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Our Mission</h5>
                      <p class="card-text">
                        We are dedicated to helping men achieve healthier lives through comprehensive 
                        health information, fitness guidance, and nutritional advice. Our platform 
                        provides evidence-based resources to support your wellness journey.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <h5 class="card-title">Our Values</h5>
                      <p class="card-text">
                        We believe in accessibility, authenticity, and community. Every piece of 
                        content is carefully curated to provide practical, actionable advice that 
                        can make a real difference in your daily life.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Rating Section -->
              <div class="rating-section">
                <div class="card">
                  <div class="card-body text-center">
                    <h5 class="card-title">How are we doing?</h5>
                    <p class="card-text">
                      Your feedback helps us improve our platform and better serve our community.
                    </p>
                    
                    <!-- User's Rating (for logged in users who have rated) -->
                    <div v-if="isLoggedIn && userRating" class="rating-stats mb-3">
                      <div class="user-rating">
                        <span class="rating-number">{{ userRating.rating }}</span>
                        <div class="stars-display">
                          <span v-for="star in 5" :key="star" 
                                :class="['star', { 'filled': star <= userRating.rating }]">
                            ★
                          </span>
                        </div>
                        <p class="rating-text">Your Rating</p>
                      </div>
                    </div>
                    
                    <button @click="openRatingModal" class="btn btn-primary btn-lg">
                      {{ !isLoggedIn ? 'Login to Rate' : 
                         userRating ? 'Update Your Rating' : 'Rate Our Website' }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="contact-section">
                <div class="card">
                  <div class="card-body text-center">
                    <h5 class="card-title">Get in Touch</h5>
                    <p class="card-text">
                      Have questions or suggestions? We'd love to hear from you.
                    </p>
                    <div class="contact-info">
                      <p><strong>Email:</strong> contact@menhealth.com</p>
                      <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

    <!-- Rating Modal -->
    <RatingModal v-if="showRatingModal" @close="closeRatingModal" />
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

.nav-separator {
  width: 1px;
  height: 20px;
  background: #ddd;
  margin: 0 15px;
}

.admin-link {
  color: #d32f2f !important;
  font-weight: 600;
}

.admin-link:hover {
  color: #b71c1c !important;
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

.user-welcome {
  color: #333;
  font-weight: 700;
  font-size: 14px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-role {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.user-role.user {
  background: #e3f2fd;
  color: #1976d2;
}

.user-role.admin {
  background: #ffebee;
  color: #d32f2f;
}

.logout-btn {
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

.logout-btn:hover { 
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

/* About Us Page */
.about-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-content {
  margin-top: 2rem;
}

.about-content .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.about-content .card-title {
  color: #2c3e50;
  font-weight: 600;
}

.rating-section {
  margin: 2rem 0;
}

.rating-stats {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.user-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-size: 2rem;
  font-weight: bold;
  color: #f39c12;
}

.stars-display {
  display: flex;
  gap: 2px;
}

.stars-display .star {
  font-size: 1.2rem;
  color: #ddd;
}

.stars-display .star.filled {
  color: #f39c12;
}

.rating-text {
  font-size: 0.9rem;
  color: #7f8c8d;
  margin: 0;
}

.contact-section {
  margin-top: 2rem;
}

.contact-info p {
  margin: 0.5rem 0;
  color: #495057;
}

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
