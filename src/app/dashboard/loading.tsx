export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-champagne">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 pb-safe">
        <div className="space-y-6 md:space-y-8">
          {/* Header Skeleton */}
          <div className="h-8 md:h-10 bg-sand rounded w-1/2 md:w-1/3 animate-pulse"></div>
          
          {/* Account Info Skeleton */}
          <div className="bg-pearl rounded-xl md:rounded-2xl shadow-luxury p-6 md:p-8">
            <div className="h-5 md:h-6 bg-sand rounded w-1/3 md:w-1/4 animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 md:h-5 bg-sand rounded w-2/3 md:w-1/2 animate-pulse"></div>
              <div className="h-4 md:h-5 bg-sand rounded w-1/2 md:w-1/3 animate-pulse"></div>
              <div className="h-4 md:h-5 bg-sand rounded w-1/3 md:w-1/4 animate-pulse"></div>
            </div>
          </div>

          {/* Orders Skeleton */}
          <div className="bg-pearl rounded-xl md:rounded-2xl shadow-luxury p-6 md:p-8">
            <div className="h-5 md:h-6 bg-sand rounded w-1/3 md:w-1/4 animate-pulse mb-4 md:mb-6"></div>
            <div className="space-y-3 md:space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-sand rounded-xl p-4 md:p-6">
                  <div className="h-4 md:h-5 bg-sand rounded w-3/4 md:w-1/2 animate-pulse mb-3"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    <div className="h-3 md:h-4 bg-sand rounded animate-pulse"></div>
                    <div className="h-3 md:h-4 bg-sand rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
