import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect } from 'react'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

export default function Toast({
  isOpen,
  onClose,
  message,
  type = 'success',
  duration = 3000
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  const styles = {
    success: {
      bg: 'bg-emerald-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-600',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-900',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    }
  }[type]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Position at top center */}
      <div className="fixed inset-x-0 top-4 flex justify-center p-4 pointer-events-none">
        <DialogPanel className={`${styles.bg} text-white px-6 py-3 rounded-lg shadow-xl pointer-events-auto flex items-center gap-3 animate-slide-in`}>
          <div className="flex-shrink-0">{styles.icon}</div>
          <p className="text-sm font-medium">{message}</p>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
