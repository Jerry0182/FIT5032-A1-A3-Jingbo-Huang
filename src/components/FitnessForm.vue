<script setup>
import { reactive } from 'vue'

const formData = reactive({
  name: '',
  age: '',
  email: '',
  fitnessGoal: ''
})

const errors = reactive({
  name: '',
  age: '',
  email: '',
  fitnessGoal: ''
})

// Validation functions
const validateName = () => {
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    return false
  }
  errors.name = ''
  return true
}

const validateAge = () => {
  if (!formData.age) {
    errors.age = 'Age is required'
    return false
  }
  const age = parseInt(formData.age)
  if (isNaN(age) || age < 16 || age > 80) {
    errors.age = 'Please enter a valid age (16-80)'
    return false
  }
  errors.age = ''
  return true
}

const validateEmail = () => {
  if (!formData.email) {
    errors.email = 'Email is required'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email'
    return false
  }
  errors.email = ''
  return true
}

const validateFitnessGoal = () => {
  if (!formData.fitnessGoal.trim()) {
    errors.fitnessGoal = 'Fitness goal is required'
    return false
  }
  errors.fitnessGoal = ''
  return true
}

const submitForm = () => {
  const isNameValid = validateName()
  const isAgeValid = validateAge()
  const isEmailValid = validateEmail()
  const isFitnessGoalValid = validateFitnessGoal()

  if (isNameValid && isAgeValid && isEmailValid && isFitnessGoalValid) {
    alert('Registration submitted successfully!')
  } else {
    alert('Please check form errors')
  }
}
</script>

<template>
  <section class="form-section">
    <h2>Fitness Assessment Form</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label>Name *</label>
        <input 
          type="text" 
          v-model="formData.name"
          @blur="validateName"
          :class="{ 'error': errors.name }"
          placeholder="Enter your name"
        />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>Age *</label>
        <input 
          type="number" 
          v-model="formData.age"
          @blur="validateAge"
          :class="{ 'error': errors.age }"
          placeholder="Enter your age"
        />
        <span v-if="errors.age" class="error">{{ errors.age }}</span>
      </div>

      <div class="form-group">
        <label>Email *</label>
        <input 
          type="email" 
          v-model="formData.email"
          @blur="validateEmail"
          :class="{ 'error': errors.email }"
          placeholder="Enter your email"
        />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label>Fitness Goal *</label>
        <textarea 
          v-model="formData.fitnessGoal"
          @blur="validateFitnessGoal"
          :class="{ 'error': errors.fitnessGoal }"
          placeholder="Describe your fitness goals"
        ></textarea>
        <span v-if="errors.fitnessGoal" class="error">{{ errors.fitnessGoal }}</span>
      </div>

      <button type="submit">Join Now</button>
    </form>
  </section>
</template>

<style scoped>
.form-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  margin: 0 0 25px 0;
  color: #333;
  text-align: center;
  font-size: 1.8rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

.form-group input,
.form-group textarea {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #dc3545;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: transform 0.3s ease;
  margin-top: 10px;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .form-section {
    padding: 20px;
  }
}
</style>
