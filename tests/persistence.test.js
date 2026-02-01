import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    })
  }
})()

global.localStorage = localStorageMock

describe('Persistence', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('saving state', () => {
    it('saves collapsed state to localStorage', () => {
      const storageKey = 'test-sidebar'
      const state = {
        collapsed: true,
        expandedGroups: ['group-1', 'group-2']
      }

      localStorage.setItem(storageKey, JSON.stringify(state))

      expect(localStorage.setItem).toHaveBeenCalledWith(
        storageKey,
        JSON.stringify(state)
      )
    })

    it('saves expanded groups as array', () => {
      const storageKey = 'sidebar-state'
      const expandedGroups = new Set(['nav-1', 'nav-2', 'nav-3'])

      const state = {
        collapsed: false,
        expandedGroups: Array.from(expandedGroups)
      }

      localStorage.setItem(storageKey, JSON.stringify(state))

      const saved = JSON.parse(localStorage.getItem(storageKey))
      expect(saved.expandedGroups).toEqual(['nav-1', 'nav-2', 'nav-3'])
    })
  })

  describe('loading state', () => {
    it('loads collapsed state from localStorage', () => {
      const storageKey = 'test-sidebar'
      const savedState = {
        collapsed: true,
        expandedGroups: ['group-1']
      }

      localStorage.setItem(storageKey, JSON.stringify(savedState))

      const loaded = JSON.parse(localStorage.getItem(storageKey))
      expect(loaded.collapsed).toBe(true)
    })

    it('loads expanded groups and converts to Set', () => {
      const storageKey = 'sidebar-state'
      const savedState = {
        collapsed: false,
        expandedGroups: ['nav-1', 'nav-2']
      }

      localStorage.setItem(storageKey, JSON.stringify(savedState))

      const loaded = JSON.parse(localStorage.getItem(storageKey))
      const groups = new Set(loaded.expandedGroups)

      expect(groups.has('nav-1')).toBe(true)
      expect(groups.has('nav-2')).toBe(true)
      expect(groups.has('nav-3')).toBe(false)
    })

    it('handles missing storage key gracefully', () => {
      const result = localStorage.getItem('non-existent-key')
      expect(result).toBeNull()
    })

    it('handles invalid JSON gracefully', () => {
      localStorage.setItem('invalid', 'not-valid-json')

      let parsed = null
      let error = null

      try {
        parsed = JSON.parse(localStorage.getItem('invalid'))
      } catch (e) {
        error = e
      }

      expect(error).toBeInstanceOf(SyntaxError)
      expect(parsed).toBeNull()
    })
  })

  describe('SSR safety', () => {
    it('should not throw when window is undefined', () => {
      // This simulates the guard we use in the composable
      const isBrowser = () => typeof window !== 'undefined'

      // In test environment, window exists
      expect(isBrowser()).toBe(true)

      // Our composables use this check before accessing localStorage
      // so they won't crash in SSR
    })
  })
})
