import { useEffect, useState } from 'react'
import StatusBadge from '../components/StatusBadge'
import { deleteComplaint, getAdminComplaints, updateComplaintStatus } from '../services/api'

export default function AdminDashboardPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const loadComplaints = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getAdminComplaints()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load admin complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  const markCleaned = async (id) => {
    setUpdatingId(id)
    try {
      await updateComplaintStatus(id, 'cleaned')
      await deleteComplaint(id)
      await loadComplaints()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#f7f4ea]">Admin Complaint Queue</h1>
        <button
          type="button"
          onClick={loadComplaints}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-300">Loading complaints...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#16324f]">
        <table className="min-w-full text-left text-sm text-slate-100">
          <thead className="bg-black/20 text-xs uppercase tracking-widest text-slate-300">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10 align-top">
                <td className="px-4 py-3">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.description} className="h-16 w-20 rounded object-cover" />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3">{item.latitude}, {item.longitude}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={item.status === 'cleaned' || updatingId === item.id}
                    onClick={() => markCleaned(item.id)}
                    className="rounded-lg bg-[#f25f5c] px-3 py-2 font-semibold text-black disabled:opacity-40"
                  >
                    {updatingId === item.id ? 'Updating...' : 'Mark Cleaned'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
