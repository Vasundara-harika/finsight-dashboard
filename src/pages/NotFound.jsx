import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

/**
 * NotFound — 404 page displayed when the user navigates to an invalid route.
 * Clean design with orange accent, animated icon, and a link back to the dashboard.
 */
const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary-hover transition-all shadow-lg shadow-orange-300/40 dark:shadow-orange-500/20 hover:scale-105"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}

export default NotFound
