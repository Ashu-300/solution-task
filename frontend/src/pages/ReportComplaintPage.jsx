import { useState } from 'react'
import { createComplaint } from '../services/api'

export default function ReportComplaintPage() {
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

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
    setMessage('')
    setError('')

    if (!image) {
      setError('Image is required')
      return
    }

    setLoading(true)
    try {
      await createComplaint({ image, description, latitude, longitude })
      setMessage('Complaint reported successfully')
      setDescription('')
      setImage(null)
    } catch (err) {
      setError(err.message || 'Failed to report complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#16324f] p-6 shadow-xl">
      <h1 className="text-3xl font-black text-[#f7f4ea]">Report Garbage</h1>
      <p className="mt-1 text-sm text-slate-300">Upload image, add details, and location.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full rounded-xl border border-white/20 bg-black/20 p-2 text-sm text-white"
          required
        />

        <textarea
          required
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-28 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            type="number"
            required
            step="any"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
          />
          <input
            type="number"
            required
            step="any"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-white outline-none focus:border-[#f25f5c]"
          />
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20"
        >
          Use Current Location
        </button>

        {message && <p className="text-emerald-300">{message}</p>}
        {error && <p className="text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#f25f5c] px-4 py-2 font-bold text-black transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </section>
  )
}
