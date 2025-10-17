import { useEffect, useState } from 'react'
import { supabase } from '../App.jsx'

export default function ScriptList() {
  const [scripts, setScripts] = useState([])
  const [search, setSearch] = useState('')

  const fetchScripts = async () => {
    let query = supabase.from('scripts').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('title', `%${search}%`)
    const { data } = await query
    if (data) setScripts(data)
  }

  useEffect(() => { fetchScripts() }, [search])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard! 📋')
  }

  return (
    <div>
      <input placeholder="Search scripts..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="mt-4 space-y-4">
        {scripts.map(s => (
          <div key={s.id} className="card">
            <h2 className="font-bold text-xl">{s.title}</h2>
            <pre className="p-2 bg-black rounded whitespace-pre-wrap">{s.code}</pre>
            <button className="copy-btn" onClick={() => copyToClipboard(s.code)}>Copy Script 📋</button>
          </div>
        ))}
      </div>
    </div>
  )
}
