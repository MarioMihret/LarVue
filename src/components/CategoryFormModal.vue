<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
    <div class="flex min-h-screen items-center justify-center px-4">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
      
      <div class="relative bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ category ? 'Edit Category' : 'Create Category' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- API Error -->
          <div v-if="apiError" class="rounded-md bg-red-50 border border-red-200 text-red-700 p-3 text-sm">
            {{ apiError }}
          </div>

          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g., Appetizers"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Description Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Brief description..."
            ></textarea>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            <div v-if="imagePreview" class="mb-3">
              <img :src="imagePreview" alt="Preview" class="h-32 w-full object-cover rounded-lg" />
              <button
                type="button"
                @click="removeImage"
                class="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove image
              </button>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Saving...' : category ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/category'
import type { Category } from '@/stores/category'
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  category?: Category | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'success'])

const categoryStore = useCategoryStore()

const formData = reactive({
  name: '',
  description: '',
  image: null as File | null
})

const errors = reactive({
  name: ''
})

const fileInput = ref<HTMLInputElement>()
const imagePreview = ref<string>('')
const isLoading = ref(false)
const apiError = ref('')

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    formData.image = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.image = null
  imagePreview.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

const handleSubmit = async () => {
  apiError.value = ''
  errors.name = ''

  if (!formData.name.trim()) {
    errors.name = 'Category name is required'
    return
  }

  isLoading.value = true

  try {
    const result = props.category
      ? await categoryStore.updateCategory(props.category.id, formData)
      : await categoryStore.createCategory(formData)

    if (result.success) {
      emit('success')
    } else {
      if (result.errors?.name && result.errors.name[0]) {
        errors.name = result.errors.name[0]
      }
      apiError.value = result.message || 'Operation failed'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.category) {
    formData.name = props.category.name
    formData.description = props.category.description || ''
    if (props.category.image) {
      imagePreview.value = props.category.image
    }
  }
})
</script>
