import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES, generateId } from '../utils/helpers'

/**
 * AddTransactionModal — modal form to add or edit a transaction.
 * Used by Admin role on the Transactions page.
 * When editData is provided, the modal operates in edit mode.
 */
const AddTransactionModal = ({ isOpen, onClose, editData = null }) => {
  const { addTransaction, editTransaction } = useAppContext()
  const isEditMode = !!editData

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editData) {
      setFormData({
        description: editData.description,
        amount: String(editData.amount),
        category: editData.category,
        type: editData.type,
        date: editData.date,
      })
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'Food',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      })
    }
    setError('')
    setShowSuccess(false)
  }, [editData, isOpen])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Amount must be a positive number')
      return
    }
    if (!formData.date) {
      setError('Date is required')
      return
    }

    setSubmitting(true)
    try {
      const txnData = {
        ...formData,
        amount: Number(formData.amount),
        description: formData.description.trim(),
      }

      if (isEditMode) {
        await editTransaction(editData.id, { ...txnData, id: editData.id })
      } else {
        await addTransaction({ ...txnData, id: generateId() })
      }
      // Show success checkmark animation, then auto-close
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
      }, 1200)
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'edit' : 'add'} transaction. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in border border-slate-200 dark:border-slate-700">
        {/* Success Checkmark Overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-800/95 rounded-xl">
            <div className="success-circle w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <path
                  className="success-check"
                  d="M5 13l4 4L19 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm font-semibold text-green-600 dark:text-green-400 animate-fade-in">
              {isEditMode ? 'Transaction Updated!' : 'Transaction Added!'}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {isEditMode ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Swiggy Order - Biryani"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Category + Type row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? 'Saving...'
                : isEditMode
                ? 'Save Changes'
                : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTransactionModal
