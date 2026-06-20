import { useState, useCallback, useRef, useEffect } from 'react'
import { llmService } from '../services/llmService'

export interface Message {
  id: string
  author: 'user' | 'assistant'
  text: string
  timestamp: number
}

interface UseChatOptions {
  accountId: string
  token: string
  storageKey?: string
}

const STORAGE_KEY_PREFIX = 'botfinance.chat'

const loadMessagesFromStorage = (accountId: string, storageKey: string) => {
  const key = `${storageKey}.${accountId}`
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored) as Message[]
    } catch {
      return []
    }
  }
  return []
}

export const useChat = ({ accountId, token, storageKey = STORAGE_KEY_PREFIX }: UseChatOptions) => {
  const [messages, setMessages] = useState<Message[]>(() =>
    loadMessagesFromStorage(accountId, storageKey)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prevAccountIdRef = useRef(accountId)

  const getStorageKey = useCallback(
    (id: string) => `${storageKey}.${id}`,
    [storageKey]
  )

  useEffect(() => {
    if (prevAccountIdRef.current !== accountId) {
      const newMessages = loadMessagesFromStorage(accountId, storageKey)
      setMessages(newMessages)
      prevAccountIdRef.current = accountId
    }
  }, [accountId, storageKey])

  const saveMessagesToStorage = useCallback(
    (msgs: Message[]) => {
      const key = getStorageKey(accountId)
      localStorage.setItem(key, JSON.stringify(msgs))
    },
    [accountId, getStorageKey]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        return
      }

      setError(null)
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        author: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      saveMessagesToStorage(updatedMessages)

      setIsLoading(true)

      try {
        const response = await llmService.chat(token, {
          account_id: accountId,
          message: text.trim(),
        })

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          author: 'assistant',
          text: response.response,
          timestamp: Date.now(),
        }

        const finalMessages = [...updatedMessages, assistantMessage]
        setMessages(finalMessages)
        saveMessagesToStorage(finalMessages)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, accountId, token, saveMessagesToStorage]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    const storageKey = getStorageKey(accountId)
    localStorage.removeItem(storageKey)
    setError(null)
  }, [accountId, getStorageKey])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
