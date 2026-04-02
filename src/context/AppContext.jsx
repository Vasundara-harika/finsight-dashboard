import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import useTransactions from '../hooks/useTransactions'
import { filterByTimeRange } from '../utils/helpers'

const AppContext = createContext()

/**
 * AppProvider wraps the entire app and manages global state:
 * transactions, role, dark mode, search, filters, sorting, toasts.
 *
 * BUG FIX: All summary values (totalIncome, totalExpenses, totalBalance)
 * are now computed via useMemo keyed on [transactions], so they reactively
 * update whenever a transaction is added, edited, or deleted.
 */
export const AppProvider = ({ children }) => {
  const {
    transactions,
    setTransactions,
    loading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    clearAllTransactions,
    refetch,
  } = useTransactions()

  // Role state — 'viewer' or 'admin'
  const [role, setRole] = useState('viewer')

  // Global user profile name — synced across Sidebar, Dashboard, Profile, Settings
  const [userName, setUserNameState] = useState(() => {
    const saved = localStorage.getItem('finsight_profile')
    return saved ? JSON.parse(saved).name : 'Andi Johnson'
  })

  const setUserName = useCallback((name) => {
    setUserNameState(name)
    // Also update the full profile object in localStorage
    const saved = localStorage.getItem('finsight_profile')
    const profile = saved ? JSON.parse(saved) : {}
    profile.name = name
    localStorage.setItem('finsight_profile', JSON.stringify(profile))
  }, [])

  // Dark mode — read initial value from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  // Time range filter — 'week' | 'month' | 'year' | 'all'
  const [timeRange, setTimeRange] = useState('all')

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')

  // Date range filter state
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Toast notification system
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // ─── Time-range-filtered transactions (used for summaries, charts, dashboard) ───
  const timeFilteredTransactions = useMemo(
    () => filterByTimeRange(transactions, timeRange),
    [transactions, timeRange]
  )

  // ─── Reactively computed summary values based on time range ───
  const totalIncome = useMemo(
    () => timeFilteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [timeFilteredTransactions]
  )

  const totalExpenses = useMemo(
    () => timeFilteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [timeFilteredTransactions]
  )

  const totalBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses])

  // Apply dark class to HTML element on mount and whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Toggle dark mode and persist to localStorage
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      localStorage.setItem('darkMode', String(newMode))
      return newMode
    })
  }, [])

  // Set dark mode explicitly (for Settings page theme cards)
  const setDarkModeExplicit = useCallback((val) => {
    setDarkMode(val)
    localStorage.setItem('darkMode', String(val))
  }, [])

  // Filter and sort transactions based on current state (time range + search + category + date)
  const filteredTransactions = useMemo(() => {
    let result = [...timeFilteredTransactions]

    // Search by description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((txn) => txn.description.toLowerCase().includes(query))
    }

    // Filter by category
    if (filterCategory !== 'All') {
      result = result.filter((txn) => txn.category === filterCategory)
    }

    // Filter by date range
    if (dateFrom) {
      result = result.filter((txn) => txn.date >= dateFrom)
    }
    if (dateTo) {
      result = result.filter((txn) => txn.date <= dateTo)
    }

    // Sort
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount)
        break
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount)
        break
      default:
        break
    }

    return result
  }, [timeFilteredTransactions, searchQuery, filterCategory, sortBy, dateFrom, dateTo])

  // Export filtered transactions to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount']
    const rows = filteredTransactions.map((t) => [t.date, t.description, t.category, t.type, t.amount])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finsight-transactions.csv'
    a.click()
    URL.revokeObjectURL(url)
    addToast('Transactions exported as CSV')
  }, [filteredTransactions, addToast])

  // Export all transactions as JSON
  const exportToJSON = useCallback(() => {
    const json = JSON.stringify(transactions, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finsight-transactions.json'
    a.click()
    URL.revokeObjectURL(url)
    addToast('Transactions exported as JSON')
  }, [transactions, addToast])

  // Import transactions from a JSON file
  const importTransactions = useCallback(
    async (jsonArray) => {
      let count = 0
      for (const txn of jsonArray) {
        try {
          await addTransaction(txn)
          count++
        } catch {
          // skip failed entries
        }
      }
      addToast(`Successfully imported ${count} transactions`, 'success')
    },
    [addTransaction, addToast]
  )

  const value = {
    // Data
    transactions,
    setTransactions,
    filteredTransactions,
    loading,
    error,

    // Computed summaries (reactively update based on timeRange)
    totalIncome,
    totalExpenses,
    totalBalance,

    // Time range
    timeRange,
    setTimeRange,
    timeFilteredTransactions,

    // Role
    role,
    setRole,

    // User profile
    userName,
    setUserName,

    // Theme
    darkMode,
    toggleDarkMode,
    setDarkModeExplicit,

    // Search & Filters
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,

    // Actions
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    clearAllTransactions,
    exportToCSV,
    exportToJSON,
    importTransactions,
    refetch,

    // Toast notifications
    toasts,
    addToast,
    removeToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/**
 * Custom hook to access the App context
 */
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export default AppContext
