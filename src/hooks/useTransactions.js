import { useState, useEffect, useCallback } from 'react'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransactionApi,
  deleteMultipleApi,
  clearAllApi,
} from '../utils/api'

/**
 * Custom hook to manage transactions via the api.js data service.
 * Uses functional state updaters (prev =>) to avoid stale closure bugs.
 *
 * Data flow:
 *   api.js handles JSON Server ↔ localStorage switching transparently.
 *   This hook just calls the API functions and keeps React state in sync.
 */
const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all transactions on mount via the data service
  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, source } = await getTransactions()
      setTransactions(data)
      if (source === 'local' || source === 'seed') {
        setError('Using local data — JSON Server unavailable')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to load transactions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      const saved = await createTransaction(transaction)
      setTransactions((prev) => [...prev, saved])
      return saved
    } catch (err) {
      console.error('Add error:', err)
      setError('Failed to add transaction')
      throw err
    }
  }

  // Edit an existing transaction
  const editTransaction = async (id, data) => {
    try {
      const saved = await updateTransaction(id, data)
      setTransactions((prev) => prev.map((t) => (t.id === id ? saved : t)))
      return saved
    } catch (err) {
      console.error('Edit error:', err)
      setError('Failed to edit transaction')
      throw err
    }
  }

  // Delete a single transaction
  const deleteTransaction = async (id) => {
    try {
      await deleteTransactionApi(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete transaction')
      throw err
    }
  }

  // Bulk delete transactions
  const deleteMultipleTransactions = async (ids) => {
    try {
      await deleteMultipleApi(ids)
      setTransactions((prev) => {
        const idSet = new Set(ids)
        return prev.filter((t) => !idSet.has(t.id))
      })
    } catch (err) {
      console.error('Bulk delete error:', err)
      setError('Failed to delete transactions')
      throw err
    }
  }

  // Clear all transactions
  const clearAllTransactions = async () => {
    try {
      await clearAllApi()
      setTransactions([])
    } catch (err) {
      console.error('Clear all error:', err)
      setError('Failed to clear transactions')
      throw err
    }
  }

  return {
    transactions,
    setTransactions,
    loading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    clearAllTransactions,
    refetch: fetchTransactions,
  }
}

export default useTransactions
