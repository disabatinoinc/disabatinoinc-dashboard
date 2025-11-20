// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const BASIC_USER = process.env.BASIC_AUTH_USER
const BASIC_PASS = process.env.BASIC_AUTH_PASS
const COOKIE_NAME = 'auth_token'
const COOKIE_VALUE = 'valid_session' // Optionally use JWT or hash for more security

// Public pages that should NOT require auth
const PUBLIC_PATHS = [
    '/legal/privacy',
    '/legal/eula',
    "/quickbooks/launch",
    "/quickbooks/disconnect",
    "/fullscreen/weekly-schedule",
    "/schedule/production-readiness"
]

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    console.log('🔒 middleware hit', pathname)

    // ➜ Skip auth for public routes
    if (isPublic(pathname)) return NextResponse.next()

    const cookie = req.cookies.get(COOKIE_NAME)

    // ✅ Already authenticated via cookie
    if (cookie?.value === COOKIE_VALUE) {
        return NextResponse.next()
    }

    const authHeader = req.headers.get('authorization')

    if (!authHeader) {
        return new NextResponse('Unauthorized', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Secure Area"',
            },
        })
    }

    const [scheme, encoded] = authHeader.split(' ')
    if (scheme !== 'Basic') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const decoded = Buffer.from(encoded, 'base64').toString()
    const [username, password] = decoded.split(':')

    const isValid = username === BASIC_USER && password === BASIC_PASS

    if (!isValid) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    // ✅ Set session cookie for 30 days
    const res = NextResponse.next()
    res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })

    return res
}

// Protect all routes except static assets and API
export const config = {
    matcher: ['/((?!api|_next|static|favicon.ico|.*\\..*).*)'],
}
