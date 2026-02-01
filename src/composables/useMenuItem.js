/**
 * @fileoverview Menu Item Composable
 * 
 * This module provides the logic and state management for individual menu items.
 * It handles:
 * - Active state detection and styling
 * - Expanded/collapsed state for groups
 * - Event handling (click, keyboard, hover)
 * - Accessibility attributes (ARIA)
 * - Dynamic class generation
 * 
 * The composable integrates with the sidebar context and uses the class
 * cascade system (defaults → global → item-specific).
 * 
 * @module composables/useMenuItem
 * @author Hassan Ali
 * @license MIT
 * 
 * @example
 * // In a menu item component
 * import { useMenuItem } from 'vue-sidebar-kit'
 * 
 * const props = defineProps({ item: Object, level: Number })
 * 
 * const {
 *   isActive,
 *   isExpanded,
 *   hasChildren,
 *   classes,
 *   ariaAttrs,
 *   handleClick
 * } = useMenuItem(props.item, props.level)
 */

import { computed, ref } from 'vue'
import { useSidebar } from './useSidebar.js'
import { isItemActive, isParentOfActive } from './useActiveState.js'
import { resolveClass, getLinkClasses } from '../styles/classes.js'

/**
 * Creates a composable for managing a single menu item's state and behavior.
 * 
 * This composable centralizes all the logic for a menu item, making the
 * component template declarative. It provides computed properties for:
 * - Visual states (active, expanded, disabled, parent of active)
 * - CSS classes (resolved through the class cascade system)
 * - Accessibility attributes
 * - Event handlers
 * 
 * @function useMenuItem
 * @param {MenuItem} item - The menu item configuration object
 * @param {number} [level=0] - Nesting level (0 = top-level, 1 = first child, etc.)
 * @param {Object} [options={}] - Additional options
 * @param {Object} [options.context] - Sidebar context (auto-injected if not provided)
 * 
 * @returns {Object} Menu item utilities and state
 * @returns {import('vue').ComputedRef<boolean>} returns.hasChildren - Whether item has children
 * @returns {import('vue').ComputedRef<boolean>} returns.isActive - Whether item is active
 * @returns {import('vue').ComputedRef<boolean>} returns.isGroupActive - Whether any child is active
 * @returns {import('vue').ComputedRef<boolean>} returns.isExpanded - Whether group is expanded
 * @returns {import('vue').ComputedRef<boolean>} returns.isDisabled - Whether item is disabled
 * @returns {import('vue').ComputedRef<boolean>} returns.isVisible - Whether item should be rendered
 * @returns {import('vue').ComputedRef<boolean>} returns.isExternal - Whether item is external link
 * @returns {import('vue').ComputedRef<string>} returns.itemClass - CSS class for <li> element
 * @returns {import('vue').ComputedRef<string>} returns.linkClass - CSS class for link element
 * @returns {import('vue').ComputedRef<Object>} returns.ariaAttrs - ARIA attributes object
 * @returns {Function} returns.handleClick - Click event handler
 * @returns {Function} returns.handleKeydown - Keyboard event handler
 * @returns {Function} returns.toggle - Toggle expanded state (for groups)
 * 
 * @example
 * // In SidebarMenuItem.vue
 * const {
 *   hasChildren,
 *   isActive,
 *   isExpanded,
 *   itemClass,
 *   linkClass,
 *   ariaAttrs,
 *   handleClick,
 *   handleKeydown
 * } = useMenuItem(props.item, props.level)
 * 
 * // Use in template:
 * // <li :class="itemClass">
 * //   <a :class="linkClass" v-bind="ariaAttrs" @click="handleClick" @keydown="handleKeydown">
 * //     ...
 * //   </a>
 * // </li>
 */
export function useMenuItem(item, level = 0, options = {}) {
  // ===========================================================================
  // CONTEXT & DEPENDENCIES
  // ===========================================================================

  /**
   * Get sidebar context - either provided or injected.
   * This provides access to global states like collapsed, currentPath, etc.
   */
  const ctx = options.context || useSidebar()

  // ===========================================================================
  // STATE COMPUTATIONS
  // ===========================================================================

  /**
   * Whether this menu item has children (is a group/submenu).
   * Items with children can be expanded/collapsed and show a dropdown arrow.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const hasChildren = computed(() => {
    return Boolean(item.children && item.children.length > 0)
  })

  /**
   * Whether this item itself is active (matches current route).
   * Active items receive special styling to indicate current location.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isActive = computed(() => {
    return isItemActive(item, ctx.currentPath.value)
  })

  /**
   * Whether this item is a parent of an active child (any depth).
   * Used to highlight the path to the currently active item.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isGroupActive = computed(() => {
    return isParentOfActive(item, ctx.currentPath.value)
  })

  /**
   * Whether this group item is currently expanded.
   * Only meaningful for items with children.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isExpanded = computed(() => {
    if (!hasChildren.value) return false
    return ctx.isGroupExpanded(item.id)
  })

  /**
   * Whether this item is disabled.
   * Disabled items cannot be clicked or navigated to.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isDisabled = computed(() => {
    return Boolean(item.disabled)
  })

  /**
   * Whether this item should be visible.
   * Supports both boolean and function-based visibility.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isVisible = computed(() => {
    if (typeof item.visible === 'function') {
      return item.visible({ item })
    }
    return item.visible !== false
  })

  /**
   * Whether this is an external link (opens in new tab).
   * External links get target="_blank" and don't trigger SPA navigation.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isExternal = computed(() => {
    return Boolean(item.external)
  })

  /**
   * Whether this item should be hidden when sidebar is collapsed.
   * Typically true for header/separator items.
   * @type {import('vue').ComputedRef<boolean>}
   */
  const isHiddenOnCollapse = computed(() => {
    return Boolean(item.hiddenOnCollapse) && ctx.isCollapsed.value
  })

  // ===========================================================================
  // CLASS GENERATION
  // ===========================================================================

  /**
   * CSS class for the <li> wrapper element.
   * Computed based on item state and class overrides.
   * @type {import('vue').ComputedRef<string>}
   */
  const itemClass = computed(() => {
    const classes = [
      resolveClass('item', ctx.classes.value, item.classes)
    ]

    // Add any custom class specified on the item
    if (item.class) {
      classes.push(item.class)
    }

    return classes.filter(Boolean).join(' ')
  })

  /**
   * CSS class for the link/anchor element.
   * Uses getLinkClasses to apply state-based classes.
   * @type {import('vue').ComputedRef<string>}
   */
  const linkClass = computed(() => {
    return getLinkClasses({
      globalClasses: ctx.classes.value,
      itemClasses: item.classes,
      isActive: isActive.value,
      isGroupActive: isGroupActive.value,
      isOpen: isExpanded.value,
      isDisabled: isDisabled.value,
      level
    })
  })

  /**
   * CSS class for the icon wrapper element.
   * @type {import('vue').ComputedRef<string>}
   */
  const iconClass = computed(() => {
    return resolveClass('icon', ctx.classes.value, item.classes)
  })

  /**
   * CSS class for the label text element.
   * @type {import('vue').ComputedRef<string>}
   */
  const labelClass = computed(() => {
    return resolveClass('label', ctx.classes.value, item.classes)
  })

  /**
   * CSS class for the badge element.
   * @type {import('vue').ComputedRef<string>}
   */
  const badgeClass = computed(() => {
    return resolveClass('badge', ctx.classes.value, item.classes)
  })

  /**
   * CSS class for the dropdown arrow element.
   * Also includes open state class when expanded.
   * @type {import('vue').ComputedRef<string>}
   */
  const dropdownClass = computed(() => {
    const base = resolveClass('dropdown', ctx.classes.value, item.classes)
    if (isExpanded.value) {
      const openClass = resolveClass('dropdownOpen', ctx.classes.value, item.classes)
      return `${base} ${openClass}`.trim()
    }
    return base
  })

  // ===========================================================================
  // ACCESSIBILITY ATTRIBUTES
  // ===========================================================================

  /**
   * ARIA attributes for accessibility.
   * Provides semantic information to screen readers.
   * 
   * Includes:
   * - aria-current="page" for active items
   * - aria-expanded for groups
   * - aria-disabled for disabled items
   * - role attributes as needed
   * 
   * @type {import('vue').ComputedRef<Object>}
   */
  const ariaAttrs = computed(() => {
    const attrs = {}

    // Active state
    if (isActive.value) {
      attrs['aria-current'] = 'page'
    }

    // Expandable groups
    if (hasChildren.value) {
      attrs['aria-expanded'] = isExpanded.value ? 'true' : 'false'
      attrs['aria-haspopup'] = 'true'
    }

    // Disabled state
    if (isDisabled.value) {
      attrs['aria-disabled'] = 'true'
      attrs['tabindex'] = '-1'
    }

    return attrs
  })

  // ===========================================================================
  // EVENT HANDLERS
  // ===========================================================================

  /**
   * Handles click events on the menu item.
   * 
   * Behavior:
   * 1. If disabled, prevent default and stop propagation
   * 2. If item has children, toggle expanded state
   * 3. If on mobile, close drawer after navigation (for leaf items)
   * 4. Emit item-click event for parent handling
   * 
   * @function handleClick
   * @param {MouseEvent} event - The click event
   * @returns {void}
   * 
   * @example
   * // In template
   * <a @click="handleClick">Link text</a>
   */
  function handleClick(event) {
    // Disabled items don't respond to clicks
    if (isDisabled.value) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    // Groups toggle their expanded state
    if (hasChildren.value) {
      event.preventDefault()
      ctx.toggleGroup(item.id)
      return
    }

    // Close mobile drawer on navigation (for leaf items)
    if (ctx.mobileOpen.value) {
      ctx.closeMobile()
    }
  }

  /**
   * Handles keyboard events for accessibility.
   * 
   * Supports:
   * - Enter/Space: Same as click
   * - ArrowRight: Expand group
   * - ArrowLeft: Collapse group
   * 
   * @function handleKeydown
   * @param {KeyboardEvent} event - The keyboard event
   * @returns {void}
   * 
   * @example
   * // In template
   * <a @keydown="handleKeydown" tabindex="0">Link text</a>
   */
  function handleKeydown(event) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleClick(event)
        break

      case 'ArrowRight':
        if (hasChildren.value && !isExpanded.value) {
          event.preventDefault()
          ctx.toggleGroup(item.id)
        }
        break

      case 'ArrowLeft':
        if (hasChildren.value && isExpanded.value) {
          event.preventDefault()
          ctx.toggleGroup(item.id)
        }
        break
    }
  }

  /**
   * Toggles the expanded state of this group.
   * Convenience method that wraps ctx.toggleGroup.
   * 
   * @function toggle
   * @returns {void}
   */
  function toggle() {
    if (hasChildren.value) {
      ctx.toggleGroup(item.id)
    }
  }

  // ===========================================================================
  // RETURN VALUE
  // ===========================================================================

  return {
    // State
    hasChildren,
    isActive,
    isGroupActive,
    isExpanded,
    isDisabled,
    isVisible,
    isExternal,
    isHiddenOnCollapse,

    // Classes
    itemClass,
    linkClass,
    iconClass,
    labelClass,
    badgeClass,
    dropdownClass,

    // Accessibility
    ariaAttrs,

    // Event handlers
    handleClick,
    handleKeydown,
    toggle,

    // Context access
    context: ctx,
    level
  }
}
