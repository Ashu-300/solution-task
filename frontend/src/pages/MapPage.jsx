import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { getBins } from '../services/api'

function MapCenterUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center)
  }, [center, map])

  return null
}

export default function MapPage() {
  const [bins, setBins] = useState([])
  const [center, setCenter] = useState([23.2599, 77.4126])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const [searching, setSearching] = useState(false)

  const loadBins = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getBins()
      setBins(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Failed to load bins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBins()
  }, [])

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#f7f4ea]">Nearby Garbage Bins</h1>
        <button
          type="button"
          onClick={loadBins}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          Refresh
        </button>
      </div>

      {loading && <p className="text-slate-300">Loading map...</p>}
      {error && <p className="text-rose-300">{error}</p>}

      <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search location (e.g., Bhopal)"
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

      <div className="h-[65vh] overflow-hidden rounded-2xl border border-white/10">
        <MapContainer center={center} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <MapCenterUpdater center={center} />
          {bins.map((bin) => (
            <Marker key={bin.id} position={[bin.latitude, bin.longitude]}>
              <Popup>
                <div className="space-y-2">
                  <p>Bin Type: {bin.type}</p>
                  <p>{bin.latitude}, {bin.longitude}</p>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${bin.latitude},${bin.longitude}`,
                        '_blank',
                      )
                    }
                    className="rounded bg-slate-800 px-2 py-1 text-xs text-white"
                  >
                    Navigate
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
