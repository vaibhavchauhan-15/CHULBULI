interface Filter {
  id: string
  label: string
}

interface AdminFilterChipsProps {
  filters: Filter[]
  activeFilter: string
  onFilterChange: (id: string) => void
}

export default function AdminFilterChips({ 
  filters, 
  activeFilter, 
  onFilterChange 
}: AdminFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-sm p-1.5 md:p-2 rounded-2xl shadow-lg border-2 border-softgold/30">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-4 md:px-5 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm
            transition-all duration-300 touch-target active:scale-95
            ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-rosegold to-softgold text-white shadow-lg scale-105'
                : 'bg-transparent text-taupe hover:bg-sand/40 hover:text-warmbrown'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
