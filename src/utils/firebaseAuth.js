// Firebase Authentication utility functions
import { ref } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase.js'

// Current user state
export const currentUser = ref(null)
export const isLoggedIn = ref(false)

// Role management
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Admin registration password
const ADMIN_REGISTRATION_PASSWORD = '123'

// Initialize authentication state listener
export function initAuth() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Get user role from localStorage or set default
      const userRole = localStorage.getItem(`user_role_${user.uid}`) || ROLES.USER
      
      currentUser.value = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: userRole,
        createdAt: user.metadata.creationTime
      }
      isLoggedIn.value = true
    } else {
      currentUser.value = null
      isLoggedIn.value = false
    }
  })
}

// Register new user with Firebase
export async function registerUser(userData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    )
    
    const user = userCredential.user
    
    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name || userData.email.split('@')[0]
    })
    
    // Set custom role claim (we'll store this in user metadata)
    // For now, we'll use a simple approach with localStorage for role management
    const userRole = userData.role || ROLES.USER
    localStorage.setItem(`user_role_${user.uid}`, userRole)
    
    return { 
      success: true, 
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || userData.email.split('@')[0],
        role: userRole,
        createdAt: user.metadata.creationTime
      }
    }
  } catch (error) {
    let message = 'Registration failed. Please try again.'
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already registered. Please use a different email or try logging in.'
        break
      case 'auth/weak-password':
        message = 'Password is too weak. Please use at least 6 characters.'
        break
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.'
        break
      case 'auth/operation-not-allowed':
        message = 'Email registration is currently disabled. Please contact support.'
        break
      default:
        message = 'Registration failed. Please check your information and try again.'
    }
    
    return { success: false, message }
  }
}

// Login user with Firebase
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Get user role from localStorage
    const userRole = localStorage.getItem(`user_role_${user.uid}`) || ROLES.USER
    
    return { 
      success: true, 
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: userRole,
        createdAt: user.metadata.creationTime
      }
    }
  } catch (error) {
    let message = 'Login failed. Please try again.'
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email. Please check your email or sign up.'
        break
      case 'auth/wrong-password':
        message = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.'
        break
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.'
        break
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please check your credentials and try again.'
        break
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later.'
        break
      default:
        message = 'Login failed. Please check your email and password.'
    }
    
    return { success: false, message }
  }
}

// Login with Google
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    
    // Set default role for Google users
    const userRole = ROLES.USER
    localStorage.setItem(`user_role_${user.uid}`, userRole)
    
    return { 
      success: true, 
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: userRole,
        createdAt: user.metadata.creationTime
      }
    }
  } catch (error) {
    let message = 'Google login failed. Please try again.'
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        message = 'Login was cancelled. Please try again.'
        break
      case 'auth/popup-blocked':
        message = 'Popup was blocked by your browser. Please allow popups and try again.'
        break
      case 'auth/account-exists-with-different-credential':
        message = 'An account already exists with this email. Please use email login instead.'
        break
      default:
        message = 'Google login failed. Please try again or use email login.'
    }
    
    return { success: false, message }
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// Check if user is logged in
export function checkAuth() {
  return isLoggedIn.value && currentUser.value !== null
}

// Role management functions
export function hasRole(role) {
  return currentUser.value && currentUser.value.role === role
}

export function isAdmin() {
  return hasRole(ROLES.ADMIN)
}

export function isUser() {
  return hasRole(ROLES.USER)
}

export function getUserRole() {
  return currentUser.value ? currentUser.value.role : null
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
  
  // In a real app, this would update the user's role in the database
  // For now, we'll update localStorage
  localStorage.setItem(`user_role_${userId}`, newRole)
  
  return { success: true, message: 'User role updated successfully' }
}

// Get all users (for admin management)
export function getUsers() {
  // In a real app, this would fetch from a database
  // For now, we'll return an empty array as Firebase doesn't provide this directly
  return []
}

// Save users (placeholder for compatibility)
export function saveUsers(users) {
  // This is a placeholder for compatibility with existing code
  // In a real app, this would save to a database
}

// Force set user role (for debugging)
export function setUserRole(role) {
  if (currentUser.value) {
    localStorage.setItem(`user_role_${currentUser.value.id}`, role)
    currentUser.value.role = role
    console.log('User role set to:', role)
  }
}

// Get current user info (for debugging)
export function getCurrentUserInfo() {
  return {
    user: currentUser.value,
    isLoggedIn: isLoggedIn.value,
    role: currentUser.value?.role,
    userId: currentUser.value?.id
  }
}
