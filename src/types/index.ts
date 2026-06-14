export type AppRoute = 'dashboard' | 'assistant' | 'finance' | 'reports' | 'open-finance'

export interface NavItem {
  route: AppRoute
  label: string
  icon: string
  path: string
}

export interface KpiCardData {
  title: string
  icon?: string
  amount: string
  trend?: {
    direction: 'positive' | 'negative'
    label: string
  }
}

export interface InsightItem {
  icon: string
  title: string
  description: string
}

export interface ConnectedAccount {
  name: string
  mask: string
  balance: string
  logoVariant: 'light' | 'dark'
}

export interface CashFlowBar {
  month: string
  heightPercent: number
  type: 'income' | 'expense'
  muted?: boolean
}

export interface ChatMessage {
  author: 'bot' | 'user'
  text: string
}

export interface PayableItem {
  dueDate: string
  description: string
  category: string
  value: string
  status: 'pending' | 'overdue' | 'paid'
}

export interface ReceivableItem {
  forecastDate: string
  client: string
  value: string
  status: string
}

export interface ReportSummaryItem {
  label: string
  value: string
  tone?: 'positive' | 'negative' | 'primary' | 'neutral'
}

export interface DreLine {
  category: string
  amount: string
  percent: string
  status: 'paid' | 'pending' | 'overdue'
  statusLabel: string
}

export interface ExpenseCompositionItem {
  label: string
  percent: number
  color: string
}

export interface BankConnection {
  bankInitial: string
  bankName: string
  account: string
  status: 'connected' | 'error'
  statusLabel: string
  actionLabel: string
  accentColor?: string
}

export interface SyncLogItem {
  title: string
  detail: string
  time: string
  tone: 'success' | 'pending'
}
