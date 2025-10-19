// Rating management utilities
import { currentUser } from './firebaseAuth.js'

// Rating data storage key
const RATINGS_KEY = 'health_app_ratings'

// Get all ratings
export function getAllRatings() {
  const ratings = localStorage.getItem(RATINGS_KEY)
  return ratings ? JSON.parse(ratings) : []
}

// Save ratings data
export function saveRatings(ratings) {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

// Add a new rating
export function addRating(ratingData) {
  // Check if user is logged in
  if (!currentUser.value) {
    return { success: false, message: 'User not logged in' }
  }
  
  const ratings = getAllRatings()
  
  // Check if user has already rated
  const existingRating = ratings.find(rating => rating.userId === currentUser.value.id)
  
  if (existingRating) {
    // Update existing rating
    const index = ratings.findIndex(rating => rating.userId === currentUser.value.id)
    ratings[index] = {
      ...existingRating,
      rating: ratingData.rating,
      feedback: ratingData.feedback || '',
      updatedAt: new Date().toISOString()
    }
  } else {
    // Add new rating
    const newRating = {
      id: `rating_${Date.now()}`,
      userId: currentUser.value.id,
      userEmail: currentUser.value.email,
      userName: currentUser.value.name,
      rating: ratingData.rating,
      feedback: ratingData.feedback || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    ratings.push(newRating)
  }
  
  saveRatings(ratings)
  return { success: true, message: 'Rating submitted successfully!' }
}

// Get user's rating
export function getUserRating() {
  if (!currentUser.value) return null
  
  const ratings = getAllRatings()
  return ratings.find(rating => rating.userId === currentUser.value.id) || null
}

// Check if user has rated
export function hasUserRated() {
  return getUserRating() !== null
}

// Calculate average rating
export function getAverageRating() {
  const ratings = getAllRatings()
  if (ratings.length === 0) return 0
  
  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0)
  return Math.round((totalRating / ratings.length) * 10) / 10 // Round to 1 decimal place
}

// Get rating statistics
export function getRatingStats() {
  const ratings = getAllRatings()
  
  if (ratings.length === 0) {
    return {
      totalRatings: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      recentRatings: []
    }
  }
  
  const totalRatings = ratings.length
  const averageRating = getAverageRating()
  
  // Calculate rating distribution
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  ratings.forEach(rating => {
    ratingDistribution[rating.rating]++
  })
  
  // Get recent ratings (last 10)
  const recentRatings = ratings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
  
  return {
    totalRatings,
    averageRating,
    ratingDistribution,
    recentRatings
  }
}

// Get rating count by star
export function getRatingCount(star) {
  const ratings = getAllRatings()
  return ratings.filter(rating => rating.rating === star).length
}

// Format date for display
export function formatRatingDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
