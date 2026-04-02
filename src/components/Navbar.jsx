import { useState, useRef, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Search, Sun, Moon, Bell, ChevronDown, Shield, Eye, User, Calendar } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

/**
 * Navbar — top bar with page title, search, dark mode toggle, role switcher, and notification bell.
 */
const Navbar = () => {
  const location = useLocation()
  const { darkMode, toggleDarkMode, role, setRole, searchQuery, setSearchQuery, userName, timeRange, setTimeRange } = useAppContext()

  const timeRanges = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' },
  ]
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Determine page title from current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/transactions':
        return 'Transactions'
      case '/insights':
        return 'Insights'
      case '/settings':
        return 'Settings'
      case '/profile':
        return 'Profile'
      case '/help':
        return 'Help & Support'
      default:
        return 'Dashboard'
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Only make search functional on transactions page
  const isTransactionsPage = location.pathname === '/transactions'

  // Show time selector on Dashboard and Transactions pages
  const showTimeSelector = location.pathname === '/' || location.pathname === '/transactions'

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Page Title */}
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
          {getPageTitle()}
        </h1>

        {/* Search Bar — center */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={isTransactionsPage ? searchQuery : ''}
              onChange={(e) => isTransactionsPage && setSearchQuery(e.target.value)}
              readOnly={!isTransactionsPage}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all ${
                !isTransactionsPage ? 'cursor-default opacity-60' : ''
              }`}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Role Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {role === 'admin' ? (
                <Shield className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden sm:inline capitalize">{role}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                <button
                  onClick={() => { setRole('viewer'); setRoleDropdownOpen(false) }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    role === 'viewer'
                      ? 'bg-orange-50 dark:bg-orange-500/10 text-primary font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Viewer
                  {role === 'viewer' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => { setRole('admin'); setRoleDropdownOpen(false) }}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors ${
                    role === 'admin'
                      ? 'bg-orange-50 dark:bg-orange-500/10 text-primary font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                  {role === 'admin' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <button className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {/* Profile Avatar — accessible on all screens including mobile */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="View Profile"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
              {userName?.split(' ')[0]}
            </span>
          </Link>
        </div>
      </div>

      {/* Time Range Selector — shown on Dashboard & Transactions */}
      {showTimeSelector && (
        <div className="px-4 md:px-6 pb-2 pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 hidden sm:block" />
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
            {timeRanges.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setTimeRange(tr.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  timeRange === tr.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
                }`}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Search — only on transactions page */}
      {isTransactionsPage && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
