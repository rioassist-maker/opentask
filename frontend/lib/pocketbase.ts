import PocketBase from 'pocketbase'

// Get backend URL
function getPbUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
  }
  return process.env.NEXT_PUBLIC_POCKETBASE_URL || window.location.origin
}

// Track if we've initialized on client-side
let _pbInstance: PocketBase | null = null
let _clientInitialized = false

/**
 * Initialize PocketBase instance
 * On client-side, creates instance that loads auth from localStorage
 */
export function initPocketBase(): PocketBase {
  const isClient = typeof window !== 'undefined'
  
  // If we already have a client-initialized instance, reuse it
  if (_pbInstance && _clientInitialized) {
    return _pbInstance
  }
  
  // If we have an instance but it was created on server, replace it with client instance
  if (_pbInstance && !_clientInitialized && isClient) {
    _pbInstance = new PocketBase(getPbUrl())
    _clientInitialized = true
    return _pbInstance
  }
  
  // Create new instance
  _pbInstance = new PocketBase(getPbUrl())
  
  // Mark as client-initialized only if we're actually on client
  if (isClient) {
    _clientInitialized = true
  }
  
  // PocketBase automatically loads auth from localStorage when instantiated in browser
  
  return _pbInstance
}

/**
 * Get PocketBase instance (creates if not exists)
 */
export function getPocketBase(): PocketBase {
  if (!_pbInstance) {
    return initPocketBase()
  }
  
  // If we're on client but instance was created on server, reinitialize
  if (typeof window !== 'undefined' && !_clientInitialized) {
    return initPocketBase()
  }
  
  return _pbInstance
}

// Export singleton instance via Proxy
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
