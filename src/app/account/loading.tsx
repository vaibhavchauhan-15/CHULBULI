export default function AccountLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pearl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rosegold mx-auto"></div>
        <p className="mt-4 text-warmbrown">Loading your account...</p>
      </div>
    </div>
  )
}
