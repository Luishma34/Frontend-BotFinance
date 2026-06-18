import { httpClient } from './httpClient'
import type { OpenFinanceResponse, Transaction, PagedResponseFull, CreateItemData } from '../types/openFinance'

export const openFinanceService = {
  getItems(token: string) {
    return httpClient.get<OpenFinanceResponse[]>('/open-finance/items', token)
  },

  getSyncedTransactions(token: string, page: number, pageSize: number) {
    return httpClient.get<PagedResponseFull<Transaction>>(
      `/open-finance/transactions/synced?page=${page}&page_size=${pageSize}`,
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
}
