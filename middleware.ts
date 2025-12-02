import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/billing',
  '/profile',
  '/config',
  '/transactions',
  '/promo',
  '/faq',
];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login'];

// Public routes (no auth check)
const publicRoutes = ['/', '/terms'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    // Store the intended destination for redirect after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth route with valid token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add security headers to response
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

