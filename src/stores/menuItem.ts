import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export interface MenuItem {
  id: number
  item_name: string
  category_id: number
  business_id: number
  price: number | string
  tax_percentage: number | string
  discount: number | string
  photo?: string
  created_at: string
  updated_at: string
  category?: {
    id: number
    name: string
  }
}

export interface Business {
  id: number
  name: string
  type: string
  location: string
  slug: string
}

export interface MenuItemsResponse {
  data: MenuItem[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export const useMenuItemStore = defineStore('menuItem', () => {
  const menuItems = ref<MenuItem[]>([])
  const businesses = ref<Business[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const lastPage = ref(1)
  const total = ref(0)

  const fetchMenuItems = async (page = 1) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get<MenuItemsResponse>(`/menu-items?page=${page}`)
      menuItems.value = response.data.data
      currentPage.value = response.data.current_page
      lastPage.value = response.data.last_page
      total.value = response.data.total
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to fetch menu items'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchBusinesses = async () => {
    try {
      const response = await api.get<{ data: Business[] }>('/businesses?per_page=all')
      businesses.value = response.data.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to fetch businesses'
      throw err
    }
  }

  const createMenuItem = async (data: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post<MenuItem>('/menu-items', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchMenuItems(currentPage.value)
      return response.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to create menu item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMenuItem = async (id: number, data: FormData) => {
    loading.value = true
    error.value = null
    try {
      data.append('_method', 'PUT')
      const response = await api.post<MenuItem>(`/menu-items/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchMenuItems(currentPage.value)
      return response.data
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to update menu item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMenuItem = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/menu-items/${id}`)
      await fetchMenuItems(currentPage.value)
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Failed to delete menu item'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    menuItems,
    businesses,
    loading,
    error,
    currentPage,
    lastPage,
    total,
    fetchMenuItems,
    fetchBusinesses,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem
  }
})
