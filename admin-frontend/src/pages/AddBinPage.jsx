import { useState } from 'react'
import { addBin } from '../services/api'

export default function AddBinPage() {
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [type, setType] = useState('blue')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device')
      return
    }

    setError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(String(position.coords.latitude))
        setLongitude(String(position.coords.longitude))
      },
      () => {
        setError('Unable to fetch location. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const lat = Number(latitude)
    const lng = Number(longitude)

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('Latitude and longitude must be valid numbers')
      setLoading(false)
      return
    }

    try {
      await addBin({ latitude: lat, longitude: lng, type })
      setMessage('Bin location added successfully')
      setLatitude('')
      setLongitude('')
    } catch (err) {
      setError(err.message || 'Failed to add bin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-white/10 bg-slate-800/80 p-6 shadow-2xl">
      <h2 className="text-3xl font-black text-cyan-300">Add Bin Location</h2>
      <p className="mt-1 text-sm text-slate-300">Enter coordinates to place a new garbage bin.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="number"
            step="any"
            required
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
          <input
            type="number"
            step="any"
            required
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="type" className="text-sm text-slate-300">Bin Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-cyan-400"
          >
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
          </select>
        </div>

        {message && <p className="text-emerald-300">{message}</p>}
        {error && <p className="text-rose-300">{error}</p>}

        <button
          type="button"
          onClick={getCurrentLocation}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          Use Current Location
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-400 px-4 py-2 font-bold text-slate-900 transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Adding...' : 'Add Bin'}
        </button>
      </form>
    </section>
  )
}
