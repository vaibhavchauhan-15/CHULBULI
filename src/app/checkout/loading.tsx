export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-champagne py-6 md:py-12 pb-safe">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 md:mb-8 h-8 md:h-10 w-40 md:w-56 bg-pearl rounded-lg animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Form Skeleton */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-pearl rounded-xl md:rounded-2xl p-6 md:p-8 border border-softgold/30 animate-pulse">
              <div className="h-6 md:h-7 w-36 md:w-48 bg-sand rounded mb-4 md:mb-6"></div>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-11 md:h-12 bg-sand rounded-xl"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-pearl rounded-xl md:rounded-2xl p-6 md:p-8 border border-softgold/30 animate-pulse">
              <div className="h-6 md:h-7 w-36 md:w-48 bg-sand rounded mb-4 md:mb-6"></div>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 md:h-12 bg-sand rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-pearl rounded-xl md:rounded-2xl p-4 md:p-6 border border-softgold/30 sticky top-4 animate-pulse">
              <div className="h-6 md:h-7 w-32 md:w-40 bg-sand rounded mb-4 md:mb-6"></div>
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 md:gap-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-sand rounded-lg shrink-0"></div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="h-3 md:h-4 bg-sand rounded"></div>
                      <div className="h-3 md:h-4 w-1/2 bg-sand rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-12 md:h-14 bg-sand rounded-full mt-4 md:mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
