import { useState, useRef } from 'react'
import {
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  Check,
  Wallet,
  Globe,
  Calendar,
  Hash,
  Bell,
  Mail,
  Receipt,
  PieChart,
  Shield,
  Info,
  Code,
  User,
  CheckCircle,
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import ConfirmModal from '../components/ConfirmModal'

/**
 * Settings page — tabbed settings for General, Appearance, Data, About.
 */
const tabs = ['General', 'Appearance', 'Data', 'About']

const Settings = () => {
  const {
    darkMode,
    setDarkModeExplicit,
    exportToCSV,
    exportToJSON,
    importTransactions,
    clearAllTransactions,
    addToast,
  } = useAppContext()

  const [activeTab, setActiveTab] = useState('General')
  const [clearModalOpen, setClearModalOpen] = useState(false)
  const fileInputRef = useRef(null)

  // General tab state (persisted to localStorage)
  const [name, setName] = useState(() => {
    const p = localStorage.getItem('finsight_profile')
    return p ? JSON.parse(p).name : 'Andi Johnson'
  })
  const [email, setEmail] = useState(() => {
    const p = localStorage.getItem('finsight_profile')
    return p ? JSON.parse(p).email : 'andi.johnson@finsight.in'
  })
  const [dateFormat, setDateFormat] = useState(() => localStorage.getItem('finsight_date_format') || 'DD/MM/YYYY')
  const [numberFormat, setNumberFormat] = useState(() => localStorage.getItem('finsight_number_format') || 'indian')

  // Notification toggles (decorative, saved to localStorage)
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem('finsight_notif_email') !== 'false')
  const [notifTxn, setNotifTxn] = useState(() => localStorage.getItem('finsight_notif_txn') !== 'false')
  const [notifReport, setNotifReport] = useState(() => localStorage.getItem('finsight_notif_report') !== 'false')
  const [notifBudget, setNotifBudget] = useState(() => localStorage.getItem('finsight_notif_budget') !== 'false')

  // Export date range
  const [exportFrom, setExportFrom] = useState('')
  const [exportTo, setExportTo] = useState('')

  // Theme selection: 'light', 'dark', 'system'
  const themeMode = darkMode ? 'dark' : 'light'

  const handleSaveGeneral = () => {
    const profile = JSON.parse(localStorage.getItem('finsight_profile') || '{}')
    localStorage.setItem('finsight_profile', JSON.stringify({ ...profile, name, email }))
    localStorage.setItem('finsight_date_format', dateFormat)
    localStorage.setItem('finsight_number_format', numberFormat)
    addToast('Settings saved successfully')
  }

  const toggleNotif = (key, val, setter) => {
    setter(val)
    localStorage.setItem(key, String(val))
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const arr = Array.isArray(data) ? data : data.transactions || []
      if (arr.length === 0) throw new Error('No transactions found')
      await importTransactions(arr)
    } catch (err) {
      addToast('Invalid JSON file — could not import', 'error')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClearAll = async () => {
    try {
      await clearAllTransactions()
      addToast('All transactions cleared', 'warning')
    } catch {
      addToast('Failed to clear transactions', 'error')
    }
  }

  // Toggle component
  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  )

  return (
    <div className="space-y-6 page-enter">
      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700 animate-fade-in">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── GENERAL TAB ─── */}
      {activeTab === 'General' && (
        <div className="space-y-6 animate-fade-in">
          {/* Profile Quick Edit */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Profile Quick Edit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                <input type="text" value="Financial Manager" readOnly className="w-full px-3 py-2.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Financial Preferences */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Financial Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Currency</span>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary">₹ INR <Check className="w-3.5 h-3.5" /></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Date Format</span>
                </div>
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-none focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Number Format</span>
                </div>
                <select value={numberFormat} onChange={(e) => setNumberFormat(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-none focus:ring-1 focus:ring-primary/30 focus:outline-none cursor-pointer">
                  <option value="indian">Indian (1,00,000)</option>
                  <option value="international">International (100,000)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Notification Settings</h3>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email Notifications', key: 'finsight_notif_email', val: notifEmail, set: setNotifEmail },
                { icon: Receipt, label: 'Transaction Alerts', key: 'finsight_notif_txn', val: notifTxn, set: setNotifTxn },
                { icon: PieChart, label: 'Monthly Report', key: 'finsight_notif_report', val: notifReport, set: setNotifReport },
                { icon: Shield, label: 'Budget Warnings', key: 'finsight_notif_budget', val: notifBudget, set: setNotifBudget },
              ].map(({ icon: Icon, label, key, val, set }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
                  </div>
                  <Toggle value={val} onChange={(v) => toggleNotif(key, v, set)} />
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleSaveGeneral} className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors">
            Save Changes
          </button>
        </div>
      )}

      {/* ─── APPEARANCE TAB ─── */}
      {activeTab === 'Appearance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Theme */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { mode: 'light', icon: Sun, label: 'Light Mode', desc: 'Clean and bright' },
                { mode: 'dark', icon: Moon, label: 'Dark Mode', desc: 'Easy on the eyes' },
                { mode: 'system', icon: Monitor, label: 'System Default', desc: 'Follows your OS' },
              ].map(({ mode, icon: Icon, label, desc }) => (
                <button
                  key={mode}
                  onClick={() => {
                    if (mode === 'system') {
                      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                      setDarkModeExplicit(prefersDark)
                    } else {
                      setDarkModeExplicit(mode === 'dark')
                    }
                  }}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                    (mode === 'light' && !darkMode) || (mode === 'dark' && darkMode)
                      ? 'border-primary bg-orange-50 dark:bg-orange-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    (mode === 'light' && !darkMode) || (mode === 'dark' && darkMode)
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Accent Color</h3>
            <div className="flex flex-wrap gap-3 mb-3">
              {[
                { color: '#F97316', name: 'Orange', active: true },
                { color: '#3B82F6', name: 'Blue', active: false },
                { color: '#22C55E', name: 'Green', active: false },
                { color: '#A855F7', name: 'Purple', active: false },
                { color: '#F43F5E', name: 'Rose', active: false },
                { color: '#14B8A6', name: 'Teal', active: false },
              ].map(({ color, name, active }) => (
                <button
                  key={name}
                  title={name}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${active ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-slate-800' : 'opacity-50'}`}
                  style={{ backgroundColor: color }}
                >
                  {active && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">Accent color customization coming soon for non-orange options</p>
          </div>
        </div>
      )}

      {/* ─── DATA TAB ─── */}
      {activeTab === 'Data' && (
        <div className="space-y-6 animate-fade-in">
          {/* Export */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">Export Your Data</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Download your transaction history in different formats</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <button onClick={exportToCSV} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-colors">
                <Download className="w-4 h-4" /> Export as CSV
              </button>
              <button onClick={exportToJSON} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium bg-slate-800 dark:bg-slate-600 text-white hover:bg-slate-700 dark:hover:bg-slate-500 transition-colors">
                <Download className="w-4 h-4" /> Export as JSON
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">From</label>
                <input type="date" value={exportFrom} onChange={(e) => setExportFrom(e.target.value)} className="px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">To</label>
                <input type="date" value={exportTo} onChange={(e) => setExportTo(e.target.value)} className="px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Import */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">Import Transactions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Upload a JSON file with transaction data</p>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
            >
              <Upload className="w-8 h-8" />
              <div className="text-center">
                <p className="text-sm font-medium">Drop a JSON file here or click to browse</p>
                <p className="text-xs mt-1">Supports .json files with transaction arrays</p>
              </div>
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border-2 border-red-200 dark:border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Irreversible actions that affect all your data</p>
            <button
              onClick={() => setClearModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear All Transactions
            </button>
          </div>
        </div>
      )}

      {/* ─── ABOUT TAB ─── */}
      {activeTab === 'About' && (
        <div className="space-y-6 animate-fade-in">
          {/* App Info */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">FinSight</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              A personal finance dashboard built as part of the Zorvyn Frontend Developer Intern screening assessment.
            </p>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Tailwind CSS', 'Recharts', 'JSON Server', 'Lucide Icons'].map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Developer */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">Vasundara Harika Varanasi</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">Frontend Developer Intern Candidate</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p><strong className="text-slate-800 dark:text-slate-100">Assignment:</strong> Zorvyn FinTech — Finance Dashboard UI</p>
              <p><strong className="text-slate-800 dark:text-slate-100">Submitted:</strong> April 2026</p>
            </div>
          </div>

          {/* Assignment Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-5">Assignment Completion Checklist</h3>
            <div className="space-y-2">
              {[
                { label: 'Dashboard Overview with Summary Cards', required: true },
                { label: 'Time-Based Visualization (Line Chart)', required: true },
                { label: 'Categorical Visualization (Donut Chart)', required: true },
                { label: 'Transaction List with Details', required: true },
                { label: 'Transaction Filtering', required: true },
                { label: 'Transaction Sorting & Search', required: true },
                { label: 'Role-Based UI (Admin / Viewer)', required: true },
                { label: 'Insights Section with Charts', required: true },
                { label: 'State Management (Context API)', required: true },
                { label: 'Responsive Design', required: true },
                { label: 'Dark Mode / Light Mode Toggle', required: false },
                { label: 'Data Persistence (localStorage)', required: false },
                { label: 'Mock API (JSON Server)', required: false },
                { label: 'Animations & Transitions', required: false },
                { label: 'Export to CSV', required: false },
                { label: 'Profile & Settings Pages', required: false },
                { label: 'Help & Documentation Page', required: false },
                { label: 'Toast Notifications', required: false },
                { label: 'Import / Export JSON Data', required: false },
                { label: 'Financial Health Score', required: false },
              ].map(({ label, required }) => (
                <div key={label} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
                  <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${required ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-orange-50 dark:bg-orange-500/10 text-primary'}`}>
                    {required ? 'Required' : 'Optional'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirm Modal */}
      <ConfirmModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear all transactions?"
        message="This will delete all transactions permanently. This action cannot be undone."
        confirmText="Yes, Delete All"
        variant="danger"
      />
    </div>
  )
}

export default Settings
