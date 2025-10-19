// Safe Cloud Functions integration with error handling
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../config/firebase.js'

// Cloud Functions availability flag
let cloudFunctionsAvailable = false
let functions = null

// Initialize Firebase Functions with error handling
try {
  console.log('Attempting to initialize Firebase Functions...')
  console.log('Firebase app:', app)
  functions = getFunctions(app)
  cloudFunctionsAvailable = true
  console.log('✅ Cloud Functions initialized successfully')
  console.log('Functions instance:', functions)
} catch (error) {
  console.error('❌ Cloud Functions initialization failed:', error)
  console.error('Error details:', error.message, error.stack)
  console.log('Will use local functions as fallback')
}

// Check if Cloud Functions are available
export const isCloudAvailable = () => cloudFunctionsAvailable

// Cloud Function URLs
const CLOUD_FUNCTION_URLS = {
  sendHealthEmail: 'https://us-central1-men-s-health-b3367.cloudfunctions.net/sendHealthEmail',
  calculateHealthScore: 'https://us-central1-men-s-health-b3367.cloudfunctions.net/calculateHealthScore',
  getHealthHistory: 'https://us-central1-men-s-health-b3367.cloudfunctions.net/getHealthHistory'
}

// Safe Cloud Function caller with fallback
export const callCloudFunction = async (functionName, data, fallbackFunction) => {
  if (!cloudFunctionsAvailable) {
    console.log(`Cloud Function ${functionName} not available, using fallback`)
    if (fallbackFunction) {
      return await fallbackFunction(data)
    }
    throw new Error(`Cloud Function ${functionName} not available and no fallback provided`)
  }

  try {
    console.log(`Calling Cloud Function: ${functionName}`)
    const url = CLOUD_FUNCTION_URLS[functionName]
    if (!url) {
      throw new Error(`No URL configured for function: ${functionName}`)
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log(`Cloud Function ${functionName} succeeded`)
    return result
  } catch (error) {
    console.warn(`Cloud Function ${functionName} failed:`, error.message)
    if (fallbackFunction) {
      console.log(`Falling back to local function for ${functionName}`)
      return await fallbackFunction(data)
    }
    throw error
  }
}

// Individual Cloud Function exports (for direct use if needed)
export const getCloudFunctions = () => {
  if (!cloudFunctionsAvailable || !functions) {
    return {
      sendHealthEmail: null,
      calculateHealthScore: null,
      getHealthHistory: null
    }
  }

  return {
    sendHealthEmail: httpsCallable(functions, 'sendHealthEmail'),
    calculateHealthScore: httpsCallable(functions, 'calculateHealthScore'),
    getHealthHistory: httpsCallable(functions, 'getHealthHistory')
  }
}
