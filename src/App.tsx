import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AssistantPage from './pages/AssistantPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import FinancePage from './pages/FinancePage'
import OpenFinancePage from './pages/OpenFinancePage'
import ReportsPage from './pages/ReportsPage'

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'assistente',
        element: <AssistantPage />,
      },
      {
        path: 'financeiro',
        element: <FinancePage />,
      },
      {
        path: 'relatorios',
        element: <ReportsPage />,
      },
      {
        path: 'open-finance',
        element: <OpenFinancePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
