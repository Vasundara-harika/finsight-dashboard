import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useAppContext } from '../context/AppContext'
import { calculateMonthlyData, formatCurrency } from '../utils/helpers'

/**
 * BalanceTrendChart — line chart showing cumulative balance trend over months.
 * Orange smooth curve with tooltip showing ₹ amounts.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const BalanceTrendChart = () => {
  const { transactions, loading } = useAppContext()

  const data = useMemo(() => calculateMonthlyData(transactions), [transactions])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="skeleton w-40 h-5 rounded mb-4" />
        <div className="skeleton w-full h-[250px] rounded" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 animate-fade-in">
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Balance Trend
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" className="dark:opacity-20" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#94A3B8' }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#F97316"
            strokeWidth={3}
            dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BalanceTrendChart
