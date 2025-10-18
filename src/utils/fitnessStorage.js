// Fitness workout progress storage utility

const FITNESS_STORAGE_KEY = 'fitness_workout_progress'

// Get all fitness progress data
export function getFitnessProgress() {
  try {
    const data = localStorage.getItem(FITNESS_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error loading fitness progress:', error)
    return {}
  }
}

// Save fitness progress data
export function saveFitnessProgress(progressData) {
  try {
    localStorage.setItem(FITNESS_STORAGE_KEY, JSON.stringify(progressData))
    return true
  } catch (error) {
    console.error('Error saving fitness progress:', error)
    return false
  }
}

// Get progress for a specific workout
export function getWorkoutProgress(workoutId) {
  const allProgress = getFitnessProgress()
  return allProgress[workoutId] || {
    started: false,
    currentExercise: 0,
    completedExercises: [],
    completed: false,
    startTime: null,
    endTime: null
  }
}

// Update workout progress
export function updateWorkoutProgress(workoutId, progressUpdate) {
  const allProgress = getFitnessProgress()
  const currentProgress = getWorkoutProgress(workoutId)
  
  const updatedProgress = {
    ...currentProgress,
    ...progressUpdate
  }
  
  allProgress[workoutId] = updatedProgress
  return saveFitnessProgress(allProgress)
}

// Complete an exercise
export function completeExercise(workoutId, exerciseIndex) {
  const currentProgress = getWorkoutProgress(workoutId)
  
  // Initialize if not started
  if (!currentProgress.started) {
    currentProgress.started = true
    currentProgress.startTime = new Date().toISOString()
    currentProgress.completedExercises = []
  }
  
  // Add exercise to completed list if not already completed
  if (!currentProgress.completedExercises.includes(exerciseIndex)) {
    currentProgress.completedExercises.push(exerciseIndex)
  }
  
  // Update current exercise position
  currentProgress.currentExercise = Math.max(currentProgress.currentExercise, exerciseIndex + 1)
  
  return updateWorkoutProgress(workoutId, currentProgress)
}

// Finish workout
export function finishWorkout(workoutId) {
  const currentProgress = getWorkoutProgress(workoutId)
  
  return updateWorkoutProgress(workoutId, {
    ...currentProgress,
    completed: true,
    endTime: new Date().toISOString()
  })
}

// Start workout
export function startWorkout(workoutId) {
  return updateWorkoutProgress(workoutId, {
    started: true,
    currentExercise: 0,
    completedExercises: [],
    completed: false,
    startTime: new Date().toISOString(),
    endTime: null
  })
}

// Calculate workout progress percentage
export function calculateWorkoutProgress(workoutId, totalExercises) {
  const progress = getWorkoutProgress(workoutId)
  
  if (!progress.started || totalExercises === 0) {
    return 0
  }
  
  return Math.round((progress.completedExercises.length / totalExercises) * 100)
}

// Get fitness statistics
export function getFitnessStats() {
  const allProgress = getFitnessProgress()
  const stats = {
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalExercises: 0,
    completedExercises: 0,
    totalTime: 0
  }
  
  Object.values(allProgress).forEach(workout => {
    stats.totalWorkouts++
    stats.totalExercises += workout.completedExercises.length
    
    if (workout.completed) {
      stats.completedWorkouts++
      stats.completedExercises += workout.completedExercises.length
      
      // Calculate time spent (if both start and end times exist)
      if (workout.startTime && workout.endTime) {
        const start = new Date(workout.startTime)
        const end = new Date(workout.endTime)
        stats.totalTime += (end - start) / (1000 * 60) // Convert to minutes
      }
    }
  })
  
  return stats
}
