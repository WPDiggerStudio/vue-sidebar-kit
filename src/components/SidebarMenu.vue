<template>
  <aside
    ref="sidebarRef"
    :class="sidebarClasses"
    :style="sidebarStyles"
    :dir="rtl ? 'rtl' : undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div :class="wrapperClasses">
      <!-- Header Slot -->
      <div v-if="$slots.header" :class="headerClasses">
        <slot name="header" />
      </div>

      <!-- Brand Slot -->
      <div v-if="$slots.brand" :class="brandClasses">
        <slot name="brand" />
      </div>

      <!-- Navigation -->
      <nav :class="navClasses" aria-label="Main navigation">
        <ul :class="menuClasses" role="menubar">
          <SidebarMenuItem
            v-for="item in visibleItems"
            :key="item.id"
            :item="item"
            :level="1"
            :mode="mode"
            @item-click="handleItemClick"
          >
            <!-- Pass through all slots -->
            <template #item-icon="slotProps">
              <slot name="item-icon" v-bind="slotProps" />
            </template>
            <template #item-badge="slotProps">
              <slot name="item-badge" v-bind="slotProps" />
            </template>
            <template #dropdown-icon="slotProps">
              <slot name="dropdown-icon" v-bind="slotProps">
                <svg
                  :class="['w-4 h-4 transition-transform', slotProps.isOpen ? 'rotate-180' : '']"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </slot>
            </template>
          </SidebarMenuItem>
        </ul>
      </nav>

      <!-- User Slot -->
      <div v-if="$slots.user" :class="userClasses">
        <slot name="user" />
      </div>

      <!-- Footer Slot -->
      <div v-if="$slots.footer" :class="footerClasses">
        <slot name="footer" />
      </div>

      <!-- Toggle Button -->
      <button
        v-if="!hideToggle"
        type="button"
        :class="toggleClasses"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="!isCollapsed"
        @click="handleToggle"
      >
        <slot name="toggle-icon" :collapsed="isCollapsed">
          <svg
            class="w-5 h-5 transition-transform"
            :class="{ 'rotate-180': isCollapsed }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </slot>
      </button>
    </div>
  </aside>

  <!-- Mobile Drawer (when using mobile mode) -->
  <SidebarMobileDrawer
    v-if="showMobileDrawer"
    :mobile-open="mobileOpen"
    :width="width"
    :classes="classes"
    :rtl="rtl"
    @update:mobile-open="handleMobileUpdate"
    @close="handleMobileClose"
  >
    <slot name="header" />
    <slot name="brand" />
    <nav :class="navClasses" aria-label="Main navigation">
      <ul :class="menuClasses" role="menubar">
        <SidebarMenuItem
          v-for="item in visibleItems"
          :key="item.id"
          :item="item"
          :level="1"
          :mode="mode"
          @item-click="handleMobileItemClick"
        >
          <template #item-icon="slotProps">
            <slot name="item-icon" v-bind="slotProps" />
          </template>
          <template #item-badge="slotProps">
            <slot name="item-badge" v-bind="slotProps" />
          </template>
          <template #dropdown-icon="slotProps">
            <slot name="dropdown-icon" v-bind="slotProps" />
          </template>
        </SidebarMenuItem>
      </ul>
    </nav>
    <slot name="user" />
    <slot name="footer" />
  </SidebarMobileDrawer>
</template>

<script>
import { defineComponent, ref, computed, provide, watch, onMounted } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'
import SidebarMobileDrawer from './SidebarMobileDrawer.vue'
import { createSidebarContext, provideSidebar } from '../composables/useSidebar.js'
import { defaultClasses, resolveClass } from '../styles/classes.js'

export default defineComponent({
  name: 'SidebarMenu',

  components: {
    SidebarMenuItem,
    SidebarMobileDrawer
  },

  props: {
    /**
     * Menu items array
     */
    items: {
      type: Array,
      required: true
    },

    /**
     * Navigation mode: 'inertia' | 'router' | 'a'
     */
    mode: {
      type: String,
      default: 'a',
      validator: (v) => ['inertia', 'router', 'a'].includes(v)
    },

    /**
     * Collapsed state (v-model:collapsed)
     */
    collapsed: {
      type: Boolean,
      default: false
    },

    /**
     * Mobile drawer open state (v-model:mobileOpen)
     */
    mobileOpen: {
      type: Boolean,
      default: false
    },

    /**
     * localStorage key for persistence
     */
    storageKey: {
      type: String,
      default: undefined
    },

    /**
     * Expanded sidebar width
     */
    width: {
      type: String,
      default: '256px'
    },

    /**
     * Collapsed sidebar width
     */
    collapsedWidth: {
      type: String,
      default: '64px'
    },

    /**
     * Accordion behavior
     */
    showOneChild: {
      type: [Boolean, String],
      default: false,
      validator: (v) => typeof v === 'boolean' || v === 'deep'
    },

    /**
     * Keep all children expanded
     */
    showChild: {
      type: Boolean,
      default: false
    },

    /**
     * Right-to-left
     */
    rtl: {
      type: Boolean,
      default: false
    },

    /**
     * Relative to parent
     */
    relative: {
      type: Boolean,
      default: false
    },

    /**
     * Hide toggle button
     */
    hideToggle: {
      type: Boolean,
      default: false
    },

    /**
     * Disable hover expansion
     */
    disableHover: {
      type: Boolean,
      default: false
    },

    /**
     * Expand on hover when collapsed
     */
    expandOnHover: {
      type: Boolean,
      default: false
    },

    /**
     * Custom link component name
     */
    linkComponentName: {
      type: String,
      default: undefined
    },

    /**
     * Class overrides
     */
    classes: {
      type: Object,
      default: () => ({})
    },

    /**
     * Mobile breakpoint (px)
     */
    mobileBreakpoint: {
      type: Number,
      default: 768
    }
  },

  emits: ['update:collapsed', 'update:mobileOpen', 'item-click'],

  setup(props, { emit }) {
    const sidebarRef = ref(null)

    // Create and provide sidebar context
    const context = createSidebarContext(props, emit)
    provideSidebar(context)

    // Provide mode and classes for child components
    provide('vsm-mode', () => props.mode)
    provide('vsm-classes', () => props.classes)
    provide('vsm-link-component', () => props.linkComponentName)

    // =========================================================================
    // COMPUTED
    // =========================================================================

    const isCollapsed = computed(() => context.isCollapsed)

    const visibleItems = computed(() => {
      return props.items
        .map((item, index) => ({
          ...item,
          id: item.id || `item-${index}`
        }))
        .filter(item => {
          if (typeof item.visible === 'function') {
            return item.visible({ item })
          }
          return item.visible !== false
        })
    })

    const showMobileDrawer = computed(() => {
      // Only show mobile drawer on mobile viewports
      if (typeof window === 'undefined') return false
      return window.innerWidth < props.mobileBreakpoint
    })

    // =========================================================================
    // CLASSES
    // =========================================================================

    const sidebarClasses = computed(() => {
      const base = resolveClass('root', props.classes, {})
      const expanded = !isCollapsed.value
        ? resolveClass('rootExpanded', props.classes, {})
        : ''
      const collapsed = isCollapsed.value
        ? resolveClass('rootCollapsed', props.classes, {})
        : ''

      return [
        'vsm-sidebar',
        base || defaultClasses.root,
        expanded,
        collapsed,
        {
          'vsm-collapsed': isCollapsed.value,
          'vsm-expanded': !isCollapsed.value,
          'vsm-rtl': props.rtl,
          'vsm-relative': props.relative
        }
      ]
    })

    const sidebarStyles = computed(() => {
      return {
        width: isCollapsed.value ? props.collapsedWidth : props.width,
        '--sidebar-width': props.width,
        '--sidebar-collapsed-width': props.collapsedWidth
      }
    })

    const wrapperClasses = computed(() => {
      return [
        'vsm-wrapper',
        resolveClass('wrapper', props.classes, {}) || 'flex flex-col h-full'
      ]
    })

    const navClasses = computed(() => {
      return [
        'vsm-nav',
        resolveClass('nav', props.classes, {}) || 'flex-1 overflow-y-auto overflow-x-hidden'
      ]
    })

    const menuClasses = computed(() => {
      return [
        'vsm-menu',
        resolveClass('menu', props.classes, {}) || 'flex flex-col py-2'
      ]
    })

    const headerClasses = computed(() => {
      return [
        'vsm-header-slot',
        resolveClass('header', props.classes, {}) || 'flex-shrink-0'
      ]
    })

    const brandClasses = computed(() => {
      return ['vsm-brand-slot', 'flex-shrink-0']
    })

    const userClasses = computed(() => {
      return ['vsm-user-slot', 'flex-shrink-0']
    })

    const footerClasses = computed(() => {
      return [
        'vsm-footer-slot',
        resolveClass('footer', props.classes, {}) || 'flex-shrink-0 border-t border-gray-700'
      ]
    })

    const toggleClasses = computed(() => {
      return [
        'vsm-toggle',
        resolveClass('toggle', props.classes, {}) || defaultClasses.toggle
      ]
    })

    // =========================================================================
    // HANDLERS
    // =========================================================================

    function handleToggle() {
      context.toggle()
    }

    function handleItemClick(payload) {
      emit('item-click', payload)
    }

    function handleMobileItemClick(payload) {
      emit('item-click', payload)
      // Close mobile drawer after navigation (if item has href/to)
      if (payload.item.href || payload.item.to) {
        setTimeout(() => {
          context.closeMobile()
        }, 150)
      }
    }

    function handleMobileUpdate(value) {
      emit('update:mobileOpen', value)
    }

    function handleMobileClose() {
      emit('update:mobileOpen', false)
    }

    function handleMouseEnter() {
      if (props.expandOnHover && isCollapsed.value) {
        context.setHoverExpanded(true)
      }
    }

    function handleMouseLeave() {
      if (props.expandOnHover) {
        context.setHoverExpanded(false)
      }
    }

    // =========================================================================
    // EXPOSE
    // =========================================================================

    // Expose methods for external control
    const exposed = {
      toggle: context.toggle,
      collapse: context.collapse,
      expand: context.expand,
      toggleMobile: context.toggleMobile,
      openMobile: context.openMobile,
      closeMobile: context.closeMobile,
      updateCurrentPath: context.updateCurrentPath
    }

    return {
      sidebarRef,
      isCollapsed,
      visibleItems,
      showMobileDrawer,

      // Classes
      sidebarClasses,
      sidebarStyles,
      wrapperClasses,
      navClasses,
      menuClasses,
      headerClasses,
      brandClasses,
      userClasses,
      footerClasses,
      toggleClasses,

      // Handlers
      handleToggle,
      handleItemClick,
      handleMobileItemClick,
      handleMobileUpdate,
      handleMobileClose,
      handleMouseEnter,
      handleMouseLeave,

      // Exposed
      ...exposed
    }
  }
})
</script>
