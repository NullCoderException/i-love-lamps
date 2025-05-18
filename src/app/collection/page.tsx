import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CollectionPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Flashlight Collection</h1>
      <p>Welcome, {user.email}!</p>
      <p className="mt-4">Your collection will appear here once we build the CRUD functionality.</p>
    </div>
  )
}