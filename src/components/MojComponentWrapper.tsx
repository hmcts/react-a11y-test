import React, { useEffect, useRef } from 'react'

interface MojComponentWrapperProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export const MojComponentWrapper: React.FC<MojComponentWrapperProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Initialize MoJ Frontend JavaScript for the wrapped content
      // This ensures interactive components work properly
      const initMojComponents = async () => {
        try {
          // Dynamic import keeps MoJ JavaScript in a separate client-side chunk
          const { initAll } = await import('@ministryofjustice/frontend')
          initAll({ scope: ref.current || undefined })
        } catch (error) {
          console.warn('Failed to initialize MoJ Frontend components:', error)
        }
      }
      
      initMojComponents()
    }
  }, [])

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
}
