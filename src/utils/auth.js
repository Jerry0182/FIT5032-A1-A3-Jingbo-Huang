// Authentication utility functions
import { ref, reactive } from 'vue'

// Current user state
export const currentUser = ref(null)
export const isLoggedIn = ref(false)

// User data storage key
const USERS_KEY = 'health_app_users'

// Simple password hash function
function hashPassword(password) {
  // Simple hash implementation, should use more secure algorithm in production
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

// Get all users
export function getUsers() {
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

// Save user data
export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Register new user
export function registerUser(userData) {
  const users = getUsers()
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === userData.email)
  if (existingUser) {
    return { success: false, message: 'Email already exists' }
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email: userData.email,
    password: hashPassword(userData.password),
    name: userData.email.split('@')[0], // Use email prefix as username
    createdAt: new Date().toISOString(),
    role: userData.role || 'user' // Support role selection, default to 'user'
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return { success: true, user: newUser }
}

// Login verification
export function loginUser(email, password) {
  const users = getUsers()
  const hashedPassword = hashPassword(password)
  
  const user = users.find(u => u.email === email && u.password === hashedPassword)
  
  if (user) {
    // Set current user and login status
    currentUser.value = { ...user }
    isLoggedIn.value = true
    
    // Save login status to sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(user))
    sessionStorage.setItem('isLoggedIn', 'true')
    
    return { success: true, user: user }
  }
  
  return { success: false, message: 'Invalid email or password' }
}

// Logout
export function logoutUser() {
  currentUser.value = null
  isLoggedIn.value = false
  
  // Clear sessionStorage
  sessionStorage.removeItem('currentUser')
  sessionStorage.removeItem('isLoggedIn')
}

// Initialize authentication state (restore from sessionStorage)
export function initAuth() {
  const savedUser = sessionStorage.getItem('currentUser')
  const savedLoginState = sessionStorage.getItem('isLoggedIn')
  
  if (savedUser && savedLoginState === 'true') {
    currentUser.value = JSON.parse(savedUser)
    isLoggedIn.value = true
  }
}

// Check if user is logged in
export function checkAuth() {
  return isLoggedIn.value && currentUser.value !== null
}

// Role management functions
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Admin registration password
const ADMIN_REGISTRATION_PASSWORD = '123'

// Check if current user has specific role
export function hasRole(role) {
  return currentUser.value && currentUser.value.role === role
}

// Check if current user is admin
export function isAdmin() {
  return hasRole(ROLES.ADMIN)
}

// Check if current user is regular user
export function isUser() {
  return hasRole(ROLES.USER)
}

// Get user role
export function getUserRole() {
  return currentUser.value ? currentUser.value.role : null
}

// Get current user
export function getCurrentUser() {
  return currentUser.value
}

// Verify admin registration password
export function verifyAdminPassword(password) {
  return password === ADMIN_REGISTRATION_PASSWORD
}

// Update user role (admin only)
export function updateUserRole(userId, newRole) {
  if (!isAdmin()) {
    return { success: false, message: 'Only admins can update user roles' }
  }
  
  const users = getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    return { success: false, message: 'User not found' }
  }
  
  users[userIndex].role = newRole
  saveUsers(users)
  
  return { success: true, message: 'User role updated successfully' }
}
