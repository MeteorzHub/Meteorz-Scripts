import { useState } from 'react'
import { supabase } from '../App.jsx'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setMessage(error ? error.message : '✅ Logged in!')
  }

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    setMessage(error ? error.message : '✅ Check your email to confirm signup!')
  }

  return (
    <div className="mb-6">
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <div>
        <button className="bg-white text-black m-1" onClick={handleLogin}>Login</button>
        <button className="bg-white text-black m-1" onClick={handleSignup}>Sign Up</button>
      </div>
      <p>{message}</p>
    </div>
  )
}
