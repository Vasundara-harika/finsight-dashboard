import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { formatCurrency, formatDate, getInitials, getCategoryColor } from '../utils/helpers'
import EmptyState from './EmptyState'
import ConfirmModal from './ConfirmModal'

/**
 * TransactionTable — list of transactions with checkbox selection, avatar initials,
 * description, category badge, date, type, amount, edit and delete buttons (Admin).
 */
const TransactionTable = ({
  onEditClick,
  onAddClick,
  selectedIds = new Set(),
  toggleSelect,
  toggleSelectAll,
}) => {
  const { filteredTransactions, role, loading, deleteTransaction, addToast } = useAppContext()
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTransaction(deleteTarget.id)
      addToast('Transaction deleted', 'success')
    } catch {
      addToast('Failed to delete transaction', 'error')
    }
    setDeleteTarget(null)
  }

  const allSelected =
    filteredTransactions.length > 0 && selectedIds.size === filteredTransactions.length

  // Skeleton loading rows
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-b-0"
          >
            <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <div className="skeleton w-32 h-4 rounded mb-2" />
              <div className="skeleton w-20 h-3 rounded" />
            </div>
            <div className="skeleton w-16 h-5 rounded-full" />
            <div className="skeleton w-20 h-5 rounded" />
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (filteredTransactions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <EmptyState onAddClick={onAddClick} />
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider items-center">
          {role === 'admin' && (
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 cursor-pointer"
              />
            </div>
          )}
          <div className={role === 'admin' ? 'col-span-3' : 'col-span-4'}>Description</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-2 text-right">Amount</div>
          {role === 'admin' && <div className="col-span-1 text-right">Actions</div>}
        </div>

        {/* Transaction Rows */}
        {filteredTransactions.map((txn, index) => (
          <div
            key={txn.id}
            className={`grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-slate-100 dark:border-slate-700/50 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors ${
              selectedIds.has(txn.id) ? 'bg-orange-50/50 dark:bg-orange-500/5' : ''
            }`}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            {/* Checkbox — Admin Only */}
            {role === 'admin' && (
              <div className="hidden md:flex col-span-1 items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(txn.id)}
                  onChange={() => toggleSelect(txn.id)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary/30 cursor-pointer"
                />
              </div>
            )}

            {/* Avatar + Description */}
            <div className={`col-span-12 ${role === 'admin' ? 'md:col-span-3' : 'md:col-span-4'} flex items-center gap-3`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(txn.category) }}
              >
                {getInitials(txn.description)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {txn.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 md:hidden">
                  {formatDate(txn.date)} · {txn.category}
                </p>
              </div>
            </div>

            {/* Category Badge */}
            <div className="hidden md:flex col-span-2">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: getCategoryColor(txn.category) + '15',
                  color: getCategoryColor(txn.category),
                }}
              >
                {txn.category}
              </span>
            </div>

            {/* Date */}
            <div className="hidden md:block col-span-2 text-sm text-slate-500 dark:text-slate-400">
              {formatDate(txn.date)}
            </div>

            {/* Type */}
            <div className="hidden md:block col-span-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  txn.type === 'income'
                    ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {txn.type === 'income' ? 'Income' : 'Expense'}
              </span>
            </div>

            {/* Amount */}
            <div className="col-span-8 md:col-span-2 text-right">
              <span
                className={`text-sm font-semibold ${
                  txn.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-500 dark:text-red-400'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </div>

            {/* Edit + Delete — Admin Only */}
            {role === 'admin' && (
              <div className="col-span-4 md:col-span-1 flex justify-end gap-1">
                <button
                  onClick={() => onEditClick(txn)}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                  title="Edit transaction"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(txn)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Single Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete this transaction?"
        message={deleteTarget ? `"${deleteTarget.description}" for ${formatCurrency(deleteTarget.amount)} will be permanently deleted.` : ''}
        confirmText="Delete"
        variant="danger"
      />
    </>
  )
}

export default TransactionTable
