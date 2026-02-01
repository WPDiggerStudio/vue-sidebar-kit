import { openBlock as c, createBlock as E, resolveDynamicComponent as Y, mergeProps as B, withCtx as O, renderSlot as h, defineComponent as T, inject as Z, computed as l, createElementBlock as k, normalizeClass as y, createElementVNode as M, markRaw as te, h as Ve, createTextVNode as me, toDisplayString as x, Transition as _, createCommentVNode as I, ref as K, onMounted as be, onUnmounted as pe, watch as oe, reactive as qe, provide as N, resolveComponent as G, withDirectives as se, vShow as le, normalizeProps as Ue, Fragment as U, createVNode as J, renderList as re, Teleport as Je, normalizeStyle as he } from "vue";
const R = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Ye = T({
  name: "SidebarMenuLink",
  props: {
    /**
     * Menu item data
     */
    item: {
      type: Object,
      required: !0
    },
    /**
     * Navigation mode override
     */
    mode: {
      type: String,
      default: null
    },
    /**
     * Additional classes
     */
    linkClass: {
      type: String,
      default: ""
    },
    /**
     * Whether link is disabled
     */
    disabled: {
      type: Boolean,
      default: !1
    },
    /**
     * Prevent default navigation
     */
    preventDefault: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = Z("vsm-mode", () => "a"), s = Z("vsm-link-component", () => null);
    let a = null, r = null;
    try {
      a = require("vue-router").RouterLink;
    } catch {
      a = null;
    }
    try {
      r = require("@inertiajs/vue3").Link;
    } catch {
      r = null;
    }
    const d = l(() => e.item.linkMode ? e.item.linkMode : e.mode ? e.mode : typeof n == "function" ? n() : n), b = l(() => {
      const v = typeof s == "function" ? s() : s;
      if (v) return v;
      if (e.disabled) return "a";
      switch (d.value) {
        case "router":
          return a || (console.error(
            '[vue-sidebar-menu-advanced] mode="router" requires vue-router. Falling back to <a>.'
          ), "a");
        case "inertia":
          return r || (console.error(
            '[vue-sidebar-menu-advanced] mode="inertia" requires @inertiajs/vue3. Falling back to <a>.'
          ), "a");
        case "a":
        default:
          return "a";
      }
    }), f = l(() => {
      const v = e.item, $ = d.value, w = {};
      if (v.external)
        return w.href = v.href || "#", w.target = "_blank", w.rel = "noopener noreferrer", { ...w, ...v.linkAttrs || {} };
      switch ($) {
        case "router":
          w.to = v.to || v.href || "#";
          break;
        case "inertia":
          w.href = v.href || "#";
          break;
        case "a":
        default:
          w.href = v.href || "#";
          break;
      }
      return e.disabled && (w.tabindex = "-1", w["aria-disabled"] = "true"), { ...w, ...v.linkAttrs || {} };
    }), m = l(() => [
      "vsm-link",
      e.linkClass,
      {
        "vsm-link--disabled": e.disabled
      }
    ].filter(Boolean));
    function C(v) {
      if (e.disabled) {
        v.preventDefault(), v.stopPropagation();
        return;
      }
      e.preventDefault && v.preventDefault(), t("click", v);
    }
    return {
      linkComponent: b,
      linkProps: f,
      linkClasses: m,
      handleClick: C
    };
  }
});
function Qe(e, t, n, s, a, r) {
  return c(), E(Y(e.linkComponent), B(e.linkProps, {
    class: e.linkClasses,
    onClick: e.handleClick
  }), {
    default: O(() => [
      h(e.$slots, "default")
    ]),
    _: 3
  }, 16, ["class", "onClick"]);
}
const Xe = /* @__PURE__ */ R(Ye, [["render", Qe]]), Ze = T({
  name: "SidebarMenuIcon",
  props: {
    /**
     * Icon value - can be:
     * - String: icon class name (e.g., 'mdi-home', 'fa fa-home')
     * - Component: Vue component
     * - Object with `svg`: inline SVG string
     * - Object with `path`: SVG path data
     * - Object with `render`: render function
     * - Object with `component`: Vue component + props
     */
    icon: {
      type: [String, Object, Function],
      default: null
    },
    /**
     * Additional classes for the icon wrapper
     */
    iconClass: {
      type: String,
      default: ""
    },
    /**
     * Size class (applied to wrapper)
     */
    size: {
      type: String,
      default: "w-5 h-5"
    }
  },
  setup(e) {
    const t = l(() => typeof e.icon == "string"), n = l(() => {
      var o, p, S, L;
      return e.icon ? !!(typeof e.icon == "function" || (o = e.icon) != null && o.__name || (p = e.icon) != null && p.render || (S = e.icon) != null && S.setup || (L = e.icon) != null && L.component) : !1;
    }), s = l(() => {
      var o;
      return ((o = e.icon) == null ? void 0 : o.svg) && typeof e.icon.svg == "string";
    }), a = l(() => {
      var o;
      return ((o = e.icon) == null ? void 0 : o.path) && typeof e.icon.path == "string";
    }), r = l(() => {
      var o;
      return ((o = e.icon) == null ? void 0 : o.render) && typeof e.icon.render == "function";
    }), d = l(() => {
      var o, p, S, L;
      return typeof e.icon == "function" ? te(e.icon) : (o = e.icon) != null && o.__name || (p = e.icon) != null && p.render || (S = e.icon) != null && S.setup ? te(e.icon) : (L = e.icon) != null && L.component ? te(e.icon.component) : null;
    }), b = l(() => {
      var o, p;
      return (o = e.icon) != null && o.props ? e.icon.props : (p = e.icon) != null && p.attrs ? e.icon.attrs : {};
    }), f = l(() => {
      var o;
      return (o = e.icon) != null && o.svg ? e.icon.svg : "";
    }), m = l(() => {
      var o;
      return ((o = e.icon) == null ? void 0 : o.path) || "";
    }), C = l(() => {
      var o;
      return (o = e.icon) != null && o.render ? {
        render: () => e.icon.render(Ve)
      } : null;
    }), v = l(() => {
      var o;
      return [
        "vsm-icon-wrapper",
        "inline-flex items-center justify-center flex-shrink-0",
        e.size,
        e.iconClass,
        (o = e.icon) == null ? void 0 : o.class
      ].filter(Boolean);
    }), $ = l(() => {
      var o;
      return ((o = e.icon) == null ? void 0 : o.attrs) || {};
    }), w = l(() => ["w-full h-full"]);
    return {
      isStringIcon: t,
      isComponentIcon: n,
      isSvgString: s,
      isSvgPath: a,
      isRenderFunction: r,
      iconComponent: d,
      iconComponentProps: b,
      sanitizedSvg: f,
      svgPath: m,
      renderComponent: C,
      iconClasses: v,
      iconAttrs: $,
      svgClasses: w
    };
  }
}), xe = ["innerHTML"], _e = ["d"];
function en(e, t, n, s, a, r) {
  return c(), k("span", B({ class: e.iconClasses }, e.iconAttrs), [
    e.isStringIcon ? (c(), k("i", {
      key: 0,
      class: y(e.icon),
      "aria-hidden": "true"
    }, null, 2)) : e.isComponentIcon ? (c(), E(Y(e.iconComponent), B({ key: 1 }, e.iconComponentProps, { "aria-hidden": "true" }), null, 16)) : e.isSvgString ? (c(), k("span", {
      key: 2,
      innerHTML: e.sanitizedSvg,
      "aria-hidden": "true"
    }, null, 8, xe)) : e.isSvgPath ? (c(), k("svg", {
      key: 3,
      class: y(e.svgClasses),
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "2",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true"
    }, [
      M("path", { d: e.svgPath }, null, 8, _e)
    ], 2)) : e.isRenderFunction ? (c(), E(Y(e.renderComponent), {
      key: 4,
      "aria-hidden": "true"
    })) : h(e.$slots, "default", { key: 5 })
  ], 16);
}
const nn = /* @__PURE__ */ R(Ze, [["render", en]]), tn = T({
  name: "SidebarMenuBadge",
  props: {
    /**
     * Badge value - can be:
     * - String: direct text
     * - Number: will be converted to string
     * - Object: { text, class, attrs }
     */
    badge: {
      type: [String, Number, Object],
      default: null
    },
    /**
     * Additional classes
     */
    badgeClass: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const t = l(() => e.badge === null || e.badge === void 0 ? "" : typeof e.badge == "object" ? e.badge.text ?? "" : String(e.badge)), n = l(() => {
      const a = [
        "vsm-badge",
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        e.badgeClass
      ];
      return typeof e.badge == "object" && e.badge.class && a.push(e.badge.class), a.filter(Boolean);
    }), s = l(() => typeof e.badge == "object" && e.badge.attrs ? e.badge.attrs : {});
    return {
      badgeText: t,
      badgeClasses: n,
      badgeAttrs: s
    };
  }
});
function sn(e, t, n, s, a, r) {
  return c(), k("span", B({ class: e.badgeClasses }, e.badgeAttrs), [
    me(x(e.badgeText) + " ", 1),
    h(e.$slots, "default")
  ], 16);
}
const ln = /* @__PURE__ */ R(tn, [["render", sn]]);
let an = 0;
const on = T({
  name: "SidebarTooltip",
  props: {
    /**
     * Whether to show the tooltip
     */
    show: {
      type: Boolean,
      default: !1
    },
    /**
     * Tooltip text content
     */
    text: {
      type: String,
      default: ""
    },
    /**
     * Additional classes
     */
    tooltipClass: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const t = `vsm-tooltip-${++an}`, n = l(() => [
      "vsm-tooltip",
      "absolute left-full ml-2 px-2 py-1 text-sm rounded shadow-lg whitespace-nowrap z-50",
      "bg-gray-800 text-white",
      "pointer-events-none",
      e.tooltipClass
    ].filter(Boolean));
    return {
      tooltipId: t,
      tooltipClasses: n
    };
  }
}), rn = ["id"];
function dn(e, t, n, s, a, r) {
  return c(), E(_, { name: "vsm-tooltip" }, {
    default: O(() => [
      e.show ? (c(), k("div", {
        key: 0,
        class: y(e.tooltipClasses),
        role: "tooltip",
        id: e.tooltipId
      }, [
        h(e.$slots, "default", {}, () => [
          me(x(e.text), 1)
        ])
      ], 10, rn)) : I("", !0)
    ]),
    _: 3
  });
}
const un = /* @__PURE__ */ R(on, [["render", dn]]);
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
const ie = Symbol("vsm-sidebar");
function W() {
  return typeof window < "u";
}
function fe() {
  return W() ? window.location.pathname + window.location.search + window.location.hash : "/";
}
function ge(e, t) {
  const n = K(e.collapsed ?? !1), s = K(e.mobileOpen ?? !1), a = K(new Set(e.defaultExpandedGroups || [])), r = K(fe()), d = K(!1), b = l(() => d.value ? !1 : n.value), f = l(() => b.value ? e.collapsedWidth : e.width);
  function m() {
    if (!(!W() || !e.storageKey))
      try {
        const i = localStorage.getItem(e.storageKey);
        if (i) {
          const D = JSON.parse(i);
          typeof D.collapsed == "boolean" && (n.value = D.collapsed), Array.isArray(D.expandedGroups) && (a.value = new Set(D.expandedGroups));
        }
      } catch (i) {
        console.warn("[vue-sidebar-kit] Failed to load persisted state:", i);
      }
  }
  function C() {
    if (!(!W() || !e.storageKey))
      try {
        localStorage.setItem(e.storageKey, JSON.stringify({
          collapsed: n.value,
          expandedGroups: Array.from(a.value)
        }));
      } catch (i) {
        console.warn("[vue-sidebar-kit] Failed to save state:", i);
      }
  }
  function v() {
    n.value = !n.value, t("update:collapsed", n.value), C();
  }
  function $() {
    n.value = !0, t("update:collapsed", !0), C();
  }
  function w() {
    n.value = !1, t("update:collapsed", !1), C();
  }
  function o() {
    s.value = !s.value, t("update:mobileOpen", s.value), H();
  }
  function p() {
    s.value = !0, t("update:mobileOpen", !0), H();
  }
  function S() {
    s.value = !1, t("update:mobileOpen", !1), H();
  }
  function L(i) {
    a.value.has(i) ? a.value.delete(i) : (e.showOneChild, a.value.add(i)), a.value = new Set(a.value), C();
  }
  function j(i) {
    return a.value.has(i);
  }
  function z(i) {
    e.expandOnHover && n.value && (d.value = i);
  }
  function H() {
    W() && (s.value ? document.body.classList.add("vsm-no-scroll") : document.body.classList.remove("vsm-no-scroll"));
  }
  function P() {
    r.value = fe();
  }
  function g() {
    P();
  }
  function F(i) {
    i.key === "Escape" && s.value && S();
  }
  return be(() => {
    m(), P(), W() && (window.addEventListener("popstate", g), window.addEventListener("hashchange", P), document.addEventListener("keydown", F));
  }), pe(() => {
    W() && (window.removeEventListener("popstate", g), window.removeEventListener("hashchange", P), document.removeEventListener("keydown", F), document.body.classList.remove("vsm-no-scroll"));
  }), oe(() => e.collapsed, (i) => {
    i !== n.value && (n.value = i);
  }), oe(() => e.mobileOpen, (i) => {
    i !== s.value && (s.value = i, H());
  }), qe({
    // State (refs)
    collapsed: n,
    mobileOpen: s,
    expandedGroups: a,
    currentPath: r,
    isCollapsed: b,
    hoverExpanded: d,
    effectiveWidth: f,
    // Props passthrough (as computed for reactivity)
    mode: l(() => e.mode || "a"),
    classes: l(() => e.classes || {}),
    width: l(() => e.width || "256px"),
    collapsedWidth: l(() => e.collapsedWidth || "64px"),
    rtl: l(() => e.rtl || !1),
    disableHover: l(() => e.disableHover || !1),
    showOneChild: l(() => e.showOneChild || !1),
    expandOnHover: l(() => e.expandOnHover || !1),
    linkComponentName: l(() => e.linkComponentName),
    // Methods
    toggle: v,
    collapse: $,
    expand: w,
    toggleMobile: o,
    openMobile: p,
    closeMobile: S,
    toggleGroup: L,
    isGroupExpanded: j,
    setHoverExpanded: z,
    updateCurrentPath: P
  });
}
function Ce(e) {
  N(ie, e);
}
function de() {
  const e = Z(ie);
  if (!e)
    throw new Error(
      "[vue-sidebar-kit] useSidebar() must be used inside a <SidebarMenu> or <SidebarProvider>. Make sure your component is wrapped in one of these components."
    );
  return e;
}
function Rn() {
  return Z(ie, null) !== null;
}
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
function ve(e) {
  return e ? e !== "/" && e.endsWith("/") ? e.slice(0, -1) : e : "/";
}
function cn(e) {
  if (e.href) {
    if (e.href.startsWith("http://") || e.href.startsWith("https://"))
      try {
        return new URL(e.href).pathname;
      } catch {
        return null;
      }
    return e.href;
  }
  return e.to ? typeof e.to == "string" ? e.to : e.to.path ? e.to.path : null : null;
}
function ue(e, t, n = {}) {
  if (e.disabled || e.external)
    return !1;
  const s = cn(e);
  if (!s)
    return !1;
  const a = ve(s), r = ve(t), d = e.activeMatch || (e.children && e.children.length > 0 ? "startsWith" : "exact");
  if (typeof d == "function") {
    const b = {
      item: e,
      currentPath: r,
      currentRoute: n.currentRoute,
      pageUrl: n.pageUrl
    };
    return d(b);
  }
  if (typeof d == "object" && d.pattern)
    try {
      return new RegExp(d.pattern).test(r);
    } catch (b) {
      return console.warn(
        `[vue-sidebar-kit] Invalid regex pattern "${d.pattern}" for item "${e.id}":`,
        b.message
      ), !1;
    }
  return d === "startsWith" ? a === "/" ? r === "/" : r.startsWith(a) : r === a;
}
function ce(e, t, n = {}) {
  return !e.children || e.children.length === 0 ? !1 : e.children.some((s) => ue(s, t, n) ? !0 : ce(s, t, n));
}
function Fn(e = null) {
  const { useSidebar: t } = require("./useSidebar.js"), n = e || t();
  function s(r) {
    return ue(r, n.currentPath.value);
  }
  function a(r) {
    return ce(r, n.currentPath.value);
  }
  return {
    isActive: s,
    isParentActive: a,
    currentPath: n.currentPath
  };
}
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
const Q = {
  // ===========================================================================
  // CONTAINER ELEMENTS
  // ===========================================================================
  /**
   * Root sidebar container.
   * Sets up flex layout, background, text color, and width transitions.
   */
  root: "flex flex-col h-full bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out",
  /**
   * Modifier class applied when sidebar is expanded.
   * Sets the full expanded width.
   */
  rootExpanded: "w-64",
  /**
   * Modifier class applied when sidebar is collapsed (rail mode).
   * Sets the narrow collapsed width.
   */
  rootCollapsed: "w-16",
  /**
   * Inner wrapper that handles scrolling.
   * Uses flex-1 to fill remaining space and enables vertical overflow.
   */
  wrapper: "flex-1 overflow-y-auto overflow-x-hidden",
  /**
   * The <nav> landmark element.
   * Ensures full height for proper layout.
   */
  nav: "h-full",
  /**
   * The <ul> menu list.
   * Removes default list styling and adds vertical spacing.
   */
  menu: "list-none p-0 m-0 space-y-1",
  // ===========================================================================
  // MENU ITEMS
  // ===========================================================================
  /**
   * The <li> list item wrapper.
   * Provides consistent containment for menu items.
   */
  item: "relative",
  /**
   * Link/anchor element (base state).
   * Sets up flex layout, padding, colors, and transitions.
   */
  link: "flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg mx-2 transition-colors duration-200",
  /**
   * Active link state (current page).
   * Uses primary color to indicate the current location.
   */
  linkActive: "bg-blue-600 text-white",
  /**
   * Hover state for links.
   * Provides visual feedback on mouse hover.
   */
  linkHover: "hover:bg-gray-800 hover:text-white",
  /**
   * Focus state for keyboard navigation.
   * Shows visible focus ring for accessibility.
   */
  linkFocus: "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
  /**
   * Disabled link state.
   * Reduces opacity and changes cursor to indicate non-interactive.
   */
  linkDisabled: "opacity-50 cursor-not-allowed",
  /**
   * Open group state (submenu expanded).
   * Provides subtle background to indicate expanded state.
   */
  linkOpen: "bg-gray-800",
  /**
   * Parent of active child.
   * Uses a different color treatment to show the path to active item.
   */
  linkGroupActive: "text-blue-400",
  // ===========================================================================
  // LINK CONTENT ELEMENTS
  // ===========================================================================
  /**
   * Icon wrapper element.
   * Sets consistent icon sizing.
   */
  icon: "w-5 h-5 flex-shrink-0",
  /**
   * Label text element.
   * Enables text truncation for long labels.
   */
  label: "flex-1 truncate",
  /**
   * Badge element.
   * Pill-shaped badge with primary color.
   */
  badge: "ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500 text-white",
  /**
   * Dropdown arrow element.
   * Rotates when submenu is expanded.
   */
  dropdown: "ml-auto w-4 h-4 transition-transform duration-200",
  /**
   * Dropdown arrow when submenu is open.
   * Rotates 180 degrees to point upward.
   */
  dropdownOpen: "rotate-180",
  // ===========================================================================
  // GROUP/SUBMENU ELEMENTS
  // ===========================================================================
  /**
   * Collapsible group container.
   * Wraps the expandable submenu area.
   */
  group: "overflow-hidden",
  /**
   * Group children wrapper.
   * Provides indentation for nested items.
   */
  groupContent: "pl-4",
  // ===========================================================================
  // SLOT CONTAINERS
  // ===========================================================================
  /**
   * Header slot container (top of sidebar).
   * Can hold logo, brand, or user info.
   */
  header: "",
  /**
   * Footer slot container (bottom of sidebar).
   * Can hold version info, logout button, etc.
   */
  footer: "mt-auto",
  // ===========================================================================
  // MOBILE ELEMENTS
  // ===========================================================================
  /**
   * Mobile overlay backdrop.
   * Semi-transparent overlay behind the drawer.
   */
  overlay: "fixed inset-0 bg-black bg-opacity-50 z-40",
  /**
   * Mobile drawer panel.
   * Slides in from the left with shadow.
   */
  drawer: "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl",
  // ===========================================================================
  // UTILITY ELEMENTS
  // ===========================================================================
  /**
   * Tooltip for collapsed mode.
   * Shows label when hovering over icons.
   */
  tooltip: "absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap z-50",
  /**
   * Toggle button for collapse/expand.
   * Positioned at bottom of sidebar.
   */
  toggle: "flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors",
  /**
   * Level-based indentation.
   * Uses CSS variable for dynamic indentation depth.
   */
  indent: "pl-[calc(var(--level,0)*1rem)]"
}, Gn = {
  "--sidebar-width": "256px",
  "--sidebar-collapsed-width": "64px",
  "--sidebar-transition-duration": "300ms",
  "--sidebar-indent-size": "16px",
  "--sidebar-item-padding-x": "16px",
  "--sidebar-item-padding-y": "10px",
  "--sidebar-icon-size": "20px"
};
function u(e, t = {}, n = {}) {
  return n && n[e] !== void 0 ? n[e] || "" : t && t[e] !== void 0 ? t[e] || "" : Q[e] || "";
}
function fn(...e) {
  const t = e.filter(Boolean).flatMap((n) => String(n).split(/\s+/)).filter(Boolean);
  return [...new Set(t)].join(" ");
}
function vn(e = {}) {
  const {
    globalClasses: t = {},
    itemClasses: n = {},
    isActive: s = !1,
    isGroupActive: a = !1,
    isOpen: r = !1,
    isDisabled: d = !1,
    isHovered: b = !1,
    isFocused: f = !1,
    level: m = 0
  } = e, C = [
    u("link", t, n)
  ];
  return C.push(u("linkHover", t, n)), C.push(u("linkFocus", t, n)), d ? C.push(u("linkDisabled", t, n)) : s ? C.push(u("linkActive", t, n)) : a && C.push(u("linkGroupActive", t, n)), r && !s && C.push(u("linkOpen", t, n)), m > 0 && C.push(u("indent", t, n)), fn(...C);
}
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
function mn(e, t = 0, n = {}) {
  const s = n.context || de(), a = l(() => !!(e.children && e.children.length > 0)), r = l(() => ue(e, s.currentPath.value)), d = l(() => ce(e, s.currentPath.value)), b = l(() => a.value ? s.isGroupExpanded(e.id) : !1), f = l(() => !!e.disabled), m = l(() => typeof e.visible == "function" ? e.visible({ item: e }) : e.visible !== !1), C = l(() => !!e.external), v = l(() => !!e.hiddenOnCollapse && s.isCollapsed.value), $ = l(() => {
    const g = [
      u("item", s.classes.value, e.classes)
    ];
    return e.class && g.push(e.class), g.filter(Boolean).join(" ");
  }), w = l(() => vn({
    globalClasses: s.classes.value,
    itemClasses: e.classes,
    isActive: r.value,
    isGroupActive: d.value,
    isOpen: b.value,
    isDisabled: f.value,
    level: t
  })), o = l(() => u("icon", s.classes.value, e.classes)), p = l(() => u("label", s.classes.value, e.classes)), S = l(() => u("badge", s.classes.value, e.classes)), L = l(() => {
    const g = u("dropdown", s.classes.value, e.classes);
    if (b.value) {
      const F = u("dropdownOpen", s.classes.value, e.classes);
      return `${g} ${F}`.trim();
    }
    return g;
  }), j = l(() => {
    const g = {};
    return r.value && (g["aria-current"] = "page"), a.value && (g["aria-expanded"] = b.value ? "true" : "false", g["aria-haspopup"] = "true"), f.value && (g["aria-disabled"] = "true", g.tabindex = "-1"), g;
  });
  function z(g) {
    if (f.value) {
      g.preventDefault(), g.stopPropagation();
      return;
    }
    if (a.value) {
      g.preventDefault(), s.toggleGroup(e.id);
      return;
    }
    s.mobileOpen.value && s.closeMobile();
  }
  function H(g) {
    switch (g.key) {
      case "Enter":
      case " ":
        g.preventDefault(), z(g);
        break;
      case "ArrowRight":
        a.value && !b.value && (g.preventDefault(), s.toggleGroup(e.id));
        break;
      case "ArrowLeft":
        a.value && b.value && (g.preventDefault(), s.toggleGroup(e.id));
        break;
    }
  }
  function P() {
    a.value && s.toggleGroup(e.id);
  }
  return {
    // State
    hasChildren: a,
    isActive: r,
    isGroupActive: d,
    isExpanded: b,
    isDisabled: f,
    isVisible: m,
    isExternal: C,
    isHiddenOnCollapse: v,
    // Classes
    itemClass: $,
    linkClass: w,
    iconClass: o,
    labelClass: p,
    badgeClass: S,
    dropdownClass: L,
    // Accessibility
    ariaAttrs: j,
    // Event handlers
    handleClick: z,
    handleKeydown: H,
    toggle: P,
    // Context access
    context: s,
    level: t
  };
}
let ae = 0;
const bn = T({
  name: "SidebarMenuItem",
  components: {
    SidebarMenuLink: Xe,
    SidebarMenuIcon: nn,
    SidebarMenuBadge: ln,
    SidebarTooltip: un
  },
  props: {
    /**
     * Menu item data
     */
    item: {
      type: Object,
      required: !0
    },
    /**
     * Nesting level (1-based)
     */
    level: {
      type: Number,
      default: 1
    },
    /**
     * Navigation mode override
     */
    mode: {
      type: String,
      default: null
    }
  },
  emits: ["item-click"],
  setup(e, { emit: t }) {
    const n = de(), s = `vsm-item-${++ae}`, a = `vsm-group-${e.item.id || ae}`, r = `vsm-tooltip-${ae}`, {
      isActive: d,
      isParentOfActive: b,
      isExpanded: f,
      isDisabled: m,
      isVisible: C,
      isHiddenOnCollapse: v,
      isExternal: $,
      hasChildren: w,
      isHovered: o,
      isFocused: p,
      showTooltip: S,
      itemClasses: L,
      linkClasses: j,
      iconClasses: z,
      labelClasses: H,
      badgeClasses: P,
      dropdownClasses: g,
      ariaAttrs: F,
      handleClick: X,
      handleKeydown: i,
      handleMouseEnter: D,
      handleMouseLeave: ee,
      handleFocus: we,
      handleBlur: Se,
      toggleExpanded: $e
    } = mn(e, t), Me = l(() => "header" in e.item), Oe = l(() => "component" in e.item), Be = l(() => n.isCollapsed), Le = l(() => [
      "vsm-item",
      u("item", n.classes, e.item.classes),
      {
        "vsm-item--active": d.value,
        "vsm-item--parent-active": b.value,
        "vsm-item--expanded": f.value,
        "vsm-item--disabled": m.value,
        "vsm-item--has-children": w.value,
        [`vsm-item--level-${e.level}`]: !0
      },
      e.item.class
    ]), Ie = l(() => {
      const A = u("link", n.classes, e.item.classes), ne = d.value ? u("linkActive", n.classes, e.item.classes) : "", Ge = o.value ? u("linkHover", n.classes, e.item.classes) : "", ze = p.value ? u("linkFocus", n.classes, e.item.classes) : "", Ke = m.value ? u("linkDisabled", n.classes, e.item.classes) : "", Ne = f.value ? u("linkOpen", n.classes, e.item.classes) : "", We = b.value ? u("linkGroupActive", n.classes, e.item.classes) : "";
      return [
        A,
        ne,
        Ge,
        ze,
        Ke,
        Ne,
        We,
        `vsm-level-${e.level}`
      ].filter(Boolean).join(" ");
    }), Ee = l(() => u("icon", n.classes, e.item.classes)), Ae = l(() => [
      "vsm-label",
      u("label", n.classes, e.item.classes)
    ].filter(Boolean).join(" ")), Pe = l(() => u("badge", n.classes, e.item.classes)), De = l(() => {
      const A = u("dropdown", n.classes, e.item.classes), ne = f.value ? "vsm-dropdown-icon--open" : "";
      return [A, "vsm-dropdown-icon", ne].filter(Boolean).join(" ");
    }), je = l(() => [
      "vsm-header",
      "text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-2",
      u("header", n.classes, {}),
      e.item.class
    ].filter(Boolean)), He = l(() => [
      "vsm-group",
      u("group", n.classes, e.item.classes)
    ].filter(Boolean)), Te = l(() => u("tooltip", n.classes, e.item.classes)), Re = l(() => e.item.children ? e.item.children.filter((A) => typeof A.visible == "function" ? A.visible({ item: A }) : A.visible !== !1) : []);
    function Fe(A) {
      X(A), t("item-click", { event: A, item: e.item });
    }
    return {
      // IDs
      itemId: s,
      groupId: a,
      tooltipId: r,
      // State
      isHeader: Me,
      isComponent: Oe,
      isCollapsed: Be,
      isActive: d,
      isParentOfActive: b,
      isExpanded: f,
      isDisabled: m,
      isVisible: C,
      isHiddenOnCollapse: v,
      isExternal: $,
      hasChildren: w,
      isHovered: o,
      isFocused: p,
      showTooltip: S,
      // Classes
      itemClasses: Le,
      linkClasses: Ie,
      iconClasses: Ee,
      labelClasses: Ae,
      badgeClasses: Pe,
      dropdownClasses: De,
      headerClasses: je,
      groupClasses: He,
      tooltipClasses: Te,
      // Data
      visibleChildren: Re,
      ariaAttrs: F,
      // Handlers
      handleClick: Fe,
      handleKeydown: i,
      handleMouseEnter: D,
      handleMouseLeave: ee,
      handleFocus: we,
      handleBlur: Se,
      toggleExpanded: $e
    };
  }
}), pn = ["data-level"], hn = ["id"];
function gn(e, t, n, s, a, r) {
  const d = G("SidebarMenuIcon"), b = G("SidebarMenuBadge"), f = G("SidebarMenuLink"), m = G("SidebarTooltip"), C = G("SidebarMenuItem", !0);
  return e.isVisible ? (c(), k("li", B({
    key: 0,
    class: e.itemClasses,
    "data-level": e.level,
    style: { "--vsm-level": e.level }
  }, e.item.attrs), [
    e.isHeader ? se((c(), k("div", {
      key: 0,
      class: y(e.headerClasses)
    }, x(e.item.header), 3)), [
      [le, !e.isCollapsed || !e.item.hiddenOnCollapse]
    ]) : e.isComponent ? se((c(), E(Y(e.item.component), Ue(B({ key: 1 }, e.item.props || {})), null, 16)), [
      [le, !e.isCollapsed || !e.item.hiddenOnCollapse]
    ]) : (c(), k(U, { key: 2 }, [
      J(f, B({
        item: e.item,
        mode: e.mode,
        disabled: e.isDisabled,
        "prevent-default": e.hasChildren && !e.item.href && !e.item.to,
        "link-class": e.linkClasses,
        onClick: e.handleClick,
        onMouseenter: e.handleMouseEnter,
        onMouseleave: e.handleMouseLeave,
        onFocus: e.handleFocus,
        onBlur: e.handleBlur,
        onKeydown: e.handleKeydown
      }, e.ariaAttrs), {
        default: O(() => [
          h(e.$slots, "item-icon", {
            item: e.item,
            icon: e.item.icon
          }, () => [
            e.item.icon ? (c(), E(d, {
              key: 0,
              icon: e.item.icon,
              "icon-class": e.iconClasses
            }, null, 8, ["icon", "icon-class"])) : I("", !0)
          ]),
          se(M("span", {
            class: y(e.labelClasses)
          }, x(e.item.label), 3), [
            [le, !e.isCollapsed]
          ]),
          e.item.badge && !e.isCollapsed ? h(e.$slots, "item-badge", {
            key: 0,
            item: e.item,
            badge: e.item.badge
          }, () => [
            J(b, {
              badge: e.item.badge,
              "badge-class": e.badgeClasses
            }, null, 8, ["badge", "badge-class"])
          ]) : I("", !0),
          e.hasChildren && !e.isCollapsed ? h(e.$slots, "dropdown-icon", {
            key: 1,
            isOpen: e.isExpanded,
            toggle: e.toggleExpanded
          }, () => [
            (c(), k("svg", {
              class: y(e.dropdownClasses),
              viewBox: "0 0 20 20",
              fill: "currentColor",
              "aria-hidden": "true"
            }, [...t[0] || (t[0] = [
              M("path", {
                "fill-rule": "evenodd",
                d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                "clip-rule": "evenodd"
              }, null, -1)
            ])], 2))
          ]) : I("", !0)
        ]),
        _: 3
      }, 16, ["item", "mode", "disabled", "prevent-default", "link-class", "onClick", "onMouseenter", "onMouseleave", "onFocus", "onBlur", "onKeydown"]),
      e.isCollapsed && e.level === 1 ? (c(), E(m, {
        key: 0,
        show: e.showTooltip,
        text: e.item.label,
        "tooltip-class": e.tooltipClasses,
        "aria-describedby": e.tooltipId
      }, null, 8, ["show", "text", "tooltip-class", "aria-describedby"])) : I("", !0),
      J(_, { name: "vsm-group" }, {
        default: O(() => [
          e.hasChildren && e.isExpanded && !e.isCollapsed ? (c(), k("ul", {
            key: 0,
            id: e.groupId,
            class: y(e.groupClasses),
            role: "group"
          }, [
            (c(!0), k(U, null, re(e.visibleChildren, (v) => (c(), E(C, {
              key: v.id,
              item: v,
              level: e.level + 1,
              mode: e.mode
            }, {
              "item-icon": O(($) => [
                h(e.$slots, "item-icon", B({ ref_for: !0 }, $))
              ]),
              "item-badge": O(($) => [
                h(e.$slots, "item-badge", B({ ref_for: !0 }, $))
              ]),
              "dropdown-icon": O(($) => [
                h(e.$slots, "dropdown-icon", B({ ref_for: !0 }, $))
              ]),
              _: 3
            }, 8, ["item", "level", "mode"]))), 128))
          ], 10, hn)) : I("", !0)
        ]),
        _: 3
      })
    ], 64))
  ], 16, pn)) : I("", !0);
}
const Cn = /* @__PURE__ */ R(bn, [["render", gn]]), yn = T({
  name: "SidebarMobileDrawer",
  props: {
    /**
     * Whether the drawer is open
     */
    mobileOpen: {
      type: Boolean,
      default: !1
    },
    /**
     * Drawer width
     */
    width: {
      type: String,
      default: "280px"
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
      default: !1
    }
  },
  emits: ["update:mobileOpen", "close"],
  setup(e, { emit: t }) {
    const n = K(null), s = l(() => [
      "vsm-overlay",
      e.classes.overlay || Q.overlay
    ].filter(Boolean)), a = l(() => [
      "vsm-drawer",
      e.classes.drawer || Q.drawer,
      e.rtl ? "vsm-drawer--rtl" : ""
    ].filter(Boolean)), r = l(() => ({
      width: e.width,
      "--sidebar-width": e.width
    })), d = l(() => [
      "vsm-drawer-close",
      "absolute top-4 right-4 p-1 rounded-md",
      "text-gray-400 hover:text-white hover:bg-gray-700",
      "focus:outline-none focus:ring-2 focus:ring-white",
      "transition-colors"
    ]), b = l(() => [
      "vsm-drawer-content",
      "flex flex-col h-full overflow-hidden pt-12"
    ]);
    function f() {
      t("update:mobileOpen", !1), t("close");
    }
    function m() {
      f();
    }
    function C(p) {
      p.key === "Escape" && e.mobileOpen && f();
    }
    function v() {
      typeof document < "u" && document.body.classList.add("vsm-no-scroll");
    }
    function $() {
      typeof document < "u" && document.body.classList.remove("vsm-no-scroll");
    }
    function w(p) {
      if (!e.mobileOpen || !n.value) return;
      const S = n.value.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (S.length === 0) return;
      const L = S[0], j = S[S.length - 1];
      p.shiftKey && document.activeElement === L ? (p.preventDefault(), j.focus()) : !p.shiftKey && document.activeElement === j && (p.preventDefault(), L.focus());
    }
    function o(p) {
      p.key === "Escape" ? C(p) : p.key === "Tab" && w(p);
    }
    return oe(() => e.mobileOpen, (p) => {
      p ? (v(), setTimeout(() => {
        if (n.value) {
          const S = n.value.querySelector(".vsm-drawer-close");
          S && S.focus();
        }
      }, 100)) : $();
    }), be(() => {
      typeof document < "u" && document.addEventListener("keydown", o);
    }), pe(() => {
      $(), typeof document < "u" && document.removeEventListener("keydown", o);
    }), {
      drawerRef: n,
      overlayClasses: s,
      drawerClasses: a,
      drawerStyles: r,
      closeButtonClasses: d,
      drawerContentClasses: b,
      close: f,
      handleOverlayClick: m
    };
  }
});
function kn(e, t, n, s, a, r) {
  return c(), E(Je, { to: "body" }, [
    J(_, { name: "vsm-overlay" }, {
      default: O(() => [
        e.mobileOpen ? (c(), k("div", {
          key: 0,
          class: y(e.overlayClasses),
          onClick: t[0] || (t[0] = (...d) => e.handleOverlayClick && e.handleOverlayClick(...d)),
          "aria-hidden": "true"
        }, null, 2)) : I("", !0)
      ]),
      _: 1
    }),
    J(_, { name: "vsm-drawer" }, {
      default: O(() => [
        e.mobileOpen ? (c(), k("aside", {
          key: 0,
          ref: "drawerRef",
          class: y(e.drawerClasses),
          style: he(e.drawerStyles),
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Navigation menu"
        }, [
          M("button", {
            type: "button",
            class: y(e.closeButtonClasses),
            onClick: t[1] || (t[1] = (...d) => e.close && e.close(...d)),
            "aria-label": "Close navigation"
          }, [
            h(e.$slots, "close-icon", {}, () => [
              t[2] || (t[2] = M("svg", {
                class: "w-6 h-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "aria-hidden": "true"
              }, [
                M("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M6 18L18 6M6 6l12 12"
                })
              ], -1))
            ])
          ], 2),
          M("div", {
            class: y(e.drawerContentClasses)
          }, [
            h(e.$slots, "default")
          ], 2)
        ], 6)) : I("", !0)
      ]),
      _: 3
    })
  ]);
}
const wn = /* @__PURE__ */ R(yn, [["render", kn]]), Sn = T({
  name: "SidebarMenu",
  components: {
    SidebarMenuItem: Cn,
    SidebarMobileDrawer: wn
  },
  props: {
    /**
     * Menu items array
     */
    items: {
      type: Array,
      required: !0
    },
    /**
     * Navigation mode: 'inertia' | 'router' | 'a'
     */
    mode: {
      type: String,
      default: "a",
      validator: (e) => ["inertia", "router", "a"].includes(e)
    },
    /**
     * Collapsed state (v-model:collapsed)
     */
    collapsed: {
      type: Boolean,
      default: !1
    },
    /**
     * Mobile drawer open state (v-model:mobileOpen)
     */
    mobileOpen: {
      type: Boolean,
      default: !1
    },
    /**
     * localStorage key for persistence
     */
    storageKey: {
      type: String,
      default: void 0
    },
    /**
     * Expanded sidebar width
     */
    width: {
      type: String,
      default: "256px"
    },
    /**
     * Collapsed sidebar width
     */
    collapsedWidth: {
      type: String,
      default: "64px"
    },
    /**
     * Accordion behavior
     */
    showOneChild: {
      type: [Boolean, String],
      default: !1,
      validator: (e) => typeof e == "boolean" || e === "deep"
    },
    /**
     * Keep all children expanded
     */
    showChild: {
      type: Boolean,
      default: !1
    },
    /**
     * Right-to-left
     */
    rtl: {
      type: Boolean,
      default: !1
    },
    /**
     * Relative to parent
     */
    relative: {
      type: Boolean,
      default: !1
    },
    /**
     * Hide toggle button
     */
    hideToggle: {
      type: Boolean,
      default: !1
    },
    /**
     * Disable hover expansion
     */
    disableHover: {
      type: Boolean,
      default: !1
    },
    /**
     * Expand on hover when collapsed
     */
    expandOnHover: {
      type: Boolean,
      default: !1
    },
    /**
     * Custom link component name
     */
    linkComponentName: {
      type: String,
      default: void 0
    },
    /**
     * Class overrides
     */
    classes: {
      type: Object,
      default: () => ({})
    },
    /**
     * Mobile breakpoint (px)
     */
    mobileBreakpoint: {
      type: Number,
      default: 768
    }
  },
  emits: ["update:collapsed", "update:mobileOpen", "item-click"],
  setup(e, { emit: t }) {
    const n = K(null), s = ge(e, t);
    Ce(s), N("vsm-mode", () => e.mode), N("vsm-classes", () => e.classes), N("vsm-link-component", () => e.linkComponentName);
    const a = l(() => s.isCollapsed), r = l(() => e.items.map((i, D) => ({
      ...i,
      id: i.id || `item-${D}`
    })).filter((i) => typeof i.visible == "function" ? i.visible({ item: i }) : i.visible !== !1)), d = l(() => typeof window > "u" ? !1 : window.innerWidth < e.mobileBreakpoint), b = l(() => {
      const i = u("root", e.classes, {}), D = a.value ? "" : u("rootExpanded", e.classes, {}), ee = a.value ? u("rootCollapsed", e.classes, {}) : "";
      return [
        "vsm-sidebar",
        i || Q.root,
        D,
        ee,
        {
          "vsm-collapsed": a.value,
          "vsm-expanded": !a.value,
          "vsm-rtl": e.rtl,
          "vsm-relative": e.relative
        }
      ];
    }), f = l(() => ({
      width: a.value ? e.collapsedWidth : e.width,
      "--sidebar-width": e.width,
      "--sidebar-collapsed-width": e.collapsedWidth
    })), m = l(() => [
      "vsm-wrapper",
      u("wrapper", e.classes, {}) || "flex flex-col h-full"
    ]), C = l(() => [
      "vsm-nav",
      u("nav", e.classes, {}) || "flex-1 overflow-y-auto overflow-x-hidden"
    ]), v = l(() => [
      "vsm-menu",
      u("menu", e.classes, {}) || "flex flex-col py-2"
    ]), $ = l(() => [
      "vsm-header-slot",
      u("header", e.classes, {}) || "flex-shrink-0"
    ]), w = l(() => ["vsm-brand-slot", "flex-shrink-0"]), o = l(() => ["vsm-user-slot", "flex-shrink-0"]), p = l(() => [
      "vsm-footer-slot",
      u("footer", e.classes, {}) || "flex-shrink-0 border-t border-gray-700"
    ]), S = l(() => [
      "vsm-toggle",
      u("toggle", e.classes, {}) || Q.toggle
    ]);
    function L() {
      s.toggle();
    }
    function j(i) {
      t("item-click", i);
    }
    function z(i) {
      t("item-click", i), (i.item.href || i.item.to) && setTimeout(() => {
        s.closeMobile();
      }, 150);
    }
    function H(i) {
      t("update:mobileOpen", i);
    }
    function P() {
      t("update:mobileOpen", !1);
    }
    function g() {
      e.expandOnHover && a.value && s.setHoverExpanded(!0);
    }
    function F() {
      e.expandOnHover && s.setHoverExpanded(!1);
    }
    const X = {
      toggle: s.toggle,
      collapse: s.collapse,
      expand: s.expand,
      toggleMobile: s.toggleMobile,
      openMobile: s.openMobile,
      closeMobile: s.closeMobile,
      updateCurrentPath: s.updateCurrentPath
    };
    return {
      sidebarRef: n,
      isCollapsed: a,
      visibleItems: r,
      showMobileDrawer: d,
      // Classes
      sidebarClasses: b,
      sidebarStyles: f,
      wrapperClasses: m,
      navClasses: C,
      menuClasses: v,
      headerClasses: $,
      brandClasses: w,
      userClasses: o,
      footerClasses: p,
      toggleClasses: S,
      // Handlers
      handleToggle: L,
      handleItemClick: j,
      handleMobileItemClick: z,
      handleMobileUpdate: H,
      handleMobileClose: P,
      handleMouseEnter: g,
      handleMouseLeave: F,
      // Exposed
      ...X
    };
  }
}), $n = ["dir"], Mn = ["aria-label", "aria-expanded"];
function On(e, t, n, s, a, r) {
  const d = G("SidebarMenuItem"), b = G("SidebarMobileDrawer");
  return c(), k(U, null, [
    M("aside", {
      ref: "sidebarRef",
      class: y(e.sidebarClasses),
      style: he(e.sidebarStyles),
      dir: e.rtl ? "rtl" : void 0,
      onMouseenter: t[1] || (t[1] = (...f) => e.handleMouseEnter && e.handleMouseEnter(...f)),
      onMouseleave: t[2] || (t[2] = (...f) => e.handleMouseLeave && e.handleMouseLeave(...f))
    }, [
      M("div", {
        class: y(e.wrapperClasses)
      }, [
        e.$slots.header ? (c(), k("div", {
          key: 0,
          class: y(e.headerClasses)
        }, [
          h(e.$slots, "header")
        ], 2)) : I("", !0),
        e.$slots.brand ? (c(), k("div", {
          key: 1,
          class: y(e.brandClasses)
        }, [
          h(e.$slots, "brand")
        ], 2)) : I("", !0),
        M("nav", {
          class: y(e.navClasses),
          "aria-label": "Main navigation"
        }, [
          M("ul", {
            class: y(e.menuClasses),
            role: "menubar"
          }, [
            (c(!0), k(U, null, re(e.visibleItems, (f) => (c(), E(d, {
              key: f.id,
              item: f,
              level: 1,
              mode: e.mode,
              onItemClick: e.handleItemClick
            }, {
              "item-icon": O((m) => [
                h(e.$slots, "item-icon", B({ ref_for: !0 }, m))
              ]),
              "item-badge": O((m) => [
                h(e.$slots, "item-badge", B({ ref_for: !0 }, m))
              ]),
              "dropdown-icon": O((m) => [
                h(e.$slots, "dropdown-icon", B({ ref_for: !0 }, m), () => [
                  (c(), k("svg", {
                    class: y(["w-4 h-4 transition-transform", m.isOpen ? "rotate-180" : ""]),
                    viewBox: "0 0 20 20",
                    fill: "currentColor",
                    "aria-hidden": "true"
                  }, [...t[3] || (t[3] = [
                    M("path", {
                      "fill-rule": "evenodd",
                      d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                      "clip-rule": "evenodd"
                    }, null, -1)
                  ])], 2))
                ])
              ]),
              _: 3
            }, 8, ["item", "mode", "onItemClick"]))), 128))
          ], 2)
        ], 2),
        e.$slots.user ? (c(), k("div", {
          key: 2,
          class: y(e.userClasses)
        }, [
          h(e.$slots, "user")
        ], 2)) : I("", !0),
        e.$slots.footer ? (c(), k("div", {
          key: 3,
          class: y(e.footerClasses)
        }, [
          h(e.$slots, "footer")
        ], 2)) : I("", !0),
        e.hideToggle ? I("", !0) : (c(), k("button", {
          key: 4,
          type: "button",
          class: y(e.toggleClasses),
          "aria-label": e.isCollapsed ? "Expand sidebar" : "Collapse sidebar",
          "aria-expanded": !e.isCollapsed,
          onClick: t[0] || (t[0] = (...f) => e.handleToggle && e.handleToggle(...f))
        }, [
          h(e.$slots, "toggle-icon", { collapsed: e.isCollapsed }, () => [
            (c(), k("svg", {
              class: y(["w-5 h-5 transition-transform", { "rotate-180": e.isCollapsed }]),
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              "aria-hidden": "true"
            }, [...t[4] || (t[4] = [
              M("path", {
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                "stroke-width": "2",
                d: "M11 19l-7-7 7-7m8 14l-7-7 7-7"
              }, null, -1)
            ])], 2))
          ])
        ], 10, Mn))
      ], 2)
    ], 46, $n),
    e.showMobileDrawer ? (c(), E(b, {
      key: 0,
      "mobile-open": e.mobileOpen,
      width: e.width,
      classes: e.classes,
      rtl: e.rtl,
      "onUpdate:mobileOpen": e.handleMobileUpdate,
      onClose: e.handleMobileClose
    }, {
      default: O(() => [
        h(e.$slots, "header"),
        h(e.$slots, "brand"),
        M("nav", {
          class: y(e.navClasses),
          "aria-label": "Main navigation"
        }, [
          M("ul", {
            class: y(e.menuClasses),
            role: "menubar"
          }, [
            (c(!0), k(U, null, re(e.visibleItems, (f) => (c(), E(d, {
              key: f.id,
              item: f,
              level: 1,
              mode: e.mode,
              onItemClick: e.handleMobileItemClick
            }, {
              "item-icon": O((m) => [
                h(e.$slots, "item-icon", B({ ref_for: !0 }, m))
              ]),
              "item-badge": O((m) => [
                h(e.$slots, "item-badge", B({ ref_for: !0 }, m))
              ]),
              "dropdown-icon": O((m) => [
                h(e.$slots, "dropdown-icon", B({ ref_for: !0 }, m))
              ]),
              _: 3
            }, 8, ["item", "mode", "onItemClick"]))), 128))
          ], 2)
        ], 2),
        h(e.$slots, "user"),
        h(e.$slots, "footer")
      ]),
      _: 3
    }, 8, ["mobile-open", "width", "classes", "rtl", "onUpdate:mobileOpen", "onClose"])) : I("", !0)
  ], 64);
}
const Bn = /* @__PURE__ */ R(Sn, [["render", On]]), Ln = T({
  name: "SidebarProvider",
  props: {
    /**
     * Collapsed state (v-model:collapsed)
     */
    collapsed: {
      type: Boolean,
      default: !1
    },
    /**
     * Mobile drawer open state (v-model:mobileOpen)
     */
    mobileOpen: {
      type: Boolean,
      default: !1
    },
    /**
     * localStorage key for persistence
     */
    storageKey: {
      type: String,
      default: void 0
    },
    /**
     * Navigation mode
     */
    mode: {
      type: String,
      default: "a"
    },
    /**
     * Expanded width
     */
    width: {
      type: String,
      default: "256px"
    },
    /**
     * Collapsed width
     */
    collapsedWidth: {
      type: String,
      default: "64px"
    },
    /**
     * RTL mode
     */
    rtl: {
      type: Boolean,
      default: !1
    },
    /**
     * Disable hover expansion
     */
    disableHover: {
      type: Boolean,
      default: !1
    },
    /**
     * Expand on hover
     */
    expandOnHover: {
      type: Boolean,
      default: !1
    },
    /**
     * Accordion behavior
     */
    showOneChild: {
      type: [Boolean, String],
      default: !1
    },
    /**
     * Class overrides
     */
    classes: {
      type: Object,
      default: () => ({})
    },
    /**
     * Custom link component
     */
    linkComponentName: {
      type: String,
      default: void 0
    },
    /**
     * Initially expanded groups
     */
    defaultExpandedGroups: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:collapsed", "update:mobileOpen"],
  setup(e, { emit: t }) {
    const n = ge(e, t);
    return Ce(n), N("vsm-mode", () => e.mode), N("vsm-classes", () => e.classes), N("vsm-link-component", () => e.linkComponentName), {};
  }
});
function In(e, t, n, s, a, r) {
  return h(e.$slots, "default");
}
const zn = /* @__PURE__ */ R(Ln, [["render", In]]), En = T({
  name: "SidebarTrigger",
  props: {
    /**
     * HTML element or component to render
     */
    as: {
      type: [String, Object],
      default: "button"
    },
    /**
     * What to toggle: 'sidebar' | 'mobile' | 'both'
     */
    toggles: {
      type: String,
      default: "both",
      validator: (e) => ["sidebar", "mobile", "both"].includes(e)
    },
    /**
     * Additional classes
     */
    triggerClass: {
      type: String,
      default: ""
    }
  },
  setup(e) {
    const t = de(), n = l(() => t.collapsed), s = l(() => t.mobileOpen), a = l(() => [
      "vsm-trigger",
      "inline-flex items-center justify-center",
      e.triggerClass
    ].filter(Boolean)), r = l(() => e.toggles === "mobile" ? s.value ? "Close menu" : "Open menu" : n.value ? "Expand sidebar" : "Collapse sidebar");
    function d() {
      switch (e.toggles) {
        case "sidebar":
          t.toggle();
          break;
        case "mobile":
          t.toggleMobile();
          break;
        case "both":
        default:
          typeof window < "u" && window.innerWidth < 768 ? t.toggleMobile() : t.toggle();
          break;
      }
    }
    return {
      isCollapsed: n,
      mobileOpen: s,
      triggerClasses: a,
      ariaLabel: r,
      handleClick: d
    };
  }
});
function An(e, t, n, s, a, r) {
  return c(), E(Y(e.as), {
    class: y(e.triggerClasses),
    "aria-label": e.ariaLabel,
    "aria-expanded": !e.isCollapsed,
    onClick: e.handleClick
  }, {
    default: O(() => [
      h(e.$slots, "default", {
        collapsed: e.isCollapsed,
        mobileOpen: e.mobileOpen
      }, () => [
        t[0] || (t[0] = M("svg", {
          class: "w-6 h-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          "aria-hidden": "true"
        }, [
          M("path", {
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "M4 6h16M4 12h16M4 18h16"
          })
        ], -1))
      ])
    ]),
    _: 3
  }, 8, ["class", "aria-label", "aria-expanded", "onClick"]);
}
const Kn = /* @__PURE__ */ R(En, [["render", An]]);
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
let V = null, q = null;
function ye() {
  if (V !== null) return V;
  try {
    return V = require("vue-router").RouterLink, V;
  } catch {
    return V = !1, null;
  }
}
function ke() {
  if (q !== null) return q;
  try {
    return q = require("@inertiajs/vue3").Link, q;
  } catch {
    return q = !1, null;
  }
}
function Pn() {
  const e = ye();
  return e !== null && e !== !1;
}
function Dn() {
  const e = ke();
  return e !== null && e !== !1;
}
function jn(e, t = null) {
  if (t)
    try {
      return G(t);
    } catch {
      console.warn(
        `[vue-sidebar-kit] Could not resolve custom link component "${t}". Falling back to default.`
      );
    }
  switch (e) {
    case "router": {
      const n = ye();
      return n || (console.warn(
        "[vue-sidebar-kit] Vue Router not found. Falling back to anchor mode. Install vue-router to use router mode."
      ), "a");
    }
    case "inertia": {
      const n = ke();
      return n || (console.warn(
        "[vue-sidebar-kit] Inertia.js not found. Falling back to anchor mode. Install @inertiajs/vue3 to use inertia mode."
      ), "a");
    }
    case "a":
    default:
      return "a";
  }
}
function Hn(e, t, n = {}) {
  const s = {};
  if (n.disabled ?? e.disabled)
    return s.role = "link", s.tabindex = "-1", s["aria-disabled"] = "true", { ...s, ...e.linkAttrs || {}, ...n.additionalAttrs || {} };
  if (e.external)
    return s.href = e.href, s.target = "_blank", s.rel = "noopener noreferrer", { ...s, ...e.linkAttrs || {}, ...n.additionalAttrs || {} };
  switch (e.linkMode || t) {
    case "router":
      s.to = e.to || e.href;
      break;
    case "inertia":
      s.href = e.href || e.to;
      break;
    case "a":
    default:
      s.href = e.href || e.to;
      break;
  }
  return {
    ...s,
    ...e.linkAttrs || {},
    ...n.additionalAttrs || {}
  };
}
function Nn(e = "a") {
  return {
    /**
     * Get the link component for a specific mode.
     * @param {string} [mode] - Mode override (uses defaultMode if not set)
     * @param {string} [customComponentName] - Custom component to resolve
     * @returns {string|Object} Link component
     */
    getLinkComponent(t = e, n = null) {
      return jn(t, n);
    },
    /**
     * Resolve link props for an item.
     * @param {MenuItem} item - Menu item
     * @param {string} [mode] - Mode override
     * @param {Object} [options] - Additional options
     * @returns {Object} Resolved props
     */
    resolveLinkProps(t, n = e, s = {}) {
      return Hn(t, n, s);
    },
    /**
     * Check Vue Router availability.
     * @returns {boolean} True if available
     */
    hasVueRouter: Pn,
    /**
     * Check Inertia availability.
     * @returns {boolean} True if available
     */
    hasInertia: Dn,
    /**
     * Current navigation mode.
     * @type {string}
     */
    mode: e
  };
}
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
const Wn = {
  /**
   * Vue plugin install function.
   * Called automatically when using app.use(VueSidebarKit)
   * 
   * @param {Object} app - Vue application instance
   * @returns {void}
   */
  install(e) {
    e.component("SidebarMenu", Bn);
  }
};
export {
  Bn as SidebarMenu,
  ln as SidebarMenuBadge,
  nn as SidebarMenuIcon,
  Cn as SidebarMenuItem,
  Xe as SidebarMenuLink,
  wn as SidebarMobileDrawer,
  zn as SidebarProvider,
  un as SidebarTooltip,
  Kn as SidebarTrigger,
  ge as createSidebarContext,
  Wn as default,
  Q as defaultClasses,
  Gn as defaultCssVars,
  vn as getLinkClasses,
  Dn as hasInertia,
  Rn as hasSidebarContext,
  Pn as hasVueRouter,
  ue as isItemActive,
  fn as mergeClasses,
  Ce as provideSidebar,
  u as resolveClass,
  Hn as resolveLinkProps,
  Fn as useActiveState,
  mn as useMenuItem,
  Nn as useNavigation,
  de as useSidebar
};
//# sourceMappingURL=vue-sidebar-kit.js.map
