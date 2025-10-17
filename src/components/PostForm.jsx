import { useState } from 'react'
import { supabase } from '../App.jsx'

export default function PostForm({ user }) {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handlePost = async () => {
    if (!title || !code) return setMessage('Fill both fields!')
    const { error } = await supabase.from('scripts').insert([{ title, code, user_id: user.id }])
    if (error) setMessage(error.message)
    else {
      setMessage('✅ Script posted!')
      setTitle('')
      setCode('')
    }
  }

  return (
    <div className="mb-6">
      <input placeholder="Script title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Script code" value={code} onChange={e => setCode(e.target.value)} />
      <button className="bg-white text-black m-1" onClick={handlePost}>Post Script</button>
      <p>{message}</p>
    </div>
  )
}
