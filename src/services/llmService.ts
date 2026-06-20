import { httpClient } from './httpClient'

export interface ChatRequest {
  account_id: string
  message: string
}

export interface ChatResponse {
  response: string
}

export const llmService = {
  chat(token: string, request: ChatRequest) {
    return httpClient.post<ChatResponse, ChatRequest>('/llm-chat/transactions', request, token)
  },
}
