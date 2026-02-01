# Vue Sidebar Kit

<p align="center">
  <img src="https://img.shields.io/npm/v/vue-sidebar-kit?color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/l/vue-sidebar-kit" alt="license" />
  <img src="https://img.shields.io/npm/dm/vue-sidebar-kit" alt="downloads" />
  <img src="https://img.shields.io/github/actions/workflow/status/WPDiggerStudio/vue-sidebar-kit/ci.yml?branch=main" alt="CI status" />
</p>

<p align="center">
  <strong>A production-ready, deeply customizable sidebar menu component for Vue 3</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#navigation-modes">Navigation Modes</a> •
  <a href="#customization">Customization</a> •
  <a href="#api-reference">API</a>
</p>

---

## Overview

**Vue Sidebar Kit** is a professional-grade sidebar navigation component for Vue 3 applications. It provides seamless support for **Inertia.js**, **Vue Router 4**, and **plain anchor** navigation - all in one package.

### Why Vue Sidebar Kit?

| Problem                                       | Solution                                                             |
| --------------------------------------------- | -------------------------------------------------------------------- |
| "Most libraries only support Vue Router"      | **Multi-mode navigation** - Inertia, Vue Router, or plain `<a>` tags |
| "I can't customize without overriding CSS"    | **Class-based styling** - pass your own Tailwind/CSS classes         |
| "Libraries bundle vue-router as dependency"   | **Optional dependencies** - only loads what you use                  |
| "Active detection doesn't work for my routes" | **Multiple strategies** - exact, startsWith, regex, or custom        |
| "I need state access in other components"     | **Provider pattern** - share sidebar state anywhere                  |

---

## Features

- 🚀 **Multi-Mode Navigation** - Inertia.js, Vue Router 4, or plain anchors
- 🎨 **Tailwind-First Design** - Beautiful defaults, fully customizable
- 📱 **Responsive** - Desktop sidebar + mobile drawer with overlay
- ♿ **Accessible** - Full keyboard navigation and ARIA support
- 🔄 **Unlimited Nesting** - Recursive menu structure with animations
- 💾 **State Persistence** - Optional localStorage for user preferences
- 🎯 **Smart Active Detection** - Multiple matching strategies
- 🎭 **Flexible Icons** - Class names, Vue components, or raw SVG
- 🔒 **SSR-Safe** - Guards for browser-only APIs
- 🌳 **Tree-Shakeable** - Import only what you need
- 📦 **TypeScript Support** - Full type definitions included

---

## Installation

```bash
# npm
npm install vue-sidebar-kit

# yarn
yarn add vue-sidebar-kit

# pnpm
pnpm add vue-sidebar-kit
```

### Peer Dependencies

| Package           | Required    | Notes                       |
| ----------------- | ----------- | --------------------------- |
| `vue`             | ✅ ^3.3.0   | Required                    |
| `vue-router`      | ❌ Optional | Needed for `mode="router"`  |
| `@inertiajs/vue3` | ❌ Optional | Needed for `mode="inertia"` |

---

## Quick Start

### 1. Import the component and styles

```javascript
import { SidebarMenu } from "vue-sidebar-kit";
import "vue-sidebar-kit/style.css";
```

### 2. Define your menu items

```javascript
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "fa fa-home",
  },
  {
    id: "users",
    label: "Users",
    href: "/users",
    icon: "fa fa-users",
    children: [
      { id: "users-list", label: "All Users", href: "/users" },
      { id: "users-create", label: "New User", href: "/users/create" },
    ],
  },
];
```

### 3. Use in your template

```vue
<template>
  <div class="flex h-screen">
    <SidebarMenu :items="menuItems" mode="a" v-model:collapsed="collapsed" />
    <main class="flex-1 overflow-auto">
      <!-- Your content -->
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { SidebarMenu } from "vue-sidebar-kit";
import "vue-sidebar-kit/style.css";

const collapsed = ref(false);
const menuItems = [
  /* ... */
];
</script>
```

---

## Navigation Modes

Vue Sidebar Kit supports three navigation modes:

### Plain Anchors (Default)

```vue
<SidebarMenu :items="items" mode="a" />
```

Uses standard `<a href="">` tags. No dependencies required.

```javascript
const items = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
];
```

### Vue Router

```vue
<SidebarMenu :items="items" mode="router" />
```

Uses `<RouterLink :to="">`. Requires `vue-router` ^4.0.0.

```javascript
const items = [
  { id: "home", label: "Home", to: "/" },
  { id: "user", label: "User", to: { name: "user", params: { id: 1 } } },
];
```

### Inertia.js

```vue
<SidebarMenu :items="items" mode="inertia" />
```

Uses Inertia's `<Link :href="">`. Requires `@inertiajs/vue3` ^1.0.0.

```javascript
const items = [
  { id: "dashboard", label: "Dashboard", href: route("dashboard") },
  { id: "users", label: "Users", href: route("users.index") },
];
```

---

## Customization

### Class Override System

Vue Sidebar Kit uses a three-tier class cascade:

1. **Default Classes** - Built-in Tailwind utilities
2. **Global Classes** - Via `classes` prop on SidebarMenu
3. **Item Classes** - Via `item.classes` on individual items

Each tier completely replaces the previous (no merging).

```vue
<SidebarMenu
  :items="items"
  :classes="{
    root: 'bg-slate-900',
    link: 'flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-slate-800',
    linkActive: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    linkGroupActive: 'text-blue-400 font-medium',
    badge: 'px-2 py-0.5 text-xs rounded-full bg-pink-500 text-white',
  }"
/>
```

### Available Class Keys

| Key                              | Description                |
| -------------------------------- | -------------------------- |
| `root`                           | Main sidebar container     |
| `rootExpanded` / `rootCollapsed` | Collapsed state modifiers  |
| `link`                           | Base link styles           |
| `linkActive`                     | Active link (current page) |
| `linkHover`                      | Hover state                |
| `linkFocus`                      | Focus state (keyboard nav) |
| `linkDisabled`                   | Disabled state             |
| `linkOpen`                       | Open submenu state         |
| `linkGroupActive`                | Parent of active child     |
| `icon`, `label`, `badge`         | Link content elements      |
| `dropdown`, `dropdownOpen`       | Dropdown arrow             |
| `header`, `footer`               | Slot containers            |
| `overlay`, `drawer`              | Mobile elements            |
| `tooltip`, `toggle`              | Utility elements           |

### Per-Item Class Overrides

```javascript
const items = [
  {
    id: "special",
    label: "Special Item",
    href: "/special",
    classes: {
      link: "bg-gradient-to-r from-purple-500 to-pink-500",
      linkActive: "ring-2 ring-white",
    },
  },
];
```

### Slots

```vue
<SidebarMenu :items="items">
  <!-- Logo at the top -->
  <template #header>
    <div class="p-4">
      <img src="/logo.svg" alt="Logo" />
    </div>
  </template>

  <!-- User profile section -->
  <template #user>
    <UserAvatar :user="currentUser" />
  </template>

  <!-- Custom icon rendering -->
  <template #item-icon="{ item, icon }">
    <MyIconLibrary :name="icon" class="w-5 h-5" />
  </template>

  <!-- Footer content -->
  <template #footer>
    <div class="p-4 text-xs text-gray-500">v1.0.0</div>
  </template>
</SidebarMenu>
```

| Slot            | Props             | Description                 |
| --------------- | ----------------- | --------------------------- |
| `header`        | -                 | Top of sidebar (logo/brand) |
| `footer`        | -                 | Bottom of sidebar           |
| `user`          | -                 | User profile area           |
| `item-icon`     | `{ item, icon }`  | Custom icon rendering       |
| `item-badge`    | `{ item, badge }` | Custom badge rendering      |
| `dropdown-icon` | `{ isOpen }`      | Dropdown arrow              |
| `toggle-icon`   | `{ collapsed }`   | Toggle button content       |

---

## Icon Support

Vue Sidebar Kit supports multiple icon formats:

### 1. Class-Based Icons

```javascript
{
  icon: "fa fa-home";
} // Font Awesome
{
  icon: "mdi mdi-account";
} // Material Design Icons
{
  icon: "heroicons-home";
} // Heroicons CSS
```

### 2. Vue Components

```javascript
import { HomeIcon } from '@heroicons/vue/24/outline'

{ icon: HomeIcon }

// With props
{ icon: { component: HomeIcon, props: { class: 'w-6 h-6' } } }
```

### 3. Inline SVG String

```javascript
{
  icon: {
    svg: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6..."/></svg>';
  }
}
```

### 4. SVG Path Data

```javascript
{
  icon: {
    path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z";
  }
}
```

### 5. Custom Slot

```vue
<template #item-icon="{ item, icon }">
  <component :is="getIconComponent(icon)" class="w-5 h-5" />
</template>
```

---

## Active State Detection

Control how items determine their "active" state:

### Strategies

```javascript
// Exact match - only '/users' is active
{ href: '/users', activeMatch: 'exact' }

// StartsWith - '/users', '/users/1', '/users/create' all active
{ href: '/users', activeMatch: 'startsWith' }

// Regex pattern
{ href: '/users/1', activeMatch: { pattern: '^/users/\\d+$' } }

// Custom function
{ href: '/special', activeMatch: (ctx) => ctx.currentPath.includes('special') }
```

### Defaults

- Items **without children**: `'exact'`
- Items **with children**: `'startsWith'`

---

## Provider Pattern

For advanced use cases, access sidebar state from anywhere:

```vue
<template>
  <SidebarProvider v-model:collapsed="collapsed" mode="inertia">
    <!-- Hamburger in header -->
    <header>
      <SidebarTrigger class="p-2 lg:hidden">
        <MenuIcon />
      </SidebarTrigger>
    </header>

    <!-- Sidebar -->
    <SidebarMenu :items="items" />

    <!-- Content can access sidebar state too! -->
    <MainContent />
  </SidebarProvider>
</template>
```

### Using useSidebar() in Child Components

```vue
<script setup>
import { useSidebar } from "vue-sidebar-kit";

const sidebar = useSidebar();

// Read state
sidebar.collapsed.value; // boolean
sidebar.mobileOpen.value; // boolean

// Call methods
sidebar.toggle(); // Toggle collapsed
sidebar.collapse(); // Force collapse
sidebar.expand(); // Force expand
sidebar.closeMobile(); // Close mobile drawer
sidebar.toggleGroup("id"); // Toggle specific group
</script>
```

---

## API Reference

### SidebarMenu Props

| Prop             | Type                           | Default   | Description                      |
| ---------------- | ------------------------------ | --------- | -------------------------------- |
| `items`          | `MenuItem[]`                   | required  | Menu items array                 |
| `mode`           | `'a' \| 'router' \| 'inertia'` | `'a'`     | Navigation mode                  |
| `collapsed`      | `boolean`                      | `false`   | Collapsed state (v-model)        |
| `mobileOpen`     | `boolean`                      | `false`   | Mobile drawer state (v-model)    |
| `storageKey`     | `string`                       | -         | localStorage key for persistence |
| `width`          | `string`                       | `'256px'` | Expanded width                   |
| `collapsedWidth` | `string`                       | `'64px'`  | Collapsed width                  |
| `expandOnHover`  | `boolean`                      | `false`   | Expand on hover when collapsed   |
| `showOneChild`   | `boolean`                      | `false`   | Accordion behavior               |
| `classes`        | `object`                       | `{}`      | Class overrides                  |
| `rtl`            | `boolean`                      | `false`   | Right-to-left layout             |

### MenuItem Schema

```typescript
interface MenuItem {
  id: string; // Unique identifier (required)
  label: string; // Display text (required)
  href?: string; // URL for anchor/Inertia mode
  to?: string | object; // Route for Vue Router mode
  icon?: string | Component | IconConfig;
  badge?: string | number | BadgeConfig;
  children?: MenuItem[]; // Nested children
  disabled?: boolean; // Disable item
  external?: boolean; // Open in new tab
  visible?: boolean | Function;
  activeMatch?: "exact" | "startsWith" | { pattern: string } | Function;
  classes?: object; // Per-item class overrides
}
```

### Events

| Event               | Payload           | Description             |
| ------------------- | ----------------- | ----------------------- |
| `update:collapsed`  | `boolean`         | Collapsed state changed |
| `update:mobileOpen` | `boolean`         | Mobile drawer toggled   |
| `item-click`        | `{ event, item }` | Item clicked            |

---

## CSS Variables

Override sizing with CSS custom properties:

```css
:root {
  --sidebar-width: 256px;
  --sidebar-collapsed-width: 64px;
  --sidebar-transition-duration: 300ms;
  --sidebar-indent-size: 16px;
}
```

---

## SSR Support

Vue Sidebar Kit is SSR-safe:

- All `window`/`localStorage` access is guarded
- State persistence activates only in `onMounted`
- Mobile drawer uses client-only logic

For **Nuxt.js**, use normally. Wrap with `<ClientOnly>` if hydration issues occur.

---

## TypeScript

Full TypeScript definitions included:

```typescript
import type {
  MenuItem,
  SidebarMenuProps,
  SidebarClasses,
  IconConfig,
  BadgeConfig,
  NavigationMode,
  ActiveMatchStrategy,
} from "vue-sidebar-kit";
```

---

## Publishing

This section is for maintainers who want to publish the package.

### Prerequisites

1. **npm account** with publishing access
2. **NPM_TOKEN** secret configured in GitHub repository settings

### Manual Publishing

```bash
# 1. Ensure you're on main branch with clean working directory
git checkout main
git pull

# 2. Update version in package.json
npm version patch  # or minor, major

# 3. Build and test
npm run build
npm run test

# 4. Verify package contents
npm pack --dry-run

# 5. Publish
npm publish --access public

# 6. Push tags
git push --follow-tags
```

### Automated Publishing (GitHub Actions)

The repository includes automated release workflows:

1. **Create a version tag:**

   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Or create a GitHub Release:**
   - Go to Releases → Create new release
   - Choose/create tag (e.g., `v1.0.0`)
   - Add release notes
   - Click "Publish release"

3. The `release.yml` workflow will automatically:
   - Build the package
   - Run tests
   - Publish to npm

### Required Secrets

Add this secret to your GitHub repository (Settings → Secrets → Actions):

| Secret      | Description                                   |
| ----------- | --------------------------------------------- |
| `NPM_TOKEN` | npm automation token with publish permissions |

**To create an npm token:**

1. Go to [npmjs.com](https://www.npmjs.com) → Account Settings → Access Tokens
2. Generate new token → Automation
3. Copy and add as GitHub secret

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## License

[MIT](./LICENSE) © [WPDiggerStudio](https://github.com/WPDiggerStudio)

---

## Credits

Built with ❤️ by [WPDiggerStudio](https://github.com/WPDiggerStudio).

Inspired by [vue-sidebar-menu](https://github.com/yaminncco/vue-sidebar-menu) with significant enhancements for multi-mode navigation, accessibility, and deep customization.
