<template>
  <span :class="iconClasses" v-bind="iconAttrs">
    <!-- String icon (class-based) -->
    <i v-if="isStringIcon" :class="icon" aria-hidden="true" />

    <!-- Vue component icon -->
    <component
      v-else-if="isComponentIcon"
      :is="iconComponent"
      v-bind="iconComponentProps"
      aria-hidden="true"
    />

    <!-- Inline SVG string -->
    <span
      v-else-if="isSvgString"
      v-html="sanitizedSvg"
      aria-hidden="true"
    />

    <!-- SVG path data -->
    <svg
      v-else-if="isSvgPath"
      :class="svgClasses"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path :d="svgPath" />
    </svg>

    <!-- Render function (use h()) -->
    <component
      v-else-if="isRenderFunction"
      :is="renderComponent"
      aria-hidden="true"
    />

    <!-- Fallback slot -->
    <slot v-else />
  </span>
</template>

<script>
import { defineComponent, computed, h, markRaw } from 'vue'

export default defineComponent({
  name: 'SidebarMenuIcon',

  props: {
    /**
     * Icon value - can be:
     * - String: icon class name (e.g., 'mdi-home', 'fa fa-home')
     * - Component: Vue component
     * - Object with `svg`: inline SVG string
     * - Object with `path`: SVG path data
     * - Object with `render`: render function
     * - Object with `component`: Vue component + props
     */
    icon: {
      type: [String, Object, Function],
      default: null
    },

    /**
     * Additional classes for the icon wrapper
     */
    iconClass: {
      type: String,
      default: ''
    },

    /**
     * Size class (applied to wrapper)
     */
    size: {
      type: String,
      default: 'w-5 h-5'
    }
  },

  setup(props) {
    // =========================================================================
    // ICON TYPE DETECTION
    // =========================================================================

    const isStringIcon = computed(() => {
      return typeof props.icon === 'string'
    })

    const isComponentIcon = computed(() => {
      if (!props.icon) return false

      // Direct component reference
      if (typeof props.icon === 'function') return true
      if (props.icon?.__name || props.icon?.render || props.icon?.setup) return true

      // Object with component property
      if (props.icon?.component) return true

      return false
    })

    const isSvgString = computed(() => {
      return props.icon?.svg && typeof props.icon.svg === 'string'
    })

    const isSvgPath = computed(() => {
      return props.icon?.path && typeof props.icon.path === 'string'
    })

    const isRenderFunction = computed(() => {
      return props.icon?.render && typeof props.icon.render === 'function'
    })

    // =========================================================================
    // RESOLVED VALUES
    // =========================================================================

    const iconComponent = computed(() => {
      if (typeof props.icon === 'function') return markRaw(props.icon)
      if (props.icon?.__name || props.icon?.render || props.icon?.setup) {
        return markRaw(props.icon)
      }
      if (props.icon?.component) return markRaw(props.icon.component)
      return null
    })

    const iconComponentProps = computed(() => {
      if (props.icon?.props) return props.icon.props
      if (props.icon?.attrs) return props.icon.attrs
      return {}
    })

    const sanitizedSvg = computed(() => {
      if (!props.icon?.svg) return ''
      // Basic sanitization - in production you might want a proper sanitizer
      return props.icon.svg
    })

    const svgPath = computed(() => {
      return props.icon?.path || ''
    })

    const renderComponent = computed(() => {
      if (!props.icon?.render) return null
      // Wrap render function in a component
      return {
        render: () => props.icon.render(h)
      }
    })

    // =========================================================================
    // CLASSES
    // =========================================================================

    const iconClasses = computed(() => {
      return [
        'vsm-icon-wrapper',
        'inline-flex items-center justify-center flex-shrink-0',
        props.size,
        props.iconClass,
        props.icon?.class
      ].filter(Boolean)
    })

    const iconAttrs = computed(() => {
      return props.icon?.attrs || {}
    })

    const svgClasses = computed(() => {
      return ['w-full h-full']
    })

    return {
      isStringIcon,
      isComponentIcon,
      isSvgString,
      isSvgPath,
      isRenderFunction,
      iconComponent,
      iconComponentProps,
      sanitizedSvg,
      svgPath,
      renderComponent,
      iconClasses,
      iconAttrs,
      svgClasses
    }
  }
})
</script>
