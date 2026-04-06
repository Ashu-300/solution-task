export default function StatusBadge({ status }) {
  const clean = status === 'cleaned'

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
        clean ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-200'
      }`}
    >
      {clean ? 'Cleaned' : 'Pending'}
    </span>
  )
}
