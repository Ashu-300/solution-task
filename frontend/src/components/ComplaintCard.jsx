import StatusBadge from './StatusBadge'

export default function ComplaintCard({ complaint }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#16324f] shadow-lg shadow-black/20">
      {complaint.image_url && (
        <img
          src={complaint.image_url}
          alt={complaint.description}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-bold text-[#f7f4ea]">{complaint.description || 'Reported garbage'}</h3>
          <StatusBadge status={complaint.status} />
        </div>

        <p className="text-sm text-slate-300">
          Lat: {complaint.latitude} | Lng: {complaint.longitude}
        </p>

        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full bg-black/25 px-2 py-1">Waste: {complaint.waste_type || 'N/A'}</span>
          <span className="rounded-full bg-black/25 px-2 py-1">By: {complaint.cleaned_by || '-'}</span>
        </div>
      </div>
    </article>
  )
}
