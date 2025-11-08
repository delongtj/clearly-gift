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

  const bgColor = {
    success: 'bg-emerald-600',
    error: 'bg-red-600',
    info: 'bg-blue-900'
  }[type]

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Position at top center */}
      <div className="fixed inset-x-0 top-4 flex justify-center p-4 pointer-events-none">
        <DialogPanel className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg pointer-events-auto`}>
          <p className="text-sm font-medium">{message}</p>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
