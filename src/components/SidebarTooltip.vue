<template>
  <Transition name="vsm-tooltip">
    <div
      v-if="show"
      :class="tooltipClasses"
      role="tooltip"
      :id="tooltipId"
    >
      <slot>{{ text }}</slot>
    </div>
  </Transition>
</template>

<script>
import { defineComponent, computed } from 'vue'

let tooltipCounter = 0

export default defineComponent({
  name: 'SidebarTooltip',

  props: {
    /**
     * Whether to show the tooltip
     */
    show: {
      type: Boolean,
      default: false
    },

    /**
     * Tooltip text content
     */
    text: {
      type: String,
      default: ''
    },

    /**
     * Additional classes
     */
    tooltipClass: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const tooltipId = `vsm-tooltip-${++tooltipCounter}`

    const tooltipClasses = computed(() => {
      return [
        'vsm-tooltip',
        'absolute left-full ml-2 px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap z-50',
        'bg-gray-800 text-white',
        'pointer-events-none',
        props.tooltipClass
      ].filter(Boolean)
    })

    return {
      tooltipId,
      tooltipClasses
    }
  }
})
</script>
