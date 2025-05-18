import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to I Love Lamps</h1>
        <p className="text-xl mb-8">Track and manage your flashlight collection</p>
        {user ? (
          <Link href="/collection" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View My Collection
          </Link>
        ) : (
          <div className="space-x-4">
            <Link href="/auth/signin" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Sign In
            </Link>
            <Link href="/auth/signup" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}