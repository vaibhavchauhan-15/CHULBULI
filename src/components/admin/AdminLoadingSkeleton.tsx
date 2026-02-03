interface AdminLoadingSkeletonProps {
  type?: 'stats' | 'table' | 'card' | 'list'
  count?: number
}

export default function AdminLoadingSkeleton({ 
  type = 'card',
  count = 4
}: AdminLoadingSkeletonProps) {
  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 mb-6 md:mb-8">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg border-2 border-softgold/20 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-3 md:h-4 bg-sand/40 rounded w-24 mb-3"></div>
                <div className="h-6 md:h-8 bg-sand/40 rounded w-32"></div>
              </div>
              <div className="w-11 h-11 md:w-12 md:h-12 bg-sand/40 rounded-xl md:rounded-2xl"></div>
            </div>
            <div className="border-t-2 border-softgold/20 pt-3 md:pt-4">
              <div className="h-3 bg-sand/40 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-16 md:h-20 bg-sand/30 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-14 bg-sand/30 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    )
  }

  // Default card skeleton
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-7 shadow-xl border-2 border-softgold/20 animate-pulse">
      <div className="mb-6">
        <div className="h-5 md:h-6 bg-sand/40 rounded w-48 mb-2"></div>
        <div className="h-3 md:h-4 bg-sand/40 rounded w-32"></div>
      </div>
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-12 md:h-14 bg-sand/30 rounded-xl"></div>
        ))}
      </div>
    </div>
  )
}
