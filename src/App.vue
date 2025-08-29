<script setup>
// Configure your hero image here. Put your image under src/assets and update the file name if needed.
const heroImage = new URL('./assets/home-hero.jpg', import.meta.url).href
</script>

<template>
  <div class="app">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-links">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link">Health Info</a>
          <a href="#" class="nav-link">Health Assessment</a>
          <a href="#" class="nav-link">Fitness & Exercise</a>
          <a href="#" class="nav-link">Nutrition & Diet</a>
          <a href="#" class="nav-link">Community & Story</a>
          <a href="#" class="nav-link">About Us</a>
        </div>
        <div class="nav-controls">
          <button class="search-btn">🔍</button>
          <div class="separator"></div>
          <a href="#" class="login-link">Log In</a>
          <button class="signup-btn">Sign up</button>
        </div>
      </div>
    </nav>

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
.nav-link { text-decoration: none; color: #333; font-weight: 500; font-size: 14px; transition: color 0.3s ease; }
.nav-link:hover { color: #667eea; }

.nav-controls { display: flex; align-items: center; gap: 15px; }
.search-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 5px; }
.separator { width: 1px; height: 20px; background: #ddd; }
.login-link { text-decoration: none; color: #333; font-weight: 500; font-size: 14px; }
.signup-btn { background: white; border: 1px solid #333; color: #333; padding: 8px 16px; border-radius: 4px; font-size: 14px; cursor: pointer; transition: all 0.3s ease; }
.signup-btn:hover { background: #333; color: white; }

/* Hero Section */
.hero { margin-top: 60px; }

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
  text-align: left;
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

/* Responsive tweaks */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-controls { gap: 10px; }
  .hero-content { text-align: center; }
}

@media (max-width: 480px) {
  .nav-container { padding: 0 15px; }
}
</style>
