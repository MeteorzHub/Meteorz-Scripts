import { useState } from 'react'
import { supabase } from '../App.jsx'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Logged in!')
  }

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else setMessage('Check your email to confirm signup!')
  }

  return (
    <div className="mb-4">
      <input className="p-2 text-black rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="p-2 text-black rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <div>
        <button className="bg-blue-600 p-2 m-1 rounded" onClick={handleLogin}>Login</button>
        <button className="bg-green-600 p-2 m-1 rounded" onClick={handleSignup}>Sign Up</button>
      </div>
      <p>{message}</p>
    </div>
  )
}
