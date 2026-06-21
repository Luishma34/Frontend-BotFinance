import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../contexts/useAuth'
import { useToast } from '../components/Toast'
import { openFinanceService } from '../services/openFinanceService'
import type { Transaction, PagedResponseFull } from '../types/openFinance'

interface Account {
  id: string
  account_id: string
  type: string
  owner: string | null
}

const TransactionsPage = () => {
  const { token } = useAuth()
  const { addToast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paginationData, setPaginationData] = useState<PagedResponseFull<Transaction> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [hasDescription, setHasDescription] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingDescription, setEditingDescription] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await openFinanceService.getTransactions(token, {
          account_id: selectedAccountId || undefined,
          page: currentPage,
          size: pageSize,
          has_description: hasDescription,
        })
        setTransactions(response.results)
        setPaginationData(response)
      } catch (err) {
        setError('Failed to fetch transactions')
        console.error('Error fetching transactions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [token, currentPage, pageSize, hasDescription, selectedAccountId])

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!token) return

      try {
        const accountsResponse = await openFinanceService.getAccounts(token)
        setAccounts(accountsResponse)
        if (accountsResponse.length > 0) {
          setSelectedAccountId(accountsResponse[0].id)
        }
      } catch (err) {
        console.error('Error fetching accounts:', err)
      }
    }

    fetchAccounts()
  }, [token])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatAmount = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount)
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case 'debit':
        return 'Débito'
      case 'credit':
        return 'Crédito'
      default:
        return type
    }
  }

  const getTransactionTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case 'debit':
        return 'negative'
      case 'credit':
        return 'positive'
      default:
        return 'neutral'
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  const handleEditDescription = (transaction: Transaction) => {
    setEditingId(transaction.id)
    setEditingDescription(transaction.description || '')
  }

  const handleSaveDescription = async (transactionId: string) => {
    if (!token) return
    
    try {
      setIsUpdating(true)
      await openFinanceService.updateTransactionDescription(
        token,
        transactionId,
        editingDescription
      )
      
      setTransactions(transactions.map(t => 
        t.id === transactionId 
          ? { ...t, description: editingDescription }
          : t
      ))
      setEditingId(null)
      setEditingDescription('')
      addToast('Descrição atualizada com sucesso!', 'success')
    } catch (err) {
      console.error('Error updating description:', err)
      addToast('Erro ao atualizar descrição', 'error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingDescription('')
  }

  const handleSyncTransactions = async () => {
    if (!token || !selectedAccountId) {
      addToast('Selecione uma conta para sincronizar', 'warning')
      return
    }

    try {
      setIsSyncing(true)
      await openFinanceService.syncTransactions(token, selectedAccountId)
      
      setCurrentPage(1)
      const response = await openFinanceService.getTransactions(token, {
        account_id: selectedAccountId,
        page: 1,
        size: pageSize,
        has_description: hasDescription,
      })
      setTransactions(response.results)
      setPaginationData(response)
      addToast('Transações sincronizadas com sucesso!', 'success')
    } catch (err) {
      console.error('Error syncing transactions:', err)
      addToast('Erro ao sincronizar transações', 'error')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Transações"
        subtitle="Visualize e organize suas transações."
      />

      <div className="dashboard-grid">
        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Histórico de Transações</span>
            <div className="card-actions">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                disabled={accounts.length === 0 || isSyncing}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontFamily: 'inherit',
                  marginRight: '8px',
                  opacity: accounts.length === 0 ? 0.6 : 1,
                  cursor: accounts.length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {accounts.length === 0 ? (
                  <option value="">Nenhuma conta disponível</option>
                ) : (
                  accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.owner || account.type}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={handleSyncTransactions}
                disabled={accounts.length === 0 || isSyncing}
                style={{
                  padding: '8px 16px',
                  background: accounts.length === 0 || isSyncing ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: accounts.length === 0 || isSyncing ? 'not-allowed' : 'pointer',
                  marginRight: '8px',
                  fontSize: '14px',
                }}
                title={accounts.length === 0 ? 'Nenhuma conta disponível para sincronizar' : ''}
              >
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </button>
              <select
                className="page-size-select"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
                <option value={100}>100 por página</option>
              </select>
            </div>
          </div>

          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
             <label style={{ marginRight: '20px', fontSize: '14px' }}>
               <input
                 type="radio"
                 name="description-filter"
                 checked={hasDescription === false}
                 onChange={() => {
                   setHasDescription(false)
                   setCurrentPage(1)
                 }}
               />
               {' '}Sem Descrição
             </label>
             <label style={{ fontSize: '14px' }}>
               <input
                 type="radio"
                 name="description-filter"
                 checked={hasDescription === true}
                 onChange={() => {
                   setHasDescription(true)
                   setCurrentPage(1)
                 }}
               />
               {' '}Com Descrição
             </label>
          </div>

          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Carregando transações...</div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              Nenhuma transação encontrada.
            </div>
          ) : (
            <>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Tipo</th>
                      <th>ID da Transação</th>
                      <th>Valor</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{formatDate(transaction.date)}</td>
                        <td>
                          {editingId === transaction.id ? (
                            <input
                              type="text"
                              value={editingDescription}
                              onChange={(e) => setEditingDescription(e.target.value)}
                              placeholder="Adicione uma descrição"
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontFamily: 'inherit',
                              }}
                            />
                          ) : (
                            <span style={{ color: transaction.description ? 'inherit' : '#9ca3af' }}>
                              {transaction.description || 'Sem descrição'}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`transaction-type ${getTransactionTypeClass(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="text-muted">{transaction.transaction_id}</td>
                        <td className={getTransactionTypeClass(transaction.type)}>
                          {formatAmount(transaction.amount, transaction.currency_code)}
                        </td>
                        <td>
                          {editingId === transaction.id ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleSaveDescription(transaction.id)}
                                disabled={isUpdating}
                                style={{
                                  padding: '4px 8px',
                                  background: '#10b981',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                }}
                              >
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                style={{
                                  padding: '4px 8px',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditDescription(transaction)}
                              style={{
                                padding: '4px 8px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                              }}
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {paginationData && paginationData.total_pages > 1 && (
                <div style={{ 
                  padding: '16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Página {paginationData.page} de {paginationData.total_pages} (Total: {paginationData.total} transações)
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      style={{
                        padding: '8px 12px',
                        background: currentPage === 1 ? '#d1d5db' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(paginationData.total_pages, prev + 1))}
                      disabled={currentPage === paginationData.total_pages}
                      style={{
                        padding: '8px 12px',
                        background: currentPage === paginationData.total_pages ? '#d1d5db' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: currentPage === paginationData.total_pages ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              )}
             </>
           )}
        </section>
      </div>
    </>
  )
}

export default TransactionsPage
