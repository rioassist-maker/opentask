import PocketBase from 'pocketbase'

// URL del backend: si está definida la env la usamos (dev local); si no, misma origen (producción).
function getPbUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://localhost:8090'
  }
  return process.env.NEXT_PUBLIC_POCKETBASE_URL || window.location.origin
}

// Instancia creada en el primer uso (así en el navegador se usa la URL correcta, no la del build).
let _pb: PocketBase | null = null
function getPb(): PocketBase {
  if (!_pb) _pb = new PocketBase(getPbUrl())
  return _pb
}

// Proxy para que `pb.collection()`, `pb.authStore`, etc. sigan funcionando igual.
export const pb = new Proxy({} as PocketBase, {
  get(_, prop) {
    return (getPb() as unknown as Record<string | symbol, unknown>)[prop]
  },
  set(_, prop, value) {
    ;(getPb() as unknown as Record<string | symbol, unknown>)[prop] = value
    return true
  },
})
