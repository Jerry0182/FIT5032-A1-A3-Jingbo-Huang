// Role-based access control utilities
import { ROLES, hasRole, isAdmin, isUser, getUserRole } from './firebaseAuth.js'

// Define page permissions for different roles
export const PAGE_PERMISSIONS = {
  'home': [ROLES.USER, ROLES.ADMIN],
  'health-info': [ROLES.USER, ROLES.ADMIN],
  'health-assessment': [ROLES.USER, ROLES.ADMIN],
  'fitness': [ROLES.USER, ROLES.ADMIN],
  'about': [ROLES.USER, ROLES.ADMIN],
  'user-management': [ROLES.ADMIN], // Admin only
  'system-settings': [ROLES.ADMIN], // Admin only
  'login': [], // No role required
  'signup': [] // No role required
}

// Check if user has permission to access a page
export function canAccessPage(pageName) {
  // If not logged in, only allow login and signup pages
  if (!getUserRole()) {
    return ['login', 'signup'].includes(pageName)
  }
  
  const allowedRoles = PAGE_PERMISSIONS[pageName]
  if (!allowedRoles) {
    return false // Unknown page
  }
  
  return allowedRoles.includes(getUserRole())
}

// Get pages accessible by current user
export function getAccessiblePages() {
  const userRole = getUserRole()
  if (!userRole) {
    return ['home', 'login', 'signup', 'about']
  }
  
  const accessiblePages = []
  for (const [page, roles] of Object.entries(PAGE_PERMISSIONS)) {
    if (roles.includes(userRole)) {
      accessiblePages.push(page)
    }
  }
  
  return accessiblePages
}

// Get admin-only pages
export function getAdminPages() {
  return Object.entries(PAGE_PERMISSIONS)
    .filter(([page, roles]) => roles.length === 1 && roles.includes(ROLES.ADMIN))
    .map(([page]) => page)
}

// Check if page requires admin role
export function isAdminPage(pageName) {
  const allowedRoles = PAGE_PERMISSIONS[pageName]
  return allowedRoles && allowedRoles.length === 1 && allowedRoles.includes(ROLES.ADMIN)
}

// Get role display name
export function getRoleDisplayName(role) {
  const roleNames = {
    [ROLES.USER]: 'User',
    [ROLES.ADMIN]: 'Administrator'
  }
  return roleNames[role] || 'Unknown'
}

// Get role description
export function getRoleDescription(role) {
  const descriptions = {
    [ROLES.USER]: 'Regular user with access to health features',
    [ROLES.ADMIN]: 'Administrator with full system access and user management'
  }
  return descriptions[role] || 'Unknown role'
}
