// Health Assessment Cloud Functions integration
import { callCloudFunction, isCloudAvailable } from './cloudService.js'

// Local health assessment functions (fallback)
import { saveAssessment, getAssessments, getAssessmentStats } from './assessmentStorage.js'

// Cloud Function wrapper for health assessment calculation
export const calculateHealthScoreCloud = async (assessmentData) => {
  // Local calculation function as fallback
  const calculateLocal = async (data) => {
    let score = 0
    
    // Age factor (simplified)
    const age = parseInt(data.personalInfo.age) || 30
    if (age < 30) score += 20
    else if (age < 40) score += 15
    else if (age < 50) score += 10
    else score += 5
    
    // BMI factor
    const height = parseFloat(data.personalInfo.height) || 170
    const weight = parseFloat(data.personalInfo.weight) || 70
    const bmi = weight / Math.pow(height / 100, 2)
    
    if (bmi >= 18.5 && bmi <= 25) score += 20
    else if (bmi >= 25 && bmi <= 30) score += 10
    else score += 5
    
    // Activity level
    const activity = data.personalInfo.activityLevel
    if (activity === 'very-active') score += 20
    else if (activity === 'active') score += 15
    else if (activity === 'moderate') score += 10
    else if (activity === 'light') score += 5
    
    // Exercise frequency
    const exercise = data.lifestyle.exerciseFrequency
    if (exercise === 'Daily') score += 15
    else if (exercise === '5-6 times per week') score += 12
    else if (exercise === '3-4 times per week') score += 10
    else if (exercise === '1-2 times per week') score += 5
    
    // Sleep hours
    const sleep = parseInt(data.lifestyle.sleepHours) || 7
    if (sleep >= 7 && sleep <= 8) score += 10
    else if (sleep >= 6 && sleep <= 9) score += 5
    
    // Diet quality
    const diet = data.lifestyle.dietQuality
    if (diet === 'Excellent (well-balanced, nutritious)') score += 15
    else if (diet === 'Good (mostly healthy with occasional treats)') score += 10
    else if (diet === 'Fair (some healthy choices)') score += 5
    
    // Stress level
    const stress = data.lifestyle.stressLevel
    if (stress === 'Very Low' || stress === 'Low') score += 10
    else if (stress === 'Moderate') score += 5
    
    // Chronic conditions
    const conditions = data.healthHistory.chronicConditions || []
    if (conditions.length === 0 || conditions.includes('None')) score += 10
    else score -= conditions.length * 5
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score))
    
    // Generate basic recommendations
    const recommendations = []
    if (score < 50) {
      recommendations.push('Consult a healthcare professional for a comprehensive health check')
      recommendations.push('Improve lifestyle habits and increase exercise frequency')
    } else if (score < 70) {
      recommendations.push('Continue maintaining good lifestyle habits')
      recommendations.push('Consider further optimizing exercise and diet')
    } else {
      recommendations.push('Congratulations! Your health status is good')
      recommendations.push('Continue maintaining your current healthy lifestyle')
    }
    
    return {
      score,
      recommendations,
      status: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Improvement'
    }
  }
  
  try {
    // Try Cloud Function first, fallback to local
    const result = await callCloudFunction(
      'calculateHealthScore',
      assessmentData,
      calculateLocal
    )
    
    return result
  } catch (error) {
    console.error('Health score calculation failed:', error)
    // Final fallback to local calculation
    return await calculateLocal(assessmentData)
  }
}

// Cloud Function wrapper for getting health history
export const getHealthHistoryCloud = async () => {
  // Local history function as fallback
  const getLocalHistory = async () => {
    const assessments = getAssessments()
    return { assessments }
  }
  
  try {
    // Try Cloud Function first, fallback to local
    const result = await callCloudFunction(
      'getHealthHistory',
      {},
      getLocalHistory
    )
    
    return result
  } catch (error) {
    console.error('Failed to get health history:', error)
    // Final fallback to local storage
    return await getLocalHistory()
  }
}

// Save assessment with Cloud Function support
export const saveAssessmentCloud = async (assessmentData) => {
  // Always save locally for backup
  const localResult = saveAssessment(assessmentData)
  
  // Try to save to cloud if available
  if (isCloudAvailable()) {
    try {
      // The Cloud Function automatically saves when calculateHealthScore is called
      console.log('Assessment data will be saved to cloud via calculateHealthScore function')
    } catch (error) {
      console.warn('Failed to save to cloud, but local save succeeded:', error)
    }
  }
  
  return localResult
}
