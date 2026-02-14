<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)
const isLoading = ref(false)
const apiError = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!formData.email) {
    errors.email = 'Email is required'
    return false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  } else {
    errors.email = ''
    return true
  }
}

const validatePassword = () => {
  if (!formData.password) {
    errors.password = 'Password is required'
    return false
  } else if (formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    return false
  } else {
    errors.password = ''
    return true
  }
}

const handleSubmit = async () => {
  apiError.value = ''
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  if (!isEmailValid || !isPasswordValid) return

  isLoading.value = true
  try {
    const { success, message } = await authStore.login({
      email: formData.email,
      password: formData.password,
    })
    if (success) {
      router.push('/')
    } else {
      apiError.value = message || 'Invalid credentials'
    }
  } catch {
    apiError.value = 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4"
          >
            <LockClosedIcon class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Sign In</h2>
          <p class="mt-2 text-sm text-gray-600">Welcome back to LarVue</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
          <div
            v-if="apiError"
            class="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm"
          >
            {{ apiError }}
          </div>
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon
                  :class="['w-5 h-5', errors.email ? 'text-red-500' : 'text-gray-400']"
                />
              </div>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                @blur="validateEmail"
                @input="errors.email && validateEmail()"
                :class="[
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900 focus:border-transparent',
                ]"
                placeholder="you@example.com"
              />
              <ExclamationCircleIcon
                v-if="errors.email"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon
                  :class="['w-5 h-5', errors.password ? 'text-red-500' : 'text-gray-400']"
                />
              </div>
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                @blur="validatePassword"
                @input="errors.password && validatePassword()"
                :class="[
                  'w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors',
                  errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-gray-900 focus:border-transparent',
                ]"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeSlashIcon v-else class="w-5 h-5" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded cursor-pointer"
              />
              <label for="remember" class="ml-2 block text-sm text-gray-700 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Forgot password?
            </a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full px-4 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center',
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white',
            ]"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

          <!-- Sign Up Link -->
          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <RouterLink
              to="/register"
              class="font-medium text-gray-900 hover:underline transition-colors"
            >
              Sign up
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
