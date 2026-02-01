<!--
  Example Usage of Vue Sidebar Kit
  
  This file demonstrates all three navigation modes and key features.
  Copy and adapt to your needs.
-->

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SidebarMenu
      :items="menuItems"
      :mode="navigationMode"
      v-model:collapsed="collapsed"
      v-model:mobile-open="mobileOpen"
      storage-key="example-sidebar"
      :classes="customClasses"
      :expand-on-hover="true"
    >
      <!-- Brand/Logo -->
      <template #header>
        <div class="flex items-center justify-center h-16 bg-gray-800">
          <span v-if="!collapsed" class="text-xl font-bold text-white">
            My App
          </span>
          <span v-else class="text-xl font-bold text-white">M</span>
        </div>
      </template>

      <!-- Custom Icon (optional) -->
      <template #item-icon="{ item, icon }">
        <!-- Use your icon library here -->
        <i :class="[icon, 'w-5 h-5']" />
      </template>

      <!-- User Profile -->
      <template #user>
        <div
          v-if="!collapsed"
          class="flex items-center gap-3 p-4 border-t border-gray-700"
        >
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            class="w-10 h-10 rounded-full"
          />
          <div>
            <p class="text-sm font-medium text-white">John Doe</p>
            <p class="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
      </template>

      <!-- Footer -->
      <template #footer>
        <div class="p-4 text-xs text-gray-500 text-center">
          v1.0.0
        </div>
      </template>
    </SidebarMenu>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="flex items-center justify-between h-16 px-6 bg-white shadow">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          @click="mobileOpen = true"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Mode Selector (for demo) -->
        <div class="flex items-center gap-4">
          <label class="text-sm text-gray-600">Navigation Mode:</label>
          <select
            v-model="navigationMode"
            class="rounded border-gray-300 text-sm"
          >
            <option value="a">Plain Anchors</option>
            <option value="router">Vue Router</option>
            <option value="inertia">Inertia.js</option>
          </select>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto p-6">
        <h1 class="text-2xl font-bold text-gray-900">Welcome to the Dashboard</h1>
        <p class="mt-2 text-gray-600">
          This is an example of vue-sidebar-kit in action.
        </p>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="font-semibold text-gray-900">Multi-Mode Navigation</h2>
            <p class="mt-2 text-sm text-gray-600">
              Switch between Inertia, Vue Router, or plain anchors.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="font-semibold text-gray-900">Deep Customization</h2>
            <p class="mt-2 text-sm text-gray-600">
              Override classes at global, item, and state levels.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="font-semibold text-gray-900">State Persistence</h2>
            <p class="mt-2 text-sm text-gray-600">
              Collapsed state and expanded groups are saved.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SidebarMenu } from 'vue-sidebar-kit'
import 'vue-sidebar-kit/style.css'

// State
const collapsed = ref(false)
const mobileOpen = ref(false)
const navigationMode = ref('a')

// Custom class overrides
const customClasses = {
  root: 'bg-gray-900 text-gray-100',
  link: 'flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors',
  linkActive: 'bg-blue-600 text-white hover:bg-blue-700',
  linkGroupActive: 'text-blue-400',
  badge: 'ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full',
  header: 'border-b border-gray-700'
}

// Menu items
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: 'fa fa-home',
    activeMatch: 'exact'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: 'fa fa-chart-bar',
    badge: 'New'
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'fa fa-users',
    href: '/users',
    activeMatch: 'startsWith',
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        href: '/users',
        activeMatch: 'exact'
      },
      {
        id: 'users-create',
        label: 'Add User',
        href: '/users/create'
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        href: '/users/roles'
      }
    ]
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'fa fa-box',
    children: [
      {
        id: 'products-list',
        label: 'All Products',
        href: '/products'
      },
      {
        id: 'products-categories',
        label: 'Categories',
        href: '/products/categories'
      },
      {
        id: 'products-inventory',
        label: 'Inventory',
        href: '/products/inventory',
        badge: { text: 12, class: 'bg-orange-500' }
      }
    ]
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/orders',
    icon: 'fa fa-shopping-cart',
    badge: 5
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'fa fa-cog',
    children: [
      {
        id: 'settings-general',
        label: 'General',
        href: '/settings/general'
      },
      {
        id: 'settings-security',
        label: 'Security',
        href: '/settings/security'
      },
      {
        id: 'settings-integrations',
        label: 'Integrations',
        href: '/settings/integrations'
      }
    ]
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: 'https://example.com/help',
    icon: 'fa fa-question-circle',
    external: true
  },
  {
    id: 'disabled-item',
    label: 'Coming Soon',
    icon: 'fa fa-lock',
    disabled: true
  }
]
</script>
