import { Search, Plus, Download, X } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { CATEGORIES } from '../utils/helpers'

/**
 * FilterBar — search, category filter, sort, date range, export CSV, and add button.
 * Includes date range filter with clear button. Admin sees highlighted Add Transaction.
 */
const FilterBar = ({ onAddClick }) => {
  const {
    role,
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
    exportToCSV,
  } = useAppContext()

  const hasDateFilter = dateFrom || dateTo

  return (
    <div className="space-y-3 mb-6 animate-fade-in">
      {/* Main filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
        >
          <option value="date-desc">Date (Newest)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="amount-desc">Amount (High → Low)</option>
          <option value="amount-asc">Amount (Low → High)</option>
        </select>

        {/* Export CSV */}
        <div className="relative group">
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 dark:bg-slate-600 text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-lg z-10">
            Downloads the currently visible transactions as a .csv spreadsheet — useful for keeping records in Excel or sharing with an accountant.
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
          </div>
        </div>

        {/* Add Transaction — Admin Only */}
        {role === 'admin' && (
          <button
            onClick={onAddClick}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-all shadow-lg shadow-orange-300/50 dark:shadow-orange-500/20 ring-2 ring-orange-300/40 dark:ring-orange-500/20 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        )}
      </div>

      {/* Date Range Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">
          Date Range:
        </span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          placeholder="From"
        />
        <span className="text-xs text-slate-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          placeholder="To"
        />
        {hasDateFilter && (
          <button
            onClick={() => { setDateFrom(''); setDateTo('') }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar
