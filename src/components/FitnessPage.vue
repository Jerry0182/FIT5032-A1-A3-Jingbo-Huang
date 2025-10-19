<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  getFitnessProgress, 
  startWorkout, 
  completeExercise, 
  finishWorkout, 
  calculateWorkoutProgress 
} from '../utils/fitnessStorage.js'

const selectedCategory = ref('all')
const selectedWorkout = ref(null)
const workoutProgress = ref({})

// Map-related states
const showGymMap = ref(false)
const melbourneGyms = ref([])

// Fitness History Modal States
const showHistoryModal = ref(false)
const fitnessHistory = ref([])
const fitnessStats = ref({
  totalWorkouts: 0,
  completedWorkouts: 0,
  totalExercises: 0,
  completedExercises: 0
})

// Interactive Table States
const globalSearch = ref('')
const sortField = ref('date')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10

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

const startWorkoutHandler = (workout) => {
  selectedWorkout.value = workout
  startWorkout(workout.id)
  loadWorkoutProgress()
}

const completeExerciseHandler = async (workoutId, exerciseIndex) => {
  await completeExercise(workoutId, exerciseIndex)
  loadWorkoutProgress()
}

const finishWorkoutHandler = async (workoutId) => {
  await finishWorkout(workoutId)
  selectedWorkout.value = null
  loadWorkoutProgress()
}

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': '#28a745',
    'Intermediate': '#ffc107',
    'Advanced': '#dc3545'
  }
  return colors[difficulty] || '#6c757d'
}

const loadWorkoutProgress = () => {
  workoutProgress.value = getFitnessProgress()
}

const getWorkoutProgress = (workoutId) => {
  const totalExercises = workouts.find(w => w.id === workoutId)?.exercises.length || 1
  return calculateWorkoutProgress(workoutId, totalExercises)
}

const isExerciseCompleted = (workoutId, exerciseIndex) => {
  const progress = workoutProgress.value[workoutId]
  return progress && progress.completedExercises && progress.completedExercises.includes(exerciseIndex)
}

const getCompletedExerciseCount = (workoutId) => {
  const progress = workoutProgress.value[workoutId]
  return progress && progress.completedExercises ? progress.completedExercises.length : 0
}

const getButtonText = (workoutId) => {
  const progress = getWorkoutProgress(workoutId)
  const isStarted = workoutProgress.value[workoutId]?.started
  
  if (progress === 100) {
    return 'Completed'
  } else if (isStarted) {
    return 'Continue'
  } else {
    return 'Start Workout'
  }
}

// Fitness History Methods
const loadFitnessHistory = () => {
  const allProgress = getFitnessProgress()
  const history = []
  
  Object.keys(allProgress).forEach(workoutId => {
    const progress = allProgress[workoutId]
    const workout = workouts.find(w => w.id == workoutId)
    
    if (workout && progress.started) {
      history.push({
        id: workoutId,
        name: workout.title,
        category: workout.category,
        date: progress.startTime,
        endDate: progress.endTime,
        totalExercises: workout.exercises.length,
        completedExercises: progress.completedExercises ? progress.completedExercises.length : 0,
        progress: Math.round(((progress.completedExercises ? progress.completedExercises.length : 0) / workout.exercises.length) * 100),
        status: progress.completed ? 'Completed' : 'In Progress',
        duration: progress.startTime && progress.endTime ? 
          Math.round((new Date(progress.endTime) - new Date(progress.startTime)) / (1000 * 60)) : null
      })
    }
  })
  
  fitnessHistory.value = history.sort((a, b) => new Date(b.date) - new Date(a.date))
  
  // Calculate stats
  fitnessStats.value = {
    totalWorkouts: history.length,
    completedWorkouts: history.filter(h => h.status === 'Completed').length,
    totalExercises: history.reduce((sum, h) => sum + h.totalExercises, 0),
    completedExercises: history.reduce((sum, h) => sum + h.completedExercises, 0)
  }
}

const openHistoryModal = () => {
  loadFitnessHistory()
  showHistoryModal.value = true
}

const closeHistoryModal = () => {
  showHistoryModal.value = false
}

// Melbourne CBD Gyms Data
const melbourneCBDGyms = [
  {
    id: 'gym_1',
    name: 'Fitness First Collins Street',
    address: 'Level 3, 333 Collins Street, Melbourne VIC 3000',
    rating: 4.2,
    openNow: true,
    lat: -37.8175,
    lng: 144.9671,
    description: 'Premium gym with state-of-the-art equipment and group classes'
  },
  {
    id: 'gym_2', 
    name: 'Anytime Fitness Bourke Street',
    address: '240 Bourke Street, Melbourne VIC 3000',
    rating: 4.0,
    openNow: true,
    lat: -37.8136,
    lng: 144.9631,
    description: '24/7 access gym with personal training services'
  },
  {
    id: 'gym_3',
    name: 'Virgin Active Melbourne Central',
    address: 'Melbourne Central, Level 4, 211 La Trobe Street, Melbourne VIC 3000',
    rating: 4.5,
    openNow: true,
    lat: -37.8103,
    lng: 144.9631,
    description: 'Luxury fitness club with swimming pool and spa facilities'
  },
  {
    id: 'gym_4',
    name: 'Goodlife Health Clubs Queen Street',
    address: 'Level 1, 123 Queen Street, Melbourne VIC 3000',
    rating: 4.1,
    openNow: true,
    lat: -37.8179,
    lng: 144.9631,
    description: 'Full-service gym with group fitness classes and personal training'
  },
  {
    id: 'gym_5',
    name: 'Jetts Fitness Flinders Street',
    address: 'Ground Floor, 1 Flinders Street, Melbourne VIC 3000',
    rating: 3.9,
    openNow: true,
    lat: -37.8183,
    lng: 144.9671,
    description: 'Affordable 24/7 gym with modern equipment and friendly staff'
  }
]

// Map-related functions
const openGymMap = () => {
  showGymMap.value = true
  melbourneGyms.value = melbourneCBDGyms
}

const closeGymMap = () => {
  showGymMap.value = false
  melbourneGyms.value = []
}

const goToGym = (gym) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${gym.lat},${gym.lng}`
  window.open(url, '_blank')
}

// Interactive Table Methods
const filteredHistory = computed(() => {
  let filtered = [...fitnessHistory.value]

  // Global search
  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    filtered = filtered.filter(workout =>
      workout.name.toLowerCase().includes(searchTerm) ||
      workout.category.toLowerCase().includes(searchTerm) ||
      workout.status.toLowerCase().includes(searchTerm) ||
      workout.progress.toString().includes(searchTerm) ||
      formatDate(workout.date).toLowerCase().includes(searchTerm)
    )
  }

  // Sort
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]

      if (sortField.value === 'date' || sortField.value === 'endDate') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (sortDirection.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredHistory.value.length / itemsPerPage)
)

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredHistory.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredHistory.value.length))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  currentPage.value = 1
}

const getSortIcon = (field) => {
  if (sortField.value !== field) return '↕'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const handleGlobalSearch = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

const getStatusBadgeClass = (status) => {
  return status === 'Completed' ? 'bg-success' : 'bg-warning'
}

const getProgressClass = (progress) => {
  if (progress >= 80) return 'text-success'
  if (progress >= 50) return 'text-warning'
  return 'text-danger'
}

// Load progress on component mount
onMounted(() => {
  loadWorkoutProgress()
})
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
            <div class="d-flex gap-3">
              <button class="btn btn-primary btn-lg" @click="openHistoryModal">
                📊 View Workout History
              </button>
              <button class="btn btn-success btn-lg" @click="openGymMap">
                🏋️ Explore Gyms
              </button>
            </div>
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
                      :disabled="getWorkoutProgress(workout.id) === 100"
                      @click="startWorkoutHandler(workout)"
                    >
                      {{ getButtonText(workout.id) }}
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
                        :class="{ completed: isExerciseCompleted(selectedWorkout.id, index) }"
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
                            :class="{ 'completed': isExerciseCompleted(selectedWorkout.id, index) }"
                            @click="completeExerciseHandler(selectedWorkout.id, index)"
                          >
                            {{ isExerciseCompleted(selectedWorkout.id, index) ? '✓ Completed' : 'Complete' }}
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
                        :disabled="getCompletedExerciseCount(selectedWorkout.id) === 0"
                        @click="finishWorkoutHandler(selectedWorkout.id)"
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

    <!-- Fitness History Modal -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="closeHistoryModal">
      <div class="modal-content history-modal" @click.stop>
        <div class="modal-header">
          <h3>📊 Workout History</h3>
          <button class="close-btn" @click="closeHistoryModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Statistics Cards -->
          <div class="stats-section mb-4">
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">💪</div>
                  <div class="stat-content">
                    <div class="stat-number">{{ fitnessStats.totalWorkouts }}</div>
                    <div class="stat-label">Total Workouts</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">✅</div>
                  <div class="stat-content">
                    <div class="stat-number">{{ fitnessStats.completedWorkouts }}</div>
                    <div class="stat-label">Completed</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">🏃</div>
                  <div class="stat-content">
                    <div class="stat-number">{{ fitnessStats.totalExercises }}</div>
                    <div class="stat-label">Total Exercises</div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="stat-card">
                  <div class="stat-icon">🎯</div>
                  <div class="stat-content">
                    <div class="stat-number">{{ fitnessStats.completedExercises }}</div>
                    <div class="stat-label">Completed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Controls -->
          <div class="table-controls mb-3">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="global-search">
                  <input 
                    type="text" 
                    v-model="globalSearch" 
                    placeholder="Search by keywords (name, category, status, progress)..."
                    class="form-control"
                    @input="handleGlobalSearch"
                  >
                </div>
              </div>
              <div class="col-md-6 text-end">
                <span class="results-info">
                  Showing {{ startIndex }}-{{ endIndex }} of {{ filteredHistory.length }} workouts
                </span>
              </div>
            </div>
          </div>

          <!-- History Table -->
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th @click="sortBy('date')" class="sortable table-header-cell">
                    <span class="header-content">
                      Date
                      <span class="sort-icon">{{ getSortIcon('date') }}</span>
                    </span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Workout</span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Category</span>
                  </th>
                  <th @click="sortBy('progress')" class="sortable table-header-cell">
                    <span class="header-content">
                      Progress
                      <span class="sort-icon">{{ getSortIcon('progress') }}</span>
                    </span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Status</span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Duration</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="workout in paginatedHistory" :key="workout.id">
                  <td class="text-center">{{ formatDate(workout.date) }}</td>
                  <td class="text-center">
                    <span class="badge bg-primary">{{ workout.name }}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-secondary">{{ getCategoryName(workout.category) }}</span>
                  </td>
                  <td class="text-center">
                    <span class="progress-value" :class="getProgressClass(workout.progress)">
                      {{ workout.progress }}%
                    </span>
                    <div class="progress-detail">
                      {{ workout.completedExercises }}/{{ workout.totalExercises }} exercises
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge" :class="getStatusBadgeClass(workout.status)">
                      {{ workout.status }}
                    </span>
                  </td>
                  <td class="text-center">
                    {{ workout.duration ? workout.duration + ' min' : 'N/A' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-section">
            <nav aria-label="Workout history pagination">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    Previous
                  </button>
                </li>
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button 
                    v-if="page !== '...'" 
                    class="page-link" 
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="page-link disabled">...</span>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <!-- Empty State -->
          <div v-if="filteredHistory.length === 0" class="empty-state text-center py-5">
            <div class="empty-icon">🏃‍♂️</div>
            <h5>No workout history found</h5>
            <p class="text-muted">Start your first workout to see your progress here!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gym Map Modal -->
    <div v-if="showGymMap" class="modal-overlay" @click="closeGymMap">
      <div class="modal-content gym-map-modal" @click.stop>
        <div class="modal-header">
          <h3>🏋️ Melbourne CBD Gyms</h3>
          <button class="close-btn" @click="closeGymMap">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="mb-4">
            <p class="text-muted mb-3">Discover top-rated gyms and fitness centers in Melbourne's Central Business District</p>
          </div>

          <!-- Gym Results -->
          <div class="row">
            <div v-for="gym in melbourneGyms" :key="gym.id" class="col-lg-6 mb-4">
              <div class="gym-card">
                <div class="gym-info">
                  <h5 class="gym-name">{{ gym.name }}</h5>
                  <p class="gym-address text-muted mb-2">
                    {{ gym.address }}
                  </p>
                  <p class="gym-description small mb-3">{{ gym.description }}</p>
                  <div class="gym-rating mb-3">
                    <span class="rating-text fw-bold">{{ gym.rating.toFixed(1) }} ⭐</span>
                  </div>
                  <div class="gym-status">
                    <span v-if="gym.openNow" class="badge bg-success">
                      Open Now
                    </span>
                    <span v-else class="badge bg-secondary">
                      Closed
                    </span>
                  </div>
                </div>
                <div class="gym-actions">
                  <button class="btn btn-primary" @click="goToGym(gym)">
                    Go There
                  </button>
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

.complete-btn.completed {
  background: #28a745;
  color: white;
  cursor: default;
}

.complete-btn.completed:hover {
  background: #28a745;
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

.finish-btn:hover:not(:disabled) {
  background: #218838;
}

.finish-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
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

/* Fitness History Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.history-modal {
  background: white;
  border-radius: 12px;
  max-width: 1200px;
  width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #495057;
}

.modal-body {
  padding: 2rem;
}

/* Statistics Cards */
.stats-section .row {
  margin: 0 -0.75rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Table Controls */
.table-controls {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.global-search input {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.global-search input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  outline: none;
}

.results-info {
  color: #6c757d;
  font-size: 0.9rem;
}

/* Table Styling */
.table {
  margin-bottom: 0;
}

.table th {
  background: #f8f9fa;
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.table td {
  vertical-align: middle;
  border-top: 1px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

/* Table Header Styling */
.table-header-cell {
  padding: 12px 16px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background-color: #495057;
  color: white;
}

.sort-icon {
  opacity: 0.7;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
}

.sortable:hover .sort-icon {
  opacity: 1;
}

/* Table Column Widths */
.table th:nth-child(1) { width: 20%; } /* Date */
.table th:nth-child(2) { width: 25%; } /* Workout */
.table th:nth-child(3) { width: 15%; } /* Category */
.table th:nth-child(4) { width: 20%; } /* Progress */
.table th:nth-child(5) { width: 15%; } /* Status */
.table th:nth-child(6) { width: 10%; } /* Duration */

/* Gym Map Modal Styles */
.gym-map-modal {
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.gym-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gym-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.gym-info {
  flex: 1;
  margin-bottom: 1rem;
}

.gym-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.gym-address {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.gym-description {
  color: #6c757d;
  font-style: italic;
}

.gym-rating {
  display: flex;
  align-items: center;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  font-size: 1rem;
  color: #2c3e50;
}

.gym-status {
  margin-top: 0.5rem;
}

.gym-actions {
  margin-top: auto;
}

.gym-actions .btn {
  width: 100%;
}


/* Progress Value Styling */
.progress-value {
  font-weight: 600;
  font-size: 1rem;
}

.progress-detail {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* Pagination */
.pagination-section {
  margin-top: 2rem;
}

.pagination .page-link {
  color: #667eea;
  border: 1px solid #dee2e6;
  padding: 0.5rem 0.75rem;
}

.pagination .page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
}

.pagination .page-link:hover {
  color: #5a6fd8;
  background-color: #e9ecef;
  border-color: #dee2e6;
}

/* Empty State */
.empty-state {
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h5 {
  color: #495057;
  margin-bottom: 0.5rem;
}

/* Responsive adjustments for modal */
@media (max-width: 767.98px) {
  .history-modal {
    width: 98%;
    margin: 1rem;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
  
  .stats-section .row {
    margin: 0;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .table-responsive {
    font-size: 0.85rem;
  }
  
  .table-header-cell {
    padding: 8px 12px;
  }
}
</style>
