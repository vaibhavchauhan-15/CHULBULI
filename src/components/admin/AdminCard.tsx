import { ReactNode } from 'react'

interface AdminCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function AdminCard({ title, subtitle, children, className = '' }: AdminCardProps) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-7 shadow-xl border-2 border-softgold/20 hover:shadow-2xl transition-all ${className}`}>
      <div className="mb-5 md:mb-6">
        <h3 className="text-base md:text-lg font-playfair font-semibold text-warmbrown mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs md:text-sm text-taupe font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
