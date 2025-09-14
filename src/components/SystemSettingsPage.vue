<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '../utils/auth.js'

const settings = ref({
  siteName: 'Men Health Platform',
  maintenanceMode: false,
  allowRegistration: true,
  maxUsers: 1000
})

const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  systemUptime: '99.9%'
})

const message = ref('')
const messageType = ref('')

// Load system statistics
const loadStats = () => {
  const users = getUsers()
  stats.value.totalUsers = users.length
  stats.value.activeUsers = users.filter(user => {
    // Simple check: users created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return new Date(user.createdAt) > thirtyDaysAgo
  }).length
}

// Save settings
const saveSettings = () => {
  // In a real application, this would save to a backend
  localStorage.setItem('systemSettings', JSON.stringify(settings.value))
  
  message.value = 'Settings saved successfully!'
  messageType.value = 'success'
  
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

// Reset to defaults
const resetSettings = () => {
  settings.value = {
    siteName: 'Men Health Platform',
    maintenanceMode: false,
    allowRegistration: true,
    maxUsers: 1000
  }
  
  message.value = 'Settings reset to defaults!'
  messageType.value = 'info'
  
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

onMounted(() => {
  loadStats()
  
  // Load saved settings
  const savedSettings = localStorage.getItem('systemSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
})
</script>

<template>
  <div class="system-settings-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">System Settings</h1>
            <p class="lead text-white-50 mb-4">Configure system preferences and monitor performance</p>
          </div>

          <!-- Message -->
          <div v-if="message" :class="['alert', `alert-${messageType}`]">
            {{ message }}
          </div>

          <!-- System Statistics -->
          <div class="row mb-4">
            <div class="col-md-4">
              <div class="card stat-card">
                <div class="card-body text-center">
                  <h3 class="text-primary">{{ stats.totalUsers }}</h3>
                  <p class="text-muted mb-0">Total Users</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stat-card">
                <div class="card-body text-center">
                  <h3 class="text-success">{{ stats.activeUsers }}</h3>
                  <p class="text-muted mb-0">Active Users (30 days)</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card stat-card">
                <div class="card-body text-center">
                  <h3 class="text-info">{{ stats.systemUptime }}</h3>
                  <p class="text-muted mb-0">System Uptime</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Form -->
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">General Settings</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveSettings">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="siteName" class="form-label">Site Name</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="siteName"
                        v-model="settings.siteName"
                        placeholder="Enter site name"
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="maxUsers" class="form-label">Maximum Users</label>
                      <input 
                        type="number" 
                        class="form-control" 
                        id="maxUsers"
                        v-model.number="settings.maxUsers"
                        min="1"
                        max="10000"
                      >
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="form-check mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="maintenanceMode"
                        v-model="settings.maintenanceMode"
                      >
                      <label class="form-check-label" for="maintenanceMode">
                        Maintenance Mode
                      </label>
                      <div class="form-text">Enable to put the site in maintenance mode</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check mb-3">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="allowRegistration"
                        v-model="settings.allowRegistration"
                      >
                      <label class="form-check-label" for="allowRegistration">
                        Allow New Registrations
                      </label>
                      <div class="form-text">Allow new users to register</div>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save"></i> Save Settings
                  </button>
                  <button type="button" class="btn btn-outline-secondary" @click="resetSettings">
                    <i class="bi bi-arrow-clockwise"></i> Reset to Defaults
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- System Information -->
          <div class="card mt-4">
            <div class="card-header">
              <h5 class="card-title mb-0">System Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <dl class="row">
                    <dt class="col-sm-4">Version:</dt>
                    <dd class="col-sm-8">1.0.0</dd>
                    
                    <dt class="col-sm-4">Environment:</dt>
                    <dd class="col-sm-8">Development</dd>
                    
                    <dt class="col-sm-4">Last Updated:</dt>
                    <dd class="col-sm-8">{{ new Date().toLocaleDateString() }}</dd>
                  </dl>
                </div>
                <div class="col-md-6">
                  <dl class="row">
                    <dt class="col-sm-4">Database:</dt>
                    <dd class="col-sm-8">LocalStorage</dd>
                    
                    <dt class="col-sm-4">Framework:</dt>
                    <dd class="col-sm-8">Vue 3 + Vite</dd>
                    
                    <dt class="col-sm-4">Status:</dt>
                    <dd class="col-sm-8">
                      <span class="badge bg-success">Online</span>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.system-settings-page {
  margin-top: 60px;
  padding: 2rem 0;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  border-radius: 12px 12px 0 0 !important;
}

.stat-card {
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.form-control {
  border-radius: 8px;
  border: 1px solid #ced4da;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.alert {
  border-radius: 8px;
  border: none;
}

.alert-success {
  background-color: #d1edff;
  color: #0c5460;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .system-settings-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .display-4 {
    font-size: 2rem;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .d-flex.gap-2 .btn {
    width: 100%;
  }
}
</style>
