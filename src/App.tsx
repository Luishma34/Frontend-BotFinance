import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AssistantPage from './pages/AssistantPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import FinancePage from './pages/FinancePage'
import OpenFinancePage from './pages/OpenFinancePage'
import TransactionsPage from './pages/TransactionsPage'
import Widget from './pages/Widget'

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
        path: 'open-finance',
        element: <OpenFinancePage />,
      },
      {
        path: 'transacoes',
        element: <TransactionsPage />,
      },
      {
        path: 'widget',
        element: <Widget />,
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
