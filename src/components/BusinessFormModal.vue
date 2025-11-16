<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingBusiness ? 'Edit Business' : 'Add New Business' }}
          </h2>
          <button @click="closeModal" type="button" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ errorMessage }}
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., ABC Restaurant"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
            <input
              v-model="form.type"
              type="text"
              required
              placeholder="e.g., restaurant, cafe, hotel"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.type }"
            />
            <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type[0] }}</p>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              v-model="form.location"
              type="text"
              required
              placeholder="e.g., Addis Ababa, Ethiopia"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.location }"
            />
            <p v-if="errors.location" class="mt-1 text-sm text-red-600">{{ errors.location[0] }}</p>
          </div>

          <!-- TIN (Optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">TIN (optional)</label>
            <input
              v-model="form.tin"
              type="text"
              placeholder="Tax Identification Number"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.tin }"
            />
            <p v-if="errors.tin" class="mt-1 text-sm text-red-600">{{ errors.tin[0] }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ editingBusiness ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { Business, BusinessFormData } from '@/stores/business'

interface Props {
  isOpen: boolean
  editingBusiness: Business | null
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: BusinessFormData]
}>()

const form = ref<BusinessFormData>({
  name: '',
  type: '',
  location: '',
  tin: ''
})

const errors = ref<any>({}) // eslint-disable-line @typescript-eslint/no-explicit-any
const errorMessage = ref('')

const closeModal = () => {
  form.value = {
    name: '',
    type: '',
    location: '',
    tin: ''
  }
  errors.value = {}
  errorMessage.value = ''
  emit('close')
}

const handleSubmit = async () => {
  errors.value = {}
  errorMessage.value = ''

  try {
    emit('submit', form.value)
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    }
    errorMessage.value = err.response?.data?.message || 'An error occurred'
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.editingBusiness) {
    form.value = {
      name: props.editingBusiness.name,
      type: props.editingBusiness.type,
      location: props.editingBusiness.location,
      tin: ''
    }
  } else if (!isOpen) {
    form.value = {
      name: '',
      type: '',
      location: '',
      tin: ''
    }
    errors.value = {}
    errorMessage.value = ''
  }
})
</script>
