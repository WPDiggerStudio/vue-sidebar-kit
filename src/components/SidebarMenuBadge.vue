<template>
  <span :class="badgeClasses" v-bind="badgeAttrs">
    {{ badgeText }}
    <slot />
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'SidebarMenuBadge',

  props: {
    /**
     * Badge value - can be:
     * - String: direct text
     * - Number: will be converted to string
     * - Object: { text, class, attrs }
     */
    badge: {
      type: [String, Number, Object],
      default: null
    },

    /**
     * Additional classes
     */
    badgeClass: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const badgeText = computed(() => {
      if (props.badge === null || props.badge === undefined) return ''

      if (typeof props.badge === 'object') {
        return props.badge.text ?? ''
      }

      return String(props.badge)
    })

    const badgeClasses = computed(() => {
      const base = [
        'vsm-badge',
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        props.badgeClass
      ]

      if (typeof props.badge === 'object' && props.badge.class) {
        base.push(props.badge.class)
      }

      return base.filter(Boolean)
    })

    const badgeAttrs = computed(() => {
      if (typeof props.badge === 'object' && props.badge.attrs) {
        return props.badge.attrs
      }
      return {}
    })

    return {
      badgeText,
      badgeClasses,
      badgeAttrs
    }
  }
})
</script>
