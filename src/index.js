/**
 * @fileoverview Vue Sidebar Kit - Main Entry Point
 * 
 * Vue Sidebar Kit is a production-ready, highly customizable sidebar menu
 * component for Vue 3. It supports multiple navigation modes and provides
 * deep customization options.
 * 
 * ## Features
 * 
 * - **Multi-mode Navigation**: Inertia.js, Vue Router 4, or plain anchors
 * - **Tailwind-First**: Works with Tailwind CSS but doesn't require it
 * - **Responsive**: Desktop sidebar + mobile drawer with overlay
 * - **Accessible**: Full keyboard navigation and ARIA support
 * - **Unlimited Nesting**: Recursive menu structure with animations
 * - **State Persistence**: Optional localStorage for collapsed/expanded state
 * - **Active Detection**: Multiple matching strategies
 * - **Deep Customization**: Class overrides at every level
 * - **Flexible Icons**: Class names, Vue components, SVG strings
 * - **SSR-Safe**: Guards for window/localStorage access
 * - **Tree-shakeable**: Import only what you need
 * 
 * ## Quick Start
 * 
 * ```javascript
 * import { SidebarMenu } from 'vue-sidebar-kit'
 * import 'vue-sidebar-kit/style.css'
 * 
 * // In your template
 * <SidebarMenu
 *   :items="menuItems"
 *   mode="inertia"
 *   v-model:collapsed="collapsed"
 * />
 * ```
 * 
 * ## Navigation Modes
 * 
 * - `'a'`: Plain HTML anchors (default, no dependencies)
 * - `'router'`: Vue Router (requires vue-router)
 * - `'inertia'`: Inertia.js (requires @inertiajs/vue3)
 * 
 * @module vue-sidebar-kit
 * @author Hassan Ali
 * @license MIT
 * @version 1.0.0
 * 
 * @see {@link https://github.com/your-repo/vue-sidebar-kit} Repository
 * @see {@link ./README.md} Full Documentation
 */

// =============================================================================
// CSS IMPORTS
// =============================================================================

/**
 * Import the core CSS file.
 * This includes transitions, animations, and CSS custom properties.
 * End users should also import this: `import 'vue-sidebar-kit/style.css'`
 */
import './styles/sidebar.css'

// =============================================================================
// COMPONENT EXPORTS
// =============================================================================

/**
 * Main Components
 * 
 * These are the primary components used to build the sidebar UI:
 * 
 * - **SidebarMenu**: The main sidebar component
 * - **SidebarMenuItem**: Individual menu item (recursive)
 * - **SidebarMenuLink**: Smart link component
 * - **SidebarMenuIcon**: Flexible icon renderer
 * - **SidebarMenuBadge**: Badge display component
 * - **SidebarMobileDrawer**: Mobile drawer with overlay
 * - **SidebarTooltip**: Collapsed mode tooltips
 * - **SidebarProvider**: Provider pattern wrapper
 * - **SidebarTrigger**: Toggle button component
 * 
 * @example
 * // Import all components
 * import {
 *   SidebarMenu,
 *   SidebarProvider,
 *   SidebarTrigger
 * } from 'vue-sidebar-kit'
 */
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuLink,
  SidebarMenuIcon,
  SidebarMenuBadge,
  SidebarMobileDrawer,
  SidebarTooltip,
  SidebarProvider,
  SidebarTrigger
} from './components/index.js'

// =============================================================================
// COMPOSABLE EXPORTS
// =============================================================================

/**
 * Sidebar State Management Composable
 * 
 * The core composable for managing sidebar state. Used with the provider
 * pattern for sharing state across components.
 * 
 * Functions:
 * - `useSidebar()`: Get sidebar context (must be inside provider)
 * - `createSidebarContext()`: Create a new context
 * - `provideSidebar()`: Provide context to descendants
 * - `hasSidebarContext()`: Check if context is available
 * 
 * @example
 * // In a child component
 * import { useSidebar } from 'vue-sidebar-kit'
 * 
 * const sidebar = useSidebar()
 * sidebar.toggle() // Toggle collapsed state
 * sidebar.closeMobile() // Close mobile drawer
 */
export {
  useSidebar,
  createSidebarContext,
  provideSidebar,
  hasSidebarContext
} from './composables/useSidebar.js'

/**
 * Active State Detection Composable
 * 
 * Utilities for determining if menu items are active based on the current route.
 * 
 * Functions:
 * - `useActiveState()`: Get reactive active state utilities
 * - `isItemActive()`: Check if a single item is active
 * 
 * Matching Strategies:
 * - `'exact'`: Path must match exactly
 * - `'startsWith'`: Current path starts with item's path
 * - `{ pattern: 'regex' }`: Custom regex pattern
 * - `(ctx) => boolean`: Custom function
 * 
 * @example
 * import { isItemActive } from 'vue-sidebar-kit'
 * 
 * const active = isItemActive(
 *   { id: 'users', href: '/users', activeMatch: 'startsWith' },
 *   '/users/123'
 * ) // true
 */
export {
  useActiveState,
  isItemActive
} from './composables/useActiveState.js'

/**
 * Navigation Mode Composable
 * 
 * Implements the Link Adapter Pattern for supporting multiple routing libraries.
 * 
 * Functions:
 * - `useNavigation()`: Get navigation utilities
 * - `resolveLinkProps()`: Get props for a link based on mode
 * - `hasVueRouter()`: Check if Vue Router is available
 * - `hasInertia()`: Check if Inertia.js is available
 * 
 * @example
 * import { hasVueRouter, hasInertia } from 'vue-sidebar-kit'
 * 
 * // Auto-detect best mode
 * const mode = hasInertia() ? 'inertia' : hasVueRouter() ? 'router' : 'a'
 */
export {
  useNavigation,
  resolveLinkProps,
  hasVueRouter,
  hasInertia
} from './composables/useNavigation.js'

/**
 * Menu Item Composable
 * 
 * Manages state and behavior for individual menu items.
 * Used internally by SidebarMenuItem but can be used for custom implementations.
 * 
 * @example
 * import { useMenuItem } from 'vue-sidebar-kit'
 * 
 * const { isActive, isExpanded, handleClick, ariaAttrs } = useMenuItem(item, level)
 */
export {
  useMenuItem
} from './composables/useMenuItem.js'

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

/**
 * CSS Class Utilities
 * 
 * Functions and objects for working with the class cascade system.
 * 
 * Objects:
 * - `defaultClasses`: Built-in Tailwind classes for all elements
 * - `defaultCssVars`: CSS custom properties for sizing
 * 
 * Functions:
 * - `mergeClasses()`: Combine multiple class strings
 * - `resolveClass()`: Resolve a class through the cascade
 * - `getLinkClasses()`: Get complete link classes based on state
 * 
 * @example
 * import { defaultClasses, resolveClass, mergeClasses } from 'vue-sidebar-kit'
 * 
 * // Extend default classes
 * const customLink = defaultClasses.link + ' my-custom-class'
 * 
 * // Resolve through cascade
 * const linkClass = resolveClass('link', globalClasses, itemClasses)
 * 
 * // Merge conditionally
 * const classes = mergeClasses('base', isActive && 'active')
 */
export {
  defaultClasses,
  defaultCssVars,
  mergeClasses,
  resolveClass,
  getLinkClasses
} from './styles/classes.js'

// =============================================================================
// VUE PLUGIN
// =============================================================================

import { SidebarMenu } from './components/index.js'

/**
 * Vue Plugin for Global Registration
 * 
 * Registers the SidebarMenu component globally, making it available
 * in all templates without explicit imports.
 * 
 * @constant {Object} VueSidebarKit
 * @property {Function} install - Vue plugin install function
 * 
 * @example
 * // In your main.js or app entry point
 * import { createApp } from 'vue'
 * import VueSidebarKit from 'vue-sidebar-kit'
 * import 'vue-sidebar-kit/style.css'
 * 
 * const app = createApp(App)
 * app.use(VueSidebarKit)
 * app.mount('#app')
 * 
 * @example
 * // Then in any component template
 * <template>
 *   <SidebarMenu :items="items" />
 * </template>
 */
const VueSidebarKit = {
  /**
   * Vue plugin install function.
   * Called automatically when using app.use(VueSidebarKit)
   * 
   * @param {Object} app - Vue application instance
   * @returns {void}
   */
  install(app) {
    app.component('SidebarMenu', SidebarMenu)
  }
}

export default VueSidebarKit
