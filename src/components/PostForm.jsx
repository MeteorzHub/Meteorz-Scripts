import { useState } from 'react'
import { supabase } from '../App.jsx'

export default function PostForm({ user }) {
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handlePost = async () => {
    const { data, error } = await supabase.from('scripts').insert([
      { title, code, user_id: user.id }
    ])
    if (error) setMessage(error.message)
    else {
      setMessage('Script posted!')
      setTitle('')
      setCode('')
    }
  }

  return (
    <div className="mb-4">
      <input className="p-2 m-1 text-black rounded w-full" placeholder="Script title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea className="p-2 m-1 text-black rounded w-full" placeholder="Script code" value={code} onChange={e => setCode(e.target.value)} />
      <button className="bg-purple-600 p-2 m-1 rounded" onClick={handlePost}>Post Script</button>
      <p>{message}</p>
    </div>
  )
}
