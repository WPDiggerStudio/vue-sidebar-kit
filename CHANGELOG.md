# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-01

### Added

- **Multi-mode Navigation**: Support for Inertia.js, Vue Router 4, and plain anchor links
- **SidebarMenu Component**: Main sidebar component with full feature set
- **SidebarMenuItem Component**: Recursive menu item with unlimited nesting
- **SidebarMenuLink Component**: Smart link adapter for all navigation modes
- **SidebarMenuIcon Component**: Flexible icon rendering (class, component, SVG)
- **SidebarMenuBadge Component**: Badge display with customizable styling
- **SidebarMobileDrawer Component**: Responsive mobile drawer with overlay
- **SidebarTooltip Component**: Collapsed mode tooltips
- **SidebarProvider Component**: Provider pattern for state sharing
- **SidebarTrigger Component**: Toggle button component

### Composables

- `useSidebar()`: Core state management with provider pattern
- `useActiveState()`: Smart active state detection with multiple strategies
- `useNavigation()`: Link adapter with optional dependency detection
- `useMenuItem()`: Menu item state and behavior management

### Features

- **Class Cascade System**: Three-tier class override (defaults → global → item)
- **State Persistence**: localStorage support for collapsed state and expanded groups
- **Active Detection Strategies**: exact, startsWith, regex pattern, custom function
- **Responsive Design**: Desktop sidebar + mobile drawer out of the box
- **Full Accessibility**: ARIA attributes, keyboard navigation, focus management
- **SSR-Safe**: Guards for browser-only APIs
- **Tree-shakeable**: Import only what you need

### Documentation

- Comprehensive README with examples
- Full JSDoc documentation in source files
- TypeScript type definitions
