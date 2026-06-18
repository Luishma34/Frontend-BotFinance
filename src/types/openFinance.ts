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
