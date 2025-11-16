import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

interface User {
  id: number
  name: string
  email: string
  phone: string
  business_name: string
  tin: string
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  password_confirmation?: string
  business_name: string
  tin: string
}

interface LoginData {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/register', data)
      
      // Store token and user data
      token.value = response.data.token || response.data.access_token
      user.value = response.data.user || response.data.data
      
      // Save to localStorage
      localStorage.setItem('auth_token', token.value || '')
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, data: response.data }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorData = err.response?.data
      const errorMessage = errorData?.message || errorData?.error || 'Registration failed'
      error.value = errorMessage
      
      if (errorData?.errors) {
        return { 
          success: false, 
          errors: errorData.errors,
          message: errorMessage
        }
      }
      
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const login = async (data: LoginData) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/login', data)
      
      // Store token and user data
      token.value = response.data.token || response.data.access_token
      user.value = response.data.user || response.data.data
      
      // Save to localStorage
      localStorage.setItem('auth_token', token.value || '')
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return { success: true, data: response.data }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errorData = err.response?.data
      const errorMessage = errorData?.message || errorData?.error || 'Login failed'
      error.value = errorMessage
      
      return { success: false, message: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    // Clear state
    user.value = null
    token.value = null
    error.value = null
    
    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    // Restore auth state from localStorage
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        // If parsing fails, clear invalid data
        logout()
      }
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    // Actions
    register,
    login,
    logout,
    initializeAuth
  }
})
