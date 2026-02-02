export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-champagne">
      {/* Sidebar Placeholder - Hidden on mobile */}
      <div className="hidden md:block w-64 bg-warmbrown"></div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-4 md:p-8 pb-safe">
        <div className="h-8 md:h-10 bg-sand rounded w-1/2 md:w-1/3 animate-pulse mb-6 md:mb-8"></div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-pearl rounded-xl md:rounded-2xl shadow-luxury p-4 md:p-6">
              <div className="h-4 md:h-5 bg-sand rounded w-1/2 animate-pulse mb-2 md:mb-3"></div>
              <div className="h-8 md:h-10 bg-sand rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-pearl rounded-xl md:rounded-2xl shadow-luxury p-4 md:p-6">
          <div className="h-5 md:h-6 bg-sand rounded w-1/3 md:w-1/4 animate-pulse mb-4 md:mb-6"></div>
          <div className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 md:h-16 bg-sand rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
