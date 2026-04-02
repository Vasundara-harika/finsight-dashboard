import { useState } from 'react'
import {
  Search,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Plus,
  BarChart3,
  Download,
  Shield,
  Eye,
  ArrowLeftRight,
  Moon,
  Sun,
  Pencil,
  Database,
  HelpCircle,
  Mail,
} from 'lucide-react'

/**
 * Help page — FAQ accordion, getting started steps, feature cards,
 * and contact section for the FinSight dashboard.
 */

const faqs = [
  {
    q: 'How do I switch between Viewer and Admin mode?',
    a: 'Click the role dropdown in the top-right corner of the navbar. You\'ll see a small shield/eye icon with your current role. Click it and select either "Viewer" or "Admin". In Viewer mode you can only see data. In Admin mode you can add, edit, and delete transactions.',
  },
  {
    q: 'How do I add a transaction?',
    a: 'First switch to Admin mode using the role dropdown in the navbar. Then go to the Transactions page — you\'ll see a prominent orange "Add Transaction" banner at the top and a button in the filter bar. Click either one to open the form. Fill in the description, amount, date, category, and type, then click "Add Transaction".',
  },
  {
    q: 'How do I export my transactions?',
    a: 'On the Transactions page, click the "Export CSV" button in the filter bar. This downloads all currently visible (filtered) transactions as a .csv file you can open in Excel or Google Sheets. You can also export as JSON from the Settings → Data tab.',
  },
  {
    q: 'How does dark mode work?',
    a: 'Click the sun/moon icon in the top-right corner of the navbar to toggle between light and dark themes. Your preference is saved to localStorage, so it persists across page refreshes and browser sessions.',
  },
  {
    q: 'Why are my transactions not showing?',
    a: 'Check your search query and category filter on the Transactions page. If you have text in the search bar or a specific category selected, only matching transactions will show. Clear the search and set the category to "All Categories" to see everything. Also make sure JSON Server is running on port 3001.',
  },
  {
    q: 'How do I edit a transaction?',
    a: 'Switch to Admin mode first. On the Transactions page, each transaction row will show a pencil (edit) icon on the right side. Click it to open the edit form with pre-filled values. Make your changes and click "Save Changes".',
  },
  {
    q: 'Is my data saved?',
    a: 'Yes! Transactions are stored in JSON Server (db.json file) and also cached in your browser\'s localStorage as a backup. If JSON Server is unavailable, the app falls back to cached data. Any transactions you add or edit are persisted to both.',
  },
]

const steps = [
  {
    num: 1,
    icon: LayoutDashboard,
    title: 'View your dashboard',
    desc: 'Get an overview of your finances with summary cards, charts, and recent transactions.',
    color: 'bg-primary',
  },
  {
    num: 2,
    icon: Plus,
    title: 'Add transactions',
    desc: 'Switch to Admin mode and add your income and expenses to track your finances.',
    color: 'bg-green-500',
  },
  {
    num: 3,
    icon: BarChart3,
    title: 'Explore insights',
    desc: 'Analyze your spending patterns, savings rate, and financial health score.',
    color: 'bg-blue-500',
  },
  {
    num: 4,
    icon: Download,
    title: 'Export your data',
    desc: 'Download transactions as CSV or JSON for record-keeping or further analysis.',
    color: 'bg-purple-500',
  },
]

const features = [
  {
    icon: Shield,
    title: 'Role-Based Access',
    desc: 'Switch between Viewer (read-only) and Admin (full control) modes to simulate real-world RBAC.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Transaction Management',
    desc: 'Add, edit, delete, search, filter by category, sort by date or amount, and export transactions.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Line charts for balance trends, donut charts for spending categories, and bar charts for monthly comparisons.',
  },
  {
    icon: Download,
    title: 'Data Export & Import',
    desc: 'Export as CSV or JSON. Import transaction data from JSON files via the Settings page.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    desc: 'Toggle between light and dark themes. Preference is saved and applied instantly across all pages.',
  },
  {
    icon: Database,
    title: 'Data Persistence',
    desc: 'JSON Server provides a real REST API. localStorage acts as a fallback cache when the server is down.',
  },
]

const filterOptions = ['All', 'Getting Started', 'Features', 'Troubleshooting']

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [openFaq, setOpenFaq] = useState(null)

  // Filter FAQs by search
  const filteredFaqs = faqs.filter((faq) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-8 page-enter">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 border border-slate-200 dark:border-slate-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setActiveFilter(opt)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeFilter === opt
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      {(activeFilter === 'All' || activeFilter === 'Troubleshooting') && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 animate-fade-in">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {(activeFilter === 'All' || activeFilter === 'Getting Started') && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Getting Started with FinSight
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    STEP {step.num}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${step.color}`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {(activeFilter === 'All' || activeFilter === 'Features') && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center animate-fade-in">
        <HelpCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">
          Need more help?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          This is a demonstration project for the Zorvyn internship assessment
        </p>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-300">
          <Mail className="w-4 h-4" />
          hr@zorvyn.io
        </span>
      </div>
    </div>
  )
}

export default Help
