/**
 * Format a number as Indian Rupees currency string
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string e.g. "₹45,000"
 */
export const formatCurrency = (amount) => {
  return '₹' + Number(amount).toLocaleString('en-IN')
}

/**
 * Format a date string into readable format
 * @param {string} dateString - ISO date string e.g. "2025-01-05"
 * @returns {string} Formatted date e.g. "Jan 05, 2025"
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

/**
 * Get initials from a description string
 * @param {string} name - Description or name string
 * @returns {string} Two-letter initials e.g. "MS" from "Monthly Salary"
 */
export const getInitials = (name) => {
  const words = name.split(' ').filter(Boolean)
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Calculate monthly aggregated data for the balance trend line chart
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Monthly data with month name and cumulative balance
 */
export const calculateMonthlyData = (transactions) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthlyMap = {}

  transactions.forEach((txn) => {
    const date = new Date(txn.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    const monthLabel = monthNames[date.getMonth()]

    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: monthLabel, income: 0, expenses: 0, sortKey: date.getTime() }
    }

    if (txn.type === 'income') {
      monthlyMap[key].income += txn.amount
    } else {
      monthlyMap[key].expenses += txn.amount
    }
  })

  const sorted = Object.values(monthlyMap).sort((a, b) => a.sortKey - b.sortKey)

  let cumulativeBalance = 0
  return sorted.map((item) => {
    cumulativeBalance += item.income - item.expenses
    return {
      month: item.month,
      income: item.income,
      expenses: item.expenses,
      balance: cumulativeBalance,
    }
  })
}

/**
 * Calculate total spending per category
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Category totals sorted by amount descending
 */
export const calculateCategoryTotals = (transactions) => {
  const categoryMap = {}

  transactions
    .filter((txn) => txn.type === 'expense')
    .forEach((txn) => {
      if (!categoryMap[txn.category]) {
        categoryMap[txn.category] = 0
      }
      categoryMap[txn.category] += txn.amount
    })

  return Object.entries(categoryMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

/**
 * Calculate summary totals: balance, income, expenses
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} { totalBalance, totalIncome, totalExpenses }
 */
export const calculateSummary = (transactions) => {
  let totalIncome = 0
  let totalExpenses = 0

  transactions.forEach((txn) => {
    if (txn.type === 'income') {
      totalIncome += txn.amount
    } else {
      totalExpenses += txn.amount
    }
  })

  return {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
  }
}

/**
 * Calculate percentage change between current and previous values
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {string} Percentage change with sign e.g. "+12.5" or "-8.3"
 */
export const getPercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? '+100' : '0'
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(1)}`
}

/**
 * Colors for donut chart categories
 */
export const CATEGORY_COLORS = {
  Rent: '#EF4444',
  Food: '#F97316',
  Entertainment: '#A855F7',
  Utilities: '#3B82F6',
  Transport: '#06B6D4',
  Shopping: '#EC4899',
  Health: '#22C55E',
  Groceries: '#EAB308',
  Salary: '#10B981',
  Freelance: '#6366F1',
}

/**
 * Get a color for a given category
 * @param {string} category
 * @returns {string} Hex color
 */
export const getCategoryColor = (category) => {
  return CATEGORY_COLORS[category] || '#94A3B8'
}

/**
 * List of all transaction categories
 */
export const CATEGORIES = [
  'Salary', 'Freelance', 'Food', 'Rent', 'Entertainment',
  'Utilities', 'Transport', 'Shopping', 'Health', 'Groceries',
]

/**
 * Generate a unique ID for new transactions
 * @returns {string} Unique ID string
 */
export const generateId = () => {
  return 'txn' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7)
}

/**
 * Print the current page as a report.
 * Hides the sidebar and navbar via CSS @media print rules in index.css.
 */
export const printReport = () => {
  window.print()
}
