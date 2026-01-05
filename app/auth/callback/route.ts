import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/profile'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth`)
  }

  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth exchange failed:', error.message)
    return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent(error.message)}`)
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  } else {
    return NextResponse.redirect(`${origin}${next}`)
  }
}
