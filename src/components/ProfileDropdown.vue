<template>
  <div class="relative profile-dropdown">
    <button
      @click.stop="isOpen = !isOpen"
      class="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div class="relative">
        <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
          <span class="text-white font-semibold text-sm">{{ initials }}</span>
        </div>
        <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      </div>
      <ChevronDownIcon :class="['w-4 h-4 text-gray-600 transition-transform', isOpen && 'rotate-180']" />
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        @click.stop
        class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
      >
        <!-- User Info -->
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <span class="text-white font-semibold">{{ initials }}</span>
              </div>
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-900 truncate">{{ user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="px-4 py-3 space-y-2 border-b border-gray-200">
          <div class="flex items-start gap-2">
            <BuildingOfficeIcon class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-xs text-gray-500">Business</p>
              <p class="text-sm text-gray-900 truncate">{{ user?.business_name }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <PhoneIcon class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-xs text-gray-500">Phone</p>
              <p class="text-sm text-gray-900">{{ user?.phone }}</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <IdentificationIcon class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="text-xs text-gray-500">TIN</p>
              <p class="text-sm text-gray-900">{{ user?.tin }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-2 py-2">
          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon class="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  IdentificationIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()

const isOpen = ref(false)

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.profile-dropdown')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const user = computed(() => authStore.user)

const initials = computed(() => {
  if (!user.value?.name) return '?'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleLogout = () => {
  isOpen.value = false
  authStore.logout()
  router.push('/login')
}
</script>
