import { useEffect, useState } from 'react'
import { deleteComplaint, getAdminComplaints, updateComplaintStatus } from '../services/api'

function statusClass(status) {
  return status === 'cleaned' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-200'
}

export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminComplaints()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const markCleaned = async (id) => {
    setUpdating(id)
    try {
      await updateComplaintStatus(id, 'cleaned')
      await deleteComplaint(id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    } finally {
      setUpdating('')
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-cyan-300">Complaint Management</h2>
        <button onClick={loadData} type="button" className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20">
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-300">Loading complaints...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/70">
            {item.image_url && <img src={item.image_url} alt={item.description} className="h-52 w-full object-cover" />}
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white">{item.description}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${statusClass(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <p className="text-sm text-slate-300">Lat: {item.latitude} | Lng: {item.longitude}</p>
              <p className="text-xs text-slate-400">Waste: {item.waste_type || 'N/A'} | Suggestion: {item.ai_suggestion || 'N/A'}</p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`, '_blank')}
                  className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white"
                >
                  Navigate
                </button>

                <button
                  type="button"
                  disabled={item.status === 'cleaned' || updating === item.id}
                  onClick={() => markCleaned(item.id)}
                  className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-900 disabled:opacity-40"
                >
                  {updating === item.id ? 'Updating...' : 'Mark Cleaned'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
