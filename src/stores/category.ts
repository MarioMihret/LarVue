import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export interface Category {
  id: number
  name: string
  image?: string | null
  description?: string | null
  created_at?: string
  updated_at?: string
}

export interface CategoryFormData {
  name: string
  image?: File | string | null
  description?: string
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  const fetchCategories = async (page = 1) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(`/menu-managers?page=${page}`)
      
      // Handle different possible response structures
      if (response.data.data) {
        categories.value = response.data.data
        if (response.data.meta) {
          pagination.value = response.data.meta
        } else if (response.data.current_page) {
          pagination.value = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total
          }
        }
      } else {
        categories.value = response.data
      }

      return { success: true }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const createCategory = async (data: CategoryFormData) => {
    isLoading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.image instanceof File) formData.append('image', data.image)

      const response = await api.post('/menu-managers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return { success: true, data: response.data }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const data = err.response?.data
      error.value = data?.message || 'Failed to create category'

      if (data?.errors) {
        return { success: false, errors: data.errors, message: error.value }
      }
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const updateCategory = async (id: number, data: CategoryFormData) => {
    isLoading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('_method', 'PUT')
      if (data.description) formData.append('description', data.description)
      if (data.image instanceof File) formData.append('image', data.image)

      const response = await api.post(`/menu-managers/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return { success: true, data: response.data }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const data = err.response?.data
      error.value = data?.message || 'Failed to update category'

      if (data?.errors) {
        return { success: false, errors: data.errors, message: error.value }
      }
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/menu-managers/${id}`)
      categories.value = categories.value.filter(cat => cat.id !== id)
      return { success: true }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      error.value = err.response?.data?.message || 'Failed to delete category'
      return { success: false, message: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    isLoading,
    error,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
