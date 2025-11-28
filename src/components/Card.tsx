import React from 'react'
import cn from 'clsx'

type Variant = 'standard' | 'glass' | 'elevated'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant
}

export default function Card({ variant = 'standard', className, children, ...rest }: CardProps) {
  const classes = cn(className, {
    'card-standard': variant === 'standard',
    'card-glass': variant === 'glass',
    'bg-[var(--bg-elevated)] rounded-xl p-6 shadow-elevated': variant === 'elevated',
  })

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
