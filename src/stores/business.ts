import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface Business {
  id: number
  name: string
  type: string
  location: string
  slug: string
  user_id?: number
  star?: string | null
  branch?: string | null
  image?: string | null
  created_at: string
  updated_at: string
}

export interface BusinessFormData {
  name: string
  type: string
  location: string
  tin?: string
}

export interface BusinessesResponse {
  data: Business[]
  current_page?: number
  last_page?: number
  per_page?: number
  total?: number
}

export const useBusinessStore = defineStore('business', () => {
  const businesses = ref<Business[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchBusinesses = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<BusinessesResponse>('/businesses?per_page=all')
      businesses.value = response.data.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to fetch businesses'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createBusiness = async (data: BusinessFormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<Business>('/businesses', data)
      await fetchBusinesses()
      return response.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to create business'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBusiness = async (id: number, data: BusinessFormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put<Business>(`/businesses/${id}`, data)
      await fetchBusinesses()
      return response.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to update business'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBusiness = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/businesses/${id}`)
      await fetchBusinesses()
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to delete business'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    businesses,
    loading,
    error,
    fetchBusinesses,
    createBusiness,
    updateBusiness,
    deleteBusiness
  }
})
