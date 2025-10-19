<script setup>
import { ref, computed, onMounted } from 'vue'
import { addRating, getUserRating, hasUserRated } from '../utils/ratings.js'

const emit = defineEmits(['close'])

const selectedRating = ref(0)
const hoveredRating = ref(0)
const feedback = ref('')
const isSubmitting = ref(false)
const showThankYou = ref(false)
const existingRating = ref(null)

// Check if user has already rated
onMounted(() => {
  if (hasUserRated()) {
    existingRating.value = getUserRating()
    selectedRating.value = existingRating.value.rating
    feedback.value = existingRating.value.feedback || ''
  }
})

// Handle star click
const handleStarClick = (rating) => {
  selectedRating.value = rating
}

// Handle star hover
const handleStarHover = (rating) => {
  hoveredRating.value = rating
}

// Handle star leave
const handleStarLeave = () => {
  hoveredRating.value = 0
}

// Get star class
const getStarClass = (star) => {
  const rating = hoveredRating.value || selectedRating.value
  return {
    'star': true,
    'filled': star <= rating,
    'hover': hoveredRating.value > 0 && star <= hoveredRating.value
  }
}

// Check if form is valid
const isFormValid = computed(() => {
  return selectedRating.value > 0
})

// Submit rating
const submitRating = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  
  try {
    const result = addRating({
      rating: selectedRating.value,
      feedback: feedback.value.trim()
    })
    
    if (result.success) {
      showThankYou.value = true
      
      // Auto close modal after 2 seconds
      setTimeout(() => {
        emit('close')
      }, 2000)
    } else {
      // Handle error case
      console.error('Rating submission failed:', result.message)
      alert(result.message || 'Failed to submit rating. Please try again.')
    }
  } catch (error) {
    console.error('Error submitting rating:', error)
    alert('An error occurred while submitting your rating. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Close modal
const closeModal = () => {
  emit('close')
}
</script>

<template>
  <div class="rating-modal-overlay" @click="closeModal">
    <div class="rating-modal" @click.stop>
      <!-- Thank You Message -->
      <div v-if="showThankYou" class="thank-you-message">
        <div class="thank-you-icon">🎉</div>
        <h3>Thank you for your feedback!</h3>
        <p>We will try to do better!</p>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <!-- Rating Form -->
      <div v-else class="rating-form">
        <div class="modal-header">
          <h3>{{ existingRating ? 'Update Your Rating' : 'Rate Our Website' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="rating-section">
            <p class="rating-label">How satisfied are you with our website?</p>
            <div class="stars-container">
              <span
                v-for="star in 5"
                :key="star"
                :class="getStarClass(star)"
                @click="handleStarClick(star)"
                @mouseenter="handleStarHover(star)"
                @mouseleave="handleStarLeave"
              >
                ★
              </span>
            </div>
            <p class="rating-text">
              {{ selectedRating === 0 ? 'Please select a rating' : 
                 selectedRating === 1 ? 'Very Dissatisfied' :
                 selectedRating === 2 ? 'Dissatisfied' :
                 selectedRating === 3 ? 'Neutral' :
                 selectedRating === 4 ? 'Satisfied' : 'Very Satisfied' }}
            </p>
          </div>
          
          <div class="feedback-section">
            <label for="feedback" class="feedback-label">
              Share your feedback (optional)
            </label>
            <textarea
              id="feedback"
              v-model="feedback"
              class="feedback-input"
              placeholder="Tell us your thoughts and suggestions..."
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ feedback.length }}/500</div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">
            Cancel
          </button>
          <button 
            class="btn-submit" 
            :class="{ 'disabled': !isFormValid || isSubmitting }"
            :disabled="!isFormValid || isSubmitting"
            @click="submitRating"
          >
            {{ isSubmitting ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rating-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.rating-modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Thank You Message */
.thank-you-message {
  text-align: center;
  padding: 3rem 2rem;
}

.thank-you-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.thank-you-message h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.thank-you-message p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: #3498db;
  border-radius: 50%;
  animation: loading 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Rating Form */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #ecf0f1;
  color: #2c3e50;
}

.modal-body {
  padding: 1.5rem 2rem;
}

.rating-section {
  text-align: center;
  margin-bottom: 2rem;
}

.rating-label {
  font-size: 1.1rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.stars-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.star {
  font-size: 2.5rem;
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.star.filled {
  color: #f39c12;
}

.star.hover {
  transform: scale(1.1);
}

.rating-text {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.feedback-section {
  margin-bottom: 1rem;
}

.feedback-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feedback-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  box-sizing: border-box;
}

.feedback-input:focus {
  outline: none;
  border-color: #3498db;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: #95a5a6;
  margin-top: 4px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 1rem 2rem 1.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #ecf0f1;
  color: #7f8c8d;
}

.btn-cancel:hover {
  background: #d5dbdb;
}

.btn-submit {
  background: #3498db;
  color: white;
}

.btn-submit:hover:not(.disabled) {
  background: #2980b9;
}

.btn-submit.disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .rating-modal {
    margin: 10px;
    max-width: none;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .star {
    font-size: 2rem;
  }
}
</style>
