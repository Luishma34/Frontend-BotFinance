import { httpClient } from './httpClient'

export interface Payable {
  id: string
  description: string
  category: string
  value: number
  due_date: string
  status: 'pending' | 'overdue' | 'paid'
  created_at: string
}

export interface Receivable {
  id: string
  client: string
  value: number
  forecast_date: string
  status: string
  created_at: string
}

export interface CreatePayableRequest {
  description: string
  category: string
  value: number
  due_date: string
  status?: string
}

export interface CreateReceivableRequest {
  client: string
  value: number
  forecast_date: string
  status?: string
}

export const financialService = {
  getPayables: (token: string) => {
    return httpClient.get<Payable[]>('/financial/payables', token)
  },

  createPayable: (token: string, data: CreatePayableRequest) => {
    return httpClient.post<Payable>('/financial/payables', data, token)
  },

  updatePayable: (token: string, id: string, data: CreatePayableRequest) => {
    return httpClient.put<Payable>(`/financial/payables/${id}`, data, token)
  },

  deletePayable: (token: string, id: string) => {
    return httpClient.delete(`/financial/payables/${id}`, token)
  },

  getReceivables: (token: string) => {
    return httpClient.get<Receivable[]>('/financial/receivables', token)
  },

  createReceivable: (token: string, data: CreateReceivableRequest) => {
    return httpClient.post<Receivable>('/financial/receivables', data, token)
  },

  updateReceivable: (token: string, id: string, data: CreateReceivableRequest) => {
    return httpClient.put<Receivable>(`/financial/receivables/${id}`, data, token)
  },

  deleteReceivable: (token: string, id: string) => {
    return httpClient.delete(`/financial/receivables/${id}`, token)
  },
}

