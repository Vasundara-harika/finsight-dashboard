import { useMemo } from 'react'
import { ShoppingBag, PiggyBank, Receipt, TrendingUp, Heart, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import InsightCard from '../components/InsightCard'
import MonthlyComparisonChart from '../components/MonthlyComparisonChart'
import CategoryBarChart from '../components/CategoryBarChart'
import {
  calculateSummary,
  calculateMonthlyData,
  calculateCategoryTotals,
  formatCurrency,
  getPercentageChange,
} from '../utils/helpers'

/**
 * Insights page — key financial insights with cards and charts,
 * plus a Financial Health Score card based on real transaction data.
 */

// Calculate a 0–100 financial health score from transaction data
const computeHealthScore = ({ savingsRate, categoryCount, txnCount, momChangeNum }) => {
  let score = 0

  // Savings rate contributes 40 points (>20% = 40, 10–20% = 25, 0–10% = 15, negative = 0)
  if (savingsRate >= 20) score += 40
  else if (savingsRate >= 10) score += 25
  else if (savingsRate >= 0) score += 15

  // Diversity of spending (more categories = healthier tracking) — up to 20 points
  score += Math.min(categoryCount * 4, 20)

  // Transaction frequency (more records = better tracking) — up to 20 points
  score += Math.min(txnCount, 20)

  // Expense trend (decreasing month-over-month = good) — up to 20 points
  if (momChangeNum !== null) {
    if (momChangeNum < 0) score += 20 // expenses decreased
    else if (momChangeNum < 10) score += 12 // slight increase
    else score += 5 // big increase
  } else {
    score += 10 // not enough data, neutral
  }

  return Math.min(score, 100)
}

const getHealthLabel = (score) => {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500', icon: CheckCircle }
  if (score >= 60) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-500', icon: CheckCircle }
  if (score >= 40) return { label: 'Fair', color: 'text-orange-500', bg: 'bg-orange-500', icon: AlertTriangle }
  return { label: 'Needs Attention', color: 'text-red-500', bg: 'bg-red-500', icon: XCircle }
}

const Insights = () => {
  const { transactions, totalIncome, totalExpenses, loading } = useAppContext()

  const summary = useMemo(() => calculateSummary(transactions), [transactions])
  const monthlyData = useMemo(() => calculateMonthlyData(transactions), [transactions])
  const categoryTotals = useMemo(() => calculateCategoryTotals(transactions), [transactions])

  // Highest spending category
  const highestCategory = useMemo(() => {
    if (categoryTotals.length === 0) return { category: 'N/A', amount: 0 }
    return categoryTotals[0]
  }, [categoryTotals])

  // Savings rate for the latest month
  const savingsRateNum = useMemo(() => {
    if (monthlyData.length === 0) return 0
    const latest = monthlyData[monthlyData.length - 1]
    if (latest.income === 0) return 0
    return ((latest.income - latest.expenses) / latest.income) * 100
  }, [monthlyData])

  const savingsRate = savingsRateNum.toFixed(1)

  // Biggest single expense
  const biggestExpense = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    if (expenses.length === 0) return { description: 'N/A', amount: 0 }
    return expenses.reduce((max, txn) => (txn.amount > max.amount ? txn : max), expenses[0])
  }, [transactions])

  // Month over month change in expenses
  const momChangeNum = useMemo(() => {
    if (monthlyData.length < 2) return null
    const curr = monthlyData[monthlyData.length - 1]
    const prev = monthlyData[monthlyData.length - 2]
    return getPercentageChange(curr.expenses, prev.expenses)
  }, [monthlyData])

  const momChange = momChangeNum !== null ? momChangeNum + '%' : 'N/A'

  // Financial Health Score
  const healthScore = useMemo(
    () =>
      computeHealthScore({
        savingsRate: savingsRateNum,
        categoryCount: categoryTotals.length,
        txnCount: transactions.length,
        momChangeNum,
      }),
    [savingsRateNum, categoryTotals.length, transactions.length, momChangeNum]
  )

  const health = getHealthLabel(healthScore)
  const HealthIcon = health.icon

  // Health score breakdown items
  const healthBreakdown = useMemo(() => {
    const items = []
    if (savingsRateNum >= 20) items.push({ label: 'Strong savings rate', good: true })
    else if (savingsRateNum >= 0) items.push({ label: 'Savings rate could improve', good: false })
    else items.push({ label: 'Spending exceeds income', good: false })

    if (categoryTotals.length >= 5) items.push({ label: 'Diverse expense tracking', good: true })
    else items.push({ label: 'Track more categories', good: false })

    if (momChangeNum !== null && momChangeNum < 0) items.push({ label: 'Expenses decreasing', good: true })
    else if (momChangeNum !== null) items.push({ label: 'Expenses increasing', good: false })

    if (transactions.length >= 15) items.push({ label: 'Good transaction history', good: true })
    else items.push({ label: 'Add more transactions for better insights', good: false })

    return items
  }, [savingsRateNum, categoryTotals.length, momChangeNum, transactions.length])

  // Skeleton state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <div className="skeleton w-20 h-3.5 rounded mb-2" />
                  <div className="skeleton w-28 h-5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="skeleton w-48 h-5 rounded mb-4" />
            <div className="skeleton w-full h-[300px] rounded" />
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="skeleton w-48 h-5 rounded mb-4" />
            <div className="skeleton w-full h-[300px] rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={ShoppingBag}
          label="Highest Spending Category"
          value={highestCategory.category}
          subtext={formatCurrency(highestCategory.amount)}
          color="bg-red-500"
        />
        <InsightCard
          icon={PiggyBank}
          label="Savings Rate (This Month)"
          value={`${savingsRate}%`}
          subtext={`Of ${formatCurrency(monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].income : 0)} income`}
          color="bg-green-500"
        />
        <InsightCard
          icon={Receipt}
          label="Biggest Single Expense"
          value={biggestExpense.description}
          subtext={formatCurrency(biggestExpense.amount)}
          color="bg-primary"
        />
        <InsightCard
          icon={TrendingUp}
          label="Month over Month Change"
          value={momChange}
          subtext="Change in total expenses"
          color="bg-blue-500"
        />
      </div>

      {/* Financial Health Score */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Score circle */}
          <div className="flex flex-col items-center gap-3 lg:min-w-[180px]">
            <div className="relative w-32 h-32">
              {/* Background ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(healthScore / 100) * 327} 327`}
                  className={health.color}
                  style={{ transition: 'stroke-dasharray 1s ease-out' }}
                />
              </svg>
              {/* Score number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${health.color}`}>{healthScore}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">out of 100</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <HealthIcon className={`w-4 h-4 ${health.color}`} />
              <span className={`text-sm font-semibold ${health.color}`}>{health.label}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                Financial Health Score
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Based on your savings rate, spending diversity, transaction history, and expense trends.
            </p>

            <div className="space-y-2.5">
              {healthBreakdown.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.good ? 'bg-green-100 dark:bg-green-500/10' : 'bg-red-100 dark:bg-red-500/10'}`}>
                    {item.good ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    )}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                💡 Tip: {healthScore >= 80
                  ? 'Your finances look great! Keep maintaining your healthy habits.'
                  : healthScore >= 60
                  ? 'You\'re on the right track. Focus on increasing your savings rate.'
                  : 'Try reducing expenses in your top spending category and tracking all transactions.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyComparisonChart />
        <CategoryBarChart />
      </div>
    </div>
  )
}

export default Insights
