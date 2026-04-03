import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes that DO NOT require authentication
const PUBLIC_ROUTES = ['/login', '/signup', '/auth', '/create-profile']

// Routes that REQUIRE authentication (prefix match)
const PROTECTED_PREFIXES = [
    '/prompts/create',
    '/profile/edit',
]

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Do NOT add logic between createServerClient and getUser().
    // Mistakes here can cause users to be randomly logged out.
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error && error.message !== 'Auth session missing!') {
        console.error('[Middleware] Supabase getUser error:', error.message)
    }

    const pathname = request.nextUrl.pathname

    // Check if this is a protected route and user is not authenticated
    const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix)
    )

    const isPublic = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
    )

    if (!user && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }

    // If already logged in and trying to visit login/signup, redirect to home
    if (user && isPublic && (pathname.startsWith('/login') || pathname.startsWith('/signup'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: Must return supabaseResponse as-is to preserve cookie state.
    return supabaseResponse
}
