/**
 * @fileoverview Multi-Mode Navigation Composable
 * 
 * This module implements the Link Adapter Pattern, providing a unified
 * interface for navigation that works across three different routing systems:
 * 
 * 1. **Plain Anchors (`mode='a'`)**: Standard HTML `<a>` tags
 * 2. **Vue Router (`mode='router'`)**: Uses `<RouterLink>` component
 * 3. **Inertia.js (`mode='inertia'`)**: Uses Inertia's `<Link>` component
 * 
 * The key design goal is **optional dependency handling**. Neither vue-router
 * nor @inertiajs/vue3 are required dependencies - they are detected at runtime
 * and gracefully fall back to anchor mode if unavailable.
 * 
 * @module composables/useNavigation
 * @author Hassan Ali
 * @license MIT
 * 
 * @example
 * // Basic usage
 * import { useNavigation, hasVueRouter, hasInertia } from 'vue-sidebar-kit'
 * 
 * // Check available adapters
 * if (hasVueRouter()) {
 *   console.log('Vue Router is available')
 * }
 * 
 * const { getLinkComponent, resolveLinkProps } = useNavigation('router')
 */

import { computed, h, resolveComponent } from 'vue'

// =============================================================================
// OPTIONAL DEPENDENCY DETECTION
// =============================================================================

/**
 * Cached reference to Vue Router's RouterLink component.
 * Set to null if vue-router is not installed.
 * @type {Object|null}
 * @private
 */
let routerLink = null

/**
 * Cached reference to Inertia's Link component.
 * Set to null if @inertiajs/vue3 is not installed.
 * @type {Object|null}
 * @private
 */
let inertiaLink = null

/**
 * Attempts to import and cache Vue Router's RouterLink component.
 * This is done lazily to avoid import errors when vue-router isn't installed.
 * 
 * @function tryLoadVueRouter
 * @private
 * @returns {Object|null} The RouterLink component or null
 */
function tryLoadVueRouter() {
  if (routerLink !== null) return routerLink
  
  try {
    // Dynamic require - will fail gracefully if not installed
    const vueRouter = require('vue-router')
    routerLink = vueRouter.RouterLink
    return routerLink
  } catch {
    routerLink = false // Mark as attempted but failed
    return null
  }
}

/**
 * Attempts to import and cache Inertia's Link component.
 * This is done lazily to avoid import errors when @inertiajs/vue3 isn't installed.
 * 
 * @function tryLoadInertia
 * @private
 * @returns {Object|null} The Inertia Link component or null
 */
function tryLoadInertia() {
  if (inertiaLink !== null) return inertiaLink
  
  try {
    // Dynamic require - will fail gracefully if not installed
    const inertia = require('@inertiajs/vue3')
    inertiaLink = inertia.Link
    return inertiaLink
  } catch {
    inertiaLink = false // Mark as attempted but failed
    return null
  }
}

// =============================================================================
// PUBLIC DEPENDENCY CHECKERS
// =============================================================================

/**
 * Checks if Vue Router is installed and available.
 * This can be used to conditionally show router-dependent features.
 * 
 * @function hasVueRouter
 * @returns {boolean} True if vue-router is installed and usable
 * 
 * @example
 * import { hasVueRouter } from 'vue-sidebar-kit'
 * 
 * if (hasVueRouter()) {
 *   // Show Vue Router specific options
 *   console.log('Router mode available')
 * }
 */
export function hasVueRouter() {
  const component = tryLoadVueRouter()
  return component !== null && component !== false
}

/**
 * Checks if Inertia.js is installed and available.
 * This can be used to conditionally enable Inertia navigation.
 * 
 * @function hasInertia
 * @returns {boolean} True if @inertiajs/vue3 is installed and usable
 * 
 * @example
 * import { hasInertia } from 'vue-sidebar-kit'
 * 
 * const defaultMode = hasInertia() ? 'inertia' : 'a'
 */
export function hasInertia() {
  const component = tryLoadInertia()
  return component !== null && component !== false
}

// =============================================================================
// LINK COMPONENT RESOLUTION
// =============================================================================

/**
 * Returns the appropriate link component based on navigation mode.
 * Falls back to 'a' tag if requested library isn't available.
 * 
 * Resolution order:
 * 1. If custom linkComponentName provided, resolve that component
 * 2. For 'router' mode, try RouterLink, fall back to 'a'
 * 3. For 'inertia' mode, try Inertia Link, fall back to 'a'
 * 4. For 'a' mode, return 'a' string (native element)
 * 
 * @function getLinkComponent
 * @param {string} mode - Navigation mode: 'a', 'router', or 'inertia'
 * @param {string} [customComponentName] - Optional custom component name to resolve
 * @returns {string|Object} Component to use (string for native, object for Vue component)
 * 
 * @example
 * // Get router link component
 * const LinkComponent = getLinkComponent('router')
 * // Returns RouterLink if available, otherwise 'a'
 * 
 * @example
 * // Custom component override
 * const LinkComponent = getLinkComponent('router', 'CustomLink')
 * // Returns resolved CustomLink component
 */
export function getLinkComponent(mode, customComponentName = null) {
  // Custom component takes priority
  if (customComponentName) {
    try {
      return resolveComponent(customComponentName)
    } catch {
      console.warn(
        `[vue-sidebar-kit] Could not resolve custom link component "${customComponentName}". ` +
        'Falling back to default.'
      )
    }
  }

  switch (mode) {
    case 'router': {
      const RouterLink = tryLoadVueRouter()
      if (RouterLink) return RouterLink
      console.warn(
        '[vue-sidebar-kit] Vue Router not found. Falling back to anchor mode. ' +
        'Install vue-router to use router mode.'
      )
      return 'a'
    }

    case 'inertia': {
      const Link = tryLoadInertia()
      if (Link) return Link
      console.warn(
        '[vue-sidebar-kit] Inertia.js not found. Falling back to anchor mode. ' +
        'Install @inertiajs/vue3 to use inertia mode.'
      )
      return 'a'
    }

    case 'a':
    default:
      return 'a'
  }
}

// =============================================================================
// LINK PROPS RESOLUTION
// =============================================================================

/**
 * @typedef {Object} ResolvedLinkProps
 * @property {string} [href] - URL for anchor/inertia modes
 * @property {string|Object} [to] - Route for router mode
 * @property {string} [target] - Link target ('_blank' for external)
 * @property {string} [rel] - Relationship attribute (for external links)
 * @property {boolean} [disabled] - Whether the link is disabled
 * @property {string} [tabindex] - Tab index for disabled items
 * @property {string} [role] - ARIA role
 * @property {string} [ariaDisabled] - ARIA disabled attribute
 */

/**
 * Resolves the correct props to pass to a link component based on mode.
 * 
 * This function handles the differences between how different link types
 * expect to receive their destination:
 * - Native `<a>`: Uses `href` attribute
 * - RouterLink: Uses `to` prop (string or route object)
 * - Inertia Link: Uses `href` prop
 * 
 * It also handles:
 * - External links (adds target="_blank" and rel="noopener noreferrer")
 * - Disabled state (prevents navigation, adds accessibility attributes)
 * - Per-item link attribute overrides
 * 
 * @function resolveLinkProps
 * @param {MenuItem} item - The menu item
 * @param {string} mode - Navigation mode ('a', 'router', 'inertia')
 * @param {Object} [options={}] - Additional options
 * @param {boolean} [options.disabled] - Force disabled state
 * @param {Object} [options.additionalAttrs] - Extra attributes to merge
 * @returns {ResolvedLinkProps} Props object to spread onto the link component
 * 
 * @example
 * // For an anchor link
 * const item = { id: '1', label: 'Home', href: '/' }
 * resolveLinkProps(item, 'a')
 * // Returns: { href: '/' }
 * 
 * @example
 * // For Vue Router with route object
 * const item = { id: '1', label: 'Users', to: { name: 'users', params: { id: 1 } }}
 * resolveLinkProps(item, 'router')
 * // Returns: { to: { name: 'users', params: { id: 1 } } }
 * 
 * @example
 * // For external link
 * const item = { id: '1', label: 'Docs', href: 'https://docs.example.com', external: true }
 * resolveLinkProps(item, 'a')
 * // Returns: { href: 'https://docs.example.com', target: '_blank', rel: 'noopener noreferrer' }
 * 
 * @example
 * // For disabled item
 * const item = { id: '1', label: 'Coming Soon', href: '/soon', disabled: true }
 * resolveLinkProps(item, 'a')
 * // Returns: { role: 'link', tabindex: '-1', 'aria-disabled': 'true' }
 */
export function resolveLinkProps(item, mode, options = {}) {
  const props = {}
  const isDisabled = options.disabled ?? item.disabled

  // =========================================================================
  // DISABLED STATE
  // =========================================================================

  if (isDisabled) {
    // Disabled links should not be navigable
    // Use role="link" with aria-disabled for accessibility
    props.role = 'link'
    props.tabindex = '-1'
    props['aria-disabled'] = 'true'
    return { ...props, ...(item.linkAttrs || {}), ...(options.additionalAttrs || {}) }
  }

  // =========================================================================
  // EXTERNAL LINKS
  // =========================================================================

  if (item.external) {
    props.href = item.href
    props.target = '_blank'
    props.rel = 'noopener noreferrer'
    return { ...props, ...(item.linkAttrs || {}), ...(options.additionalAttrs || {}) }
  }

  // =========================================================================
  // MODE-SPECIFIC PROPS
  // =========================================================================

  // Determine effective mode (per-item override or global)
  const effectiveMode = item.linkMode || mode

  switch (effectiveMode) {
    case 'router':
      // Vue Router uses the 'to' prop
      // If item has 'to', use it; otherwise convert href to 'to'
      props.to = item.to || item.href
      break

    case 'inertia':
      // Inertia uses 'href' prop
      props.href = item.href || item.to
      break

    case 'a':
    default:
      // Native anchor uses 'href' attribute
      props.href = item.href || item.to
      break
  }

  // =========================================================================
  // MERGE ADDITIONAL ATTRIBUTES
  // =========================================================================

  return {
    ...props,
    ...(item.linkAttrs || {}),
    ...(options.additionalAttrs || {})
  }
}

// =============================================================================
// NAVIGATION COMPOSABLE
// =============================================================================

/**
 * Creates a navigation composable with mode-specific utilities.
 * 
 * This composable provides reactive methods for:
 * - Getting the correct link component
 * - Resolving link props
 * - Checking navigation capabilities
 * 
 * @function useNavigation
 * @param {string} [defaultMode='a'] - Default navigation mode
 * @returns {Object} Navigation utilities
 * @returns {Function} returns.getLinkComponent - Get link component for mode
 * @returns {Function} returns.resolveLinkProps - Resolve props for link
 * @returns {Function} returns.hasVueRouter - Check if Vue Router available
 * @returns {Function} returns.hasInertia - Check if Inertia available
 * @returns {string} returns.mode - Current navigation mode
 * 
 * @example
 * // In component setup
 * import { useNavigation } from 'vue-sidebar-kit'
 * 
 * const nav = useNavigation('inertia')
 * 
 * // Get link component for current mode
 * const LinkComponent = nav.getLinkComponent()
 * 
 * // Resolve props for an item
 * const linkProps = nav.resolveLinkProps(menuItem)
 */
export function useNavigation(defaultMode = 'a') {
  return {
    /**
     * Get the link component for a specific mode.
     * @param {string} [mode] - Mode override (uses defaultMode if not set)
     * @param {string} [customComponentName] - Custom component to resolve
     * @returns {string|Object} Link component
     */
    getLinkComponent(mode = defaultMode, customComponentName = null) {
      return getLinkComponent(mode, customComponentName)
    },

    /**
     * Resolve link props for an item.
     * @param {MenuItem} item - Menu item
     * @param {string} [mode] - Mode override
     * @param {Object} [options] - Additional options
     * @returns {Object} Resolved props
     */
    resolveLinkProps(item, mode = defaultMode, options = {}) {
      return resolveLinkProps(item, mode, options)
    },

    /**
     * Check Vue Router availability.
     * @returns {boolean} True if available
     */
    hasVueRouter,

    /**
     * Check Inertia availability.
     * @returns {boolean} True if available
     */
    hasInertia,

    /**
     * Current navigation mode.
     * @type {string}
     */
    mode: defaultMode
  }
}
