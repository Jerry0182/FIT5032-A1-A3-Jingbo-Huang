<script setup>
import { ref, onMounted, computed } from 'vue'
import { getUsers, updateUserRole, ROLES } from '../utils/auth.js'
import { getRoleDisplayName, getRoleDescription } from '../utils/roles.js'

const users = ref([])
const loading = ref(true)
const message = ref('')
const messageType = ref('')

// Load all users
const loadUsers = () => {
  loading.value = true
  users.value = getUsers()
  loading.value = false
}

// Update user role
const updateRole = (userId, newRole) => {
  const result = updateUserRole(userId, newRole)
  
  if (result.success) {
    message.value = result.message
    messageType.value = 'success'
    loadUsers() // Reload users
  } else {
    message.value = result.message
    messageType.value = 'error'
  }
  
  // Clear message after 3 seconds
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

// Get available roles for dropdown
const availableRoles = computed(() => [
  { value: ROLES.USER, label: getRoleDisplayName(ROLES.USER) },
  { value: ROLES.ADMIN, label: getRoleDisplayName(ROLES.ADMIN) }
])

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-management-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <!-- Header -->
          <div class="page-header">
            <h1 class="display-4 fw-bold text-white mb-3">User Management</h1>
            <p class="lead text-white-50 mb-4">Manage user accounts and roles</p>
          </div>

          <!-- Message -->
          <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-danger']">
            {{ message }}
          </div>

          <!-- Users Table -->
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">All Users</h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              
              <div v-else-if="users.length === 0" class="text-center py-4">
                <p class="text-muted">No users found.</p>
              </div>
              
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span :class="['badge', user.role === 'admin' ? 'bg-danger' : 'bg-primary']">
                          {{ getRoleDisplayName(user.role) }}
                        </span>
                      </td>
                      <td>{{ formatDate(user.createdAt) }}</td>
                      <td>
                        <select 
                          :value="user.role" 
                          @change="updateRole(user.id, $event.target.value)"
                          class="form-select form-select-sm"
                          style="width: auto;"
                        >
                          <option 
                            v-for="role in availableRoles" 
                            :key="role.value" 
                            :value="role.value"
                          >
                            {{ role.label }}
                          </option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-body text-center">
                  <h3 class="text-primary">{{ users.filter(u => u.role === 'user').length }}</h3>
                  <p class="text-muted mb-0">Regular Users</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-body text-center">
                  <h3 class="text-danger">{{ users.filter(u => u.role === 'admin').length }}</h3>
                  <p class="text-muted mb-0">Administrators</p>
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
.user-management-page {
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

.table th {
  border-top: none;
  font-weight: 600;
  color: #495057;
}

.badge {
  font-size: 0.75rem;
}

.alert {
  border-radius: 8px;
  border: none;
}

.alert-success {
  background-color: #d1edff;
  color: #0c5460;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.spinner-border {
  color: #667eea;
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .user-management-page {
    margin-top: 66px;
    padding: 1rem 0;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .display-4 {
    font-size: 2rem;
  }
}
</style>
