<script setup>
import { ref } from 'vue'
import SignupPage from './components/SignupPage.vue'

// Configure your hero image here. Put your image under src/assets and update the file name if needed.
const heroImage = new URL('./assets/home-hero.jpg', import.meta.url).href

// Page routing
const currentPage = ref('home')

const navigateTo = (page) => {
  currentPage.value = page
}
</script>

<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-links">
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
      <!-- Hero Section using <img> (full screen cover) -->
      <section class="hero">
        <div class="hero-stage">
          <img :src="heroImage" alt="hero" class="hero-img" />
          <div class="hero-overlay"></div>

          <div class="hero-content">
            <div class="hero-text">
              <h1 class="main-headline">
                <span>We help mens</span>
                <span>have healthier</span>
                <span>lives</span>
              </h1>
            </div>
            <button class="cta-button">
              Start analyzing your health
              <span class="arrow">→</span>
            </button>
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
      <div class="placeholder-content">
        <h1>{{ currentPage.charAt(0).toUpperCase() + currentPage.slice(1) }} Page</h1>
        <p>This page is under construction.</p>
        <button @click="navigateTo('home')" class="back-btn">Back to Home</button>
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
}

.nav-links { display: flex; gap: 30px; }
.nav-link { text-decoration: none; color: #333; font-weight: 700; font-size: 14px; transition: color 0.3s ease; cursor: pointer; }
.nav-link:hover { color: #667eea; }

.nav-controls { display: flex; align-items: center; gap: 15px; }
.search-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 5px; }
.separator { width: 1px; height: 20px; background: #ddd; }
.login-link { text-decoration: none; color: #333; font-weight: 700; font-size: 14px; cursor: pointer; }
.signup-btn { background: white; border: 1px solid #333; color: #333; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; font-weight: 700; }
.signup-btn:hover { background: #333; color: white; }

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
  max-width: 1200px;
  width: 100%;
  padding: 0 24px;
  text-align: center;
}

.hero-text { margin-bottom: 28px; }

/* Big heading scales with viewport */
.main-headline {
  margin: 0;
  font-weight: 800;
  line-height: 0.95;
  font-size: clamp(40px, 12vw, 140px);
  color: #333;
}
.main-headline span { display: block; }

/* CTA Button */
.cta-button {
  margin-top: clamp(12px, 2vw, 24px);
  background: #333;
  color: white;
  border: none;
  padding: 14px 26px;
  border-radius: 26px;
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.cta-button:hover { background: #555; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.arrow { font-size: 18px; font-weight: bold; }

/* Page Placeholder */
.page-placeholder {
  margin-top: 60px;
  padding: 2rem;
  text-align: center;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.placeholder-content {
  max-width: 600px;
  padding: 2rem;
}

.page-placeholder h1 {
  font-size: clamp(24px, 4vw, 48px);
  margin-bottom: 1rem;
  font-weight: 700;
}

.page-placeholder p {
  font-size: clamp(16px, 2vw, 20px);
  margin-bottom: 2rem;
  opacity: 0.9;
}

.back-btn {
  background: white;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}












</style>
