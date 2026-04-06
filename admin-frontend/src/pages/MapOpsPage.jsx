import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { addBin, deleteComplaint, getAdminComplaints, getBins, updateComplaintStatus } from '../services/api'

function MapCenterUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

export default function MapOpsPage() {
  const [complaints, setComplaints] = useState([])
  const [bins, setBins] = useState([])
  const [center, setCenter] = useState([23.2599, 77.4126])
  const [query, setQuery] = useState('')
  const [binType, setBinType] = useState('blue')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)

  const pendingCount = useMemo(() => complaints.filter((c) => c.status !== 'cleaned').length, [complaints])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [complaintData, binData] = await Promise.all([getAdminComplaints(), getBins()])
      setComplaints(Array.isArray(complaintData) ? complaintData : [])
      setBins(Array.isArray(binData) ? binData : [])
    } catch (err) {
      setError(err.message || 'Failed to load map data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const markCleaned = async (id) => {
    try {
      await updateComplaintStatus(id, 'cleaned')
      await deleteComplaint(id)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to mark complaint cleaned')
    }
  }

  const placeBin = async (lat, lng) => {
    try {
      await addBin({ latitude: lat, longitude: lng, type: binType })
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to place bin')
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
        <div>
          <h2 className="text-3xl font-black text-cyan-300">Map Operations</h2>
          <p className="text-sm text-slate-300">Pending complaints: {pendingCount} | Bins: {bins.length}</p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white/10 p-2">
          <label className="text-sm text-slate-300" htmlFor="type">Bin Type</label>
          <select
            id="type"
            value={binType}
            onChange={(e) => setBinType(e.target.value)}
            className="rounded bg-black/30 px-2 py-1 text-sm"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
          <button onClick={loadData} type="button" className="rounded bg-slate-700 px-2 py-1 text-sm">Refresh</button>
        </div>
      </div>

      {loading && <p className="text-slate-300">Loading map...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search location"
          className="min-w-[220px] flex-1 rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={searching}
          className="rounded bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 disabled:opacity-60"
        >
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>
      {searchError && <p className="text-rose-300">{searchError}</p>}

      <div className="h-[72vh] overflow-hidden rounded-2xl border border-white/10">
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <MapCenterUpdater center={center} />

          {complaints.map((c) => (
            <Marker key={`c-${c.id}`} position={[c.latitude, c.longitude]}>
              <Popup>
                <div className="space-y-2">
                  <p className="font-semibold">{c.description}</p>
                  <p>Status: {c.status}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`, '_blank')}
                      className="rounded bg-slate-700 px-2 py-1 text-xs text-white"
                    >
                      Navigate
                    </button>
                    <button
                      type="button"
                      onClick={() => markCleaned(c.id)}
                      className="rounded bg-cyan-500 px-2 py-1 text-xs text-slate-900"
                    >
                      Cleaned
                    </button>
                    <button
                      type="button"
                      onClick={() => placeBin(c.latitude, c.longitude)}
                      className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                    >
                      Add Bin
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {bins.map((b) => (
            <Marker key={`b-${b.id}`} position={[b.latitude, b.longitude]}>
              <Popup>
                Bin: {b.type}
                <br />
                {b.latitude}, {b.longitude}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
