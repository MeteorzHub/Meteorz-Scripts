import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- SUPABASE SETUP ---
// Replace these with your Supabase info
const supabaseUrl = 'https://xosgnvwhjhovzjwcfqlr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvc2dudndoamhvdnpqd2NmcWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzYwMzIsImV4cCI6MjA3NjIxMjAzMn0.ipi5YUc5OZmnZP1TBsYbzTTEXekXxX_3sgd0OVcb9zk'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('landing')
  const [scripts, setScripts] = useState([])
  const [search, setSearch] = useState('')

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => listener.subscription.unsubscribe()
  }, [])

  // Fetch scripts
  const fetchScripts = async () => {
    let query = supabase.from('scripts').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('title', `%${search}%`)
    const { data } = await query
    if (data) setScripts(data)
  }

  useEffect(() => { fetchScripts() }, [search, page])

  // Copy button
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard! 📋')
  }

  // --- NAVBAR ---
  const NavBar = () => (
    <nav className="p-4 flex justify-between items-center border-b border-white">
      <h1 className="font-bold text-2xl cursor-pointer" onClick={() => setPage('landing')}>Meteorz Scripts</h1>
      <div className="space-x-4">
        {!user && <button onClick={() => setPage('login')} className="bg-white text-black px-3 py-1 rounded">Login / SignUp</button>}
        {user && <>
          <button onClick={() => setPage('post')} className="bg-white text-black px-3 py-1 rounded">Post Script</button>
          <button onClick={() => setPage('profile')} className="bg-white text-black px-3 py-1 rounded">Profile</button>
          <button onClick={async () => { await supabase.auth.signOut(); setPage('landing') }} className="bg-red-600 px-3 py-1 rounded">Logout</button>
        </>}
      </div>
    </nav>
  )

  // --- LOGIN PAGE ---
  const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState('')

    const handleLogin = async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setMessage(error ? error.message : '✅ Logged in!')
      if (!error) setPage('landing')
    }

    const handleSignup = async () => {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) return setMessage(error.message)
      await supabase.from('users').insert([{ id: data.user.id, username, email }])
      setMessage('✅ Signed up! Check your email to confirm.')
    }

    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Login / Sign Up</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 mb-2 rounded text-black" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 rounded text-black" />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-2 rounded text-black" />
        <div className="flex space-x-2 mt-2">
          <button className="bg-white text-black px-3 py-1 rounded" onClick={handleLogin}>Login</button>
          <button className="bg-white text-black px-3 py-1 rounded" onClick={handleSignup}>Sign Up</button>
        </div>
        <p className="mt-2">{message}</p>
      </div>
    )
  }

  // --- SCRIPT CARD ---
  const ScriptCard = ({ s }) => (
    <div className="bg-gray-900 border-2 border-white rounded-xl shadow-lg p-4 flex flex-col hover:scale-105 transition-transform">
      {s.image_url && <img src={s.image_url} alt="Script" className="w-full max-h-40 object-cover rounded mb-2" />}
      <h2 className="font-bold text-xl">{s.title}</h2>
      {s.game && <span className="bg-white text-black px-2 py-1 rounded-full text-sm mt-1">{s.game}</span>}
      <pre className="bg-black p-2 rounded whitespace-pre-wrap mt-2 flex-1">{s.code}</pre>
      <button className="copy-btn mt-2 bg-white text-black px-2 py-1 rounded self-end" onClick={() => copyToClipboard(s.code)}>Copy 📋</button>
    </div>
  )

  // --- LANDING PAGE ---
  const LandingPage = () => (
    <div className="p-6">
      <input placeholder="Search scripts..." className="p-2 text-black w-full mb-4 rounded" value={search} onChange={e => setSearch(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scripts.map(s => <ScriptCard key={s.id} s={s} />)}
      </div>
    </div>
  )

  // --- POST SCRIPT PAGE ---
  const PostScriptPage = ({ user }) => {
    const [title, setTitle] = useState('')
    const [code, setCode] = useState('')
    const [game, setGame] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [message, setMessage] = useState('')

    const handlePost = async () => {
      if (!user) return setMessage('You must be logged in!')
      if (!title || !code) return setMessage('Title & code required!')
      const { error } = await supabase.from('scripts').insert([{ title, code, game, image_url: imageUrl, user_id: user.id }])
      if (error) setMessage(error.message)
      else { setMessage('✅ Script posted!'); setTitle(''); setCode(''); setGame(''); setImageUrl(''); fetchScripts() }
    }

    return (
      <div className="p-6 max-w-md mx-auto flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Post a Script</h2>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 mb-2 rounded text-black"/>
        <textarea placeholder="Code" value={code} onChange={e => setCode(e.target.value)} className="w-full p-2 mb-2 rounded text-black"/>
        <input placeholder="Game (optional)" value={game} onChange={e => setGame(e.target.value)} className="w-full p-2 mb-2 rounded text-black"/>
        <input placeholder="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full p-2 mb-2 rounded text-black"/>
        <button className="bg-white text-black px-3 py-1 rounded mt-2" onClick={handlePost}>Post Script</button>
        <p className="mt-2">{message}</p>
      </div>
    )
  }

  // --- PROFILE PAGE ---
  const ProfilePage = ({ user }) => {
    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState('')
    const [userScripts, setUserScripts] = useState([])

    useEffect(() => {
      if (!user) return
      const fetchProfile = async () => {
        const { data: u } = await supabase.from('users').select('*').eq('id', user.id).single()
        if (u) { setUsername(u.username); setAvatar(u.avatar_url) }
        const { data: s } = await supabase.from('scripts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        if (s) setUserScripts(s)
      }
      fetchProfile()
    }, [user])

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="text-lg">Username: {username}</p>
        {avatar && <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full my-2" />}
        <h3 className="font-bold mt-4 text-xl">Your Scripts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {userScripts.map(s => <ScriptCard key={s.id} s={s} />)}
          {userScripts.length === 0 && <p className="mt-4">You haven't posted any scripts yet.</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      {page === 'landing' && <LandingPage />}
      {page === 'login' && <LoginPage />}
      {page === 'post' && <PostScriptPage user={user} />}
      {page === 'profile' && <ProfilePage user={user} />}
    </div>
  )
}
