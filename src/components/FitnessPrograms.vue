<script setup>
import { ref } from 'vue'

// Dynamic data from JavaScript data structure
const fitnessPrograms = ref([
  'Strength Training',
  'Cardio Workouts', 
  'Muscle Building',
  'Weight Loss'
])
</script>

<template>
  <section class="programs">
    <h2>Fitness Programs</h2>
    <div class="programs-list">
      <div v-for="program in fitnessPrograms" :key="program" class="program-item">
        {{ program }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.programs {
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.programs h2 {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
  font-size: 1.8rem;
}

.programs-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.program-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border: 2px solid #e9ecef;
  font-weight: bold;
  color: #495057;
  transition: transform 0.3s ease;
}

.program-item:hover {
  transform: translateY(-3px);
  border-color: #667eea;
  background: #e3f2fd;
}

@media (max-width: 600px) {
  .programs-list {
    grid-template-columns: 1fr;
  }
}
</style>
