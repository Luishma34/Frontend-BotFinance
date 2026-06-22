export const ConnectionStatus = {
  UPDATED: 'UPDATED',
  LOGIN_ERROR: 'LOGIN_ERROR',
  UPDATING: 'UPDATING',
  OUTDATED: 'OUTDATED',
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export interface OpenFinanceResponse {
  id: string;
  user_id: string;
  pluggy_connection_id: string;
  institution_image_url: string;
  institution_name: string;
  status: ConnectionStatus;
  consent_expires_at: string | null;
  last_updated_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Transaction {
  id: string;
  account_id: string;
  transaction_id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  currency_code: string;
  user_id: string;
}

export interface Account {
  id?: string;
  account_id: string;
  owner: string | null;
  balance: number;
  type: string;
  currency_code: string;
}

export interface AccountResponse extends Account {
  id: string;
  open_finance_connection: string;
}

export interface PagedResponseFull<T> {
  page: number;
  total_pages: number;
  total: number;
  results: T[];
}

export interface CreateItemData {
  user_id: string;
  pluggy_connection_id: string;
  institution_name: string;
  institution_image_url: string;
  status: string;
  consent_expires_at: Date;
  last_updated_at: Date;
}
export interface StatisticsResponse {
  month: string;
  revenues: number;
  expenses: number;
}

export interface BalanceStatisticsResponse {
  total: number;
  statistics: StatisticsResponse;
}

export interface Month {
  month: string;
  value: number;
}

export interface BalanceHistoryResponse {
  revenue_months: Month[];
  expense_months: Month[];
  total: number;
}

export interface AccountConnectedResponse {
  account_id: string;
  balance: number;
  currency_code: string;
  id: string;
  open_finance_connection: string;
  owner: string;
  type: string;
  user_id: string;
}

export type InsightType = "OPORTUNIDADE_DE_ECONOMIA" | "RISCO_DE_FLUXO_DE_CAIXA" | "PADRAO_DE_GASTOS" | "DESPESA_RECORRENTE" | "ALERTA" | "SUGESTAO"

export interface Insight {
    type: InsightType
    title: string
    description: string
    severity: "LOW" | "MEDIUM" | "HIGH" | null
    actionable: boolean
    icon: string
}

export interface InsightsResponse {
    insights: Insight[]
    summary: string
}

