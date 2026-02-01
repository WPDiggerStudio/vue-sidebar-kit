/**
 * @fileoverview Active State Detection Composable
 * 
 * This module provides sophisticated active state detection for menu items.
 * It supports multiple matching strategies to determine if a menu item
 * corresponds to the current route/URL.
 * 
 * The module is designed to work with all three navigation modes:
 * - Plain anchors (using window.location)
 * - Vue Router (using currentRoute)
 * - Inertia.js (using page.url)
 * 
 * @module composables/useActiveState
 * @author Hassan Ali
 * @license MIT
 * 
 * @example
 * // Basic usage
 * import { isItemActive } from 'vue-sidebar-kit'
 * 
 * const active = isItemActive(menuItem, '/current/path')
 * 
 * @example
 * // With Vue Router
 * import { useActiveState } from 'vue-sidebar-kit'
 * import { useRouter } from 'vue-router'
 * 
 * const router = useRouter()
 * const { isActive, isParentActive } = useActiveState()
 */

/**
 * @typedef {Object} ActiveMatchContext
 * @property {MenuItem} item - The menu item being checked
 * @property {string} currentPath - Current URL path (e.g., '/users/123')
 * @property {Object} [currentRoute] - Vue Router route object (if available)
 * @property {string} [pageUrl] - Inertia page URL (if available)
 * @property {boolean} [isExact] - Whether this is an exact match check
 */

/**
 * @typedef {'exact'|'startsWith'|{pattern: string}|Function} ActiveMatchStrategy
 * 
 * Strategies for determining if a menu item is active:
 * 
 * - `'exact'`: Path must match exactly (default for items without children)
 * - `'startsWith'`: Current path starts with item's href (default for parent items)
 * - `{ pattern: string }`: A regex pattern to match against the path
 * - `Function`: Custom function receiving context, returns boolean
 */

/**
 * Normalizes a path by removing trailing slashes for consistent comparison.
 * Also handles edge cases like root path '/' and query strings.
 * 
 * @function normalizePath
 * @param {string} path - The path to normalize
 * @returns {string} Normalized path without trailing slash (except for root)
 * 
 * @example
 * normalizePath('/users/')    // Returns: '/users'
 * normalizePath('/users')     // Returns: '/users'
 * normalizePath('/')          // Returns: '/'
 * normalizePath('')           // Returns: '/'
 * normalizePath('/a/b/c/')    // Returns: '/a/b/c'
 */
function normalizePath(path) {
  if (!path) return '/'
  // Remove trailing slash unless it's the root path
  if (path !== '/' && path.endsWith('/')) {
    return path.slice(0, -1)
  }
  return path
}

/**
 * Extracts the path portion from a URL or route object.
 * Handles various input formats:
 * - String paths: '/users/123'
 * - Full URLs: 'https://example.com/users/123'
 * - Route objects: { name: 'users', params: {} }
 * 
 * @function getItemPath
 * @param {MenuItem} item - The menu item to extract path from
 * @returns {string|null} The extracted path, or null if not determinable
 * 
 * @example
 * getItemPath({ href: '/users' })           // Returns: '/users'
 * getItemPath({ to: '/users' })             // Returns: '/users'
 * getItemPath({ to: { path: '/users' } })   // Returns: '/users'
 * getItemPath({ href: 'https://x.com/a' })  // Returns: '/a'
 */
function getItemPath(item) {
  // Try href first (used by anchor and Inertia modes)
  if (item.href) {
    // Handle external URLs
    if (item.href.startsWith('http://') || item.href.startsWith('https://')) {
      try {
        return new URL(item.href).pathname
      } catch {
        return null
      }
    }
    return item.href
  }

  // Try 'to' prop (used by Vue Router mode)
  if (item.to) {
    if (typeof item.to === 'string') {
      return item.to
    }
    // Route object: { path: '/x' } or { name: 'route-name' }
    if (item.to.path) {
      return item.to.path
    }
    // Named routes can't be resolved without router instance
    // Return null and let the caller handle it
    return null
  }

  return null
}

/**
 * Determines if a menu item is currently active based on the matching strategy.
 * 
 * This is the core function for active state detection. It supports multiple
 * strategies and handles edge cases like disabled items, external links, and
 * items without navigation targets.
 * 
 * Algorithm:
 * 1. Return false for disabled or external items
 * 2. Return false if item has no navigable path
 * 3. Apply the matching strategy (exact, startsWith, pattern, or custom)
 * 4. Default to 'startsWith' for parents, 'exact' for leaf items
 * 
 * @function isItemActive
 * @param {MenuItem} item - The menu item to check
 * @param {string} currentPath - The current URL path
 * @param {Object} [options={}] - Additional options
 * @param {Object} [options.currentRoute] - Vue Router route object
 * @param {string} [options.pageUrl] - Inertia page URL
 * @returns {boolean} True if the item is considered active
 * 
 * @example
 * // Exact match (default for leaf items)
 * const item = { id: 'users', href: '/users', activeMatch: 'exact' }
 * isItemActive(item, '/users')      // true
 * isItemActive(item, '/users/123')  // false
 * 
 * @example
 * // StartsWith match (default for parent items)
 * const item = { id: 'users', href: '/users', activeMatch: 'startsWith' }
 * isItemActive(item, '/users')      // true
 * isItemActive(item, '/users/123')  // true
 * isItemActive(item, '/settings')   // false
 * 
 * @example
 * // Pattern match (regex)
 * const item = { 
 *   id: 'user-detail', 
 *   href: '/users/1',
 *   activeMatch: { pattern: '^/users/\\d+$' }
 * }
 * isItemActive(item, '/users/123')    // true
 * isItemActive(item, '/users')        // false
 * isItemActive(item, '/users/abc')    // false
 * 
 * @example
 * // Custom function
 * const item = {
 *   id: 'special',
 *   href: '/dashboard',
 *   activeMatch: (ctx) => ctx.currentPath.includes('dashboard')
 * }
 * isItemActive(item, '/admin/dashboard')  // true
 */
export function isItemActive(item, currentPath, options = {}) {
  // =========================================================================
  // EARLY RETURNS
  // =========================================================================

  // Disabled items are never active
  if (item.disabled) {
    return false
  }

  // External links are never considered active (they navigate away)
  if (item.external) {
    return false
  }

  // Get the item's path
  const itemPath = getItemPath(item)
  if (!itemPath) {
    return false
  }

  // Normalize paths for comparison
  const normalizedItemPath = normalizePath(itemPath)
  const normalizedCurrentPath = normalizePath(currentPath)

  // =========================================================================
  // STRATEGY RESOLUTION
  // =========================================================================

  /**
   * Determine the matching strategy to use.
   * Priority:
   * 1. Explicitly set on item.activeMatch
   * 2. 'startsWith' for items with children (parent items)
   * 3. 'exact' for leaf items (no children)
   */
  const strategy = item.activeMatch || 
    (item.children && item.children.length > 0 ? 'startsWith' : 'exact')

  // =========================================================================
  // STRATEGY APPLICATION
  // =========================================================================

  // Custom function strategy
  if (typeof strategy === 'function') {
    /** @type {ActiveMatchContext} */
    const context = {
      item,
      currentPath: normalizedCurrentPath,
      currentRoute: options.currentRoute,
      pageUrl: options.pageUrl
    }
    return strategy(context)
  }

  // Pattern (regex) strategy
  if (typeof strategy === 'object' && strategy.pattern) {
    try {
      const regex = new RegExp(strategy.pattern)
      return regex.test(normalizedCurrentPath)
    } catch (e) {
      console.warn(
        `[vue-sidebar-kit] Invalid regex pattern "${strategy.pattern}" for item "${item.id}":`,
        e.message
      )
      return false
    }
  }

  // StartsWith strategy
  if (strategy === 'startsWith') {
    // Handle root path specially
    if (normalizedItemPath === '/') {
      return normalizedCurrentPath === '/'
    }
    return normalizedCurrentPath.startsWith(normalizedItemPath)
  }

  // Exact strategy (default)
  return normalizedCurrentPath === normalizedItemPath
}

/**
 * Checks if a menu item is a parent of an active child.
 * This is used to highlight parent menu items when a nested child is active.
 * 
 * The check is recursive, so grandparent items will also return true
 * if any descendant at any depth is active.
 * 
 * @function isParentOfActive
 * @param {MenuItem} item - The parent item to check
 * @param {string} currentPath - The current URL path
 * @param {Object} [options={}] - Additional options passed to isItemActive
 * @returns {boolean} True if any descendant is active
 * 
 * @example
 * const usersMenu = {
 *   id: 'users',
 *   href: '/users',
 *   children: [
 *     { id: 'users-list', href: '/users' },
 *     { id: 'users-create', href: '/users/create' }
 *   ]
 * }
 * 
 * isParentOfActive(usersMenu, '/users/create')  // true
 * isParentOfActive(usersMenu, '/settings')      // false
 */
export function isParentOfActive(item, currentPath, options = {}) {
  // No children means can't be a parent
  if (!item.children || item.children.length === 0) {
    return false
  }

  // Check each child recursively
  return item.children.some(child => {
    // Check if this child is active
    if (isItemActive(child, currentPath, options)) {
      return true
    }
    // Recursively check if any grandchild is active
    return isParentOfActive(child, currentPath, options)
  })
}

/**
 * Creates a reactive composable for active state detection.
 * 
 * This composable integrates with the sidebar context and provides
 * reactive methods to check active states. It's designed to be used
 * within components that are descendants of SidebarMenu or SidebarProvider.
 * 
 * @function useActiveState
 * @param {Object} [context] - Optional sidebar context (auto-injected if not provided)
 * @returns {Object} Active state utilities
 * @returns {Function} returns.isActive - Check if an item is active
 * @returns {Function} returns.isParentActive - Check if item is parent of active
 * @returns {import('vue').Ref<string>} returns.currentPath - The current path ref
 * 
 * @example
 * // In a component's setup
 * import { useActiveState } from 'vue-sidebar-kit'
 * 
 * const { isActive, isParentActive, currentPath } = useActiveState()
 * 
 * // Use in template or computed
 * const menuItemActive = computed(() => isActive(props.item))
 * const isGroupActive = computed(() => isParentActive(props.item))
 */
export function useActiveState(context = null) {
  // Import useSidebar here to avoid circular dependency
  const { useSidebar } = require('./useSidebar.js')

  // Get context from injection if not provided
  const ctx = context || useSidebar()

  /**
   * Check if an item is active relative to current path.
   * Wrapper around isItemActive that uses context's currentPath.
   * 
   * @param {MenuItem} item - The menu item to check
   * @returns {boolean} True if active
   */
  function isActive(item) {
    return isItemActive(item, ctx.currentPath.value)
  }

  /**
   * Check if an item is parent of an active child.
   * Wrapper around isParentOfActive.
   * 
   * @param {MenuItem} item - The parent item to check
   * @returns {boolean} True if any child is active
   */
  function isParentActive(item) {
    return isParentOfActive(item, ctx.currentPath.value)
  }

  return {
    isActive,
    isParentActive,
    currentPath: ctx.currentPath
  }
}
