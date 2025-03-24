// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const fallbackHost = process.env.NEXT_PUBLIC_FALLBACK_HOST
    const referer = req.headers.get('referer')
    const redirectTo = referer || fallbackHost
    const res = NextResponse.redirect(`${redirectTo}/`)
    res.cookies.set('auth_token', '', {
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    })

    return res
}