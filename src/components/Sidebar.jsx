import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  HelpCircle,
  User,
} from 'lucide-react'

/**
 * Sidebar — fixed left navigation with user profile, menu links, and other pages.
 * Collapses to a bottom tab bar on mobile screens.
 */
const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/insights', label: 'Insights', icon: TrendingUp },
]

const otherItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/help', label: 'Help', icon: HelpCircle },
]

// All routable items for mobile bottom bar (top 3 + settings)
const mobileItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/insights', label: 'Insights', icon: TrendingUp },
  { path: '/settings', label: 'Settings', icon: Settings },
]

const Sidebar = () => {
  const location = useLocation()

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const linkClasses = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-orange-50 dark:bg-orange-500/10 text-primary'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
    }`

  const iconClasses = (path) =>
    `w-5 h-5 ${isActive(path) ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[220px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-30">
        {/* User Profile Section */}
        <NavLink to="/profile" className="flex flex-col items-center pt-8 pb-6 px-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Andi Johnson
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Financial Manager
          </p>
        </NavLink>

        {/* Menu Section */}
        <div className="flex-1 px-3 pt-6 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClasses(item.path)}>
                <item.icon className={iconClasses(item.path)} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Others Section */}
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3 mt-8">
            Others
          </p>
          <nav className="flex flex-col gap-1">
            {otherItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClasses(item.path)}>
                <item.icon className={iconClasses(item.path)} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-30 flex justify-around items-center py-2 px-4">
        {mobileItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isActive(item.path) ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default Sidebar
