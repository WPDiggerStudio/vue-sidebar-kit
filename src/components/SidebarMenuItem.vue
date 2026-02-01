<template>
  <li
    v-if="isVisible"
    :class="itemClasses"
    :data-level="level"
    :style="{ '--vsm-level': level }"
    v-bind="item.attrs"
  >
    <!-- Header Item -->
    <template v-if="isHeader">
      <div
        :class="headerClasses"
        v-show="!isCollapsed || !item.hiddenOnCollapse"
      >
        {{ item.header }}
      </div>
    </template>

    <!-- Component Item -->
    <template v-else-if="isComponent">
      <component
        :is="item.component"
        v-bind="item.props || {}"
        v-show="!isCollapsed || !item.hiddenOnCollapse"
      />
    </template>

    <!-- Regular Menu Item -->
    <template v-else>
      <!-- Link -->
      <SidebarMenuLink
        :item="item"
        :mode="mode"
        :disabled="isDisabled"
        :prevent-default="hasChildren && !item.href && !item.to"
        :link-class="linkClasses"
        @click="handleClick"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        v-bind="ariaAttrs"
      >
        <!-- Icon -->
        <slot name="item-icon" :item="item" :icon="item.icon">
          <SidebarMenuIcon
            v-if="item.icon"
            :icon="item.icon"
            :icon-class="iconClasses"
          />
        </slot>

        <!-- Label (hidden in collapsed mode) -->
        <span v-show="!isCollapsed" :class="labelClasses">
          {{ item.label }}
        </span>

        <!-- Badge (hidden in collapsed mode) -->
        <slot v-if="item.badge && !isCollapsed" name="item-badge" :item="item" :badge="item.badge">
          <SidebarMenuBadge
            :badge="item.badge"
            :badge-class="badgeClasses"
          />
        </slot>

        <!-- Dropdown Arrow (if has children) -->
        <slot
          v-if="hasChildren && !isCollapsed"
          name="dropdown-icon"
          :is-open="isExpanded"
          :toggle="toggleExpanded"
        >
          <svg
            :class="dropdownClasses"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </slot>
      </SidebarMenuLink>

      <!-- Tooltip (collapsed mode) -->
      <SidebarTooltip
        v-if="isCollapsed && level === 1"
        :show="showTooltip"
        :text="item.label"
        :tooltip-class="tooltipClasses"
        :aria-describedby="tooltipId"
      />

      <!-- Children (collapsible group) -->
      <Transition name="vsm-group">
        <ul
          v-if="hasChildren && isExpanded && !isCollapsed"
          :id="groupId"
          :class="groupClasses"
          role="group"
        >
          <SidebarMenuItem
            v-for="child in visibleChildren"
            :key="child.id"
            :item="child"
            :level="level + 1"
            :mode="mode"
          >
            <!-- Pass through slots -->
            <template #item-icon="slotProps">
              <slot name="item-icon" v-bind="slotProps" />
            </template>
            <template #item-badge="slotProps">
              <slot name="item-badge" v-bind="slotProps" />
            </template>
            <template #dropdown-icon="slotProps">
              <slot name="dropdown-icon" v-bind="slotProps" />
            </template>
          </SidebarMenuItem>
        </ul>
      </Transition>
    </template>
  </li>
</template>

<script>
import { defineComponent, computed, ref, inject } from 'vue'
import SidebarMenuLink from './SidebarMenuLink.vue'
import SidebarMenuIcon from './SidebarMenuIcon.vue'
import SidebarMenuBadge from './SidebarMenuBadge.vue'
import SidebarTooltip from './SidebarTooltip.vue'
import { useMenuItem } from '../composables/useMenuItem.js'
import { useSidebar } from '../composables/useSidebar.js'
import { defaultClasses, resolveClass } from '../styles/classes.js'

let itemIdCounter = 0

export default defineComponent({
  name: 'SidebarMenuItem',

  components: {
    SidebarMenuLink,
    SidebarMenuIcon,
    SidebarMenuBadge,
    SidebarTooltip
  },

  props: {
    /**
     * Menu item data
     */
    item: {
      type: Object,
      required: true
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

  emits: ['item-click'],

  setup(props, { emit }) {
    const sidebar = useSidebar()
    const itemId = `vsm-item-${++itemIdCounter}`
    const groupId = `vsm-group-${props.item.id || itemIdCounter}`
    const tooltipId = `vsm-tooltip-${itemIdCounter}`

    // Use the menu item composable
    const {
      isActive,
      isParentOfActive,
      isExpanded,
      isDisabled,
      isVisible,
      isHiddenOnCollapse,
      isExternal,
      hasChildren,
      isHovered,
      isFocused,
      showTooltip,
      itemClasses: baseItemClasses,
      linkClasses: baseLinkClasses,
      iconClasses: baseIconClasses,
      labelClasses: baseLabelClasses,
      badgeClasses: baseBadgeClasses,
      dropdownClasses: baseDropdownClasses,
      ariaAttrs,
      handleClick: baseHandleClick,
      handleKeydown,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      toggleExpanded
    } = useMenuItem(props, emit)

    // =========================================================================
    // ITEM TYPE DETECTION
    // =========================================================================

    const isHeader = computed(() => {
      return 'header' in props.item
    })

    const isComponent = computed(() => {
      return 'component' in props.item
    })

    const isCollapsed = computed(() => {
      return sidebar.isCollapsed
    })

    // =========================================================================
    // CLASSES (with overrides)
    // =========================================================================

    const itemClasses = computed(() => {
      return [
        'vsm-item',
        resolveClass('item', sidebar.classes, props.item.classes),
        {
          'vsm-item--active': isActive.value,
          'vsm-item--parent-active': isParentOfActive.value,
          'vsm-item--expanded': isExpanded.value,
          'vsm-item--disabled': isDisabled.value,
          'vsm-item--has-children': hasChildren.value,
          [`vsm-item--level-${props.level}`]: true
        },
        props.item.class
      ]
    })

    const linkClasses = computed(() => {
      const base = resolveClass('link', sidebar.classes, props.item.classes)
      const activeClass = isActive.value
        ? resolveClass('linkActive', sidebar.classes, props.item.classes)
        : ''
      const hoverClass = isHovered.value
        ? resolveClass('linkHover', sidebar.classes, props.item.classes)
        : ''
      const focusClass = isFocused.value
        ? resolveClass('linkFocus', sidebar.classes, props.item.classes)
        : ''
      const disabledClass = isDisabled.value
        ? resolveClass('linkDisabled', sidebar.classes, props.item.classes)
        : ''
      const openClass = isExpanded.value
        ? resolveClass('linkOpen', sidebar.classes, props.item.classes)
        : ''
      const groupActiveClass = isParentOfActive.value
        ? resolveClass('linkGroupActive', sidebar.classes, props.item.classes)
        : ''

      return [
        base,
        activeClass,
        hoverClass,
        focusClass,
        disabledClass,
        openClass,
        groupActiveClass,
        `vsm-level-${props.level}`
      ].filter(Boolean).join(' ')
    })

    const iconClasses = computed(() => {
      return resolveClass('icon', sidebar.classes, props.item.classes)
    })

    const labelClasses = computed(() => {
      return [
        'vsm-label',
        resolveClass('label', sidebar.classes, props.item.classes)
      ].filter(Boolean).join(' ')
    })

    const badgeClasses = computed(() => {
      return resolveClass('badge', sidebar.classes, props.item.classes)
    })

    const dropdownClasses = computed(() => {
      const base = resolveClass('dropdown', sidebar.classes, props.item.classes)
      const openClass = isExpanded.value ? 'vsm-dropdown-icon--open' : ''
      return [base, 'vsm-dropdown-icon', openClass].filter(Boolean).join(' ')
    })

    const headerClasses = computed(() => {
      return [
        'vsm-header',
        'text-xs font-semibold uppercase tracking-wider text-gray-400 px-4 py-2',
        resolveClass('header', sidebar.classes, {}),
        props.item.class
      ].filter(Boolean)
    })

    const groupClasses = computed(() => {
      return [
        'vsm-group',
        resolveClass('group', sidebar.classes, props.item.classes)
      ].filter(Boolean)
    })

    const tooltipClasses = computed(() => {
      return resolveClass('tooltip', sidebar.classes, props.item.classes)
    })

    // =========================================================================
    // CHILDREN
    // =========================================================================

    const visibleChildren = computed(() => {
      if (!props.item.children) return []

      return props.item.children.filter(child => {
        if (typeof child.visible === 'function') {
          return child.visible({ item: child })
        }
        return child.visible !== false
      })
    })

    // =========================================================================
    // HANDLERS
    // =========================================================================

    function handleClick(event) {
      baseHandleClick(event)
      emit('item-click', { event, item: props.item })
    }

    return {
      // IDs
      itemId,
      groupId,
      tooltipId,

      // State
      isHeader,
      isComponent,
      isCollapsed,
      isActive,
      isParentOfActive,
      isExpanded,
      isDisabled,
      isVisible,
      isHiddenOnCollapse,
      isExternal,
      hasChildren,
      isHovered,
      isFocused,
      showTooltip,

      // Classes
      itemClasses,
      linkClasses,
      iconClasses,
      labelClasses,
      badgeClasses,
      dropdownClasses,
      headerClasses,
      groupClasses,
      tooltipClasses,

      // Data
      visibleChildren,
      ariaAttrs,

      // Handlers
      handleClick,
      handleKeydown,
      handleMouseEnter,
      handleMouseLeave,
      handleFocus,
      handleBlur,
      toggleExpanded
    }
  }
})
</script>
