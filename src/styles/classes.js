/**
 * @fileoverview CSS Class Management Utilities
 * 
 * This module provides the class cascade system for Vue Sidebar Kit.
 * It implements a three-tier override system:
 * 
 * 1. **Default Classes**: Built-in Tailwind utility classes
 * 2. **Global Classes**: User overrides via `classes` prop on SidebarMenu
 * 3. **Item Classes**: Per-item overrides via `item.classes` object
 * 
 * The cascade follows CSS specificity principles - more specific overrides
 * win. Classes at each tier can either extend or replace the previous tier.
 * 
 * @module styles/classes
 * @author Hassan Ali
 * @license MIT
 * 
 * @example
 * // Using the class system
 * import { resolveClass, mergeClasses, getLinkClasses } from 'vue-sidebar-kit'
 * 
 * // Resolve a single class key
 * const linkClass = resolveClass('link', globalClasses, itemClasses)
 * 
 * // Get all link classes based on state
 * const classes = getLinkClasses({ isActive: true, isDisabled: false })
 */

// =============================================================================
// DEFAULT CSS CLASSES
// =============================================================================

/**
 * Default CSS classes for all sidebar elements.
 * 
 * These are Tailwind utility classes that provide a professional,
 * accessible, and responsive design out of the box. They can be
 * completely overridden using the global `classes` prop.
 * 
 * **Design Principles:**
 * - Dark theme by default (works well with most dashboards)
 * - Smooth transitions for state changes
 * - Clear visual hierarchy
 * - Accessible color contrast
 * - Flexible spacing that works at various sizes
 * 
 * @constant {Object} defaultClasses
 * @property {string} root - Main sidebar container
 * @property {string} rootExpanded - Modifier when expanded
 * @property {string} rootCollapsed - Modifier when collapsed
 * @property {string} wrapper - Inner scroll wrapper
 * @property {string} nav - Navigation landmark element
 * @property {string} menu - Unordered list element
 * @property {string} item - List item element
 * @property {string} link - Link/anchor element
 * @property {string} linkActive - Active link state
 * @property {string} linkHover - Hover state
 * @property {string} linkFocus - Focus state (keyboard navigation)
 * @property {string} linkDisabled - Disabled state
 * @property {string} linkOpen - Parent with open submenu
 * @property {string} linkGroupActive - Parent of active child
 * @property {string} icon - Icon wrapper
 * @property {string} label - Label text
 * @property {string} badge - Badge element
 * @property {string} dropdown - Dropdown arrow
 * @property {string} dropdownOpen - Dropdown arrow when open
 * @property {string} group - Collapsible group container
 * @property {string} groupContent - Group children wrapper
 * @property {string} header - Header slot container
 * @property {string} footer - Footer slot container
 * @property {string} overlay - Mobile overlay backdrop
 * @property {string} drawer - Mobile drawer panel
 * @property {string} tooltip - Collapsed mode tooltip
 * @property {string} toggle - Toggle button
 * @property {string} indent - Level-based indentation
 * 
 * @example
 * // Using defaults directly
 * import { defaultClasses } from 'vue-sidebar-kit'
 * console.log(defaultClasses.link) // 'flex items-center gap-3 ...'
 * 
 * @example
 * // Extending defaults
 * const customClasses = {
 *   link: defaultClasses.link + ' my-custom-class'
 * }
 */
export const defaultClasses = {
  // ===========================================================================
  // CONTAINER ELEMENTS
  // ===========================================================================

  /**
   * Root sidebar container.
   * Sets up flex layout, background, text color, and width transitions.
   */
  root: 'flex flex-col h-full bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out',

  /**
   * Modifier class applied when sidebar is expanded.
   * Sets the full expanded width.
   */
  rootExpanded: 'w-64',

  /**
   * Modifier class applied when sidebar is collapsed (rail mode).
   * Sets the narrow collapsed width.
   */
  rootCollapsed: 'w-16',

  /**
   * Inner wrapper that handles scrolling.
   * Uses flex-1 to fill remaining space and enables vertical overflow.
   */
  wrapper: 'flex-1 overflow-y-auto overflow-x-hidden',

  /**
   * The <nav> landmark element.
   * Ensures full height for proper layout.
   */
  nav: 'h-full',

  /**
   * The <ul> menu list.
   * Removes default list styling and adds vertical spacing.
   */
  menu: 'list-none p-0 m-0 space-y-1',

  // ===========================================================================
  // MENU ITEMS
  // ===========================================================================

  /**
   * The <li> list item wrapper.
   * Provides consistent containment for menu items.
   */
  item: 'relative',

  /**
   * Link/anchor element (base state).
   * Sets up flex layout, padding, colors, and transitions.
   */
  link: 'flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg mx-2 transition-colors duration-200',

  /**
   * Active link state (current page).
   * Uses primary color to indicate the current location.
   */
  linkActive: 'bg-blue-600 text-white',

  /**
   * Hover state for links.
   * Provides visual feedback on mouse hover.
   */
  linkHover: 'hover:bg-gray-800 hover:text-white',

  /**
   * Focus state for keyboard navigation.
   * Shows visible focus ring for accessibility.
   */
  linkFocus: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',

  /**
   * Disabled link state.
   * Reduces opacity and changes cursor to indicate non-interactive.
   */
  linkDisabled: 'opacity-50 cursor-not-allowed',

  /**
   * Open group state (submenu expanded).
   * Provides subtle background to indicate expanded state.
   */
  linkOpen: 'bg-gray-800',

  /**
   * Parent of active child.
   * Uses a different color treatment to show the path to active item.
   */
  linkGroupActive: 'text-blue-400',

  // ===========================================================================
  // LINK CONTENT ELEMENTS
  // ===========================================================================

  /**
   * Icon wrapper element.
   * Sets consistent icon sizing.
   */
  icon: 'w-5 h-5 flex-shrink-0',

  /**
   * Label text element.
   * Enables text truncation for long labels.
   */
  label: 'flex-1 truncate',

  /**
   * Badge element.
   * Pill-shaped badge with primary color.
   */
  badge: 'ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white',

  /**
   * Dropdown arrow element.
   * Rotates when submenu is expanded.
   */
  dropdown: 'ml-auto w-4 h-4 transition-transform duration-200',

  /**
   * Dropdown arrow when submenu is open.
   * Rotates 180 degrees to point upward.
   */
  dropdownOpen: 'rotate-180',

  // ===========================================================================
  // GROUP/SUBMENU ELEMENTS
  // ===========================================================================

  /**
   * Collapsible group container.
   * Wraps the expandable submenu area.
   */
  group: 'overflow-hidden',

  /**
   * Group children wrapper.
   * Provides indentation for nested items.
   */
  groupContent: 'pl-4',

  // ===========================================================================
  // SLOT CONTAINERS
  // ===========================================================================

  /**
   * Header slot container (top of sidebar).
   * Can hold logo, brand, or user info.
   */
  header: '',

  /**
   * Footer slot container (bottom of sidebar).
   * Can hold version info, logout button, etc.
   */
  footer: 'mt-auto',

  // ===========================================================================
  // MOBILE ELEMENTS
  // ===========================================================================

  /**
   * Mobile overlay backdrop.
   * Semi-transparent overlay behind the drawer.
   */
  overlay: 'fixed inset-0 bg-black bg-opacity-50 z-40',

  /**
   * Mobile drawer panel.
   * Slides in from the left with shadow.
   */
  drawer: 'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl',

  // ===========================================================================
  // UTILITY ELEMENTS
  // ===========================================================================

  /**
   * Tooltip for collapsed mode.
   * Shows label when hovering over icons.
   */
  tooltip: 'absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap z-50',

  /**
   * Toggle button for collapse/expand.
   * Positioned at bottom of sidebar.
   */
  toggle: 'flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors',

  /**
   * Level-based indentation.
   * Uses CSS variable for dynamic indentation depth.
   */
  indent: 'pl-[calc(var(--level,0)*1rem)]'
}

// =============================================================================
// CSS CUSTOM PROPERTIES (VARIABLES)
// =============================================================================

/**
 * Default CSS custom property values.
 * 
 * These values are set on the root element and can be overridden
 * in your CSS to change sizing without modifying classes.
 * 
 * @constant {Object} defaultCssVars
 * @property {string} '--sidebar-width' - Expanded sidebar width
 * @property {string} '--sidebar-collapsed-width' - Collapsed sidebar width
 * @property {string} '--sidebar-transition-duration' - Animation duration
 * @property {string} '--sidebar-indent-size' - Indentation per level
 * @property {string} '--sidebar-item-padding-x' - Horizontal padding
 * @property {string} '--sidebar-item-padding-y' - Vertical padding
 * @property {string} '--sidebar-icon-size' - Icon dimensions
 * 
 * @example
 * // Override in your CSS
 * :root {
 *   --sidebar-width: 280px;
 *   --sidebar-transition-duration: 200ms;
 * }
 */
export const defaultCssVars = {
  '--sidebar-width': '256px',
  '--sidebar-collapsed-width': '64px',
  '--sidebar-transition-duration': '300ms',
  '--sidebar-indent-size': '16px',
  '--sidebar-item-padding-x': '16px',
  '--sidebar-item-padding-y': '10px',
  '--sidebar-icon-size': '20px'
}

// =============================================================================
// CLASS RESOLUTION UTILITIES
// =============================================================================

/**
 * Resolves a class key through the cascade system.
 * 
 * The cascade order (from lowest to highest priority):
 * 1. Default classes (built-in)
 * 2. Global classes (from SidebarMenu `classes` prop)
 * 3. Item classes (from `item.classes` object)
 * 
 * Later values completely replace earlier values (no merging).
 * 
 * @function resolveClass
 * @param {string} key - The class key to resolve (e.g., 'link', 'linkActive')
 * @param {Object} [globalClasses={}] - Global class overrides
 * @param {Object} [itemClasses={}] - Per-item class overrides
 * @returns {string} The resolved class string
 * 
 * @example
 * // Defaults only
 * resolveClass('link')
 * // Returns: defaultClasses.link
 * 
 * @example
 * // Global override
 * resolveClass('link', { link: 'custom-link-class' })
 * // Returns: 'custom-link-class'
 * 
 * @example
 * // Item override takes priority
 * resolveClass('link', 
 *   { link: 'global-link' },
 *   { link: 'item-specific-link' }
 * )
 * // Returns: 'item-specific-link'
 */
export function resolveClass(key, globalClasses = {}, itemClasses = {}) {
  // Item classes have highest priority
  if (itemClasses && itemClasses[key] !== undefined) {
    return itemClasses[key] || ''
  }

  // Global classes override defaults
  if (globalClasses && globalClasses[key] !== undefined) {
    return globalClasses[key] || ''
  }

  // Fall back to defaults
  return defaultClasses[key] || ''
}

/**
 * Merges multiple class strings into one.
 * 
 * Filters out empty strings and falsy values, then joins with spaces.
 * This is useful for combining base classes with conditional modifiers.
 * 
 * @function mergeClasses
 * @param {...(string|boolean|undefined)} classes - Class strings to merge
 * @returns {string} Merged class string
 * 
 * @example
 * mergeClasses('base-class', 'modifier')
 * // Returns: 'base-class modifier'
 * 
 * @example
 * // With conditionals
 * mergeClasses(
 *   'link',
 *   isActive && 'link-active',
 *   isDisabled && 'link-disabled'
 * )
 * // Returns: 'link link-active' (if isActive is true)
 * 
 * @example
 * // Empty values filtered out
 * mergeClasses('a', '', undefined, 'b', false, 'c')
 * // Returns: 'a b c'
 * 
 * @example
 * // Deduplication
 * mergeClasses('class-a class-b', 'class-a class-c')
 * // Returns: 'class-a class-b class-c' (no duplicates)
 */
export function mergeClasses(...classes) {
  // Filter out falsy values, split each string into individual classes,
  // flatten into a single array, and remove duplicates using Set
  const allClasses = classes
    .filter(Boolean)
    .flatMap(cls => String(cls).split(/\s+/))
    .filter(Boolean)
  
  // Remove duplicates while preserving order
  return [...new Set(allClasses)].join(' ')
}

// =============================================================================
// LINK CLASS GENERATION
// =============================================================================

/**
 * @typedef {Object} LinkClassOptions
 * @property {Object} [globalClasses={}] - Global class overrides
 * @property {Object} [itemClasses={}] - Per-item class overrides
 * @property {boolean} [isActive=false] - Whether the link is active
 * @property {boolean} [isGroupActive=false] - Whether a child is active
 * @property {boolean} [isOpen=false] - Whether the submenu is open
 * @property {boolean} [isDisabled=false] - Whether the link is disabled
 * @property {boolean} [isHovered=false] - Whether the link is hovered
 * @property {boolean} [isFocused=false] - Whether the link is focused
 * @property {number} [level=0] - Nesting level for indentation
 */

/**
 * Generates the complete class string for a link element.
 * 
 * This function combines the base link class with state-specific
 * modifiers. It handles the complex logic of which states override
 * others (e.g., disabled overrides active).
 * 
 * State priority (highest to lowest):
 * 1. Disabled - Always shows as disabled
 * 2. Active - Currently on this page
 * 3. Group Active - Child is active (for parent items)
 * 4. Open - Submenu is expanded
 * 5. Hover/Focus - Interactive states
 * 
 * @function getLinkClasses
 * @param {LinkClassOptions} options - Configuration options
 * @returns {string} Complete class string for the link
 * 
 * @example
 * // Basic active link
 * getLinkClasses({ isActive: true })
 * // Returns: 'flex items-center gap-3 ... bg-blue-600 text-white'
 * 
 * @example
 * // Disabled link (overrides active)
 * getLinkClasses({ isActive: true, isDisabled: true })
 * // Returns: 'flex items-center ... opacity-50 cursor-not-allowed'
 * 
 * @example
 * // Parent with active child
 * getLinkClasses({ isGroupActive: true, isOpen: true })
 * // Returns: 'flex items-center ... text-blue-400 bg-gray-800'
 * 
 * @example
 * // With custom classes
 * getLinkClasses({
 *   globalClasses: { link: 'my-link', linkActive: 'my-active' },
 *   isActive: true
 * })
 * // Returns: 'my-link my-active'
 */
export function getLinkClasses(options = {}) {
  const {
    globalClasses = {},
    itemClasses = {},
    isActive = false,
    isGroupActive = false,
    isOpen = false,
    isDisabled = false,
    isHovered = false,
    isFocused = false,
    level = 0
  } = options

  // Start with base link class
  const classes = [
    resolveClass('link', globalClasses, itemClasses)
  ]

  // Always add hover class (CSS will handle the :hover pseudo)
  classes.push(resolveClass('linkHover', globalClasses, itemClasses))

  // Always add focus class (CSS will handle the :focus pseudo)
  classes.push(resolveClass('linkFocus', globalClasses, itemClasses))

  // State-specific classes (order matters for specificity)
  if (isDisabled) {
    // Disabled state - highest priority
    classes.push(resolveClass('linkDisabled', globalClasses, itemClasses))
  } else if (isActive) {
    // Active state - current page
    classes.push(resolveClass('linkActive', globalClasses, itemClasses))
  } else if (isGroupActive) {
    // Parent of active child
    classes.push(resolveClass('linkGroupActive', globalClasses, itemClasses))
  }

  // Open state (can combine with other states)
  if (isOpen && !isActive) {
    classes.push(resolveClass('linkOpen', globalClasses, itemClasses))
  }

  // Add indentation for nested items
  if (level > 0) {
    classes.push(resolveClass('indent', globalClasses, itemClasses))
  }

  return mergeClasses(...classes)
}

// =============================================================================
// ADDITIONAL UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates CSS variable string for inline styles.
 * 
 * Useful for setting dynamic CSS variables on elements.
 * 
 * @function getCssVarStyle
 * @param {Object} vars - Object with CSS variable names and values
 * @returns {string} CSS variable declarations for inline style
 * 
 * @example
 * getCssVarStyle({ '--level': 2, '--custom': 'value' })
 * // Returns: '--level: 2; --custom: value;'
 */
export function getCssVarStyle(vars) {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')
}

/**
 * Creates an object suitable for :style binding with CSS variables.
 * 
 * @function getCssVarObject
 * @param {number} level - Nesting level
 * @returns {Object} Style object with CSS variable
 * 
 * @example
 * // In template: :style="getCssVarObject(2)"
 * getCssVarObject(2)
 * // Returns: { '--level': 2 }
 */
export function getCssVarObject(level) {
  return { '--level': level }
}
