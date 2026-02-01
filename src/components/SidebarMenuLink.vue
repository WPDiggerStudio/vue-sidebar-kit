<template>
  <component
    :is="linkComponent"
    v-bind="linkProps"
    :class="linkClasses"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script>
import { defineComponent, computed, inject } from 'vue'

export default defineComponent({
  name: 'SidebarMenuLink',

  props: {
    /**
     * Menu item data
     */
    item: {
      type: Object,
      required: true
    },

    /**
     * Navigation mode override
     */
    mode: {
      type: String,
      default: null
    },

    /**
     * Additional classes
     */
    linkClass: {
      type: String,
      default: ''
    },

    /**
     * Whether link is disabled
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * Prevent default navigation
     */
    preventDefault: {
      type: Boolean,
      default: false
    }
  },

  emits: ['click'],

  setup(props, { emit }) {
    // Try to get sidebar context (may not exist if used standalone)
    const sidebarMode = inject('vsm-mode', () => 'a')
    const customLinkComponent = inject('vsm-link-component', () => null)

    // Resolve RouterLink and InertiaLink lazily
    let RouterLink = null
    let InertiaLink = null

    try {
      const vueRouter = require('vue-router')
      RouterLink = vueRouter.RouterLink
    } catch (e) {
      RouterLink = null
    }

    try {
      const inertiaVue = require('@inertiajs/vue3')
      InertiaLink = inertiaVue.Link
    } catch (e) {
      InertiaLink = null
    }

    const effectiveMode = computed(() => {
      // Per-item override takes priority
      if (props.item.linkMode) return props.item.linkMode
      // Prop override
      if (props.mode) return props.mode
      // From sidebar context
      return typeof sidebarMode === 'function' ? sidebarMode() : sidebarMode
    })

    const linkComponent = computed(() => {
      // Custom link component from context
      const custom = typeof customLinkComponent === 'function'
        ? customLinkComponent()
        : customLinkComponent

      if (custom) return custom

      // Disabled or external links use native anchor
      if (props.disabled) return 'a'

      switch (effectiveMode.value) {
        case 'router':
          if (!RouterLink) {
            console.error(
              '[vue-sidebar-menu-advanced] mode="router" requires vue-router. ' +
              'Falling back to <a>.'
            )
            return 'a'
          }
          return RouterLink

        case 'inertia':
          if (!InertiaLink) {
            console.error(
              '[vue-sidebar-menu-advanced] mode="inertia" requires @inertiajs/vue3. ' +
              'Falling back to <a>.'
            )
            return 'a'
          }
          return InertiaLink

        case 'a':
        default:
          return 'a'
      }
    })

    const linkProps = computed(() => {
      const item = props.item
      const mode = effectiveMode.value
      const result = {}

      // External link handling
      if (item.external) {
        result.href = item.href || '#'
        result.target = '_blank'
        result.rel = 'noopener noreferrer'
        return { ...result, ...(item.linkAttrs || {}) }
      }

      // Mode-specific props
      switch (mode) {
        case 'router':
          result.to = item.to || item.href || '#'
          break

        case 'inertia':
          result.href = item.href || '#'
          break

        case 'a':
        default:
          result.href = item.href || '#'
          break
      }

      // Disabled state
      if (props.disabled) {
        result.tabindex = '-1'
        result['aria-disabled'] = 'true'
      }

      // Merge additional link attributes
      return { ...result, ...(item.linkAttrs || {}) }
    })

    const linkClasses = computed(() => {
      return [
        'vsm-link',
        props.linkClass,
        {
          'vsm-link--disabled': props.disabled
        }
      ].filter(Boolean)
    })

    function handleClick(event) {
      if (props.disabled) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      if (props.preventDefault) {
        event.preventDefault()
      }

      emit('click', event)
    }

    return {
      linkComponent,
      linkProps,
      linkClasses,
      handleClick
    }
  }
})
</script>
