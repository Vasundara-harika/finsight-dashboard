import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useAppContext } from '../context/AppContext'
import { calculateCategoryTotals, formatCurrency, getCategoryColor } from '../utils/helpers'

/**
 * CategoryBarChart — horizontal bar chart ranking spending categories
 * from highest to lowest. Uses category-specific colors.
 */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {payload[0].payload.category}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const CategoryBarChart = () => {
  const { transactions, loading } = useAppContext()

  const data = useMemo(() => calculateCategoryTotals(transactions), [transactions])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="skeleton w-48 h-5 rounded mb-4" />
        <div className="skeleton w-full h-[300px] rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Spending by Category
      </h3>
      <ResponsiveContainer width="100%" height={data.length * 50 + 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:opacity-20" horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            width={75}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getCategoryColor(entry.category)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryBarChart
