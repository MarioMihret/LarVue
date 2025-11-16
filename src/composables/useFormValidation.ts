import { reactive } from 'vue'

export function useFormValidation() {
  const errors = reactive<Record<string, string>>({})

  // Simple validation functions
  function validateRequired(field: string, value: string) {
    if (!value || value.trim() === '') {
      errors[field] = 'This field is required'
      return false
    }
    errors[field] = ''
    return true
  }

  function validateEmail(field: string, value: string) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(value)) {
      errors[field] = 'Please enter a valid email'
      return false
    }
    errors[field] = ''
    return true
  }

  function validatePassword(field: string, value: string) {
    if (value.length < 8) {
      errors[field] = 'Password must be at least 8 characters'
      return false
    }
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /\d/.test(value)
    
    if (!hasUpper || !hasLower || !hasNumber) {
      errors[field] = 'Password must have uppercase, lowercase and number'
      return false
    }
    errors[field] = ''
    return true
  }

  function validatePhone(field: string, value: string) {
    if (value.length < 10) {
      errors[field] = 'Phone number must be at least 10 digits'
      return false
    }
    errors[field] = ''
    return true
  }

  function getPasswordStrength(password: string) {
    let score = 0
    
    if (password.length >= 8) score = score + 1
    if (password.length >= 12) score = score + 1
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score = score + 1
    if (/\d/.test(password)) score = score + 1
    if (/[^a-zA-Z0-9]/.test(password)) score = score + 1

    if (score <= 2) {
      return {
        width: '33%',
        color: 'bg-red-500',
        textColor: 'text-red-600',
        label: 'Weak'
      }
    }
    if (score <= 3) {
      return {
        width: '66%',
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        label: 'Medium'
      }
    }
    return {
      width: '100%',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      label: 'Strong'
    }
  }

  return {
    errors,
    validateRequired,
    validateEmail,
    validatePassword,
    validatePhone,
    getPasswordStrength
  }
}
