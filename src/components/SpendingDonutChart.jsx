import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useAppContext } from '../context/AppContext'
import { calculateCategoryTotals, formatCurrency, getCategoryColor } from '../utils/helpers'

/**
 * SpendingDonutChart — donut (pie with inner radius) showing spending by category.
 * Custom legend below with color dots, category names, and amounts.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {payload[0].name}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const SpendingDonutChart = () => {
  const { timeFilteredTransactions, loading } = useAppContext()

  const data = useMemo(() => calculateCategoryTotals(timeFilteredTransactions), [timeFilteredTransactions])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="skeleton w-40 h-5 rounded mb-4" />
        <div className="skeleton w-48 h-48 rounded-full mx-auto mb-4" />
        <div className="flex flex-wrap gap-2 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton w-20 h-4 rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getCategoryColor(entry.category)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 justify-center">
        {data.map((entry) => (
          <div key={entry.category} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: getCategoryColor(entry.category) }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {entry.category}
            </span>
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {formatCurrency(entry.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpendingDonutChart
