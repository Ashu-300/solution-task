import { useEffect, useState } from 'react'
import ComplaintCard from '../components/ComplaintCard'
import { getComplaints } from '../services/api'

export default function UserDashboardPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadComplaints = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getComplaints()
      setComplaints(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#f7f4ea]">Your City Reports</h1>
        <button
          onClick={loadComplaints}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
          type="button"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-300">Loading complaints...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint.id} complaint={complaint} />
        ))}
      </div>

      {!loading && complaints.length === 0 && <p className="text-slate-300">No complaints found.</p>}
    </section>
  )
}
