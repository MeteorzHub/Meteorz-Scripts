import { useEffect, useState } from 'react'
import { supabase } from '../App.jsx'

export default function ScriptList() {
  const [scripts, setScripts] = useState([])
  const [search, setSearch] = useState('')

  const fetchScripts = async () => {
    let query = supabase.from('scripts').select('*').order('created_at', { ascending: false })
    if (search) query = query.ilike('title', `%${search}%`)
    const { data, error } = await query
    if (error) console.error(error)
    else setScripts(data)
  }

  useEffect(() => { fetchScripts() }, [search])

  return (
    <div>
      <input className="p-2 m-1 text-black rounded w-full" placeholder="Search scripts..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="mt-4 space-y-4">
        {scripts.map(s => (
          <div key={s.id} className="bg-gray-800 p-4 rounded">
            <h2 className="font-bold">{s.title}</h2>
            <pre className="bg-black p-2 rounded">{s.code}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
