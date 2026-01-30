export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-champagne">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-1">
            <div className="bg-pearl rounded-2xl shadow-luxury p-6 space-y-6">
              <div className="h-6 bg-sand rounded w-3/4 animate-pulse"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-sand rounded animate-pulse"></div>
                ))}
              </div>
              <div className="h-6 bg-sand rounded w-3/4 animate-pulse mt-6"></div>
              <div className="space-y-3">
                <div className="h-10 bg-sand rounded animate-pulse"></div>
                <div className="h-10 bg-sand rounded animate-pulse"></div>
              </div>
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-pearl rounded-2xl shadow-luxury overflow-hidden">
                  <div className="aspect-square bg-sand animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-sand rounded w-3/4 animate-pulse"></div>
                    <div className="h-8 bg-sand rounded w-1/2 animate-pulse"></div>
                    <div className="h-10 bg-sand rounded animate-pulse mt-4"></div>
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
