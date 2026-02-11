'use client'

interface AdminPageErrorFallbackProps {
  title: string
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminPageErrorFallback({
  title,
  error,
  reset,
}: AdminPageErrorFallbackProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border-2 border-softgold/30 bg-white/90 p-8 shadow-xl">
        <h2 className="text-2xl font-playfair font-bold text-warmbrown mb-3">{title}</h2>
        <p className="text-sm text-taupe mb-6">
          Something went wrong while loading this admin section.
        </p>

        <div className="rounded-xl bg-red-50 border border-red-200 p-3 mb-6">
          <p className="text-xs text-red-700 font-medium break-words">
            {error.message || 'Unexpected error'}
          </p>
        </div>

        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rosegold to-softgold text-white font-semibold hover:shadow-lg transition-all"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
