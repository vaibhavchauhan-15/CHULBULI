import { ReactNode } from 'react'
import { IconType } from 'react-icons'
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'

interface AdminStatsCardProps {
  title: string
  value: string | number
  icon: IconType
  trend?: {
    value: number
    label: string
  }
  variant?: 'primary' | 'secondary' | 'tertiary' | 'default'
}

export default function AdminStatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: AdminStatsCardProps) {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-rosegold/20 via-softgold/20 to-sand/30 border-rosegold/40 hover:border-rosegold/60',
    secondary: 'bg-gradient-to-br from-softgold/20 via-sand/30 to-pearl/40 border-softgold/40 hover:border-softgold/60',
    tertiary: 'bg-gradient-to-br from-sand/30 via-pearl/40 to-champagne/40 border-sand/40 hover:border-sand/60',
    default: 'bg-white/90 border-softgold/20 hover:border-softgold/40'
  }

  const iconStyles = {
    primary: 'bg-gradient-to-br from-rosegold to-softgold text-white',
    secondary: 'bg-gradient-to-br from-softgold to-[#D4A574] text-white',
    tertiary: 'bg-gradient-to-br from-[#D4A574] to-[#B8916B] text-white',
    default: 'bg-sand/40 text-rosegold'
  }

  return (
    <div className={`backdrop-blur-sm rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg border-2 transition-all hover:shadow-xl hover:scale-105 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div>
          <p className="text-xs md:text-sm text-taupe font-semibold mb-1 md:mb-2">
            {title}
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-playfair font-bold text-warmbrown">
            {value}
          </p>
        </div>
        <div className={`w-11 h-11 md:w-12 md:h-12 ${iconStyles[variant]} rounded-xl md:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0`}>
          <Icon size={20} className="md:w-6 md:h-6" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t-2 border-softgold/20">
          <div className={`flex items-center gap-1 px-2 md:px-2.5 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold ${
            trend.value >= 0 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {trend.value >= 0 ? (
              <FiArrowUp size={14} className="md:w-4 md:h-4" />
            ) : (
              <FiArrowDown size={14} className="md:w-4 md:h-4" />
            )}
            <span>{Math.abs(trend.value).toFixed(1)}%</span>
          </div>
          <span className="text-xs md:text-sm text-taupe font-medium">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  )
}
