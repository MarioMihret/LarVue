<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useFormValidation } from '@/composables/useFormValidation'
import FormInput from '@/components/FormInput.vue'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const { errors, getPasswordStrength } = useFormValidation()

// Simple validation functions
function validateField(field: string, value: string, minLength = 0) {
  if (!value || value.trim() === '') {
    errors[field] = `${field.replace('_', ' ')} is required`
    return false
  }
  if (minLength > 0 && value.trim().length < minLength) {
    errors[field] = `Must be at least ${minLength} characters`
    return false
  }
  errors[field] = ''
  return true
}

function validateEmailField(value: string) {
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.email = 'Please enter a valid email'
    return false
  }
  errors.email = ''
  return true
}

function validatePasswordField(value: string) {
  if (!value || value.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
    errors.password = 'Password must have uppercase, lowercase and number'
    return false
  }
  errors.password = ''
  return true
}

const formData: Record<string, string | boolean> = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  business_name: '',
  tin: '',
  acceptTerms: false,
})

const isLoading = ref(false)
const apiError = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Validators
const validateName = () => validateField('name', formData.name as string, 2)
const validateEmail = () => validateEmailField(formData.email as string)
const validatePhone = () => validateField('phone', formData.phone as string, 10)
const validateBusinessName = () =>
  validateField('business_name', formData.business_name as string, 2)
const validateTin = () => validateField('tin', formData.tin as string, 5)
const validatePassword = () => validatePasswordField(formData.password as string)
const validateConfirmPassword = () => {
  if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }
  errors.confirmPassword = ''
  return true
}
const validateTerms = () => {
  if (!formData.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms'
    return false
  }
  errors.acceptTerms = ''
  return true
}

const strength = computed(() => getPasswordStrength(formData.password as string))

// Form fields configuration (computed so isVisible updates reactively)
const formFields = computed(() => [
  {
    id: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'John Doe',
    icon: UserIcon,
    validate: validateName,
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    icon: EnvelopeIcon,
    validate: validateEmail,
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '09xxxxxxxx',
    icon: PhoneIcon,
    validate: validatePhone,
  },
  {
    id: 'business_name',
    label: 'Business Name',
    type: 'text',
    placeholder: 'ABC Restaurant',
    icon: BuildingOfficeIcon,
    validate: validateBusinessName,
  },
  {
    id: 'tin',
    label: 'TIN',
    type: 'text',
    placeholder: '123456789',
    icon: IdentificationIcon,
    validate: validateTin,
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    icon: LockClosedIcon,
    showToggle: true,
    isVisible: showPassword.value,
    validate: validatePassword,
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: '••••••••',
    icon: LockClosedIcon,
    showToggle: true,
    isVisible: showConfirmPassword.value,
    validate: validateConfirmPassword,
  },
])

const handleSubmit = async () => {
  apiError.value = ''
  // Clear previous backend errors
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const isValid = [
    validateName(),
    validateEmail(),
    validatePhone(),
    validateBusinessName(),
    validateTin(),
    validatePassword(),
    validateConfirmPassword(),
    validateTerms(),
  ].every((v) => v)

  if (!isValid) return

  isLoading.value = true
  try {
    const result = await authStore.register({
      name: formData.name as string,
      email: formData.email as string,
      phone: formData.phone as string,
      password: formData.password as string,
      password_confirmation: formData.password as string,
      business_name: formData.business_name as string,
      tin: formData.tin as string,
    })

    if (result.success) {
      router.push('/')
    } else {
      // Handle backend validation errors
      if (result.errors) {
        Object.keys(result.errors).forEach((field) => {
          const fieldErrors = result.errors?.[field]
          if (fieldErrors && fieldErrors.length > 0 && fieldErrors[0]) {
            errors[field] = fieldErrors[0]
          }
        })
      }
      apiError.value = result.message || 'Registration failed.'
    }
  } catch {
    apiError.value = 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4"
          >
            <UserPlusIcon class="w-8 h-8 text-white" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Create Account</h2>
          <p class="mt-2 text-sm text-gray-600">Start your free trial today</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
          <!-- API Error -->
          <div
            v-if="apiError"
            class="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm"
          >
            {{ apiError }}
          </div>

          <!-- Form Fields -->
          <FormInput
            v-for="field in formFields"
            :key="field.id"
            :id="field.id"
            :label="field.label"
            v-model="formData[field.id] as string"
            :type="field.type"
            :placeholder="field.placeholder"
            :error="errors[field.id]"
            :icon="field.icon"
            :show-toggle="field.showToggle"
            :toggle-icon="field.showToggle ? (field.isVisible ? EyeSlashIcon : EyeIcon) : undefined"
            :is-password-visible="field.showToggle ? field.isVisible : false"
            @blur="field.validate()"
            @input="errors[field.id] && field.validate()"
            @toggle="
              field.id === 'password'
                ? (showPassword = !showPassword)
                : (showConfirmPassword = !showConfirmPassword)
            "
          >
            <template
              v-if="field.id === 'password' && formData.password && !errors.password"
              #extra
            >
              <div class="mt-2 flex items-center gap-2">
                <div class="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    class="h-full transition-all duration-300"
                    :class="strength.color"
                    :style="{ width: strength.width }"
                  ></div>
                </div>
                <span class="text-xs font-medium" :class="strength.textColor">{{
                  strength.label
                }}</span>
              </div>
            </template>
          </FormInput>

          <!-- Terms Checkbox -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="formData.acceptTerms"
              type="checkbox"
              @change="validateTerms"
              :class="[
                'h-4 w-4 focus:ring-gray-900 border-gray-300 rounded mt-1 cursor-pointer',
                errors.acceptTerms ? 'border-red-500' : 'text-gray-900',
              ]"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-700 cursor-pointer">
              I agree to the
              <a href="#" class="text-gray-900 hover:underline font-medium">Terms of Service</a> and
              <a href="#" class="text-gray-900 hover:underline font-medium">Privacy Policy</a>
            </label>
          </div>
          <p v-if="errors.acceptTerms" class="-mt-3 text-sm text-red-600">
            {{ errors.acceptTerms }}
          </p>

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
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </button>

          <!-- Sign In Link -->
          <p class="text-center text-sm text-gray-600">
            Already have an account?
            <RouterLink
              to="/login"
              class="font-medium text-gray-900 hover:underline transition-colors"
            >
              Sign in
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
