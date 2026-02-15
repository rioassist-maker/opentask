import PocketBase from 'pocketbase'

// Get backend URL
function getPbUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
  }
  return process.env.NEXT_PUBLIC_POCKETBASE_URL || window.location.origin
}

// Singleton instance
let _pbInstance: PocketBase | null = null

/**
 * Initialize PocketBase (call this before using pb)
 * On client-side, this loads auth from localStorage
 */
export function initPocketBase(): PocketBase {
  if (_pbInstance) return _pbInstance
  
  _pbInstance = new PocketBase(getPbUrl())
  
  // PocketBase automatically loads auth from localStorage when instantiated in browser
  // The default storage key is 'pocketbase_auth'
  
  return _pbInstance
}

// Initialize immediately if in browser context
// This ensures auth is loaded from localStorage as soon as possible
if (typeof window !== 'undefined') {
  initPocketBase()
}

/**
 * Get PocketBase instance
 * Initializes on first call if not already initialized
 */
export function getPocketBase(): PocketBase {
  return _pbInstance || initPocketBase()
}

// Export default instance for convenience
// This will be initialized when first accessed or immediately in browser
export const pb = new Proxy({} as PocketBase, {
  get(_target, prop) {
    const instance = getPocketBase()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  },
  set(_target, prop, value) {
    const instance = getPocketBase()
    ;(instance as any)[prop] = value
    return true
  },
})
