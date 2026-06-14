import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppShell = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
