<template>
  <div class="email-sender">
    <!-- Email Sender Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Share Health Article</h3>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="sender-name">Your Name (Optional):</label>
            <input 
              type="text" 
              id="sender-name"
              v-model="senderName" 
              placeholder="Enter your name"
            >
          </div>
          
          <div class="preview-section">
            <h4>Preview:</h4>
            <div class="article-preview">
              <h5>{{ selectedArticle.title }}</h5>
              <p class="category">{{ selectedArticle.category }}</p>
              <p class="content">{{ selectedArticle.content }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button 
            class="btn-send" 
            @click="sendEmail"
            :disabled="isSending"
          >
            {{ isSending ? 'Sending...' : 'Send Article' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Success/Error Messages -->
    <div v-if="message" class="message" :class="messageType">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { sendHealthArticleEmail, getRandomHealthArticle } from '../utils/emailService.js'

export default {
  name: 'EmailSender',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      senderName: '',
      isSending: false,
      message: '',
      messageType: '',
      selectedArticle: null
    }
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.resetForm()
        this.selectRandomArticle()
      }
    }
  },
  methods: {
    selectRandomArticle() {
      this.selectedArticle = getRandomHealthArticle()
    },
    
    resetForm() {
      this.senderName = ''
      this.isSending = false
      this.message = ''
      this.messageType = ''
    },
    
    async sendEmail() {
      this.isSending = true
      this.message = ''
      
      try {
        // Use a default email address for sending to yourself
        const defaultEmail = 'your-email@example.com' // You can change this to your actual email
        const result = await sendHealthArticleEmail(
          defaultEmail, 
          this.senderName || 'Anonymous'
        )
        
        if (result.success) {
          this.showMessage(result.message, 'success')
          setTimeout(() => {
            this.closeModal()
          }, 2000)
        } else {
          this.showMessage(result.message, 'error')
        }
      } catch (error) {
        this.showMessage('An error occurred while sending email', 'error')
        console.error('Email sending error:', error)
      } finally {
        this.isSending = false
      }
    },
    
    showMessage(text, type) {
      this.message = text
      this.messageType = type
      setTimeout(() => {
        this.message = ''
        this.messageType = ''
      }, 5000)
    },
    
    closeModal() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.email-sender {
  position: relative;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.close-btn:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

.preview-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.preview-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.article-preview {
  background: white;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.article-preview h5 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
}

.article-preview .category {
  margin: 0 0 10px 0;
  color: #7f8c8d;
  font-style: italic;
  font-size: 14px;
}

.article-preview .content {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-cancel, .btn-send {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover {
  background-color: #7f8c8d;
}

.btn-send {
  background-color: #3498db;
  color: white;
}

.btn-send:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-send:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  z-index: 1001;
  max-width: 300px;
}

.message.success {
  background-color: #27ae60;
}

.message.error {
  background-color: #e74c3c;
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header, .modal-body, .modal-footer {
    padding: 15px;
  }
}
</style>
