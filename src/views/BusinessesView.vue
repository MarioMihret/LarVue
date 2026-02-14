<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, BuildingOfficeIcon } from '@heroicons/vue/24/outline'
import { useBusinessStore, type Business, type BusinessFormData } from '@/stores/business'
import ProfileDropdown from '@/components/ProfileDropdown.vue'
import BusinessFormModal from '@/components/BusinessFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const businessStore = useBusinessStore()

const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingBusiness = ref<Business | null>(null)
const businessToDelete = ref<Business | null>(null)

onMounted(async () => {
  await businessStore.fetchBusinesses()
})

const openCreateModal = () => {
  editingBusiness.value = null
  isFormModalOpen.value = true
}

const openEditModal = (business: Business) => {
  editingBusiness.value = business
  isFormModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  editingBusiness.value = null
}

const handleFormSubmit = async (formData: BusinessFormData) => {
  try {
    if (editingBusiness.value) {
      await businessStore.updateBusiness(editingBusiness.value.id, formData)
    } else {
      await businessStore.createBusiness(formData)
    }
    closeFormModal()
  } catch {
    // Error handled in store
  }
}

const openDeleteModal = (business: Business) => {
  businessToDelete.value = business
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  businessToDelete.value = null
}

const handleDelete = async () => {
  if (businessToDelete.value) {
    await businessStore.deleteBusiness(businessToDelete.value.id)
    closeDeleteModal()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-8">
            <RouterLink
              to="/"
              class="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              LarVue
            </RouterLink>

            <nav class="flex gap-1">
              <RouterLink
                to="/categories"
                class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Categories
              </RouterLink>
              <RouterLink to="/businesses" class="px-4 py-2 rounded-lg text-gray-900 bg-gray-100">
                Businesses
              </RouterLink>
              <RouterLink
                to="/menu-items"
                class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Menu Items
              </RouterLink>
            </nav>
          </div>

          <ProfileDropdown />
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Businesses</h1>
          <p class="text-gray-600 mt-1">Manage your business locations</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon class="h-5 w-5" />
          Add Business
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="businessStore.loading" class="text-center py-12">
        <div
          class="inline-block animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"
        ></div>
        <p class="text-gray-600 mt-2">Loading businesses...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="businessStore.error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ businessStore.error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="businessStore.businesses.length === 0" class="text-center py-12">
        <BuildingOfficeIcon class="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-500 text-lg">No businesses found</p>
        <button @click="openCreateModal" class="mt-4 text-blue-600 hover:text-blue-700 font-medium">
          Create your first business
        </button>
      </div>

      <!-- Businesses Table -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="business in businessStore.businesses"
              :key="business.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ business.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ business.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ business.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(business.created_at).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(business)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button @click="openDeleteModal(business)" class="text-red-600 hover:text-red-900">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Modals -->
    <BusinessFormModal
      :is-open="isFormModalOpen"
      :editing-business="editingBusiness"
      :loading="businessStore.loading"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Business"
      :message="`Are you sure you want to delete '${businessToDelete?.name}'? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>
