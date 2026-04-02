import { useMemo, useState, useEffect } from 'react'
import { Wallet, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import SummaryCard from '../components/SummaryCard'
import BalanceTrendChart from '../components/BalanceTrendChart'
import SpendingDonutChart from '../components/SpendingDonutChart'
import {
  calculateSummary,
  calculateMonthlyData,
  calculateCategoryTotals,
  formatCurrency,
  formatDate,
  getInitials,
  getPercentageChange,
  getCategoryColor,
} from '../utils/helpers'

/**
 * Dashboard page — overview with welcome banner, summary cards, charts,
 * recent transactions, top spending categories, and monthly budget progress.
 */

// Daily finance tips (rotated by day of week)
const dailyTips = [
  'Track every expense — even small ones add up over time.',
  'Aim to save at least 20% of your income every month.',
  'Review your subscriptions regularly and cancel unused ones.',
  'Set category budgets and review them weekly.',
  'Build an emergency fund worth 3-6 months of expenses.',
  'Automate your savings — set up recurring transfers.',
  'Compare prices before big purchases — patience saves money.',
]

// Default budget limits stored in localStorage
const DEFAULT_BUDGETS = { Food: 3000, Shopping: 5000, Entertainment: 2000 }

const Dashboard = () => {
  const { transactions, totalIncome, totalExpenses, totalBalance, loading, userName } = useAppContext()

  // Budget limits from localStorage
  const [budgets] = useState(() => {
    const saved = localStorage.getItem('finsight_budgets')
    return saved ? JSON.parse(saved) : DEFAULT_BUDGETS
  })

  // Calculate summary data from transactions
  const summary = useMemo(() => calculateSummary(transactions), [transactions])
  const monthlyData = useMemo(() => calculateMonthlyData(transactions), [transactions])
  const categoryTotals = useMemo(() => calculateCategoryTotals(transactions), [transactions])

  // Calculate percentage changes between months
  const percentageChanges = useMemo(() => {
    if (monthlyData.length < 2) return { balance: null, income: null, expenses: null }
    const curr = monthlyData[monthlyData.length - 1]
    const prev = monthlyData[monthlyData.length - 2]
    return {
      balance: getPercentageChange(curr.balance, prev.balance),
      income: getPercentageChange(curr.income, prev.income),
      expenses: getPercentageChange(curr.expenses, prev.expenses),
    }
  }, [monthlyData])

  // Recent transactions (last 5, sorted by date desc)
  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  }, [transactions])

  // Top spending categories with progress bar percentages
  const topCategories = useMemo(() => {
    const maxAmount = categoryTotals.length > 0 ? categoryTotals[0].amount : 1
    return categoryTotals.slice(0, 5).map((cat) => ({
      ...cat,
      percentage: Math.round((cat.amount / maxAmount) * 100),
    }))
  }, [categoryTotals])

  // Smart tip based on real data
  const smartTip = useMemo(() => {
    if (transactions.length === 0) return dailyTips[new Date().getDay()]
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
    if (savingsRate > 20) return `You saved ${savingsRate.toFixed(0)}% of your income. Great work!`
    if (categoryTotals.length > 0)
      return `Your biggest expense category is ${categoryTotals[0].category}. Consider reviewing your budget.`
    return dailyTips[new Date().getDay()]
  }, [transactions, totalIncome, totalExpenses, categoryTotals])

  // Budget progress for top 3 budgeted categories
  const budgetProgress = useMemo(() => {
    return Object.entries(budgets).map(([category, limit]) => {
      const catData = categoryTotals.find((c) => c.category === category)
      const spent = catData ? catData.amount : 0
      const percentage = Math.min(Math.round((spent / limit) * 100), 100)
      return { category, limit, spent, percentage }
    })
  }, [budgets, categoryTotals])

  // Today's greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {greeting}, {userName} 👋
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{todayStr}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-500/10 rounded-lg px-4 py-2 max-w-md">
            <p className="text-sm text-primary font-medium">💡 {smartTip}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          icon={Wallet}
          label="Total Balance"
          amount={totalBalance}
          percentageChange={percentageChanges.balance}
          iconBg="bg-primary"
          loading={loading}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total Income"
          amount={totalIncome}
          percentageChange={percentageChanges.income}
          iconBg="bg-green-500"
          loading={loading}
        />
        <SummaryCard
          icon={TrendingDown}
          label="Total Expenses"
          amount={totalExpenses}
          percentageChange={percentageChanges.expenses}
          iconBg="bg-red-500"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <BalanceTrendChart />
        </div>
        <div className="lg:col-span-2">
          <SpendingDonutChart />
        </div>
      </div>

      {/* Recent Transactions + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Transactions */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Scheduled Payment
            </h3>
            <a
              href="/transactions"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton w-28 h-3.5 rounded mb-1.5" />
                    <div className="skeleton w-16 h-3 rounded" />
                  </div>
                  <div className="skeleton w-16 h-4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
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
                      {formatDate(txn.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold flex-shrink-0 ${
                      txn.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-500 dark:text-red-400'
                    }`}
                  >
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Spending Categories */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Top Categories
            </h3>
            <a
              href="/insights"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="skeleton w-24 h-3.5 rounded mb-2" />
                  <div className="skeleton w-full h-2.5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {cat.category}
                    </span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {formatCurrency(cat.amount)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: getCategoryColor(cat.category),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Budget Overview */}
      {!loading && budgetProgress.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Monthly Budget Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {budgetProgress.map((b) => (
              <div key={b.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {b.category}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatCurrency(b.spent)} / {formatCurrency(b.limit)}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${b.percentage}%`,
                      backgroundColor:
                        b.percentage >= 80 ? '#EF4444' : b.percentage >= 50 ? '#F97316' : '#22C55E',
                    }}
                  />
                </div>
                <p className="text-[11px] mt-1 text-slate-400 dark:text-slate-500">
                  {b.percentage >= 80
                    ? '⚠️ Nearing budget limit'
                    : b.percentage >= 50
                    ? 'Halfway through budget'
                    : '✅ Within budget'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
