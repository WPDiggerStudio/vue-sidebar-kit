<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="vsm-overlay">
      <div
        v-if="mobileOpen"
        :class="overlayClasses"
        @click="handleOverlayClick"
        aria-hidden="true"
      />
    </Transition>

    <!-- Drawer -->
    <Transition name="vsm-drawer">
      <aside
        v-if="mobileOpen"
        ref="drawerRef"
        :class="drawerClasses"
        :style="drawerStyles"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <!-- Close Button -->
        <button
          type="button"
          :class="closeButtonClasses"
          @click="close"
          aria-label="Close navigation"
        >
          <slot name="close-icon">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </slot>
        </button>

        <!-- Drawer Content -->
        <div :class="drawerContentClasses">
          <slot />
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { defaultClasses } from '../styles/classes.js'

export default defineComponent({
  name: 'SidebarMobileDrawer',

  props: {
    /**
     * Whether the drawer is open
     */
    mobileOpen: {
      type: Boolean,
      default: false
    },

    /**
     * Drawer width
     */
    width: {
      type: String,
      default: '280px'
    },

    /**
     * Class overrides
     */
    classes: {
      type: Object,
      default: () => ({})
    },

    /**
     * RTL mode
     */
    rtl: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:mobileOpen', 'close'],

  setup(props, { emit }) {
    const drawerRef = ref(null)

    // =========================================================================
    // CLASSES
    // =========================================================================

    const overlayClasses = computed(() => {
      return [
        'vsm-overlay',
        props.classes.overlay || defaultClasses.overlay
      ].filter(Boolean)
    })

    const drawerClasses = computed(() => {
      return [
        'vsm-drawer',
        props.classes.drawer || defaultClasses.drawer,
        props.rtl ? 'vsm-drawer--rtl' : ''
      ].filter(Boolean)
    })

    const drawerStyles = computed(() => {
      return {
        width: props.width,
        '--sidebar-width': props.width
      }
    })

    const closeButtonClasses = computed(() => {
      return [
        'vsm-drawer-close',
        'absolute top-4 right-4 p-1 rounded-md',
        'text-gray-400 hover:text-white hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-white',
        'transition-colors'
      ]
    })

    const drawerContentClasses = computed(() => {
      return [
        'vsm-drawer-content',
        'flex flex-col h-full overflow-hidden pt-12'
      ]
    })

    // =========================================================================
    // HANDLERS
    // =========================================================================

    function close() {
      emit('update:mobileOpen', false)
      emit('close')
    }

    function handleOverlayClick() {
      close()
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && props.mobileOpen) {
        close()
      }
    }

    // =========================================================================
    // BODY SCROLL LOCK
    // =========================================================================

    function lockScroll() {
      if (typeof document !== 'undefined') {
        document.body.classList.add('vsm-no-scroll')
      }
    }

    function unlockScroll() {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('vsm-no-scroll')
      }
    }

    // =========================================================================
    // FOCUS TRAP (basic)
    // =========================================================================

    function handleTabKey(event) {
      if (!props.mobileOpen || !drawerRef.value) return

      const focusableElements = drawerRef.value.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') {
        handleEscape(event)
      } else if (event.key === 'Tab') {
        handleTabKey(event)
      }
    }

    // =========================================================================
    // LIFECYCLE
    // =========================================================================

    watch(() => props.mobileOpen, (isOpen) => {
      if (isOpen) {
        lockScroll()
        // Focus first focusable element after transition
        setTimeout(() => {
          if (drawerRef.value) {
            const close = drawerRef.value.querySelector('.vsm-drawer-close')
            if (close) close.focus()
          }
        }, 100)
      } else {
        unlockScroll()
      }
    })

    onMounted(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('keydown', handleKeydown)
      }
    })

    onUnmounted(() => {
      unlockScroll()
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeydown)
      }
    })

    return {
      drawerRef,
      overlayClasses,
      drawerClasses,
      drawerStyles,
      closeButtonClasses,
      drawerContentClasses,
      close,
      handleOverlayClick
    }
  }
})
</script>
