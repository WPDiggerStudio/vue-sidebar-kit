import type { Component, VNode, Ref } from 'vue';
type RouteLocationRaw = string | {
    name?: string;
    path?: string;
    params?: Record<string, any>;
    query?: Record<string, any>;
};
type RouteLocationNormalized = {
    path: string;
    name?: string | symbol;
    params: Record<string, any>;
    query: Record<string, any>;
};
export type NavigationMode = 'inertia' | 'router' | 'a';
export interface ActiveMatchContext {
    item: MenuItem;
    currentPath: string;
    currentRoute?: RouteLocationNormalized;
    pageUrl?: string;
}
export type ActiveMatchStrategy = 'exact' | 'startsWith' | {
    pattern: string;
} | ((ctx: ActiveMatchContext) => boolean);
export interface IconConfig {
    /** Icon class name (e.g., 'heroicons-home', 'mdi-home') */
    class?: string;
    /** Vue component to render as icon */
    component?: Component;
    /** Inline SVG string */
    svg?: string;
    /** SVG path data (d attribute) */
    path?: string;
    /** Custom render function */
    render?: (h: any) => VNode;
    /** Additional attributes */
    attrs?: Record<string, any>;
}
export type MenuItemIcon = string | Component | IconConfig;
export interface BadgeConfig {
    text: string | number;
    class?: string;
    attrs?: Record<string, any>;
}
export type MenuItemBadge = string | number | BadgeConfig;
export interface SidebarClasses {
    /** Root sidebar container */
    root?: string;
    /** Expanded state modifier */
    rootExpanded?: string;
    /** Collapsed state modifier */
    rootCollapsed?: string;
    /** Menu wrapper */
    wrapper?: string;
    /** <nav> element */
    nav?: string;
    /** <ul> menu list */
    menu?: string;
    /** <li> menu item */
    item?: string;
    /** Link/anchor element */
    link?: string;
    /** Active link state */
    linkActive?: string;
    /** Hover state */
    linkHover?: string;
    /** Focus state */
    linkFocus?: string;
    /** Disabled state */
    linkDisabled?: string;
    /** Open group state */
    linkOpen?: string;
    /** Parent of active child */
    linkGroupActive?: string;
    /** Icon wrapper */
    icon?: string;
    /** Label text */
    label?: string;
    /** Badge element */
    badge?: string;
    /** Dropdown arrow */
    dropdown?: string;
    /** Dropdown open state */
    dropdownOpen?: string;
    /** Group container (collapsible) */
    group?: string;
    /** Group content (children wrapper) */
    groupContent?: string;
    /** Header slot container */
    header?: string;
    /** Footer slot container */
    footer?: string;
    /** Mobile overlay backdrop */
    overlay?: string;
    /** Mobile drawer container */
    drawer?: string;
    /** Tooltip in collapsed mode */
    tooltip?: string;
    /** Toggle button */
    toggle?: string;
    /** Level-based indentation (use --level CSS var) */
    indent?: string;
}
export interface MenuItem {
    /** Unique identifier (required) */
    id: string;
    /** Display label (required) */
    label: string;
    /** Icon configuration */
    icon?: MenuItemIcon;
    /** Nested children */
    children?: MenuItem[];
    /** Disabled state */
    disabled?: boolean;
    /** Badge content */
    badge?: MenuItemBadge;
    /** Visibility control */
    visible?: boolean | ((ctx: {
        item: MenuItem;
    }) => boolean);
    /** URL for <a> mode and Inertia */
    href?: string;
    /** Route for Vue Router */
    to?: string | RouteLocationRaw;
    /** Override navigation mode per-item */
    linkMode?: NavigationMode;
    /** Additional link attributes */
    linkAttrs?: Record<string, any>;
    /** Open in external tab */
    external?: boolean;
    /** Active state matching strategy */
    activeMatch?: ActiveMatchStrategy;
    /** Additional class for this item's <li> */
    class?: string;
    /** Deep class overrides for this item */
    classes?: Partial<SidebarClasses>;
    /** Additional attributes */
    attrs?: Record<string, any>;
}
export interface HeaderItem {
    /** Section header text */
    header: string;
    /** Visibility */
    visible?: boolean | (() => boolean);
    /** Hide when collapsed */
    hiddenOnCollapse?: boolean;
    /** Additional class */
    class?: string;
    id?: string;
}
export interface ComponentItem {
    /** Vue component to render */
    component: Component;
    /** Props to pass */
    props?: Record<string, any>;
    /** Visibility */
    visible?: boolean | (() => boolean);
    /** Hide when collapsed */
    hiddenOnCollapse?: boolean;
    id?: string;
}
export type SidebarItemType = MenuItem | HeaderItem | ComponentItem;
export interface SidebarMenuProps {
    /** Menu items array */
    items: SidebarItemType[];
    /** Navigation mode */
    mode?: NavigationMode;
    /** Collapsed state (v-model:collapsed) */
    collapsed?: boolean;
    /** Mobile drawer open state (v-model:mobileOpen) */
    mobileOpen?: boolean;
    /** localStorage key for persistence */
    storageKey?: string;
    /** Expanded width */
    width?: string;
    /** Collapsed width */
    collapsedWidth?: string;
    /** Accordion behavior (one child open at a time) */
    showOneChild?: boolean | 'deep';
    /** Keep all children open */
    showChild?: boolean;
    /** Right-to-left */
    rtl?: boolean;
    /** Relative to parent instead of viewport */
    relative?: boolean;
    /** Hide the toggle button */
    hideToggle?: boolean;
    /** Disable hover expansion in collapsed mode */
    disableHover?: boolean;
    /** Custom link component name */
    linkComponentName?: string;
    /** Class overrides object */
    classes?: SidebarClasses;
    /** Mobile breakpoint (px) */
    mobileBreakpoint?: number;
    /** Expand on hover when collapsed */
    expandOnHover?: boolean;
}
export interface SidebarMenuEmits {
    (e: 'update:collapsed', value: boolean): void;
    (e: 'update:mobileOpen', value: boolean): void;
    (e: 'item-click', payload: {
        event: Event;
        item: MenuItem;
    }): void;
}
export interface SidebarContext {
    collapsed: Ref<boolean>;
    mobileOpen: Ref<boolean>;
    expandedGroups: Ref<Set<string>>;
    currentPath: Ref<string>;
    mode: Ref<NavigationMode>;
    classes: Ref<SidebarClasses>;
    width: Ref<string>;
    collapsedWidth: Ref<string>;
    toggle: () => void;
    collapse: () => void;
    expand: () => void;
    toggleMobile: () => void;
    openMobile: () => void;
    closeMobile: () => void;
    toggleGroup: (id: string) => void;
    isGroupExpanded: (id: string) => boolean;
    isItemActive: (item: MenuItem) => boolean;
    isParentActive: (item: MenuItem) => boolean;
}
export interface MobileItemRect {
    top: number;
    height: number;
    padding: [number, number];
    maxHeight: number;
    maxWidth: number;
    dropup: number;
}
export interface MobileItem {
    item: MenuItem | null;
    rect: MobileItemRect;
    timeout: ReturnType<typeof setTimeout> | null;
}
export {};
