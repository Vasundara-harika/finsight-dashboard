import seedData from '../data/db.json'

const API_URL = 'http://localhost:3001/transactions'
const STORAGE_KEY = 'finsight_transactions'

/**
 * Data service layer for FinSight.
 *
 * Strategy:
 *   1. Try JSON Server (localhost:3001) for every operation.
 *   2. If JSON Server is unreachable (Vercel, offline, etc.), fall back to
 *      localStorage + in-memory state so the app still works as a full demo.
 *
 * The `isServerAvailable` flag is set once on the first request and cached
 * for the session so we don't keep hitting a dead endpoint.
 */

let _serverAvailable = null // null = untested, true/false after first probe

/**
 * Probe whether JSON Server is reachable. Result is cached for the session.
 */
const checkServer = async () => {
  if (_serverAvailable !== null) return _serverAvailable
  try {
    const res = await fetch(API_URL, { method: 'HEAD', signal: AbortSignal.timeout(2000) })
    _serverAvailable = res.ok
  } catch {
    _serverAvailable = false
  }
  return _serverAvailable
}

// ─── LocalStorage helpers ───────────────────────────────────────────────

const readLocal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeLocal = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Return seed data from db.json, used when there is nothing in localStorage yet.
 */
const getSeedData = () => [...seedData.transactions]

// ─── Public API ─────────────────────────────────────────────────────────

/**
 * Fetch all transactions.
 * Priority: JSON Server → localStorage → seed data from db.json
 */
export const getTransactions = async () => {
  const online = await checkServer()

  if (online) {
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Server error')
      const data = await res.json()
      writeLocal(data) // keep cache in sync
      return { data, source: 'server' }
    } catch {
      // fall through to local
    }
  }

  // Offline / Vercel path
  const cached = readLocal()
  if (cached && cached.length > 0) {
    return { data: cached, source: 'local' }
  }

  // First visit on Vercel — seed from db.json
  const seed = getSeedData()
  writeLocal(seed)
  return { data: seed, source: 'seed' }
}

/**
 * Add a transaction.
 * Online  → POST to JSON Server, then cache.
 * Offline → append to localStorage directly.
 */
export const createTransaction = async (transaction) => {
  const online = await checkServer()

  if (online) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    })
    if (!res.ok) throw new Error('Failed to add transaction')
    const saved = await res.json()
    // Sync cache
    const local = readLocal() || []
    writeLocal([...local, saved])
    return saved
  }

  // Offline fallback — save to localStorage
  const local = readLocal() || []
  const updated = [...local, transaction]
  writeLocal(updated)
  return transaction
}

/**
 * Update a transaction by ID.
 */
export const updateTransaction = async (id, data) => {
  const online = await checkServer()

  if (online) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update transaction')
    const saved = await res.json()
    const local = readLocal() || []
    writeLocal(local.map((t) => (t.id === id ? saved : t)))
    return saved
  }

  const local = readLocal() || []
  writeLocal(local.map((t) => (t.id === id ? data : t)))
  return data
}

/**
 * Delete a single transaction by ID.
 */
export const deleteTransactionApi = async (id) => {
  const online = await checkServer()

  if (online) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete transaction')
  }

  const local = readLocal() || []
  writeLocal(local.filter((t) => t.id !== id))
}

/**
 * Delete multiple transactions by ID array.
 */
export const deleteMultipleApi = async (ids) => {
  const online = await checkServer()
  const idSet = new Set(ids)

  if (online) {
    await Promise.all(ids.map((id) => fetch(`${API_URL}/${id}`, { method: 'DELETE' })))
  }

  const local = readLocal() || []
  writeLocal(local.filter((t) => !idSet.has(t.id)))
}

/**
 * Clear all transactions.
 */
export const clearAllApi = async () => {
  const online = await checkServer()

  if (online) {
    try {
      const res = await fetch(API_URL)
      const all = await res.json()
      await Promise.all(all.map((t) => fetch(`${API_URL}/${t.id}`, { method: 'DELETE' })))
    } catch {
      // ignore server errors during clear
    }
  }

  writeLocal([])
}
