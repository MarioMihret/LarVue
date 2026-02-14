<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, PencilIcon, TrashIcon, StarIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { useMenuItemStore, type MenuItem } from '@/stores/menuItem'
import { useCategoryStore } from '@/stores/category'
import ProfileDropdown from '@/components/ProfileDropdown.vue'
import MenuItemFormModal from '@/components/MenuItemFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const menuItemStore = useMenuItemStore()
const categoryStore = useCategoryStore()

const searchQuery = ref('')
const showFavoritesOnly = ref(false)
const isFormModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingItem = ref<MenuItem | null>(null)
const itemToDelete = ref<MenuItem | null>(null)
const favorites = ref<number[]>([])

// Load favorites from localStorage
onMounted(async () => {
  const storedFavorites = localStorage.getItem('favoriteMenuItems')
  if (storedFavorites) {
    favorites.value = JSON.parse(storedFavorites)
  }

  try {
    await Promise.all([menuItemStore.fetchMenuItems(), menuItemStore.fetchBusinesses()])

    // Fetch all categories without pagination for dropdown
    let currentPage = 1
    let hasMore = true
    const allCategories: typeof categoryStore.categories = []

    while (hasMore) {
      await categoryStore.fetchCategories(currentPage)
      allCategories.push(...categoryStore.categories)
      hasMore = categoryStore.pagination.current_page < categoryStore.pagination.last_page
      currentPage++
    }

    categoryStore.categories = allCategories
  } catch {
    // Handle initialization errors gracefully
  }
})

const isFavorite = (itemId: number) => {
  return favorites.value.includes(itemId)
}

const toggleFavorite = (itemId: number) => {
  const index = favorites.value.indexOf(itemId)
  if (index > -1) {
    favorites.value.splice(index, 1)
  } else {
    favorites.value.push(itemId)
  }
  localStorage.setItem('favoriteMenuItems', JSON.stringify(favorites.value))
}

const filteredItems = computed(() => {
  let items = menuItemStore.menuItems

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(
      (item) =>
        item.item_name.toLowerCase().includes(query) ||
        item.category?.name.toLowerCase().includes(query),
    )
  }

  // Filter by favorites
  if (showFavoritesOnly.value) {
    items = items.filter((item) => isFavorite(item.id))
  }

  return items
})

const groupedItems = computed(() => {
  const groups: { [key: number]: { categoryId: number; categoryName: string; items: MenuItem[] } } =
    {}

  filteredItems.value.forEach((item) => {
    const categoryId = item.category_id
    const categoryName = item.category?.name || 'Uncategorized'

    if (!groups[categoryId]) {
      groups[categoryId] = {
        categoryId,
        categoryName,
        items: [],
      }
    }

    groups[categoryId].items.push(item)
  })

  return Object.values(groups)
})

const getImageUrl = (photo: string) => {
  if (photo.startsWith('http')) {
    return photo
  }
  return `https://laravelapi.mebrejderma.com/${photo}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  const originalSrc = img.src

  if (!originalSrc.includes('/storage/')) {
    const path = originalSrc.replace('https://laravelapi.mebrejderma.com/', '')
    img.src = `https://laravelapi.mebrejderma.com/storage/${path}`
  }
}

const openCreateModal = () => {
  editingItem.value = null
  isFormModalOpen.value = true
}

const openEditModal = (item: MenuItem) => {
  editingItem.value = item
  isFormModalOpen.value = true
}

const closeFormModal = () => {
  isFormModalOpen.value = false
  editingItem.value = null
}

const handleFormSubmit = async (formData: FormData) => {
  try {
    if (editingItem.value) {
      await menuItemStore.updateMenuItem(editingItem.value.id, formData)
    } else {
      await menuItemStore.createMenuItem(formData)
    }
    closeFormModal()
  } catch {
    // Error handled in store
  }
}

const openDeleteModal = (item: MenuItem) => {
  itemToDelete.value = item
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = null
}

const handleDelete = async () => {
  if (itemToDelete.value) {
    await menuItemStore.deleteMenuItem(itemToDelete.value.id)
    closeDeleteModal()
  }
}

const changePage = async (page: number) => {
  await menuItemStore.fetchMenuItems(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
              <RouterLink
                to="/businesses"
                class="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Businesses
              </RouterLink>
              <RouterLink to="/menu-items" class="px-4 py-2 rounded-lg text-gray-900 bg-gray-100">
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
          <h1 class="text-3xl font-bold text-gray-900">Menu Items</h1>
          <p class="text-gray-600 mt-1">Manage your menu items</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon class="h-5 w-5" />
          Add Item
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by item name or category..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            @click="showFavoritesOnly = !showFavoritesOnly"
            class="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            :class="
              showFavoritesOnly
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            "
          >
            <StarIcon class="h-5 w-5" :class="showFavoritesOnly ? 'fill-current' : ''" />
            Favorites
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="menuItemStore.loading" class="text-center py-12">
        <div
          class="inline-block animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"
        ></div>
        <p class="text-gray-600 mt-2">Loading menu items...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="menuItemStore.error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
      >
        {{ menuItemStore.error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredItems.length === 0" class="text-center py-12">
        <p class="text-gray-500 text-lg">No menu items found</p>
        <button @click="openCreateModal" class="mt-4 text-blue-600 hover:text-blue-700 font-medium">
          Create your first menu item
        </button>
      </div>

      <!-- Items Grouped by Category -->
      <div v-else class="space-y-6">
        <div
          v-for="group in groupedItems"
          :key="group.categoryId"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div class="bg-gray-100 px-6 py-3 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">{{ group.categoryName }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <!-- Image -->
              <div class="relative h-48 bg-gray-200">
                <img
                  v-if="item.photo"
                  :src="getImageUrl(item.photo)"
                  :alt="item.item_name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <PhotoIcon class="h-16 w-16" />
                </div>

                <!-- Favorite Button -->
                <button
                  @click="toggleFavorite(item.id)"
                  class="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                >
                  <StarIcon
                    class="h-5 w-5"
                    :class="isFavorite(item.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'"
                  />
                </button>
              </div>

              <!-- Content -->
              <div class="p-4">
                <h3 class="font-semibold text-gray-900 text-lg mb-2">{{ item.item_name }}</h3>

                <div class="space-y-1 text-sm text-gray-600 mb-3">
                  <div class="flex justify-between">
                    <span>Price:</span>
                    <span class="font-medium text-gray-900"
                      >${{ Number(item.price).toFixed(2) }}</span
                    >
                  </div>
                  <div class="flex justify-between">
                    <span>Tax:</span>
                    <span>{{ item.tax_percentage }}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Discount:</span>
                    <span>{{ item.discount }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2">
                  <button
                    @click="openEditModal(item)"
                    class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1"
                  >
                    <PencilIcon class="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    @click="openDeleteModal(item)"
                    class="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-1"
                  >
                    <TrashIcon class="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="menuItemStore.lastPage > 1" class="flex justify-center gap-2 mt-6">
        <button
          @click="changePage(menuItemStore.currentPage - 1)"
          :disabled="menuItemStore.currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-gray-700">
          Page {{ menuItemStore.currentPage }} of {{ menuItemStore.lastPage }}
        </span>
        <button
          @click="changePage(menuItemStore.currentPage + 1)"
          :disabled="menuItemStore.currentPage === menuItemStore.lastPage"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </main>

    <!-- Modals -->
    <MenuItemFormModal
      :is-open="isFormModalOpen"
      :editing-item="editingItem"
      :categories="categoryStore.categories"
      :businesses="menuItemStore.businesses"
      :loading="menuItemStore.loading"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />

    <ConfirmModal
      :is-open="isDeleteModalOpen"
      title="Delete Menu Item"
      :message="`Are you sure you want to delete '${itemToDelete?.item_name}'? This action cannot be undone.`"
      @confirm="handleDelete"
      @cancel="closeDeleteModal"
    />
  </div>
</template>
