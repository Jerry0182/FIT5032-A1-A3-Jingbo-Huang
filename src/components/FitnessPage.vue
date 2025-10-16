<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('all')
const selectedWorkout = ref(null)
const workoutProgress = ref({})

const categories = [
  { id: 'all', name: 'All Workouts', icon: '💪' },
  { id: 'strength', name: 'Strength Training', icon: '🏋️' },
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
  { id: 'flexibility', name: 'Flexibility', icon: '🧘' },
  { id: 'sports', name: 'Sports', icon: '⚽' }
]

const workouts = [
  {
    id: 1,
    title: 'Upper Body Strength',
    category: 'strength',
    duration: '45 minutes',
    difficulty: 'Intermediate',
    equipment: ['Dumbbells', 'Bench'],
    description: 'Comprehensive upper body workout focusing on chest, back, shoulders, and arms.',
    exercises: [
      { name: 'Push-ups', sets: '3 x 12', rest: '60s' },
      { name: 'Dumbbell Press', sets: '3 x 10', rest: '90s' },
      { name: 'Pull-ups', sets: '3 x 8', rest: '90s' },
      { name: 'Shoulder Press', sets: '3 x 10', rest: '60s' },
      { name: 'Bicep Curls', sets: '3 x 12', rest: '45s' }
    ],
    benefits: ['Increased muscle mass', 'Better posture', 'Enhanced strength'],
    calories: 350
  },
  {
    id: 2,
    title: 'HIIT Cardio Blast',
    category: 'cardio',
    duration: '30 minutes',
    difficulty: 'Advanced',
    equipment: ['Timer'],
    description: 'High-intensity interval training for maximum fat burning and cardiovascular improvement.',
    exercises: [
      { name: 'Burpees', sets: '4 x 30s', rest: '30s' },
      { name: 'Jump Squats', sets: '4 x 30s', rest: '30s' },
      { name: 'Mountain Climbers', sets: '4 x 30s', rest: '30s' },
      { name: 'High Knees', sets: '4 x 30s', rest: '30s' },
      { name: 'Jumping Jacks', sets: '4 x 30s', rest: '30s' }
    ],
    benefits: ['Fat burning', 'Improved endurance', 'Time efficient'],
    calories: 400
  },
  {
    id: 3,
    title: 'Morning Yoga Flow',
    category: 'flexibility',
    duration: '25 minutes',
    difficulty: 'Beginner',
    equipment: ['Yoga Mat'],
    description: 'Gentle yoga sequence to start your day with energy and flexibility.',
    exercises: [
      { name: 'Sun Salutation A', sets: '5 rounds', rest: '10s' },
      { name: 'Downward Dog', sets: 'Hold 1min', rest: '30s' },
      { name: 'Warrior I', sets: 'Hold 45s each', rest: '30s' },
      { name: 'Tree Pose', sets: 'Hold 30s each', rest: '30s' },
      { name: 'Child\'s Pose', sets: 'Hold 2min', rest: '0s' }
    ],
    benefits: ['Improved flexibility', 'Stress relief', 'Better balance'],
    calories: 120
  },
  {
    id: 4,
    title: 'Lower Body Power',
    category: 'strength',
    duration: '50 minutes',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Plates'],
    description: 'Build explosive power and strength in your lower body.',
    exercises: [
      { name: 'Squats', sets: '4 x 8', rest: '2min' },
      { name: 'Deadlifts', sets: '4 x 6', rest: '2min' },
      { name: 'Lunges', sets: '3 x 12 each', rest: '90s' },
      { name: 'Calf Raises', sets: '4 x 15', rest: '60s' },
      { name: 'Leg Press', sets: '3 x 12', rest: '90s' }
    ],
    benefits: ['Increased leg strength', 'Better athletic performance', 'Improved stability'],
    calories: 450
  },
  {
    id: 5,
    title: 'Swimming Workout',
    category: 'sports',
    duration: '60 minutes',
    difficulty: 'Intermediate',
    equipment: ['Pool', 'Goggles'],
    description: 'Full-body swimming workout for endurance and strength.',
    exercises: [
      { name: 'Freestyle Warm-up', sets: '10 laps', rest: '2min' },
      { name: 'Backstroke', sets: '8 laps', rest: '90s' },
      { name: 'Breaststroke', sets: '6 laps', rest: '90s' },
      { name: 'Butterfly', sets: '4 laps', rest: '2min' },
      { name: 'Cool-down', sets: '5 laps easy', rest: '0s' }
    ],
    benefits: ['Low impact', 'Full body workout', 'Improved lung capacity'],
    calories: 500
  },
  {
    id: 6,
    title: 'Core Stability',
    category: 'strength',
    duration: '35 minutes',
    difficulty: 'Beginner',
    equipment: ['Mat'],
    description: 'Strengthen your core with targeted exercises for better stability.',
    exercises: [
      { name: 'Plank', sets: '3 x 45s', rest: '60s' },
      { name: 'Russian Twists', sets: '3 x 20 each', rest: '45s' },
      { name: 'Leg Raises', sets: '3 x 15', rest: '60s' },
      { name: 'Mountain Climbers', sets: '3 x 30s', rest: '45s' },
      { name: 'Dead Bug', sets: '3 x 10 each', rest: '30s' }
    ],
    benefits: ['Stronger core', 'Better posture', 'Reduced back pain'],
    calories: 200
  }
]

const filteredWorkouts = computed(() => {
  if (selectedCategory.value === 'all') {
    return workouts
  }
  return workouts.filter(workout => workout.category === selectedCategory.value)
})

const startWorkout = (workout) => {
  selectedWorkout.value = workout
  workoutProgress.value[workout.id] = {
    started: true,
    currentExercise: 0,
    startTime: new Date()
  }
}

const completeExercise = (workoutId, exerciseIndex) => {
  if (!workoutProgress.value[workoutId]) {
    workoutProgress.value[workoutId] = { started: true, currentExercise: 0 }
  }
  workoutProgress.value[workoutId].currentExercise = exerciseIndex + 1
}

const finishWorkout = (workoutId) => {
  if (workoutProgress.value[workoutId]) {
    workoutProgress.value[workoutId].completed = true
    workoutProgress.value[workoutId].endTime = new Date()
  }
  selectedWorkout.value = null
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': '#28a745',
    'Intermediate': '#ffc107',
    'Advanced': '#dc3545'
  }
  return colors[difficulty] || '#6c757d'
}

const getWorkoutProgress = (workoutId) => {
  const progress = workoutProgress.value[workoutId]
  if (!progress || !progress.started) return 0
  
  const totalExercises = workouts.find(w => w.id === workoutId)?.exercises.length || 1
  return Math.round((progress.currentExercise / totalExercises) * 100)
}
</script>

<template>
  <div class="fitness-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">Fitness & Exercise</h1>
            <p class="lead text-white-50 mb-4">Transform your body with our comprehensive workout programs</p>
          </div>

          <!-- Category Filter -->
          <div class="category-filter">
            <div class="filter-buttons">
              <button 
                v-for="category in categories" 
                :key="category.id"
                :class="['filter-btn', { active: selectedCategory === category.id }]"
                @click="selectedCategory = category.id"
              >
                <span class="filter-icon">{{ category.icon }}</span>
                <span class="filter-text">{{ category.name }}</span>
              </button>
            </div>
          </div>

          <!-- Workout Grid -->
          <div v-if="!selectedWorkout" class="workouts-grid">
            <div class="row">
              <div 
                v-for="workout in filteredWorkouts" 
                :key="workout.id"
                class="col-md-6 col-lg-4 mb-4"
              >
                <div class="workout-card">
                  <div class="workout-header">
                    <div class="workout-category">{{ categories.find(c => c.id === workout.category)?.name }}</div>
                    <div class="workout-difficulty" :style="{ backgroundColor: getDifficultyColor(workout.difficulty) }">
                      {{ workout.difficulty }}
                    </div>
                  </div>
                  
                  <div class="workout-content">
                    <h5 class="workout-title">{{ workout.title }}</h5>
                    <div class="workout-meta">
                      <span class="meta-item">⏱️ {{ workout.duration }}</span>
                      <span class="meta-item">🔥 {{ workout.calories }} cal</span>
                    </div>
                    <p class="workout-description">{{ workout.description }}</p>
                    
                    <div class="equipment-list">
                      <span class="equipment-label">Equipment:</span>
                      <span class="equipment-items">{{ workout.equipment.join(', ') }}</span>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div v-if="workoutProgress[workout.id]" class="workout-progress">
                      <div class="progress">
                        <div 
                          class="progress-bar" 
                          :style="{ width: getWorkoutProgress(workout.id) + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">{{ getWorkoutProgress(workout.id) }}% Complete</span>
                    </div>
                  </div>
                  
                  <div class="workout-footer">
                    <button 
                      class="start-btn"
                      :disabled="workoutProgress[workout.id]?.completed"
                      @click="startWorkout(workout)"
                    >
                      {{ workoutProgress[workout.id]?.completed ? 'Completed' : 
                         workoutProgress[workout.id]?.started ? 'Continue' : 'Start Workout' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Workout Detail View -->
          <div v-else class="workout-detail">
            <div class="workout-header-detail">
              <button class="back-btn" @click="selectedWorkout = null">
                ← Back to Workouts
              </button>
              <h2 class="workout-title-detail">{{ selectedWorkout.title }}</h2>
              <div class="workout-info">
                <span class="info-badge">{{ selectedWorkout.duration }}</span>
                <span class="info-badge">{{ selectedWorkout.difficulty }}</span>
                <span class="info-badge">{{ selectedWorkout.calories }} calories</span>
              </div>
            </div>

            <div class="workout-content-detail">
              <div class="row">
                <div class="col-lg-8">
                  <!-- Exercises List -->
                  <div class="exercises-section">
                    <h4>Exercises</h4>
                    <div class="exercises-list">
                      <div 
                        v-for="(exercise, index) in selectedWorkout.exercises" 
                        :key="index"
                        class="exercise-item"
                        :class="{ completed: index < (workoutProgress[selectedWorkout.id]?.currentExercise || 0) }"
                      >
                        <div class="exercise-number">{{ index + 1 }}</div>
                        <div class="exercise-content">
                          <h6 class="exercise-name">{{ exercise.name }}</h6>
                          <div class="exercise-details">
                            <span class="exercise-sets">{{ exercise.sets }}</span>
                            <span class="exercise-rest">Rest: {{ exercise.rest }}</span>
                          </div>
                        </div>
                        <div class="exercise-actions">
                          <button 
                            class="complete-btn"
                            :disabled="index >= (workoutProgress[selectedWorkout.id]?.currentExercise || 0)"
                            @click="completeExercise(selectedWorkout.id, index)"
                          >
                            {{ index < (workoutProgress[selectedWorkout.id]?.currentExercise || 0) ? '✓' : 'Complete' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="col-lg-4">
                  <!-- Workout Info Sidebar -->
                  <div class="workout-sidebar">
                    <div class="sidebar-section">
                      <h5>Benefits</h5>
                      <ul class="benefits-list">
                        <li v-for="benefit in selectedWorkout.benefits" :key="benefit">
                          {{ benefit }}
                        </li>
                      </ul>
                    </div>
                    
                    <div class="sidebar-section">
                      <h5>Equipment Needed</h5>
                      <ul class="equipment-list-sidebar">
                        <li v-for="item in selectedWorkout.equipment" :key="item">
                          {{ item }}
                        </li>
                      </ul>
                    </div>
                    
                    <div class="sidebar-section">
                      <h5>Workout Progress</h5>
                      <div class="progress-circle">
                        <div class="progress-percentage">
                          {{ getWorkoutProgress(selectedWorkout.id) }}%
                        </div>
                        <div class="progress-label">Complete</div>
                      </div>
                    </div>
                    
                    <div class="sidebar-actions">
                      <button 
                        class="finish-btn"
                        @click="finishWorkout(selectedWorkout.id)"
                      >
                        Finish Workout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fitness Tips -->
          <div class="fitness-tips">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">💡 Fitness Tips</h5>
                <div class="tips-grid">
                  <div class="tip-item">
                    <strong>Consistency:</strong> Work out 3-4 times per week for best results
                  </div>
                  <div class="tip-item">
                    <strong>Progression:</strong> Gradually increase weight or reps over time
                  </div>
                  <div class="tip-item">
                    <strong>Recovery:</strong> Allow 48 hours between strength training sessions
                  </div>
                  <div class="tip-item">
                    <strong>Form:</strong> Focus on proper technique over heavy weights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fitness-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.category-filter {
  margin-bottom: 2rem;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid transparent;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.filter-btn.active {
  background: white;
  color: #2c3e50;
  border-color: white;
}

.filter-icon {
  font-size: 1.2rem;
}

.workouts-grid {
  margin-bottom: 2rem;
}

.workout-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.workout-card:hover {
  transform: translateY(-5px);
}

.workout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

.workout-category {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.workout-difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.workout-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.workout-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.workout-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.workout-description {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.equipment-list {
  margin-bottom: 1rem;
}

.equipment-label {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
}

.equipment-items {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.workout-progress {
  margin-bottom: 1rem;
}

.progress {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: #28a745;
  font-weight: 500;
}

.workout-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.start-btn {
  width: 100%;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-btn:hover:not(:disabled) {
  background: #34495e;
}

.start-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

/* Workout Detail Styles */
.workout-detail {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.workout-header-detail {
  padding: 2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.back-btn {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #34495e;
}

.workout-title-detail {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.workout-info {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.info-badge {
  background: #2c3e50;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.workout-content-detail {
  padding: 2rem;
}

.exercises-section h4 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exercise-item {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.exercise-item.completed {
  background: #d4edda;
  border-left: 4px solid #28a745;
}

.exercise-number {
  background: #2c3e50;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
  flex-shrink: 0;
}

.exercise-item.completed .exercise-number {
  background: #28a745;
}

.exercise-content {
  flex-grow: 1;
}

.exercise-name {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.exercise-details {
  display: flex;
  gap: 1rem;
}

.exercise-sets,
.exercise-rest {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.complete-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.complete-btn:hover:not(:disabled) {
  background: #218838;
}

.complete-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.workout-sidebar {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.benefits-list,
.equipment-list-sidebar {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefits-list li,
.equipment-list-sidebar li {
  padding: 0.5rem 0;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
}

.benefits-list li:last-child,
.equipment-list-sidebar li:last-child {
  border-bottom: none;
}

.progress-circle {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 2px solid #2c3e50;
}

.progress-percentage {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.progress-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.finish-btn {
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.finish-btn:hover {
  background: #218838;
}

.fitness-tips {
  margin-top: 2rem;
}

.fitness-tips .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fitness-tips .card-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.tip-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #2c3e50;
}

.tip-item strong {
  color: #2c3e50;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .fitness-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .workout-header-detail,
  .workout-content-detail {
    padding: 1.5rem;
  }
  
  .exercise-item {
    flex-direction: column;
    text-align: center;
  }
  
  .exercise-number {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .exercise-details {
    justify-content: center;
  }
  
  .workout-info {
    justify-content: center;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
