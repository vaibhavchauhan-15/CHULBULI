export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-champagne py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 h-10 w-56 bg-pearl rounded-lg animate-pulse"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-pearl rounded-2xl p-8 border border-softgold/30 animate-pulse">
              <div className="h-7 w-48 bg-sand rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-sand rounded-xl"></div>
                ))}
              </div>
            </div>
            
            <div className="bg-pearl rounded-2xl p-8 border border-softgold/30 animate-pulse">
              <div className="h-7 w-48 bg-sand rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-sand rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-pearl rounded-2xl p-6 border border-softgold/30 sticky top-4 animate-pulse">
              <div className="h-7 w-40 bg-sand rounded mb-6"></div>
              <div className="space-y-4 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-16 h-16 bg-sand rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-sand rounded"></div>
                      <div className="h-4 w-1/2 bg-sand rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-14 bg-sand rounded-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
