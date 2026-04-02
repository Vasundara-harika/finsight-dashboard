import { useState, useMemo } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  Save,
  Wallet,
  TrendingDown,
  PiggyBank,
  DollarSign,
  ArrowRight,
  Moon,
  Sun,
  Bell,
  LayoutDashboard,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import {
  formatCurrency,
  formatDate,
  getInitials,
  getCategoryColor,
  calculateMonthlyData,
} from '../utils/helpers'

/**
 * Profile page — shows user financial profile with personal info,
 * financial summary, account preferences, and recent activity.
 */
const Profile = () => {
  const {
    transactions,
    totalIncome,
    totalExpenses,
    totalBalance,
    darkMode,
    toggleDarkMode,
    addToast,
  } = useAppContext()

  // Editable profile fields
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('finsight_profile')
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Andi Johnson',
          email: 'andi.johnson@finsight.in',
          phone: '+91 98765 43210',
          location: 'Hyderabad, Telangana',
          memberSince: 'January 2025',
        }
  })

  const [editProfile, setEditProfile] = useState(profile)

  // Notification preference (decorative, persisted)
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('finsight_notifications') !== 'false'
  })

  // Default view preference
  const [defaultView, setDefaultView] = useState(() => {
    return localStorage.getItem('finsight_default_view') || 'dashboard'
  })

  // Monthly data for savings rate
  const monthlyData = useMemo(() => calculateMonthlyData(transactions), [transactions])
  const savingsRate = useMemo(() => {
    if (monthlyData.length === 0) return 0
    const latest = monthlyData[monthlyData.length - 1]
    if (latest.income === 0) return 0
    return ((latest.income - latest.expenses) / latest.income) * 100
  }, [monthlyData])

  // Last 5 transactions
  const recentTxns = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  }, [transactions])

  const handleSave = () => {
    setProfile(editProfile)
    localStorage.setItem('finsight_profile', JSON.stringify(editProfile))
    setEditing(false)
    addToast('Profile updated successfully')
  }

  const handleCancel = () => {
    setEditProfile(profile)
    setEditing(false)
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Top Section — Avatar + Name + Edit */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {profile.name}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Financial Manager</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Member since {profile.memberSince}
            </p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">
            Personal Information
          </h3>

          <div className="space-y-4">
            {[
              { icon: User, label: 'Full Name', key: 'name' },
              { icon: Mail, label: 'Email', key: 'email' },
              { icon: Phone, label: 'Phone', key: 'phone' },
              { icon: MapPin, label: 'Location', key: 'location' },
            ].map(({ icon: Icon, label, key }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                  {editing ? (
                    <input
                      type="text"
                      value={editProfile[key]}
                      onChange={(e) => setEditProfile({ ...editProfile, [key]: e.target.value })}
                      className="w-full mt-0.5 px-2 py-1 rounded text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none transition-all"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {profile[key]}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Member Since (read only) */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Member Since</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {profile.memberSince}
                </p>
              </div>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Right Column — Financial Summary + Preferences */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">
              Financial Summary
            </h3>
            <div className="space-y-4">
              {[
                { icon: DollarSign, label: 'Monthly Income', value: formatCurrency(totalIncome), color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-500/10' },
                { icon: TrendingDown, label: 'Monthly Expenses', value: formatCurrency(totalExpenses), color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-500/10' },
                { icon: PiggyBank, label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, color: 'text-primary', bg: 'bg-orange-100 dark:bg-orange-500/10' },
                { icon: Wallet, label: 'Net Worth', value: formatCurrency(totalBalance), color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-500/10' },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Preferences */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">
              Account Preferences
            </h3>
            <div className="space-y-4">
              {/* Currency */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Currency</span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  ₹ Indian Rupee
                  <span className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">✓</span>
                </span>
              </div>

              {/* Theme */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Theme</span>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {darkMode ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Notifications</span>
                <button
                  onClick={() => {
                    const next = !notifications
                    setNotifications(next)
                    localStorage.setItem('finsight_notifications', String(next))
                    addToast(next ? 'Notifications enabled' : 'Notifications disabled')
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? 'translate-x-5' : ''}`} />
                </button>
              </div>

              {/* Default View */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Default View</span>
                <select
                  value={defaultView}
                  onChange={(e) => {
                    setDefaultView(e.target.value)
                    localStorage.setItem('finsight_default_view', e.target.value)
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-none focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="transactions">Transactions</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Recent Activity
          </h3>
          <a
            href="/transactions"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="space-y-3">
          {recentTxns.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                style={{ backgroundColor: getCategoryColor(txn.category) }}
              >
                {getInitials(txn.description)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                  {txn.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(txn.date)} · {txn.category}
                </p>
              </div>
              <span
                className={`text-sm font-semibold flex-shrink-0 ${
                  txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile
