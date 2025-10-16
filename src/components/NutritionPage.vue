<script setup>
import { ref, computed } from 'vue'

const selectedCategory = ref('all')
const selectedMeal = ref(null)
const dailyCalories = ref(2500)
const currentGoal = ref('maintain')

const categories = [
  { id: 'all', name: 'All Foods', icon: '🍽️' },
  { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
  { id: 'lunch', name: 'Lunch', icon: '🥗' },
  { id: 'dinner', name: 'Dinner', icon: '🍖' },
  { id: 'snacks', name: 'Snacks', icon: '🍎' }
]

const meals = [
  {
    id: 1,
    title: 'Protein Power Bowl',
    category: 'lunch',
    calories: 450,
    protein: 35,
    carbs: 25,
    fat: 18,
    prepTime: '15 minutes',
    difficulty: 'Easy',
    description: 'A nutritious bowl packed with lean protein and fresh vegetables.',
    ingredients: [
      'Grilled chicken breast (150g)',
      'Quinoa (1/2 cup)',
      'Mixed greens (2 cups)',
      'Cherry tomatoes (1/2 cup)',
      'Avocado (1/4)',
      'Olive oil dressing (1 tbsp)'
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Season and grill chicken breast until cooked through',
      'Slice chicken and prepare vegetables',
      'Combine all ingredients in a bowl',
      'Drizzle with olive oil dressing and serve'
    ],
    benefits: ['High protein', 'Balanced macros', 'Rich in vitamins']
  },
  {
    id: 2,
    title: 'Overnight Oats',
    category: 'breakfast',
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 8,
    prepTime: '5 minutes',
    difficulty: 'Easy',
    description: 'A convenient and nutritious breakfast that prepares itself overnight.',
    ingredients: [
      'Rolled oats (1/2 cup)',
      'Greek yogurt (1/2 cup)',
      'Almond milk (1/2 cup)',
      'Chia seeds (1 tbsp)',
      'Berries (1/2 cup)',
      'Honey (1 tsp)'
    ],
    instructions: [
      'Mix oats, chia seeds, and almond milk in a jar',
      'Add Greek yogurt and stir well',
      'Sweeten with honey if desired',
      'Refrigerate overnight (8+ hours)',
      'Top with fresh berries before serving'
    ],
    benefits: ['High fiber', 'Probiotics', 'Antioxidants']
  },
  {
    id: 3,
    title: 'Grilled Salmon & Vegetables',
    category: 'dinner',
    calories: 380,
    protein: 28,
    carbs: 20,
    fat: 22,
    prepTime: '25 minutes',
    difficulty: 'Medium',
    description: 'A heart-healthy dinner rich in omega-3 fatty acids.',
    ingredients: [
      'Salmon fillet (150g)',
      'Broccoli (1 cup)',
      'Sweet potato (1 medium)',
      'Asparagus (6 spears)',
      'Lemon (1/2)',
      'Olive oil (1 tbsp)',
      'Herbs and spices'
    ],
    instructions: [
      'Preheat grill to medium-high heat',
      'Season salmon with herbs and lemon',
      'Cut sweet potato into wedges',
      'Toss vegetables with olive oil and seasoning',
      'Grill salmon for 4-5 minutes per side',
      'Grill vegetables until tender (8-10 minutes)'
    ],
    benefits: ['Omega-3 fatty acids', 'Vitamin D', 'Antioxidants']
  },
  {
    id: 4,
    title: 'Green Smoothie Bowl',
    category: 'breakfast',
    calories: 280,
    protein: 8,
    carbs: 35,
    fat: 12,
    prepTime: '10 minutes',
    difficulty: 'Easy',
    description: 'A refreshing and energizing start to your day.',
    ingredients: [
      'Spinach (1 cup)',
      'Frozen banana (1 medium)',
      'Almond milk (1/2 cup)',
      'Greek yogurt (1/4 cup)',
      'Almond butter (1 tbsp)',
      'Granola (2 tbsp)',
      'Berries (1/4 cup)'
    ],
    instructions: [
      'Blend spinach, banana, almond milk, and yogurt',
      'Add almond butter and blend until smooth',
      'Pour into a bowl',
      'Top with granola and fresh berries',
      'Serve immediately'
    ],
    benefits: ['Iron-rich', 'Vitamin C', 'Healthy fats']
  },
  {
    id: 5,
    title: 'Mediterranean Quinoa Salad',
    category: 'lunch',
    calories: 420,
    protein: 15,
    carbs: 55,
    fat: 16,
    prepTime: '20 minutes',
    difficulty: 'Easy',
    description: 'A light and refreshing salad with Mediterranean flavors.',
    ingredients: [
      'Quinoa (1 cup)',
      'Cucumber (1/2 cup)',
      'Cherry tomatoes (1/2 cup)',
      'Kalamata olives (1/4 cup)',
      'Feta cheese (2 oz)',
      'Red onion (2 tbsp)',
      'Olive oil (2 tbsp)',
      'Lemon juice (1 tbsp)'
    ],
    instructions: [
      'Cook quinoa according to package instructions',
      'Let quinoa cool completely',
      'Dice cucumber and halve cherry tomatoes',
      'Chop olives and red onion',
      'Combine all ingredients in a large bowl',
      'Whisk olive oil and lemon juice for dressing',
      'Toss salad with dressing and serve'
    ],
    benefits: ['Complete protein', 'Healthy fats', 'Antioxidants']
  },
  {
    id: 6,
    title: 'Greek Yogurt Parfait',
    category: 'snacks',
    calories: 200,
    protein: 12,
    carbs: 25,
    fat: 6,
    prepTime: '5 minutes',
    difficulty: 'Easy',
    description: 'A protein-rich snack perfect for any time of day.',
    ingredients: [
      'Greek yogurt (3/4 cup)',
      'Granola (1/4 cup)',
      'Mixed berries (1/2 cup)',
      'Honey (1 tsp)',
      'Chopped nuts (1 tbsp)'
    ],
    instructions: [
      'Layer half the yogurt in a glass',
      'Add half the granola and berries',
      'Repeat layers',
      'Drizzle with honey',
      'Top with chopped nuts',
      'Serve immediately'
    ],
    benefits: ['Probiotics', 'Protein', 'Fiber']
  }
]

const goals = [
  { value: 'lose', label: 'Weight Loss', calories: 2000 },
  { value: 'maintain', label: 'Maintain Weight', calories: 2500 },
  { value: 'gain', label: 'Weight Gain', calories: 3000 }
]

const filteredMeals = computed(() => {
  if (selectedCategory.value === 'all') {
    return meals
  }
  return meals.filter(meal => meal.category === selectedCategory.value)
})

const selectMeal = (meal) => {
  selectedMeal.value = meal
}

const backToMeals = () => {
  selectedMeal.value = null
}

const updateGoal = (goal) => {
  currentGoal.value = goal.value
  dailyCalories.value = goal.calories
}

const calculateMacros = (meal) => {
  const percentage = (meal.calories / dailyCalories.value) * 100
  return Math.round(percentage)
}
</script>

<template>
  <div class="nutrition-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">Nutrition & Diet</h1>
            <p class="lead text-white-50 mb-4">Fuel your body with nutritious meals and healthy eating habits</p>
          </div>

          <!-- Daily Goal Selector -->
          <div class="goal-selector">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Daily Nutrition Goal</h5>
                <div class="goal-buttons">
                  <button 
                    v-for="goal in goals" 
                    :key="goal.value"
                    :class="['goal-btn', { active: currentGoal === goal.value }]"
                    @click="updateGoal(goal)"
                  >
                    <div class="goal-label">{{ goal.label }}</div>
                    <div class="goal-calories">{{ goal.calories }} cal/day</div>
                  </button>
                </div>
                <div class="current-goal">
                  Current target: <strong>{{ dailyCalories }} calories per day</strong>
                </div>
              </div>
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

          <!-- Meals Grid -->
          <div v-if="!selectedMeal" class="meals-grid">
            <div class="row">
              <div 
                v-for="meal in filteredMeals" 
                :key="meal.id"
                class="col-md-6 col-lg-4 mb-4"
              >
                <div class="meal-card" @click="selectMeal(meal)">
                  <div class="meal-image">
                    <div class="meal-category">{{ categories.find(c => c.id === meal.category)?.name }}</div>
                    <div class="meal-difficulty" :class="meal.difficulty.toLowerCase()">
                      {{ meal.difficulty }}
                    </div>
                  </div>
                  
                  <div class="meal-content">
                    <h5 class="meal-title">{{ meal.title }}</h5>
                    <div class="meal-meta">
                      <span class="meta-item">⏱️ {{ meal.prepTime }}</span>
                      <span class="meta-item">🔥 {{ meal.calories }} cal</span>
                    </div>
                    <p class="meal-description">{{ meal.description }}</p>
                    
                    <div class="macro-info">
                      <div class="macro-item">
                        <span class="macro-label">Protein:</span>
                        <span class="macro-value">{{ meal.protein }}g</span>
                      </div>
                      <div class="macro-item">
                        <span class="macro-label">Carbs:</span>
                        <span class="macro-value">{{ meal.carbs }}g</span>
                      </div>
                      <div class="macro-item">
                        <span class="macro-label">Fat:</span>
                        <span class="macro-value">{{ meal.fat }}g</span>
                      </div>
                    </div>
                    
                    <div class="calorie-percentage">
                      {{ calculateMacros(meal) }}% of daily calories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Meal Detail View -->
          <div v-else class="meal-detail">
            <div class="meal-header-detail">
              <button class="back-btn" @click="backToMeals">
                ← Back to Meals
              </button>
              <h2 class="meal-title-detail">{{ selectedMeal.title }}</h2>
              <div class="meal-info">
                <span class="info-badge">{{ selectedMeal.prepTime }}</span>
                <span class="info-badge">{{ selectedMeal.difficulty }}</span>
                <span class="info-badge">{{ selectedMeal.calories }} calories</span>
              </div>
            </div>

            <div class="meal-content-detail">
              <div class="row">
                <div class="col-lg-8">
                  <!-- Ingredients and Instructions -->
                  <div class="recipe-section">
                    <div class="ingredients-section">
                      <h4>Ingredients</h4>
                      <ul class="ingredients-list">
                        <li v-for="ingredient in selectedMeal.ingredients" :key="ingredient">
                          {{ ingredient }}
                        </li>
                      </ul>
                    </div>
                    
                    <div class="instructions-section">
                      <h4>Instructions</h4>
                      <ol class="instructions-list">
                        <li v-for="(instruction, index) in selectedMeal.instructions" :key="index">
                          {{ instruction }}
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div class="col-lg-4">
                  <!-- Nutrition Info Sidebar -->
                  <div class="nutrition-sidebar">
                    <div class="sidebar-section">
                      <h5>Nutrition Facts</h5>
                      <div class="nutrition-facts">
                        <div class="fact-item">
                          <span class="fact-label">Calories:</span>
                          <span class="fact-value">{{ selectedMeal.calories }}</span>
                        </div>
                        <div class="fact-item">
                          <span class="fact-label">Protein:</span>
                          <span class="fact-value">{{ selectedMeal.protein }}g</span>
                        </div>
                        <div class="fact-item">
                          <span class="fact-label">Carbohydrates:</span>
                          <span class="fact-value">{{ selectedMeal.carbs }}g</span>
                        </div>
                        <div class="fact-item">
                          <span class="fact-label">Fat:</span>
                          <span class="fact-value">{{ selectedMeal.fat }}g</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="sidebar-section">
                      <h5>Health Benefits</h5>
                      <ul class="benefits-list">
                        <li v-for="benefit in selectedMeal.benefits" :key="benefit">
                          {{ benefit }}
                        </li>
                      </ul>
                    </div>
                    
                    <div class="sidebar-section">
                      <h5>Daily Intake</h5>
                      <div class="daily-percentage">
                        <div class="percentage-circle">
                          <div class="percentage-number">
                            {{ calculateMacros(selectedMeal) }}%
                          </div>
                          <div class="percentage-label">of daily calories</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Nutrition Tips -->
          <div class="nutrition-tips">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">💡 Nutrition Tips</h5>
                <div class="tips-grid">
                  <div class="tip-item">
                    <strong>Hydration:</strong> Drink at least 8 glasses of water daily
                  </div>
                  <div class="tip-item">
                    <strong>Portion Control:</strong> Use smaller plates to manage serving sizes
                  </div>
                  <div class="tip-item">
                    <strong>Meal Timing:</strong> Eat every 3-4 hours to maintain energy
                  </div>
                  <div class="tip-item">
                    <strong>Whole Foods:</strong> Choose minimally processed foods when possible
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
.nutrition-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.goal-selector {
  margin-bottom: 2rem;
}

.goal-selector .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.goal-selector .card-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.goal-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.goal-btn {
  flex: 1;
  min-width: 150px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.goal-btn:hover {
  background: #e9ecef;
}

.goal-btn.active {
  background: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.goal-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.goal-calories {
  font-size: 0.9rem;
  opacity: 0.8;
}

.current-goal {
  color: #7f8c8d;
  font-size: 0.9rem;
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

.meals-grid {
  margin-bottom: 2rem;
}

.meal-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.meal-card:hover {
  transform: translateY(-5px);
}

.meal-image {
  position: relative;
  height: 120px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
}

.meal-category {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.meal-difficulty {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.meal-difficulty.easy {
  background: #28a745;
  color: white;
}

.meal-difficulty.medium {
  background: #ffc107;
  color: #212529;
}

.meal-difficulty.hard {
  background: #dc3545;
  color: white;
}

.meal-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.meal-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1rem;
}

.meal-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.meal-description {
  color: #7f8c8d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.macro-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.macro-item {
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.macro-label {
  display: block;
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.macro-value {
  display: block;
  font-weight: 600;
  color: #2c3e50;
}

.calorie-percentage {
  text-align: center;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Meal Detail Styles */
.meal-detail {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.meal-header-detail {
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

.meal-title-detail {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.meal-info {
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

.meal-content-detail {
  padding: 2rem;
}

.recipe-section h4 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.ingredients-section {
  margin-bottom: 2rem;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredients-list li {
  padding: 0.75rem;
  background: #f8f9fa;
  border-left: 4px solid #2c3e50;
  margin-bottom: 0.5rem;
  border-radius: 0 6px 6px 0;
}

.instructions-section {
  margin-bottom: 2rem;
}

.instructions-list {
  counter-reset: step-counter;
  list-style: none;
  padding: 0;
}

.instructions-list li {
  counter-increment: step-counter;
  padding: 1rem;
  background: #f8f9fa;
  margin-bottom: 1rem;
  border-radius: 8px;
  position: relative;
  padding-left: 3rem;
}

.instructions-list li::before {
  content: counter(step-counter);
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #2c3e50;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.nutrition-sidebar {
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

.nutrition-facts {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.fact-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.fact-item:last-child {
  border-bottom: none;
}

.fact-label {
  color: #6c757d;
  font-weight: 500;
}

.fact-value {
  color: #2c3e50;
  font-weight: 600;
}

.benefits-list {
  list-style: none;
  padding: 0;
}

.benefits-list li {
  padding: 0.5rem 0;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
}

.benefits-list li:last-child {
  border-bottom: none;
}

.daily-percentage {
  text-align: center;
}

.percentage-circle {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #2c3e50;
  color: white;
}

.percentage-number {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.percentage-label {
  font-size: 0.8rem;
  opacity: 0.9;
}

.nutrition-tips {
  margin-top: 2rem;
}

.nutrition-tips .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nutrition-tips .card-title {
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
  .nutrition-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .goal-buttons {
    flex-direction: column;
  }
  
  .goal-btn {
    min-width: auto;
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
  
  .macro-info {
    grid-template-columns: 1fr;
  }
  
  .meal-header-detail,
  .meal-content-detail {
    padding: 1.5rem;
  }
  
  .meal-info {
    justify-content: center;
  }
  
  .instructions-list li {
    padding-left: 2.5rem;
  }
  
  .instructions-list li::before {
    width: 20px;
    height: 20px;
    font-size: 0.7rem;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
