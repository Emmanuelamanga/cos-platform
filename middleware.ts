// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize the Supabase client with special handling for base64 cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          try {
            const cookieValue = request.cookies.get(name)?.value;
            
            // Special handling for base64-prefixed cookies
            if (cookieValue && cookieValue.startsWith('base64-')) {
              // For base64 cookies, we just return the raw value without parsing
              // Supabase will handle the decoding internally
              return cookieValue;
            }
            
            return cookieValue;
          } catch (error) {
            console.error(`Error getting cookie: ${name}`, error);
            return undefined;
          }
        },
        set(name, value, options) {
          try {
            // Set the cookie on the request
            request.cookies.set({
              name,
              value,
              ...options,
            });
            
            // Set the cookie on the response
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            
            response.cookies.set({
              name,
              value,
              ...options,
            });
          } catch (error) {
            console.error(`Error setting cookie: ${name}`, error);
          }
        },
        remove(name, options) {
          try {
            // Remove the cookie by setting maxAge to 0
            request.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
            
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          } catch (error) {
            console.error(`Error removing cookie: ${name}`, error);
          }
        },
      },
    }
  )

  // Rest of your middleware code...
  // Get the pathname from the request
  const { pathname } = request.nextUrl

  try {
    // Refresh the session (using try/catch to handle potential errors)
    const { data: { session } } = await supabase.auth.getSession()

    // Public routes that don't require authentication
    const publicRoutes = ['/sign-in', '/sign-up', '/reset-password', '/', '/about', '/contact']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/public/'))

    // Handle unauthenticated users
    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // If the user is authenticated, check role-based access
    if (session) {
      // Get user profile including role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error);
        return response; // Continue without blocking if profile fetch fails
      }

      const userRole = profile?.role || 'user'

      // Admin-only routes
      const adminRoutes = ['/admin', '/dashboard']
      const isAdminRoute = adminRoutes.some(route => 
        pathname === route || pathname.startsWith(`${route}/`)
      )

      // Redirect non-admin users trying to access admin routes
      if (isAdminRoute && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // If a user is already logged in and tries to access login/signup pages
      if (session && (pathname === '/sign-in' || pathname === '/sign-up')) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'admin') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    }
  } catch (error) {
    console.error("Auth error in middleware:", error);
    // Don't block the request if auth checking fails
    // This prevents auth issues from breaking the site completely
  }

  return response
}

// Match all routes except for static assets, API routes, etc.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}