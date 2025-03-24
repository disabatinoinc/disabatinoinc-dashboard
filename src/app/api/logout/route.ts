// src/app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const baseUrl = req.nextUrl.origin
    const res = NextResponse.redirect(`${baseUrl}/`)
    res.cookies.set('auth_token', '', { maxAge: 0 })
    return res
}