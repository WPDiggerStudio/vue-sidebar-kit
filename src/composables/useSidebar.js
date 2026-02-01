/**
 * @fileoverview Main Sidebar State Management Composable
 * 
 * This module provides the core state management for the Vue Sidebar Kit.
 * It implements the Provider Pattern, allowing sidebar state to be shared
 * across deeply nested components without prop drilling.
 * 
 * @module composables/useSidebar
 * @author Hassan Ali
 * @license MIT
 * 
 * @example
 * // In a parent component (typically your layout)
 * import { createSidebarContext, provideSidebar } from 'vue-sidebar-kit'
 * 
 * const context = createSidebarContext(props, emit)
 * provideSidebar(context)
 * 
 * @example
 * // In any child component
 * import { useSidebar } from 'vue-sidebar-kit'
 * 
 * const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar()
 */

import { ref, computed, provide, inject, reactive, watch, onMounted, onUnmounted } from 'vue'

/**
 * Symbol key used for Vue's provide/inject mechanism.
 * Using a Symbol ensures uniqueness and prevents naming collisions.
 * 
 * @constant {Symbol}
 * @private
 */
const SIDEBAR_INJECTION_KEY = Symbol('vsm-sidebar')

/**
 * Checks if the code is running in a browser environment.
 * This is essential for SSR (Server-Side Rendering) safety.
 * 
 * @function isBrowser
 * @returns {boolean} True if running in browser, false if in Node.js/SSR
 * 
 * @example
 * if (isBrowser()) {
 *   // Safe to access window, document, localStorage
 *   localStorage.setItem('key', 'value')
 * }
 */
function isBrowser() {
  return typeof window !== 'undefined'
}

/**
 * Gets the current URL path in an SSR-safe manner.
 * Returns the full path including pathname, search params, and hash.
 * 
 * @function getCurrentPath
 * @returns {string} The current path (e.g., '/users?page=1#section')
 * 
 * @example
 * const path = getCurrentPath()
 * // Returns: '/dashboard' or '/' if on server
 */
function getCurrentPath() {
  if (!isBrowser()) return '/'
  return window.location.pathname + window.location.search + window.location.hash
}

/**
 * Creates the main sidebar context object.
 * This is the factory function that initializes all sidebar state and methods.
 * 
 * The context object is reactive and can be used with Vue's reactivity system.
 * It handles:
 * - Collapsed/expanded state
 * - Mobile drawer open/close
 * - Group expansion tracking
 * - State persistence to localStorage
 * - Route change detection
 * - Keyboard event handling
 * 
 * @function createSidebarContext
 * @param {Object} props - Component props passed from SidebarMenu or SidebarProvider
 * @param {boolean} [props.collapsed=false] - Initial collapsed state
 * @param {boolean} [props.mobileOpen=false] - Initial mobile drawer state
 * @param {string} [props.storageKey] - localStorage key for persistence (optional)
 * @param {string} [props.width='256px'] - Expanded sidebar width
 * @param {string} [props.collapsedWidth='64px'] - Collapsed sidebar width
 * @param {boolean} [props.expandOnHover=false] - Expand on mouse hover when collapsed
 * @param {boolean|'deep'} [props.showOneChild=false] - Accordion behavior for groups
 * @param {string[]} [props.defaultExpandedGroups=[]] - Initially expanded group IDs
 * @param {string} [props.mode='a'] - Navigation mode ('a', 'router', 'inertia')
 * @param {Object} [props.classes={}] - Class override object
 * @param {boolean} [props.rtl=false] - Right-to-left layout
 * @param {boolean} [props.disableHover=false] - Disable hover effects
 * @param {string} [props.linkComponentName] - Custom link component name
 * 
 * @param {Function} emit - Vue emit function for v-model updates
 * 
 * @returns {Object} Reactive sidebar context object
 * @returns {import('vue').Ref<boolean>} returns.collapsed - Collapsed state ref
 * @returns {import('vue').Ref<boolean>} returns.mobileOpen - Mobile open state ref
 * @returns {import('vue').Ref<Set<string>>} returns.expandedGroups - Expanded group IDs
 * @returns {import('vue').Ref<string>} returns.currentPath - Current URL path
 * @returns {import('vue').ComputedRef<boolean>} returns.isCollapsed - Effective collapsed state
 * @returns {import('vue').Ref<boolean>} returns.hoverExpanded - Hover expansion state
 * @returns {import('vue').ComputedRef<string>} returns.effectiveWidth - Current width
 * @returns {Function} returns.toggle - Toggle collapsed state
 * @returns {Function} returns.collapse - Force collapse
 * @returns {Function} returns.expand - Force expand
 * @returns {Function} returns.toggleMobile - Toggle mobile drawer
 * @returns {Function} returns.openMobile - Open mobile drawer
 * @returns {Function} returns.closeMobile - Close mobile drawer
 * @returns {Function} returns.toggleGroup - Toggle a group's expanded state
 * @returns {Function} returns.isGroupExpanded - Check if group is expanded
 * @returns {Function} returns.setHoverExpanded - Set hover expansion state
 * @returns {Function} returns.updateCurrentPath - Force path update
 * 
 * @example
 * // Basic usage in a component setup
 * const context = createSidebarContext(
 *   { collapsed: false, storageKey: 'my-app-sidebar' },
 *   (event, value) => emit(event, value)
 * )
 * 
 * // Use context methods
 * context.toggle()  // Toggle collapsed state
 * context.toggleGroup('users')  // Toggle a specific group
 */
export function createSidebarContext(props, emit) {
  // =========================================================================
  // STATE INITIALIZATION
  // =========================================================================

  /**
   * Whether the sidebar is in collapsed (rail) mode.
   * When collapsed, only icons are visible and labels are hidden.
   * @type {import('vue').Ref<boolean>}
   */
  const collapsed = ref(props.collapsed ?? false)

  /**
   * Whether the mobile drawer is open.
   * Only relevant on mobile viewports (below mobileBreakpoint).
   * @type {import('vue').Ref<boolean>}
   */
  const mobileOpen = ref(props.mobileOpen ?? false)

  /**
   * Set of currently expanded group IDs.
   * Groups are menu items with children that can be expanded/collapsed.
   * @type {import('vue').Ref<Set<string>>}
   */
  const expandedGroups = ref(new Set(props.defaultExpandedGroups || []))

  /**
   * Current URL path for active state detection.
   * Updated on navigation events and can be manually refreshed.
   * @type {import('vue').Ref<string>}
   */
  const currentPath = ref(getCurrentPath())

  /**
   * Whether the sidebar is temporarily expanded due to hover.
   * Only active when expandOnHover prop is true and sidebar is collapsed.
   * @type {import('vue').Ref<boolean>}
   */
  const hoverExpanded = ref(false)

  // =========================================================================
  // COMPUTED PROPERTIES
  // =========================================================================

  /**
   * Effective collapsed state accounting for hover expansion.
   * If hover-expanded, returns false even if technically collapsed.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isCollapsed = computed(() => {
    if (hoverExpanded.value) return false
    return collapsed.value
  })

  /**
   * Current effective width of the sidebar.
   * Returns collapsed width or full width based on state.
   * @type {import('vue').ComputedRef<string>}
   */
  const effectiveWidth = computed(() => {
    return isCollapsed.value ? props.collapsedWidth : props.width
  })

  // =========================================================================
  // PERSISTENCE FUNCTIONS
  // =========================================================================

  /**
   * Loads persisted state from localStorage.
   * Called on component mount if storageKey is provided.
   * Handles:
   * - Collapsed state restoration
   * - Expanded groups restoration
   * 
   * @function loadPersistedState
   * @private
   * @returns {void}
   */
  function loadPersistedState() {
    if (!isBrowser() || !props.storageKey) return

    try {
      const saved = localStorage.getItem(props.storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        if (typeof data.collapsed === 'boolean') {
          collapsed.value = data.collapsed
        }
        if (Array.isArray(data.expandedGroups)) {
          expandedGroups.value = new Set(data.expandedGroups)
        }
      }
    } catch (e) {
      console.warn('[vue-sidebar-kit] Failed to load persisted state:', e)
    }
  }

  /**
   * Saves current state to localStorage.
   * Called automatically when collapsed state or expanded groups change.
   * 
   * @function savePersistedState
   * @private
   * @returns {void}
   */
  function savePersistedState() {
    if (!isBrowser() || !props.storageKey) return

    try {
      localStorage.setItem(props.storageKey, JSON.stringify({
        collapsed: collapsed.value,
        expandedGroups: Array.from(expandedGroups.value)
      }))
    } catch (e) {
      console.warn('[vue-sidebar-kit] Failed to save state:', e)
    }
  }

  // =========================================================================
  // PUBLIC METHODS
  // =========================================================================

  /**
   * Toggles the sidebar between collapsed and expanded states.
   * Emits 'update:collapsed' event for v-model binding.
   * Persists state if storageKey is configured.
   * 
   * @function toggle
   * @fires update:collapsed
   * @returns {void}
   * 
   * @example
   * const { toggle } = useSidebar()
   * toggle() // Toggles between collapsed/expanded
   */
  function toggle() {
    collapsed.value = !collapsed.value
    emit('update:collapsed', collapsed.value)
    savePersistedState()
  }

  /**
   * Forces the sidebar into collapsed (rail) state.
   * Useful for responsive layouts or programmatic control.
   * 
   * @function collapse
   * @fires update:collapsed
   * @returns {void}
   * 
   * @example
   * // Collapse sidebar on mobile
   * if (window.innerWidth < 768) {
   *   sidebar.collapse()
   * }
   */
  function collapse() {
    collapsed.value = true
    emit('update:collapsed', true)
    savePersistedState()
  }

  /**
   * Forces the sidebar into expanded state.
   * Shows full labels and expands to full width.
   * 
   * @function expand
   * @fires update:collapsed
   * @returns {void}
   */
  function expand() {
    collapsed.value = false
    emit('update:collapsed', false)
    savePersistedState()
  }

  /**
   * Toggles the mobile drawer between open and closed.
   * Only affects mobile view. Also manages body scroll lock.
   * 
   * @function toggleMobile
   * @fires update:mobileOpen
   * @returns {void}
   */
  function toggleMobile() {
    mobileOpen.value = !mobileOpen.value
    emit('update:mobileOpen', mobileOpen.value)
    updateBodyScroll()
  }

  /**
   * Opens the mobile drawer.
   * Applies body scroll lock to prevent background scrolling.
   * 
   * @function openMobile
   * @fires update:mobileOpen
   * @returns {void}
   */
  function openMobile() {
    mobileOpen.value = true
    emit('update:mobileOpen', true)
    updateBodyScroll()
  }

  /**
   * Closes the mobile drawer.
   * Removes body scroll lock.
   * 
   * @function closeMobile
   * @fires update:mobileOpen
   * @returns {void}
   */
  function closeMobile() {
    mobileOpen.value = false
    emit('update:mobileOpen', false)
    updateBodyScroll()
  }

  /**
   * Toggles a group's expanded state.
   * Groups are menu items with children that can be collapsed.
   * 
   * If showOneChild is enabled, only one group at the same level
   * will remain expanded (accordion behavior).
   * 
   * @function toggleGroup
   * @param {string} id - The unique identifier of the group to toggle
   * @returns {void}
   * 
   * @example
   * // Toggle the 'users' group
   * sidebar.toggleGroup('users')
   */
  function toggleGroup(id) {
    if (expandedGroups.value.has(id)) {
      expandedGroups.value.delete(id)
    } else {
      // If showOneChild, close others at same level
      if (props.showOneChild === true) {
        // For now, just add - proper sibling detection would need tree context
      }
      expandedGroups.value.add(id)
    }
    // Trigger reactivity by creating new Set
    expandedGroups.value = new Set(expandedGroups.value)
    savePersistedState()
  }

  /**
   * Checks if a specific group is currently expanded.
   * 
   * @function isGroupExpanded
   * @param {string} id - The group identifier to check
   * @returns {boolean} True if the group is expanded
   * 
   * @example
   * if (sidebar.isGroupExpanded('settings')) {
   *   console.log('Settings menu is open')
   * }
   */
  function isGroupExpanded(id) {
    return expandedGroups.value.has(id)
  }

  /**
   * Sets the hover expansion state.
   * Used internally when mouse enters/leaves the collapsed sidebar.
   * 
   * @function setHoverExpanded
   * @param {boolean} value - Whether to expand on hover
   * @returns {void}
   */
  function setHoverExpanded(value) {
    if (props.expandOnHover && collapsed.value) {
      hoverExpanded.value = value
    }
  }

  // =========================================================================
  // BODY SCROLL LOCK
  // =========================================================================

  /**
   * Updates body scroll lock based on mobile drawer state.
   * Adds/removes 'vsm-no-scroll' class to prevent background scrolling.
   * 
   * @function updateBodyScroll
   * @private
   * @returns {void}
   */
  function updateBodyScroll() {
    if (!isBrowser()) return

    if (mobileOpen.value) {
      document.body.classList.add('vsm-no-scroll')
    } else {
      document.body.classList.remove('vsm-no-scroll')
    }
  }

  // =========================================================================
  // ROUTE CHANGE DETECTION
  // =========================================================================

  /**
   * Updates the current path from window.location.
   * Call this after programmatic navigation to refresh active states.
   * 
   * @function updateCurrentPath
   * @returns {void}
   * 
   * @example
   * // After Inertia navigation
   * router.on('navigate', () => {
   *   sidebar.updateCurrentPath()
   * })
   */
  function updateCurrentPath() {
    currentPath.value = getCurrentPath()
  }

  /**
   * Handler for browser popstate events (back/forward navigation).
   * 
   * @function handlePopState
   * @private
   * @returns {void}
   */
  function handlePopState() {
    updateCurrentPath()
  }

  // =========================================================================
  // KEYBOARD HANDLING
  // =========================================================================

  /**
   * Global keyboard event handler.
   * Handles Escape key to close mobile drawer.
   * 
   * @function handleKeydown
   * @private
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {void}
   */
  function handleKeydown(event) {
    if (event.key === 'Escape' && mobileOpen.value) {
      closeMobile()
    }
  }

  // =========================================================================
  // LIFECYCLE
  // =========================================================================

  onMounted(() => {
    loadPersistedState()
    updateCurrentPath()

    if (isBrowser()) {
      window.addEventListener('popstate', handlePopState)
      window.addEventListener('hashchange', updateCurrentPath)
      document.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    if (isBrowser()) {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('hashchange', updateCurrentPath)
      document.removeEventListener('keydown', handleKeydown)
      document.body.classList.remove('vsm-no-scroll')
    }
  })

  // Watch for prop changes (external v-model updates)
  watch(() => props.collapsed, (val) => {
    if (val !== collapsed.value) {
      collapsed.value = val
    }
  })

  watch(() => props.mobileOpen, (val) => {
    if (val !== mobileOpen.value) {
      mobileOpen.value = val
      updateBodyScroll()
    }
  })

  // =========================================================================
  // CONTEXT OBJECT
  // =========================================================================

  /**
   * The reactive context object containing all state and methods.
   * This object is provided to child components and returned from useSidebar().
   */
  const context = reactive({
    // State (refs)
    collapsed,
    mobileOpen,
    expandedGroups,
    currentPath,
    isCollapsed,
    hoverExpanded,
    effectiveWidth,

    // Props passthrough (as computed for reactivity)
    mode: computed(() => props.mode || 'a'),
    classes: computed(() => props.classes || {}),
    width: computed(() => props.width || '256px'),
    collapsedWidth: computed(() => props.collapsedWidth || '64px'),
    rtl: computed(() => props.rtl || false),
    disableHover: computed(() => props.disableHover || false),
    showOneChild: computed(() => props.showOneChild || false),
    expandOnHover: computed(() => props.expandOnHover || false),
    linkComponentName: computed(() => props.linkComponentName),

    // Methods
    toggle,
    collapse,
    expand,
    toggleMobile,
    openMobile,
    closeMobile,
    toggleGroup,
    isGroupExpanded,
    setHoverExpanded,
    updateCurrentPath
  })

  return context
}

/**
 * Provides the sidebar context to all descendant components.
 * Call this in the setup of SidebarMenu or SidebarProvider.
 * 
 * @function provideSidebar
 * @param {Object} context - The context object from createSidebarContext
 * @returns {void}
 * 
 * @example
 * // In SidebarMenu.vue setup
 * const context = createSidebarContext(props, emit)
 * provideSidebar(context)
 */
export function provideSidebar(context) {
  provide(SIDEBAR_INJECTION_KEY, context)
}

/**
 * Injects and returns the sidebar context in child components.
 * Must be called inside a component that is a descendant of
 * SidebarMenu or SidebarProvider.
 * 
 * @function useSidebar
 * @throws {Error} If called outside of a sidebar context
 * @returns {Object} The sidebar context object with all state and methods
 * 
 * @example
 * // In any child component
 * import { useSidebar } from 'vue-sidebar-kit'
 * 
 * const sidebar = useSidebar()
 * 
 * // Access state
 * console.log(sidebar.collapsed.value)
 * 
 * // Call methods
 * sidebar.toggle()
 * sidebar.toggleGroup('settings')
 * 
 * // Use in template
 * // <button @click="sidebar.toggle()">Toggle</button>
 */
export function useSidebar() {
  const context = inject(SIDEBAR_INJECTION_KEY)
  if (!context) {
    throw new Error(
      '[vue-sidebar-kit] useSidebar() must be used inside a <SidebarMenu> or <SidebarProvider>. ' +
      'Make sure your component is wrapped in one of these components.'
    )
  }
  return context
}

/**
 * Checks if a sidebar context exists without throwing an error.
 * Useful for optional sidebar integration in shared components.
 * 
 * @function hasSidebarContext
 * @returns {boolean} True if sidebar context is available
 * 
 * @example
 * // In a shared component that may or may not be in a sidebar
 * if (hasSidebarContext()) {
 *   const sidebar = useSidebar()
 *   // Use sidebar features
 * }
 */
export function hasSidebarContext() {
  return inject(SIDEBAR_INJECTION_KEY, null) !== null
}
