export default function CartLoading() {
  return (
    <div className="min-h-screen bg-champagne py-6 md:py-12 pb-safe">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 md:mb-8 h-8 md:h-10 w-32 md:w-48 bg-pearl rounded-lg animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-pearl rounded-xl md:rounded-2xl p-4 md:p-6 border border-softgold/30 animate-pulse">
                <div className="flex gap-4 md:gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-sand rounded-xl shrink-0"></div>
                  <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                    <div className="h-5 md:h-6 w-3/4 bg-sand rounded"></div>
                    <div className="h-4 md:h-5 w-1/4 bg-sand rounded"></div>
                    <div className="h-8 md:h-8 w-24 md:w-32 bg-sand rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-pearl rounded-xl md:rounded-2xl p-4 md:p-6 border border-softgold/30 sticky top-4 animate-pulse">
              <div className="h-6 md:h-7 w-28 md:w-32 bg-sand rounded mb-4 md:mb-6"></div>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="h-4 md:h-5 bg-sand rounded"></div>
                <div className="h-4 md:h-5 bg-sand rounded"></div>
              </div>
              <div className="h-11 md:h-12 bg-sand rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
