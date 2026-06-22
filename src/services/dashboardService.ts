import { httpClient } from './httpClient'
import type { BalanceStatisticsResponse, BalanceHistoryResponse, AccountConnectedResponse, InsightsResponse } from '../types/openFinance'

export const dashboardService = {
    getBalanceStatistics: (token: string) => {
        return httpClient.get<BalanceStatisticsResponse>('/open-finance/accounts/balance-statistics', token)
    },
    getBalanceHistory: (token: string) => {
        return httpClient.get<BalanceHistoryResponse>('/open-finance/accounts/history-statistics', token)
    }, 
    getAccountConnected: (token: string) => {
        return httpClient.get<AccountConnectedResponse[]>('/open-finance/accounts/synced', token)
    },
    getInsights: (token: string) => {
        return httpClient.get<InsightsResponse>('/llm-chat/insights', token)
    }
}
