import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

/**
 * Toast — renders stacked toast notifications in the bottom-right corner.
 * Green for success, red for error, orange for warning. Auto-dismisses after 3s.
 */
const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
}

const colorMap = {
  success: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-800 dark:text-green-300',
  error: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-800 dark:text-red-300',
  warning: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-800 dark:text-orange-300',
}

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-orange-500',
}

const Toast = () => {
  const { toasts, removeToast } = useAppContext()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || CheckCircle
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colorMap[toast.type] || colorMap.success}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorMap[toast.type] || iconColorMap.success}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default Toast
