import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { deleteComplaint, getAdminComplaints, setBinLocation, updateComplaintStatus } from '../services/api'

function MapCenterUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

export default function AdminMapPage() {
  const [complaints, setComplaints] = useState([])
  const [center, setCenter] = useState([23.2599, 77.4126])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)
  const [binType, setBinType] = useState('blue')

  const loadComplaints = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminComplaints()
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

  const markCleaned = async (id) => {
    try {
      await updateComplaintStatus(id, 'cleaned')
      await deleteComplaint(id)
      await loadComplaints()
    } catch (err) {
      setError(err.message || 'Failed to update complaint')
    }
  }

  const openNavigate = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  const addBinHere = async (lat, lng) => {
    try {
      await setBinLocation({ latitude: lat, longitude: lng, type: binType })
    } catch (err) {
      setError(err.message || 'Failed to set bin location')
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    setSearchError('')
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}`,
      )
      const data = await response.json()
      if (!Array.isArray(data) || data.length === 0) {
        setSearchError('No matching location found')
      } else {
        const result = data[0]
        setCenter([Number(result.lat), Number(result.lon)])
      }
    } catch {
      setSearchError('Failed to search location')
    } finally {
      setSearching(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-[#f7f4ea]">Admin Field Map</h1>

        <div className="flex items-center gap-2 rounded-xl bg-white/10 p-2">
          <label className="text-sm text-slate-200" htmlFor="binType">Bin Type</label>
          <select
            id="binType"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            className="rounded bg-black/30 px-2 py-1 text-sm text-white"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-slate-300">Loading map data...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search location"
          className="min-w-[220px] flex-1 rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 disabled:opacity-60"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {searchError && <p className="text-rose-300">{searchError}</p>}

      <div className="h-[70vh] overflow-hidden rounded-2xl border border-white/10">
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <MapCenterUpdater center={center} />
          {complaints.map((item) => (
            <Marker key={item.id} position={[item.latitude, item.longitude]}>
              <Popup>
                <div className="space-y-2">
                  <p className="font-semibold">{item.description}</p>
                  <p>Status: {item.status}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openNavigate(item.latitude, item.longitude)}
                      className="rounded bg-slate-800 px-2 py-1 text-xs text-white"
                    >
                      Navigate
                    </button>
                    <button
                      type="button"
                      onClick={() => markCleaned(item.id)}
                      className="rounded bg-emerald-700 px-2 py-1 text-xs text-white"
                    >
                      Mark Cleaned
                    </button>
                    <button
                      type="button"
                      onClick={() => addBinHere(item.latitude, item.longitude)}
                      className="rounded bg-blue-700 px-2 py-1 text-xs text-white"
                    >
                      Set Bin
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
