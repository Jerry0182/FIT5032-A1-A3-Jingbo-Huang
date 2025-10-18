<script setup>
import { ref, computed } from 'vue'
import { loginUser, loginWithGoogle } from '../utils/firebaseAuth.js'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')
const rememberMe = ref(false)

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

const handleGoogleLogin = async () => {
  try {
    const result = await loginWithGoogle()
    if (result.success) {
      alert('Google login successful!')
      window.location.reload()
    } else {
      alert(result.message)
    }
  } catch (error) {
    alert('Google login failed: ' + error.message)
  }
}

const loginWithEmail = async () => {
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
  
  // Attempt to login
  try {
    const result = await loginUser(email.value, password.value)
    
    if (result.success) {
      alert('Login successful!')
      // Refresh page to update navbar state
      window.location.reload()
    } else {
      passwordError.value = result.message
    }
  } catch (error) {
    passwordError.value = 'Login failed: ' + error.message
  }
}

const forgotPassword = () => {
  alert('Forgot password clicked')
}

const getApp = () => {
  alert('Get the app clicked')
}
</script>

<template>
  <div class="login-page">
    <!-- Left side - Background image with text -->
    <div class="left-section">
      <div class="background-image">
        <img src="../assets/signup.jpg" alt="Cycling man" class="bg-img" />
        <div class="overlay-text">
          <h1>WELCOME</h1>
          <h1>BACK</h1>
        </div>
      </div>
    </div>

    <!-- Right side - Login form -->
    <div class="right-section">
      <div class="form-container">
        <div class="form-header">
          <h2>WELCOME BACK</h2>
          <h2>LOG IN</h2>
        </div>

        <!-- Google Login Button -->
        <button class="google-btn" @click="handleGoogleLogin">
          <span class="google-icon">G</span>
          <span>Log in with Google</span>
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
            placeholder="Password" 
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

        <!-- Remember Me and Forgot Password -->
        <div class="login-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password" @click.prevent="forgotPassword">
            Forgot password?
          </a>
        </div>

        <!-- Login Button -->
        <button class="login-btn" @click="loginWithEmail">
          Log in
          <span class="arrow">→</span>
        </button>

        <!-- Get App Button -->
        <button class="get-app-btn" @click="getApp">
          Get the app
        </button>

        <!-- Signup Link -->
        <div class="signup-link">
          <a href="#" class="link">Sign up (Don't have an account?)</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
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

/* Login Options */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: #0066cc;
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
}

.forgot-password:hover {
  color: #004499;
}

/* Login Button */
.login-btn {
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

.login-btn:hover {
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

/* Signup Link */
.signup-link {
  text-align: center;
  margin-top: 1.5rem;
}

.signup-link .link {
  color: #333;
  text-decoration: underline;
  font-size: 16px;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .login-page {
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
  .login-btn,
  .get-app-btn {
    padding: 16px 20px;
    font-size: 16px;
  }
  
  .form-input {
    padding: 14px 16px;
    font-size: 16px;
  }
  
  .login-options {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .login-page {
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
  .login-page {
    margin-top: 60px; /* Keep original desktop margin */
  }
}
</style>
