import { describe, it, expect } from 'vitest'
import { isItemActive } from '../src/composables/useActiveState.js'

describe('Active State Detection', () => {
  describe('exact matching', () => {
    it('matches exact path', () => {
      const item = { href: '/dashboard', activeMatch: 'exact' }
      expect(isItemActive(item, '/dashboard', 'a')).toBe(true)
    })

    it('does not match partial path', () => {
      const item = { href: '/dashboard', activeMatch: 'exact' }
      expect(isItemActive(item, '/dashboard/settings', 'a')).toBe(false)
    })

    it('matches root path exactly', () => {
      const item = { href: '/', activeMatch: 'exact' }
      expect(isItemActive(item, '/', 'a')).toBe(true)
    })

    it('does not match root when on subpath', () => {
      const item = { href: '/', activeMatch: 'exact' }
      expect(isItemActive(item, '/about', 'a')).toBe(false)
    })
  })

  describe('startsWith matching', () => {
    it('matches exact path', () => {
      const item = { href: '/users', activeMatch: 'startsWith' }
      expect(isItemActive(item, '/users', 'a')).toBe(true)
    })

    it('matches child path', () => {
      const item = { href: '/users', activeMatch: 'startsWith' }
      expect(isItemActive(item, '/users/123', 'a')).toBe(true)
    })

    it('matches deeply nested path', () => {
      const item = { href: '/users', activeMatch: 'startsWith' }
      expect(isItemActive(item, '/users/123/edit/profile', 'a')).toBe(true)
    })

    it('does not match different prefix', () => {
      const item = { href: '/users', activeMatch: 'startsWith' }
      expect(isItemActive(item, '/user-settings', 'a')).toBe(false)
    })
  })

  describe('pattern matching', () => {
    it('matches regex pattern', () => {
      const item = { href: '/posts', activeMatch: { pattern: '^/posts/\\d+$' } }
      expect(isItemActive(item, '/posts/123', 'a')).toBe(true)
    })

    it('does not match non-matching pattern', () => {
      const item = { href: '/posts', activeMatch: { pattern: '^/posts/\\d+$' } }
      expect(isItemActive(item, '/posts/abc', 'a')).toBe(false)
    })

    it('handles invalid regex gracefully', () => {
      const item = { href: '/test', activeMatch: { pattern: '[invalid' } }
      expect(isItemActive(item, '/test', 'a')).toBe(false)
    })
  })

  describe('disabled and external items', () => {
    it('returns false for disabled items', () => {
      const item = { href: '/dashboard', disabled: true }
      expect(isItemActive(item, '/dashboard', 'a')).toBe(false)
    })

    it('returns false for external items', () => {
      const item = { href: 'https://example.com', external: true }
      expect(isItemActive(item, 'https://example.com', 'a')).toBe(false)
    })
  })

  describe('items without href', () => {
    it('returns false for items without href', () => {
      const item = { label: 'No Link' }
      expect(isItemActive(item, '/anywhere', 'a')).toBe(false)
    })
  })

  describe('default matching (no strategy)', () => {
    it('defaults to exact for items without children', () => {
      const item = { href: '/dashboard' }
      expect(isItemActive(item, '/dashboard', 'a')).toBe(true)
      expect(isItemActive(item, '/dashboard/sub', 'a')).toBe(false)
    })
  })
})
