import * as React from "react"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
}

export function Toast({ className, ...props }: ToastProps) {
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border border-gray-300 ${className}`} {...props}>
      Toast
    </div>
  )
}
