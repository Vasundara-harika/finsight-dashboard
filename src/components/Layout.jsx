import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Toast from './Toast'

/**
 * Layout — wraps all pages with the sidebar, navbar, and toast container.
 * Sidebar is fixed left on desktop, bottom bar on mobile.
 */
const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="lg:ml-[220px] min-h-screen pb-20 lg:pb-0">
        <Navbar />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Global toast notification container */}
      <Toast />
    </div>
  )
}

export default Layout
