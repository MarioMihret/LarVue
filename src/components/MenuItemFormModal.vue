<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ editingItem ? 'Edit Menu Item' : 'Add New Menu Item' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {{ errorMessage }}
          </div>

          <!-- Item Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              v-model="form.item_name"
              type="text"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.item_name }"
            />
            <p v-if="errors.item_name" class="mt-1 text-sm text-red-600">{{ errors.item_name[0] }}</p>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              v-model="form.category_id"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.category_id }"
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="mt-1 text-sm text-red-600">{{ errors.category_id[0] }}</p>
          </div>

          <!-- Business -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Business *</label>
            <select
              v-model="form.business_id"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': errors.business_id }"
            >
              <option value="">{{ businesses.length === 0 ? 'No businesses available - Please create one first' : 'Select a business' }}</option>
              <option v-for="business in businesses" :key="business.id" :value="business.id">
                {{ business.name }} ({{ business.type }})
              </option>
            </select>
            <p v-if="businesses.length === 0" class="mt-1 text-sm text-yellow-600">
              ⚠️ You need to create a business first before adding menu items.
            </p>
            <p v-if="errors.business_id" class="mt-1 text-sm text-red-600">{{ errors.business_id[0] }}</p>
          </div>

          <!-- Price, Tax, Discount Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.price }"
              />
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tax % *</label>
              <input
                v-model.number="form.tax_percentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.tax_percentage }"
              />
              <p v-if="errors.tax_percentage" class="mt-1 text-sm text-red-600">{{ errors.tax_percentage[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Discount *</label>
              <input
                v-model.number="form.discount"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.discount }"
              />
              <p v-if="errors.discount" class="mt-1 text-sm text-red-600">{{ errors.discount[0] }}</p>
            </div>
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Photo (optional)</label>
            <div class="flex items-start gap-4">
              <div class="flex-1">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p v-if="errors.photo" class="mt-1 text-sm text-red-600">{{ errors.photo[0] }}</p>
              </div>
              
              <div v-if="imagePreview" class="relative">
                <img :src="imagePreview" alt="Preview" class="w-20 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XMarkIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
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
              {{ editingItem ? 'Update' : 'Create' }}
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
import type { MenuItem, Business } from '@/stores/menuItem'
import type { Category } from '@/stores/category'

interface Props {
  isOpen: boolean
  editingItem: MenuItem | null
  categories: Category[]
  businesses: Business[]
  loading: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  submit: [data: FormData]
}>()

interface MenuItemFormData {
  item_name: string
  category_id: number | string
  business_id: number | string
  price: number | string
  tax_percentage: number | string
  discount: number | string
}

const form = ref<MenuItemFormData>({
  item_name: '',
  category_id: '',
  business_id: '',
  price: '',
  tax_percentage: 0,
  discount: 0
})

const photoFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const errors = ref<any>({}) // eslint-disable-line @typescript-eslint/no-explicit-any
const errorMessage = ref('')

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    photoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  photoFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  form.value = {
    item_name: '',
    category_id: '',
    business_id: '',
    price: '',
    tax_percentage: 0,
    discount: 0
  }
  photoFile.value = null
  imagePreview.value = ''
  errors.value = {}
  errorMessage.value = ''
  emit('close')
}

const handleSubmit = async () => {
  errors.value = {}
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('item_name', form.value.item_name)
    formData.append('category_id', String(form.value.category_id))
    formData.append('business_id', String(form.value.business_id))
    formData.append('price', String(form.value.price))
    formData.append('tax_percentage', String(form.value.tax_percentage))
    formData.append('discount', String(form.value.discount))
    
    if (photoFile.value) {
      formData.append('photo', photoFile.value)
    }

    emit('submit', formData)
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    }
    errorMessage.value = err.response?.data?.message || 'An error occurred'
  }
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.editingItem) {
    form.value = {
      item_name: props.editingItem.item_name,
      category_id: props.editingItem.category_id,
      business_id: props.editingItem.business_id,
      price: props.editingItem.price,
      tax_percentage: props.editingItem.tax_percentage,
      discount: props.editingItem.discount
    }
    
    if (props.editingItem.photo) {
      const baseUrl = 'https://laravelapi.mebrejderma.com/'
      imagePreview.value = props.editingItem.photo.startsWith('http') 
        ? props.editingItem.photo 
        : baseUrl + props.editingItem.photo
    }
  } else if (!isOpen) {
    form.value = {
      item_name: '',
      category_id: '',
      business_id: '',
      price: '',
      tax_percentage: 0,
      discount: 0
    }
    photoFile.value = null
    imagePreview.value = ''
    errors.value = {}
    errorMessage.value = ''
  }
})
</script>
