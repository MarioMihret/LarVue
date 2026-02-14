<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import ProfileDropdown from '@/components/ProfileDropdown.vue'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center gap-6">
            <RouterLink
              to="/"
              class="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              LarVue
            </RouterLink>
            <nav v-if="authStore.user" class="flex items-center gap-2">
              <RouterLink
                to="/categories"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Categories
              </RouterLink>
              <RouterLink
                to="/businesses"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Businesses
              </RouterLink>
              <RouterLink
                to="/menu-items"
                class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Menu Items
              </RouterLink>
            </nav>
          </div>
          <ProfileDropdown v-if="authStore.user" />
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-gray-50 to-white pt-20 pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Welcome{{ authStore.user ? ', ' + authStore.user.name : '' }}!
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The ultimate restaurant management platform that combines powerful backend capabilities
            with a stunning, responsive frontend experience.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              class="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-sm"
            >
              Get Started
            </button>
            <button
              class="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your restaurant efficiently and delight your customers
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Menu Management -->
          <div class="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Menu Management</h3>
            <p class="text-gray-600 leading-relaxed">
              Create and manage comprehensive menus with categories, pricing, and beautiful images.
              Update your offerings in real-time.
            </p>
          </div>

          <!-- Online Ordering -->
          <div class="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Online Ordering</h3>
            <p class="text-gray-600 leading-relaxed">
              Seamless online ordering system with secure payments and real-time order tracking.
              Delight your customers with convenience.
            </p>
          </div>

          <!-- QR Code Menus -->
          <div class="p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-200">
            <div class="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">QR Code Menus</h3>
            <p class="text-gray-600 leading-relaxed">
              Generate QR codes for contactless menu access. Perfect for modern dining experiences
              and enhanced safety.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Transform Your Restaurant?</h2>
        <p class="text-xl text-gray-300 mb-10 leading-relaxed">
          Join thousands of restaurants already using LarVue to streamline operations and enhance
          customer experiences.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            class="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm"
          >
            Start Free Trial
          </button>
          <button
            class="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg border-2 border-gray-700 hover:bg-gray-700 transition-colors duration-200"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="col-span-1">
            <h3 class="text-xl font-bold text-gray-900 mb-4">LarVue</h3>
            <p class="text-gray-600 text-sm">Restaurant management made simple and efficient.</p>
          </div>

          <!-- Product -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900 transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Demo</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Careers</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold text-gray-900 mb-4">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900 transition-colors">Help Center</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Contact</a></li>
              <li><a href="#" class="hover:text-gray-900 transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="pt-8 border-t border-gray-200">
          <p class="text-center text-sm text-gray-500">© 2025 LarVue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
