<script setup>
import { ref, computed } from 'vue'
import { registerUser, loginUser } from '../utils/auth.js'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
const validatePassword = (password) => {
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  
  return {
    isValid: hasMinLength && hasUpperCase && hasLowerCase,
    hasMinLength,
    hasUpperCase,
    hasLowerCase
  }
}

// Computed properties for real-time validation
const emailValidation = computed(() => {
  if (!email.value) return { isValid: true, message: '' }
  return {
    isValid: validateEmail(email.value),
    message: validateEmail(email.value) ? '' : 'Please enter a valid email address'
  }
})

const passwordValidation = computed(() => {
  if (!password.value) return { isValid: true, message: '' }
  const validation = validatePassword(password.value)
  return {
    isValid: validation.isValid,
    message: validation.isValid ? '' : 'Password must be at least 8 characters with uppercase and lowercase letters'
  }
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const signupWithGoogle = () => {
  alert('Sign up with Google clicked')
}

const signupWithEmail = () => {
  // Clear previous errors
  emailError.value = ''
  passwordError.value = ''
  
  // Validate email
  if (!email.value) {
    emailError.value = 'Email is required'
    return
  }
  if (!emailValidation.value.isValid) {
    emailError.value = emailValidation.value.message
    return
  }
  
  // Validate password
  if (!password.value) {
    passwordError.value = 'Password is required'
    return
  }
  if (!passwordValidation.value.isValid) {
    passwordError.value = passwordValidation.value.message
    return
  }
  
  // Attempt to register user
  const result = registerUser({
    email: email.value,
    password: password.value
  })
  
  if (result.success) {
    alert('Sign up successful! You are now logged in.')
    // Auto login after successful registration
    loginUser(email.value, password.value)
    // Refresh page to update navbar state
    window.location.reload()
  } else {
    emailError.value = result.message
  }
}

const getApp = () => {
  alert('Get the app clicked')
}
</script>

<template>
  <div class="signup-page">
    <!-- Left side - Background image with text -->
    <div class="left-section">
      <div class="background-image">
        <img src="../assets/signup.jpg" alt="Cycling man" class="bg-img" />
        <div class="overlay-text">
          <h1>Join us and</h1>
          <h1>give you</h1>
          <h1>healthier</h1>
          <h1>life</h1>
        </div>
      </div>
    </div>

    <!-- Right side - Signup form -->
    <div class="right-section">
      <div class="form-container">
        <div class="form-header">
          <h2>NEW HERE?</h2>
          <h2>SIGN UP</h2>
        </div>

        <!-- Google Signup Button -->
        <button class="google-btn" @click="signupWithGoogle">
          <span class="google-icon">G</span>
          <span>Sign up with Google</span>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>Or with email</span>
        </div>

        <!-- Email Input -->
        <div class="input-group">
          <input 
            type="email" 
            v-model="email"
            placeholder="Email" 
            class="form-input"
            :class="{ 'error': emailError || (!emailValidation.isValid && email) }"
          />
          <div v-if="emailError || (!emailValidation.isValid && email)" class="error-message">
            {{ emailError || emailValidation.message }}
          </div>
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <input 
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Create a password" 
            class="form-input"
            :class="{ 'error': passwordError || (!passwordValidation.isValid && password) }"
          />
          <button class="eye-btn" @click="togglePassword">
            👁️
          </button>
          <div v-if="passwordError || (!passwordValidation.isValid && password)" class="error-message">
            {{ passwordError || passwordValidation.message }}
          </div>
        </div>

        <!-- Privacy Statement -->
        <div class="privacy-statement">
          We take your privacy seriously. Read more on our 
          <a href="#" class="link">collection statement</a>.
        </div>

        <!-- Signup Button -->
        <button class="signup-btn" @click="signupWithEmail">
          It's Men time
          <span class="arrow">→</span>
        </button>

        <!-- Get App Button -->
        <button class="get-app-btn" @click="getApp">
          Get the app
        </button>

        <!-- Login Link -->
        <div class="login-link">
          <a href="#" class="link">Login (Already have an account)</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  display: flex;
  min-height: 100vh;
  margin-top: 60px; /* Account for navbar */
}

/* Left Section */
.left-section {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: relative;
  width: 100%;
  height: 100%;
}

.bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay-text {
  position: absolute;
  top: 5%;
  left: 5%;
  color: white;
  z-index: 2;
}

.overlay-text h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Right Section */
.right-section {
  flex: 1;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.form-container {
  width: 100%;
  max-width: 500px;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.form-header h2 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  color: #333;
}

/* Google Button */
.google-btn {
  width: 100%;
  background: #333;
  color: white;
  border: none;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 2rem;
  transition: background-color 0.3s ease;
}

.google-btn:hover {
  background: #555;
}

.google-icon {
  font-weight: bold;
  font-size: 22px;
}

/* Divider */
.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
  color: #666;
  font-size: 16px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
  z-index: 1;
}

.divider span {
  background: white;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

/* Input Groups */
.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 18px;
  background: white;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #333;
}

.form-input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 6px;
  margin-left: 6px;
}

.eye-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 6px;
}

/* Privacy Statement */
.privacy-statement {
  font-size: 14px;
  color: #666;
  margin: 1.5rem 0;
  line-height: 1.4;
}

.link {
  color: #0066cc;
  text-decoration: underline;
}

/* Signup Button */
.signup-btn {
  width: 100%;
  background: #333;
  color: white;
  border: none;
  padding: 20px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 2rem 0;
  transition: background-color 0.3s ease;
}

.signup-btn:hover {
  background: #555;
}

.arrow {
  font-size: 22px;
  font-weight: bold;
}

/* Get App Button */
.get-app-btn {
  width: 100%;
  background: white;
  color: #333;
  border: 1px solid #333;
  padding: 18px 24px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
}

.get-app-btn:hover {
  background: #f5f5f5;
}

/* Login Link */
.login-link {
  text-align: center;
  margin-top: 1.5rem;
}

.login-link .link {
  color: #333;
  text-decoration: underline;
  font-size: 16px;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .signup-page {
    flex-direction: column;
    margin-top: 66px;
  }
  
  .left-section {
    display: none; /* Hide background image on mobile */
  }
  
  .right-section {
    flex: none;
    padding: 2rem 1rem;
  }
  
  .form-container {
    max-width: 100%;
  }
  
  .form-header h2 {
    font-size: 1.8rem;
  }
  
  .google-btn,
  .signup-btn,
  .get-app-btn {
    padding: 16px 20px;
    font-size: 16px;
  }
  
  .form-input {
    padding: 14px 16px;
    font-size: 16px;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .signup-page {
    margin-top: 72px;
  }
  
  .right-section {
    padding: 2rem;
  }
  
  .form-header h2 {
    font-size: 2rem;
  }
}

@media (min-width: 992px) {
  .signup-page {
    margin-top: 60px; /* Keep original desktop margin */
  }
}
</style>
