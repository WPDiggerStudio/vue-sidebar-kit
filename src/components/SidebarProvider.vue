<template>
  <slot />
</template>

<script>
import { defineComponent, provide, computed } from 'vue'
import { createSidebarContext, provideSidebar } from '../composables/useSidebar.js'

/**
 * SidebarProvider - Provides sidebar context to child components.
 *
 * Use this component to wrap your layout and provide sidebar state
 * that can be accessed via useSidebar() composable.
 *
 * @example
 * <SidebarProvider v-model:collapsed="collapsed" v-model:mobile-open="mobileOpen">
 *   <YourLayout>
 *     <SidebarTrigger />
 *     <SidebarMenu :items="items" />
 *   </YourLayout>
 * </SidebarProvider>
 */
export default defineComponent({
  name: 'SidebarProvider',

  props: {
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
     * Navigation mode
     */
    mode: {
      type: String,
      default: 'a'
    },

    /**
     * Expanded width
     */
    width: {
      type: String,
      default: '256px'
    },

    /**
     * Collapsed width
     */
    collapsedWidth: {
      type: String,
      default: '64px'
    },

    /**
     * RTL mode
     */
    rtl: {
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
     * Expand on hover
     */
    expandOnHover: {
      type: Boolean,
      default: false
    },

    /**
     * Accordion behavior
     */
    showOneChild: {
      type: [Boolean, String],
      default: false
    },

    /**
     * Class overrides
     */
    classes: {
      type: Object,
      default: () => ({})
    },

    /**
     * Custom link component
     */
    linkComponentName: {
      type: String,
      default: undefined
    },

    /**
     * Initially expanded groups
     */
    defaultExpandedGroups: {
      type: Array,
      default: () => []
    }
  },

  emits: ['update:collapsed', 'update:mobileOpen'],

  setup(props, { emit }) {
    // Create sidebar context
    const context = createSidebarContext(props, emit)

    // Provide context to all descendants
    provideSidebar(context)

    // Also provide individual values for convenience
    provide('vsm-mode', () => props.mode)
    provide('vsm-classes', () => props.classes)
    provide('vsm-link-component', () => props.linkComponentName)

    return {}
  }
})
</script>
