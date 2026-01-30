export default function AdminLoading() {
  return (
    <div className="flex min-h-screen bg-champagne">
      {/* Sidebar Placeholder */}
      <div className="w-64 bg-warmbrown"></div>

      {/* Main Content Skeleton */}
      <div className="flex-1 p-8">
        <div className="h-10 bg-sand rounded w-1/3 animate-pulse mb-8"></div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-pearl rounded-2xl shadow-luxury p-6">
              <div className="h-5 bg-sand rounded w-1/2 animate-pulse mb-3"></div>
              <div className="h-10 bg-sand rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-pearl rounded-2xl shadow-luxury p-6">
          <div className="h-6 bg-sand rounded w-1/4 animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-sand rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
