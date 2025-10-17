import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import LoginForm from './components/LoginForm.jsx'
import PostForm from './components/PostForm.jsx'
import ScriptList from './components/ScriptList.jsx'

// REPLACE with your Supabase project URL & anon key
const supabaseUrl = 'https://xosgnvwhjhovzjwcfqlr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2dudndoamhvdnpqd2NmcWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzYwMzIsImV4cCI6MjA3NjIxMjAzMn0.ipi5YUc5OZmnZP1TBsYbzTTEXekXxX_3sgd0OVcb9zk'
export const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(r => setUser(r.data.session?.user || null))
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-4">ScriptHub 💻</h1>
      {!user && <LoginForm />}
      {user && (
        <>
          <p className="mb-2">Logged in as: {user.email}</p>
          <PostForm user={user} />
        </>
      )}
      <ScriptList />
    </div>
  )
}
