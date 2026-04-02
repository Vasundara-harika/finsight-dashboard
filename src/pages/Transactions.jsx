import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Plus, Trash2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import FilterBar from '../components/FilterBar'
import TransactionTable from '../components/TransactionTable'
import AddTransactionModal from '../components/AddTransactionModal'
import ConfirmModal from '../components/ConfirmModal'
import { formatCurrency, getCategoryColor } from '../utils/helpers'

/**
 * Transactions page — pie chart, stats, filter bar, transaction table
 * with date range, delete, and bulk select (Admin only).
 */

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {payload[0].name}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatCurrency(payload[0].value)} ({payload[0].payload.count} txns)
        </p>
      </div>
    )
  }
  return null
}

const Transactions = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const {
    filteredTransactions,
    role,
    loading,
    deleteMultipleTransactions,
    addToast,
  } = useAppContext()

  const handleAddClick = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const handleEditClick = (txn) => {
    setEditData(txn)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditData(null)
  }

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredTransactions.map((t) => t.id)))
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkDelete = async () => {
    try {
      await deleteMultipleTransactions([...selectedIds])
      addToast(`Deleted ${selectedIds.size} transactions`, 'success')
      setSelectedIds(new Set())
    } catch {
      addToast('Failed to delete transactions', 'error')
    }
  }

  // Pie chart data
  const pieData = useMemo(() => {
    const map = {}
    filteredTransactions.forEach((txn) => {
      if (!map[txn.category]) {
        map[txn.category] = { category: txn.category, amount: 0, count: 0 }
      }
      map[txn.category].amount += txn.amount
      map[txn.category].count += 1
    })
    return Object.values(map).sort((a, b) => b.amount - a.amount)
  }, [filteredTransactions])

  // Summary stats
  const stats = useMemo(() => {
    let income = 0, expenses = 0
    filteredTransactions.forEach((t) => {
      if (t.type === 'income') income += t.amount
      else expenses += t.amount
    })
    return { income, expenses, total: filteredTransactions.length }
  }, [filteredTransactions])

  return (
    <div className="space-y-4 page-enter">
      {/* Highlighted Add Transaction Banner — Admin Only */}
      {role === 'admin' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30 animate-fade-in">
          <div>
            <h3 className="text-white font-semibold text-base">Record a new transaction</h3>
            <p className="text-orange-100 text-sm mt-0.5">
              Keep your finances up to date — add income or expenses here
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      )}

      {/* Bulk Selection Bar — Admin only, visible when items selected */}
      {role === 'admin' && selectedIds.size > 0 && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-500/10 rounded-xl p-3 border border-red-200 dark:border-red-500/30 animate-fade-in">
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            {selectedIds.size} transaction{selectedIds.size > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setBulkDeleteOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}

      {/* Pie Chart + Stats Row */}
      {!loading && filteredTransactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          {/* Pie Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Transaction Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={getCategoryColor(entry.category)} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
              {pieData.slice(0, 6).map((entry) => (
                <div key={entry.category} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(entry.category) }}
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {entry.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Currently shown</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(stats.income)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All income entries</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Expenses</p>
              <p className="text-2xl font-bold text-red-500 dark:text-red-400">{formatCurrency(stats.expenses)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">All expense entries</p>
            </div>
          </div>
        </div>
      )}

      <FilterBar onAddClick={handleAddClick} />
      <TransactionTable
        onEditClick={handleEditClick}
        onAddClick={handleAddClick}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAll}
      />
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editData={editData}
      />
      <ConfirmModal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title={`Delete ${selectedIds.size} transaction${selectedIds.size > 1 ? 's' : ''}?`}
        message="This will permanently delete the selected transactions. This action cannot be undone."
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  )
}

export default Transactions
