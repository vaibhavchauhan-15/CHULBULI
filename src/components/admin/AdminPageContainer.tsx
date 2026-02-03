import { ReactNode } from 'react'

interface AdminPageContainerProps {
  children: ReactNode
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full'
  className?: string
}

export default function AdminPageContainer({ 
  children, 
  maxWidth = 'default',
  className = ''
}: AdminPageContainerProps) {
  const maxWidthStyles = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full'
  }

  return (
    <div className={`${maxWidthStyles[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 ${className}`}>
      {children}
    </div>
  )
}
