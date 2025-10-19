<script setup>
import { ref, computed, onMounted } from 'vue'
import { saveAssessment, getAssessments, getAssessmentStats } from '../utils/assessmentStorage.js'
import { calculateHealthScoreCloud, getHealthHistoryCloud, saveAssessmentCloud } from '../utils/healthAssessmentCloud.js'

const currentStep = ref(0)
const showHistory = ref(false)
const assessmentHistory = ref([])
const assessmentStats = ref({
  totalAssessments: 0,
  averageScore: 0,
  lastAssessment: null,
  byType: {},
  recentTrend: 'No data'
})

// Interactive table states
const globalSearch = ref('')
const sortField = ref('date')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10
const assessmentData = ref({
  personalInfo: {
    age: '',
    height: '',
    weight: '',
    activityLevel: ''
  },
  healthHistory: {
    chronicConditions: [],
    medications: '',
    familyHistory: []
  },
  lifestyle: {
    exerciseFrequency: '',
    dietQuality: '',
    sleepHours: '',
    stressLevel: ''
  },
  goals: {
    primaryGoal: '',
    timeframe: '',
    specificTargets: []
  }
})

const steps = [
  { title: 'Personal Information', description: 'Basic health metrics' },
  { title: 'Health History', description: 'Medical background' },
  { title: 'Lifestyle', description: 'Daily habits and routines' },
  { title: 'Goals', description: 'Health objectives' },
  { title: 'Results', description: 'Assessment summary' }
]

const chronicConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol', 
  'Arthritis', 'Depression', 'Anxiety', 'None'
]

const familyHistoryOptions = [
  'Heart Disease', 'Diabetes', 'Cancer', 'High Blood Pressure',
  'Stroke', 'Mental Health Issues', 'None'
]

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
  { value: 'light', label: 'Light activity (light exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderate activity (moderate exercise 3-5 days/week)' },
  { value: 'active', label: 'Active (hard exercise 6-7 days/week)' },
  { value: 'very-active', label: 'Very active (very hard exercise, physical job)' }
]

const exerciseFrequencies = [
  'Never', '1-2 times per week', '3-4 times per week', 
  '5-6 times per week', 'Daily'
]

const dietQualities = [
  'Poor (fast food, processed foods)', 'Fair (some healthy choices)',
  'Good (mostly healthy with occasional treats)', 'Excellent (well-balanced, nutritious)'
]

const stressLevels = [
  'Very Low', 'Low', 'Moderate', 'High', 'Very High'
]

const primaryGoals = [
  'Weight Loss', 'Weight Gain', 'Muscle Building', 'Cardiovascular Health',
  'General Wellness', 'Stress Reduction', 'Better Sleep', 'Increased Energy'
]

const timeframes = [
  '1 month', '3 months', '6 months', '1 year', 'Long-term'
]

const progress = computed(() => {
  return ((currentStep.value + 1) / steps.length) * 100
})

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const toggleArrayItem = (array, item) => {
  const index = array.indexOf(item)
  if (index > -1) {
    array.splice(index, 1)
  } else {
    array.push(item)
  }
}

const submitAssessment = async () => {
  try {
    // Use Cloud Function with local fallback
    const result = await calculateHealthScoreCloud(assessmentData.value)
    
    if (result && result.score !== undefined) {
      assessmentData.value.score = result.score
      assessmentData.value.recommendations = result.recommendations || []
      assessmentData.value.saved = true
      
      // Save assessment locally as backup
      saveAssessment({
        type: 'Comprehensive Health Assessment',
        score: result.score,
        recommendations: result.recommendations
      })
      
      nextStep()
    } else {
      throw new Error('Invalid response from health assessment')
    }
  } catch (error) {
    console.error('Assessment submission failed:', error)
    alert('Failed to submit assessment. Please try again.')
  }
}

const calculateHealthScore = () => {
  let score = 0
  
  // Age factor (simplified)
  const age = parseInt(assessmentData.value.personalInfo.age)
  if (age < 30) score += 20
  else if (age < 50) score += 15
  else if (age < 70) score += 10
  else score += 5
  
  // Activity level
  const activity = assessmentData.value.lifestyle.exerciseFrequency
  if (activity === 'Daily') score += 25
  else if (activity === '5-6 times per week') score += 20
  else if (activity === '3-4 times per week') score += 15
  else if (activity === '1-2 times per week') score += 10
  
  // Diet quality
  const diet = assessmentData.value.lifestyle.dietQuality
  if (diet.includes('Excellent')) score += 20
  else if (diet.includes('Good')) score += 15
  else if (diet.includes('Fair')) score += 10
  else score += 5
  
  // Sleep hours
  const sleep = parseInt(assessmentData.value.lifestyle.sleepHours)
  if (sleep >= 7 && sleep <= 9) score += 15
  else if (sleep >= 6 && sleep <= 10) score += 10
  else score += 5
  
  // Stress level
  const stress = assessmentData.value.lifestyle.stressLevel
  if (stress === 'Very Low' || stress === 'Low') score += 15
  else if (stress === 'Moderate') score += 10
  else if (stress === 'High') score += 5
  
  // Chronic conditions (negative impact)
  score -= assessmentData.value.healthHistory.chronicConditions.length * 5
  
  return Math.max(0, Math.min(100, score))
}

const generateRecommendations = (score) => {
  const recommendations = []
  
  if (score < 40) {
    recommendations.push('Consider consulting with a healthcare professional')
    recommendations.push('Focus on basic lifestyle improvements')
    recommendations.push('Start with small, manageable changes')
  } else if (score < 70) {
    recommendations.push('Good foundation, focus on specific improvements')
    recommendations.push('Consider adding more physical activity')
    recommendations.push('Consider improving your diet habits')
  } else {
    recommendations.push('Excellent health habits!')
    recommendations.push('Continue maintaining your current lifestyle')
    recommendations.push('Consider advanced fitness goals')
  }
  
  return recommendations
}

const resetAssessment = () => {
  console.log('resetAssessment called')
  currentStep.value = 0
  assessmentData.value = {
    personalInfo: { age: '', height: '', weight: '', activityLevel: '' },
    healthHistory: { chronicConditions: [], medications: '', familyHistory: [] },
    lifestyle: { exerciseFrequency: '', dietQuality: '', sleepHours: '', stressLevel: '' },
    goals: { primaryGoal: '', timeframe: '', specificTargets: [] }
  }
  console.log('resetAssessment completed, currentStep:', currentStep.value)
}

// Load assessment history
const loadHistory = async () => {
  try {
    // Try Cloud Function first, fallback to local
    const result = await getHealthHistoryCloud()
    
    if (result && result.assessments) {
      assessmentHistory.value = result.assessments
      
      // Calculate stats from cloud data
      if (result.assessments.length > 0) {
        const totalScore = result.assessments.reduce((sum, assessment) => sum + assessment.score, 0)
        assessmentStats.value = {
          totalAssessments: result.assessments.length,
          averageScore: Math.round(totalScore / result.assessments.length),
          lastAssessment: result.assessments[0]
        }
      } else {
        assessmentStats.value = { totalAssessments: 0, averageScore: 0, lastAssessment: null }
      }
    } else {
      throw new Error('No assessments from cloud')
    }
  } catch (error) {
    console.warn('Failed to load from cloud, using local storage:', error)
    // Fallback to local storage
    assessmentHistory.value = getAssessments()
    assessmentStats.value = getAssessmentStats()
  }
}

// View history
const viewHistory = async () => {
  console.log('viewHistory called')
  try {
    await loadHistory()
    console.log('loadHistory completed')
    showHistory.value = true
    console.log('showHistory set to true:', showHistory.value)
  } catch (error) {
    console.error('Error in viewHistory:', error)
    showHistory.value = true
  }
}

// Close history
const closeHistory = () => {
  showHistory.value = false
}

// Initialize data on mount
onMounted(() => {
  loadHistory()
})

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get score class for styling
const getScoreClass = (score) => {
  if (score >= 90) return 'text-success'
  if (score >= 80) return 'text-primary'
  if (score >= 70) return 'text-warning'
  return 'text-danger'
}

// Get status badge class
const getStatusBadgeClass = (status) => {
  const classes = {
    'Excellent': 'bg-success',
    'Good': 'bg-primary',
    'Fair': 'bg-warning',
    'Needs Improvement': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

// Interactive table computed properties
const filteredHistory = computed(() => {
  let filtered = [...assessmentHistory.value]

  // Global search - search by keywords
  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    filtered = filtered.filter(assessment => 
      assessment.type.toLowerCase().includes(searchTerm) ||
      assessment.status.toLowerCase().includes(searchTerm) ||
      assessment.recommendations.some(rec => 
        rec.toLowerCase().includes(searchTerm)
      ) ||
      assessment.score.toString().includes(searchTerm) ||
      formatDate(assessment.date).toLowerCase().includes(searchTerm)
    )
  }

  // Sort
  if (sortField.value) {
    filtered.sort((a, b) => {
      let aVal = a[sortField.value]
      let bVal = b[sortField.value]

      if (sortField.value === 'date') {
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

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => 
  Math.min(startIndex.value + itemsPerPage, filteredHistory.value.length)
)

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Interactive table methods
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
</script>

<template>
  <div class="health-assessment-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">Health Assessment</h1>
            <p class="lead text-white-50 mb-4">Get personalized health insights and recommendations</p>
          </div>

          <!-- Progress Bar -->
          <div class="progress-container">
            <div class="progress">
              <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
            <div class="progress-text">
              Step {{ currentStep + 1 }} of {{ steps.length }}: {{ steps[currentStep].title }}
            </div>
          </div>

          <!-- Assessment Form -->
          <div class="assessment-form">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">{{ steps[currentStep].title }}</h5>
                <p class="card-subtitle">{{ steps[currentStep].description }}</p>
              </div>
              <div class="card-body">
                
                <!-- Step 1: Personal Information -->
                <div v-if="currentStep === 0" class="step-content">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Age</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="assessmentData.personalInfo.age"
                        placeholder="Enter your age"
                        min="18"
                        max="120"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Height (cm)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="assessmentData.personalInfo.height"
                        placeholder="Enter your height"
                        min="100"
                        max="250"
                      >
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Weight (kg)</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        v-model="assessmentData.personalInfo.weight"
                        placeholder="Enter your weight"
                        min="30"
                        max="300"
                        step="0.1"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Activity Level</label>
                      <select class="form-select" v-model="assessmentData.personalInfo.activityLevel">
                        <option value="">Select activity level</option>
                        <option 
                          v-for="level in activityLevels" 
                          :key="level.value" 
                          :value="level.value"
                        >
                          {{ level.label }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Step 2: Health History -->
                <div v-if="currentStep === 1" class="step-content">
                  <div class="mb-4">
                    <label class="form-label">Chronic Conditions (select all that apply)</label>
                    <div class="condition-cards">
                      <div 
                        v-for="condition in chronicConditions" 
                        :key="condition"
                        :class="['condition-card', { 'selected': assessmentData.healthHistory.chronicConditions.includes(condition) }]"
                        @click="toggleArrayItem(assessmentData.healthHistory.chronicConditions, condition)"
                      >
                        <span class="condition-text">{{ condition }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label">Current Medications</label>
                    <textarea 
                      class="form-control" 
                      v-model="assessmentData.healthHistory.medications"
                      placeholder="List any medications you're currently taking (optional)"
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label">Family History (select all that apply)</label>
                    <div class="condition-cards">
                      <div 
                        v-for="condition in familyHistoryOptions" 
                        :key="condition"
                        :class="['condition-card', { 'selected': assessmentData.healthHistory.familyHistory.includes(condition) }]"
                        @click="toggleArrayItem(assessmentData.healthHistory.familyHistory, condition)"
                      >
                        <span class="condition-text">{{ condition }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Lifestyle -->
                <div v-if="currentStep === 2" class="step-content">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Exercise Frequency</label>
                      <select class="form-select" v-model="assessmentData.lifestyle.exerciseFrequency">
                        <option value="">Select frequency</option>
                        <option 
                          v-for="freq in exerciseFrequencies" 
                          :key="freq" 
                          :value="freq"
                        >
                          {{ freq }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Sleep Hours (per night)</label>
                      <select class="form-select" v-model="assessmentData.lifestyle.sleepHours">
                        <option value="">Select hours</option>
                        <option value="4">4 hours or less</option>
                        <option value="5">5 hours</option>
                        <option value="6">6 hours</option>
                        <option value="7">7 hours</option>
                        <option value="8">8 hours</option>
                        <option value="9">9 hours</option>
                        <option value="10">10 hours or more</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Diet Quality</label>
                      <select class="form-select" v-model="assessmentData.lifestyle.dietQuality">
                        <option value="">Select quality</option>
                        <option 
                          v-for="quality in dietQualities" 
                          :key="quality" 
                          :value="quality"
                        >
                          {{ quality }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Stress Level</label>
                      <select class="form-select" v-model="assessmentData.lifestyle.stressLevel">
                        <option value="">Select level</option>
                        <option 
                          v-for="level in stressLevels" 
                          :key="level" 
                          :value="level"
                        >
                          {{ level }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Step 4: Goals -->
                <div v-if="currentStep === 3" class="step-content">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Primary Health Goal</label>
                      <select class="form-select" v-model="assessmentData.goals.primaryGoal">
                        <option value="">Select primary goal</option>
                        <option 
                          v-for="goal in primaryGoals" 
                          :key="goal" 
                          :value="goal"
                        >
                          {{ goal }}
                        </option>
                      </select>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Timeframe</label>
                      <select class="form-select" v-model="assessmentData.goals.timeframe">
                        <option value="">Select timeframe</option>
                        <option 
                          v-for="timeframe in timeframes" 
                          :key="timeframe" 
                          :value="timeframe"
                        >
                          {{ timeframe }}
                        </option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">Specific Targets (optional)</label>
                    <textarea 
                      class="form-control" 
                      v-model="assessmentData.goals.specificTargets"
                      placeholder="Describe any specific targets or milestones you'd like to achieve"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <!-- Step 5: Results -->
                <div v-if="currentStep === 4" class="step-content results-step">
                  <div class="results-header text-center mb-4">
                    <h3>Your Health Assessment Results</h3>
                    <div class="health-score">
                      <div class="score-circle">
                        <span class="score-number">{{ assessmentData.score }}</span>
                        <span class="score-label">Health Score</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="recommendations">
                    <h5>Recommendations</h5>
                    <ul class="recommendations-list">
                      <li 
                        v-for="(recommendation, index) in assessmentData.recommendations" 
                        :key="index"
                      >
                        {{ recommendation }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="action-buttons">
                    <button class="btn btn-primary btn-lg" @click="resetAssessment">
                      Take Assessment Again
                    </button>
                    <button class="btn btn-outline-primary btn-lg ms-3" @click="viewHistory">
                      📊 View Assessment History
                    </button>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="form-navigation">
                  <button 
                    v-if="currentStep > 0" 
                    class="btn btn-outline-secondary"
                    @click="prevStep"
                  >
                    Previous
                  </button>
                  
                  <button 
                    v-if="currentStep < 4" 
                    class="btn btn-primary"
                    @click="nextStep"
                  >
                    Next
                  </button>
                  
                  <button 
                    v-if="currentStep === 3" 
                    class="btn btn-success"
                    @click="submitAssessment"
                  >
                    Complete Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assessment History Modal -->
    <div v-if="showHistory" class="modal-overlay" @click="closeHistory">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Assessment History</h3>
          <button class="btn-close" @click="closeHistory">&times;</button>
        </div>
        
        <div class="modal-body">
          <!-- Statistics -->
          <div class="stats-section mb-4">
            <div class="row">
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>{{ assessmentStats.totalAssessments }}</h4>
                  <p>Total Assessments</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>{{ assessmentStats.averageScore }}</h4>
                  <p>Average Score</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>{{ assessmentStats.recentTrend }}</h4>
                  <p>Recent Trend</p>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-card">
                  <h4>{{ assessmentStats.byType ? Object.keys(assessmentStats.byType).length : 0 }}</h4>
                  <p>Assessment Types</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive Table Controls -->
          <div class="table-controls mb-3">
            <div class="row">
              <div class="col-md-12">
                <div class="search-box">
                  <input 
                    type="text" 
                    v-model="globalSearch" 
                    placeholder="Search by keywords (type, status, recommendations)..."
                    class="form-control"
                    @input="handleGlobalSearch"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Interactive History Table -->
          <div class="table-responsive">
            <table class="table table-striped">
              <thead class="table-dark">
                <tr>
                  <th @click="sortBy('date')" class="sortable table-header-cell">
                    <span class="header-content">
                      Date
                      <span class="sort-icon">{{ getSortIcon('date') }}</span>
                    </span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Type</span>
                  </th>
                  <th @click="sortBy('score')" class="sortable table-header-cell">
                    <span class="header-content">
                      Score
                      <span class="sort-icon">{{ getSortIcon('score') }}</span>
                    </span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Status</span>
                  </th>
                  <th class="table-header-cell">
                    <span class="header-content">Recommendations</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="assessment in paginatedHistory" :key="assessment.id">
                  <td class="text-center">{{ formatDate(assessment.date) }}</td>
                  <td class="text-center">
                    <span class="badge bg-primary">{{ assessment.type }}</span>
                  </td>
                  <td class="text-center">
                    <span class="score-value" :class="getScoreClass(assessment.score)">
                      {{ assessment.score }}/100
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="badge" :class="getStatusBadgeClass(assessment.status)">
                      {{ assessment.status }}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="recommendations">
                      {{ assessment.recommendations.slice(0, 2).join(', ') }}
                      <span v-if="assessment.recommendations.length > 2">
                        +{{ assessment.recommendations.length - 2 }} more
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-section">
            <div class="row align-items-center">
              <div class="col-md-6">
                <div class="pagination-info">
                  Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredHistory.length }} assessments
                </div>
              </div>
              <div class="col-md-6">
                <nav aria-label="Assessment pagination">
                  <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
                    </li>
                    <li 
                      v-for="page in visiblePages" 
                      :key="page" 
                      class="page-item" 
                      :class="{ active: page === currentPage }"
                    >
                      <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeHistory">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.health-assessment-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.progress-container {
  margin-bottom: 2rem;
}

.progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: #fff;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: white;
  font-weight: 500;
}

.assessment-form {
  margin-bottom: 2rem;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 12px 12px 0 0 !important;
  padding: 1.5rem;
}

.card-title {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.card-subtitle {
  margin: 0.5rem 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.card-body {
  padding: 2rem;
}

.step-content {
  min-height: 400px;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 1px solid #ced4da;
  padding: 0.75rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #2c3e50;
  box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25);
}

.condition-checkboxes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.form-check {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin: 0;
}

.form-check-input:checked {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.form-check-label {
  font-size: 0.9rem;
  color: #495057;
}

.results-step {
  text-align: center;
}

.health-score {
  margin: 2rem 0;
}

.score-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin: 0 auto;
}

.score-number {
  font-size: 3rem;
  font-weight: bold;
  line-height: 1;
}

.score-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.recommendations {
  text-align: left;
  margin: 2rem 0;
}

.recommendations h5 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.recommendations-list {
  list-style: none;
  padding: 0;
}

.recommendations-list li {
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 4px solid #2c3e50;
  margin-bottom: 0.5rem;
  border-radius: 0 6px 6px 0;
}

/* Condition Cards Styles */
.condition-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.condition-card {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.condition-card:hover {
  border-color: #2c3e50;
  background: #e9ecef;
  transform: translateY(-2px);
}

.condition-card.selected {
  background: #2c3e50;
  border-color: #2c3e50;
  color: white;
}

.condition-card.selected:hover {
  background: #34495e;
  border-color: #34495e;
}

.condition-text {
  font-weight: 500;
  font-size: 0.95rem;
}

.form-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #2c3e50;
  border-color: #2c3e50;
}

.btn-primary:hover {
  background: #34495e;
  border-color: #34495e;
}

.btn-success {
  background: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background: #218838;
  border-color: #218838;
}

.action-buttons {
  margin-top: 2rem;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .health-assessment-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .condition-cards {
    grid-template-columns: 1fr;
  }
  
  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-navigation .btn {
    width: 100%;
  }
  
  .score-circle {
    width: 120px;
    height: 120px;
  }
  
  .score-number {
    font-size: 2.5rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

/* Stats Section */
.stats-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-card p {
  margin: 0.5rem 0 0 0;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Table Styles */
.table th {
  border-top: none;
  font-weight: 600;
}

.score-value {
  font-weight: bold;
}

.recommendations {
  max-width: 200px;
  font-size: 0.85rem;
  line-height: 1.4;
}

@media (max-width: 767.98px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 1rem;
  }
  
  .stats-section .row {
    margin: 0;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
}

/* Interactive Table Styles */
.table-controls {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.search-box input, .column-search input, .column-search select {
  border-radius: 8px;
  border: 2px solid #e9ecef;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.search-box input:focus, .column-search input:focus, .column-search select:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
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
.table th:nth-child(1) { width: 15%; } /* Date */
.table th:nth-child(2) { width: 25%; } /* Type */
.table th:nth-child(3) { width: 15%; } /* Score */
.table th:nth-child(4) { width: 20%; } /* Status */
.table th:nth-child(5) { width: 25%; } /* Recommendations */

.pagination-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.pagination-info {
  color: #6c757d;
  font-size: 0.9rem;
}

.page-link {
  border-radius: 6px;
  margin: 0 2px;
  border: 1px solid #dee2e6;
  color: #007bff;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-item.disabled .page-link {
  color: #6c757d;
  background-color: #fff;
  border-color: #dee2e6;
}

@media (max-width: 767.98px) {
  .table-controls .row {
    margin: 0;
  }
  
  .table-controls .col-md-6 {
    margin-bottom: 1rem;
  }
  
  .pagination-section .row {
    margin: 0;
  }
  
  .pagination {
    justify-content: center !important;
  }
  
  .pagination-info {
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style>
