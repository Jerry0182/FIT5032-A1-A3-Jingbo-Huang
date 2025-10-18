// Assessment data storage utilities
const STORAGE_KEY = 'health_assessments'

// Get all assessments from localStorage
export function getAssessments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading assessments from localStorage:', error)
    return []
  }
}

// Save assessment to localStorage
export function saveAssessment(assessmentData) {
  try {
    const assessments = getAssessments()
    
    // Create new assessment object
    const newAssessment = {
      id: Date.now(), // Use timestamp as unique ID
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      type: assessmentData.type,
      score: assessmentData.score,
      status: getStatusFromScore(assessmentData.score),
      recommendations: assessmentData.recommendations || [],
      createdAt: new Date().toISOString()
    }
    
    // Add to beginning of array (most recent first)
    assessments.unshift(newAssessment)
    
    // Keep only last 50 assessments to prevent localStorage overflow
    if (assessments.length > 50) {
      assessments.splice(50)
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments))
    
    return newAssessment
  } catch (error) {
    console.error('Error saving assessment to localStorage:', error)
    return null
  }
}

// Get status based on score
function getStatusFromScore(score) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  return 'Needs Improvement'
}

// Get assessments by type
export function getAssessmentsByType(type) {
  const assessments = getAssessments()
  return type ? assessments.filter(a => a.type === type) : assessments
}

// Get latest assessment
export function getLatestAssessment() {
  const assessments = getAssessments()
  return assessments.length > 0 ? assessments[0] : null
}

// Get assessment statistics
export function getAssessmentStats() {
  const assessments = getAssessments()
  
  if (assessments.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      byType: {},
      recentTrend: 'No data'
    }
  }
  
  // Calculate average score
  const totalScore = assessments.reduce((sum, a) => sum + a.score, 0)
  const averageScore = Math.round(totalScore / assessments.length)
  
  // Group by type
  const byType = assessments.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1
    return acc
  }, {})
  
  // Calculate recent trend (last 3 vs previous 3)
  let recentTrend = 'Stable'
  if (assessments.length >= 6) {
    const recent = assessments.slice(0, 3)
    const previous = assessments.slice(3, 6)
    const recentAvg = recent.reduce((sum, a) => sum + a.score, 0) / 3
    const previousAvg = previous.reduce((sum, a) => sum + a.score, 0) / 3
    
    if (recentAvg > previousAvg + 5) recentTrend = 'Improving'
    else if (recentAvg < previousAvg - 5) recentTrend = 'Declining'
  }
  
  return {
    total: assessments.length,
    averageScore,
    byType,
    recentTrend
  }
}

// Clear all assessments (for testing)
export function clearAllAssessments() {
  localStorage.removeItem(STORAGE_KEY)
}

// Delete specific assessment
export function deleteAssessment(assessmentId) {
  try {
    const assessments = getAssessments()
    const filtered = assessments.filter(a => a.id !== assessmentId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting assessment:', error)
    return false
  }
}
