import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

interface InputDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  title: string
  message: string
  placeholder?: string
  submitText?: string
  cancelText?: string
  defaultValue?: string
}

export default function InputDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  placeholder = '',
  submitText = 'Submit',
  cancelText = 'Cancel',
  defaultValue = ''
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(value)
    onClose()
    setValue(defaultValue)
  }

  const handleClose = () => {
    onClose()
    setValue(defaultValue)
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-md w-full bg-white rounded-lg shadow-xl p-6">
          <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </DialogTitle>
          <p className="text-sm text-gray-600 mb-4">
            {message}
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white text-sm font-medium"
              >
                {submitText}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
