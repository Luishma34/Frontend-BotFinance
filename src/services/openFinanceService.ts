import { httpClient } from './httpClient'
import type { OpenFinanceResponse, Transaction, CreateItemData, Account, AccountResponse, PagedResponseFull } from '../types/openFinance'

interface TransactionFilters {
  account_id?: string
  transaction_type?: string
  start_date?: string
  end_date?: string
  has_description?: boolean
  page?: number
  size?: number
}

export const openFinanceService = {
  getItems(token: string) {
    return httpClient.get<OpenFinanceResponse[]>('/open-finance/items', token)
  },

  getTransactions(token: string, filters?: TransactionFilters) {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.account_id) params.append('account_id', filters.account_id)
      if (filters.transaction_type) params.append('transaction_type', filters.transaction_type)
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      if (filters.has_description !== undefined) params.append('has_description', String(filters.has_description))
      if (filters.page) params.append('page', String(filters.page))
      if (filters.size) params.append('size', String(filters.size))
    }
    
    const queryString = params.toString()
    const url = `/open-finance/transactions/${queryString ? '?' + queryString : ''}`
    
    return httpClient.get<PagedResponseFull<Transaction>>(url, token)
  },

  getSyncedTransactions(token: string, page: number, pageSize: number) {
    return this.getTransactions(token, { page, size: pageSize })
  },

  updateTransactionDescription(token: string, transactionId: string, description: string) {
    return httpClient.patch<Transaction, { description: string }>(
      `/open-finance/transactions/description/${transactionId}`,
      { description },
      token
    )
  },

  getAccounts(token: string) {
    return httpClient.get<AccountResponse[]>('/open-finance/accounts/synced', token)
  },

  getAccountsNotSynced(token: string, itemId: string, type?: string) {
    const params = new URLSearchParams()
    params.append('itemId', itemId)
    if (type) params.append('type', type)
    const queryString = params.toString()
    return httpClient.get<Account[]>(`/open-finance/accounts/not-synced?${queryString}`, token)
  },

  createAccount(token: string, accountData: {
    open_finance_connection: string
    account_id: string
    owner: string
    balance: number
    type: string
    currency_code: string
  }) {
    return httpClient.post<AccountResponse, typeof accountData>(
      '/open-finance/accounts',
      accountData,
      token
    )
  },

  syncTransactions(token: string, accountId: string) {
    return httpClient.post<Transaction[], unknown>(
      `/open-finance/transactions/sync/${accountId}`,
      {},
      token
    )
  },

  getConnectToken(token: string, clientUserId: string) {
    return httpClient.post<{ accessToken: string }, { options: { clientUserId: string } }>(
      '/open-finance/connect-token',
      { options: { clientUserId } },
      token
    )
  },

  createItem(token: string, data: CreateItemData) {
    return httpClient.post<unknown, CreateItemData>('/open-finance/item', data, token)
  },
  unsyncItem(token: string, itemId: string) {
    return httpClient.delete(`/open-finance/item/unsync/${itemId}`, token)
  }
}
