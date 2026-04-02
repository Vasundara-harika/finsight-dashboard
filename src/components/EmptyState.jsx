import { SearchX, Plus } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

/**
 * EmptyState — displayed when search or filter returns 0 results.
 * Shows a SearchX icon, message, and an "Add one" link for Admin users.
 */
const EmptyState = ({ onAddClick }) => {
  const { role } = useAppContext()

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <SearchX className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">
        No transactions found
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
        Try adjusting your search or filter
      </p>
      {role === 'admin' && onAddClick && (
        <button
          onClick={onAddClick}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add one
        </button>
      )}
    </div>
  )
}

export default EmptyState
