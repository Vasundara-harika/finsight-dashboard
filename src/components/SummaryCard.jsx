import { TrendingUp, TrendingDown } from 'lucide-react'
import useCountUp from '../hooks/useCountUp'

/**
 * SummaryCard — displays a metric (Total Balance, Income, Expenses) with
 * an icon, formatted amount, and percentage change with count-up animation.
 * Uses the reusable useCountUp hook for smooth number transitions.
 */
const SummaryCard = ({ icon: Icon, label, amount, percentageChange, iconBg, loading }) => {
  const displayAmount = useCountUp(loading ? 0 : amount, 800)

  // Skeleton loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="skeleton w-10 h-10 rounded-lg" />
          <div className="skeleton w-16 h-5 rounded" />
        </div>
        <div className="skeleton w-24 h-4 rounded mb-2" />
        <div className="skeleton w-32 h-7 rounded" />
      </div>
    )
  }

  const isPositive = percentageChange && !String(percentageChange).startsWith('-')

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {percentageChange && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              isPositive
                ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {percentageChange}%
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 animate-count-up">
        ₹{displayAmount.toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default SummaryCard
