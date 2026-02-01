import { describe, it, expect } from 'vitest'
import { defaultClasses, resolveClass, mergeClasses, getLinkClasses } from '../src/styles/classes.js'

describe('Classes Utilities', () => {
  describe('defaultClasses', () => {
    it('has all required class keys', () => {
      const requiredKeys = [
        'root', 'rootExpanded', 'rootCollapsed',
        'link', 'linkActive', 'linkHover', 'linkDisabled',
        'icon', 'label', 'badge', 'dropdown',
        'header', 'footer', 'overlay', 'drawer', 'tooltip'
      ]

      requiredKeys.forEach(key => {
        expect(defaultClasses).toHaveProperty(key)
        expect(typeof defaultClasses[key]).toBe('string')
      })
    })

    it('default classes are non-empty strings', () => {
      expect(defaultClasses.root.length).toBeGreaterThan(0)
      expect(defaultClasses.link.length).toBeGreaterThan(0)
    })
  })

  describe('resolveClass', () => {
    it('returns default when no overrides', () => {
      const result = resolveClass('link', {}, {})
      expect(result).toBe(defaultClasses.link)
    })

    it('returns global override when provided', () => {
      const globalClasses = { link: 'custom-link-class' }
      const result = resolveClass('link', globalClasses, {})
      expect(result).toBe('custom-link-class')
    })

    it('returns item override when provided (highest priority)', () => {
      const globalClasses = { link: 'global-link' }
      const itemClasses = { link: 'item-link' }
      const result = resolveClass('link', globalClasses, itemClasses)
      expect(result).toBe('item-link')
    })

    it('handles missing keys gracefully', () => {
      const result = resolveClass('nonexistent', {}, {})
      expect(result).toBe('')
    })
  })

  describe('mergeClasses', () => {
    it('merges multiple class strings', () => {
      const result = mergeClasses('class-a', 'class-b', 'class-c')
      expect(result).toContain('class-a')
      expect(result).toContain('class-b')
      expect(result).toContain('class-c')
    })

    it('handles undefined values', () => {
      const result = mergeClasses('class-a', undefined, 'class-b')
      expect(result).toContain('class-a')
      expect(result).toContain('class-b')
      expect(result).not.toContain('undefined')
    })

    it('handles empty strings', () => {
      const result = mergeClasses('class-a', '', 'class-b')
      expect(result).toBe('class-a class-b')
    })

    it('deduplicates classes', () => {
      const result = mergeClasses('class-a class-b', 'class-a class-c')
      const classes = result.split(' ')
      const uniqueClasses = [...new Set(classes)]
      expect(classes.length).toBe(uniqueClasses.length)
    })
  })

  describe('getLinkClasses', () => {
    it('returns base link class when no state', () => {
      const result = getLinkClasses({
        isActive: false,
        isHover: false,
        isFocus: false,
        isDisabled: false,
        isOpen: false,
        isGroupActive: false,
        level: 1
      })

      expect(result).toContain(defaultClasses.link)
    })

    it('includes active class when active', () => {
      const result = getLinkClasses({
        isActive: true,
        isHover: false,
        isFocus: false,
        isDisabled: false,
        isOpen: false,
        isGroupActive: false,
        level: 1
      })

      expect(result).toContain(defaultClasses.linkActive)
    })

    it('includes disabled class when disabled', () => {
      const result = getLinkClasses({
        isActive: false,
        isHover: false,
        isFocus: false,
        isDisabled: true,
        isOpen: false,
        isGroupActive: false,
        level: 1
      })

      expect(result).toContain(defaultClasses.linkDisabled)
    })

    it('combines multiple state classes', () => {
      const result = getLinkClasses({
        isActive: true,
        isHover: true,
        isFocus: false,
        isDisabled: false,
        isOpen: true,
        isGroupActive: false,
        level: 1
      })

      expect(result).toContain(defaultClasses.linkActive)
      expect(result).toContain(defaultClasses.linkHover)
      expect(result).toContain(defaultClasses.linkOpen)
    })
  })
})
