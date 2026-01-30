export default function CartLoading() {
  return (
    <div className="min-h-screen bg-champagne py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 h-10 w-48 bg-pearl rounded-lg animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-pearl rounded-2xl p-6 border border-softgold/30 animate-pulse">
                <div className="flex gap-6">
                  <div className="w-24 h-24 bg-sand rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-3/4 bg-sand rounded"></div>
                    <div className="h-5 w-1/4 bg-sand rounded"></div>
                    <div className="h-8 w-32 bg-sand rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-pearl rounded-2xl p-6 border border-softgold/30 sticky top-4 animate-pulse">
              <div className="h-7 w-32 bg-sand rounded mb-6"></div>
              <div className="space-y-4 mb-6">
                <div className="h-5 bg-sand rounded"></div>
                <div className="h-5 bg-sand rounded"></div>
              </div>
              <div className="h-12 bg-sand rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
