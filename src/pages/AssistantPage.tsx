import { useMemo, useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import ChatMessage from '../components/ChatMessage'
import { useAuth } from '../contexts/useAuth'
import { useChat } from '../hooks/useChat'
import { openFinanceService } from '../services/openFinanceService'
import type { AccountResponse } from '../types/openFinance'

const AssistantPage = () => {
  const { token, isAuthenticated } = useAuth()
  const [draft, setDraft] = useState('')
  const [accounts, setAccounts] = useState<AccountResponse[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [accountsError, setAccountsError] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const normalizedDraft = useMemo(() => draft.trim(), [draft])

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    accountId: selectedAccountId,
    token: token || '',
    storageKey: 'botfinance.chat',
  })

  useEffect(() => {
    const loadAccounts = async () => {
      if (!token || !isAuthenticated) {
        setIsLoadingAccounts(false)
        return
      }

      try {
        setIsLoadingAccounts(true)
        setAccountsError(null)
        const fetchedAccounts = await openFinanceService.getAccounts(token)
        setAccounts(fetchedAccounts)
        if (fetchedAccounts.length > 0) {
          setSelectedAccountId(fetchedAccounts[0].id)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar contas'
        setAccountsError(errorMessage)
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    loadAccounts()
  }, [token, isAuthenticated])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!normalizedDraft || !selectedAccountId || isLoading) {
      return
    }
    await sendMessage(normalizedDraft)
    setDraft('')
  }

  const handleClearChat = () => {
    setShowClearConfirm(true)
  }

  const handleConfirmClear = () => {
    clearMessages()
    setShowClearConfirm(false)
  }

  const handleCancelClear = () => {
    setShowClearConfirm(false)
  }

  if (!isAuthenticated) {
    return (
      <>
        <PageHeader title="Assistente Financeiro" subtitle="Tire dúvidas e receba análises estratégicas." />
        <section className="chat-container">
          <div className="error-message">Você precisa estar autenticado para usar o assistente.</div>
        </section>
      </>
    )
  }

  if (isLoadingAccounts) {
    return (
      <>
        <PageHeader title="Assistente Financeiro" subtitle="Tire dúvidas e receba análises estratégicas." />
        <section className="chat-container">
          <div className="loading-message">Carregando contas...</div>
        </section>
      </>
    )
  }

  if (accountsError || accounts.length === 0) {
    return (
      <>
        <PageHeader title="Assistente Financeiro" subtitle="Tire dúvidas e receba análises estratégicas." />
        <section className="chat-container">
          <div className="error-message">
            {accountsError || 'Nenhuma conta conectada. Conecte uma conta para usar o assistente.'}
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Assistente Financeiro" subtitle="Tire dúvidas e receba análises estratégicas." />

      <section className="chat-container">
        <div className="chat-header">
          <div className="account-selector">
            <label htmlFor="account-select">Analisar conta:</label>
            <select
              id="account-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.owner || 'Sem nome'} ({account.account_id})
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn-clear-chat"
            onClick={handleClearChat}
            disabled={messages.length === 0}
            title="Limpar conversa"
          >
            Limpar
          </button>
        </div>

        <div className="chat-history" aria-live="polite">
          {messages.length === 0 && !error && (
            <div className="empty-state">
              <p>Comece uma conversa com o assistente financeiro.</p>
              <p className="hint">Ex: "Quanto gastei com alimentação?" ou "Qual foi minha maior compra?"</p>
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {error && <div className="error-message">{error}</div>}
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Digite sua pergunta (ex: Como reduzir meus custos?)..."
            disabled={isLoading}
          />
          <button type="submit" className="btn-send" disabled={!normalizedDraft || isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </section>

      {showClearConfirm && (
        <div className="modal-overlay" onClick={handleCancelClear}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Limpar conversa</h3>
            <p>Tem certeza que deseja limpar toda a conversa? Esta ação não pode ser desfeita.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={handleCancelClear}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleConfirmClear}
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AssistantPage
