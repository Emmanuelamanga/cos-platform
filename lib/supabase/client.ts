// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Export this function as createClient to match the import in case-stats.tsx
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Using the new cookie API (preferred)
        getAll() {
          return Object.fromEntries(
            document.cookie.split(';').map(cookie => {
              const [key, ...value] = cookie.trim().split('=')
              return [key, value.join('=')]
            })
          )
        },
        setAll(cookieStrings) {
          cookieStrings.forEach(cookieString => {
            document.cookie = cookieString
          })
        },
        
        // Including the old cookie API methods for completeness
        get(name) {
          const cookies = document.cookie.split(';')
          const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
          
          if (!cookie) return undefined
          
          const value = cookie.split('=')[1]
          return decodeURIComponent(value)
        },
        set(name, value, options) {
          let cookie = `${name}=${encodeURIComponent(value)}`
          
          if (options) {
            if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`
            if (options.expires) cookie += `; Expires=${options.expires.toUTCString()}`
            if (options.path) cookie += `; Path=${options.path}`
            if (options.domain) cookie += `; Domain=${options.domain}`
            if (options.secure) cookie += `; Secure`
            if (options.sameSite) cookie += `; SameSite=${options.sameSite}`
          }
          
          document.cookie = cookie
        },
        remove(name, options) {
          const cookieOptions = {
            ...options,
            maxAge: 0
          }
          this.set(name, '', cookieOptions)
        }
      }
    }
  )
}

// Keep the original function for backward compatibility
export function getSupabaseClient() {
  return createClient()
}