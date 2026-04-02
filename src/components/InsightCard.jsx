/**
 * InsightCard — displays a single insight metric with icon, label, and value.
 * Used on the Insights page for key observations.
 */
const InsightCard = ({ icon: Icon, label, value, subtext, color = 'bg-primary' }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 card-hover animate-fade-in">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsightCard
