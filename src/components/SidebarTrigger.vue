<template>
  <component
    :is="as"
    :class="triggerClasses"
    :aria-label="ariaLabel"
    :aria-expanded="!isCollapsed"
    @click="handleClick"
  >
    <slot :collapsed="isCollapsed" :mobile-open="mobileOpen">
      <!-- Default hamburger icon -->
      <svg
        class="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </slot>
  </component>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useSidebar } from '../composables/useSidebar.js'

/**
 * SidebarTrigger - A button to toggle sidebar state.
 *
 * Must be used within a SidebarProvider or SidebarMenu context.
 *
 * @example
 * <SidebarTrigger class="md:hidden" />
 */
export default defineComponent({
  name: 'SidebarTrigger',

  props: {
    /**
     * HTML element or component to render
     */
    as: {
      type: [String, Object],
      default: 'button'
    },

    /**
     * What to toggle: 'sidebar' | 'mobile' | 'both'
     */
    toggles: {
      type: String,
      default: 'both',
      validator: (v) => ['sidebar', 'mobile', 'both'].includes(v)
    },

    /**
     * Additional classes
     */
    triggerClass: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const sidebar = useSidebar()

    const isCollapsed = computed(() => sidebar.collapsed)
    const mobileOpen = computed(() => sidebar.mobileOpen)

    const triggerClasses = computed(() => {
      return [
        'vsm-trigger',
        'inline-flex items-center justify-center',
        props.triggerClass
      ].filter(Boolean)
    })

    const ariaLabel = computed(() => {
      if (props.toggles === 'mobile') {
        return mobileOpen.value ? 'Close menu' : 'Open menu'
      }
      return isCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar'
    })

    function handleClick() {
      switch (props.toggles) {
        case 'sidebar':
          sidebar.toggle()
          break
        case 'mobile':
          sidebar.toggleMobile()
          break
        case 'both':
        default:
          // On mobile, toggle mobile drawer; on desktop, toggle collapse
          if (typeof window !== 'undefined' && window.innerWidth < 768) {
            sidebar.toggleMobile()
          } else {
            sidebar.toggle()
          }
          break
      }
    }

    return {
      isCollapsed,
      mobileOpen,
      triggerClasses,
      ariaLabel,
      handleClick
    }
  }
})
</script>
