<script setup>
import FitnessPrograms from './components/FitnessPrograms.vue'
import FitnessForm from './components/FitnessForm.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Men's Fitness Center</h1>
      <p>Transform Your Body, Transform Your Life</p>
    </header>

    <main>
      <!-- Dynamic data display component -->
      <FitnessPrograms />
      
      <!-- Form component -->
      <FitnessForm />
    </main>
  </div>
</template>

<style scoped>
/* Responsive design */
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  color: white;
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
}

header p {
  margin: 10px 0 0 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Responsive design */
@media (max-width: 600px) {
  .app {
    padding: 15px;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  header p {
    font-size: 1rem;
  }
}
</style>
