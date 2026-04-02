import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Help from './pages/Help'
import NotFound from './pages/NotFound'

/**
 * App component — defines routes within the shared Layout shell.
 * 6 pages: Dashboard, Transactions, Insights, Settings, Profile, Help.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
