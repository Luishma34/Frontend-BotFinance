import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../contexts/useAuth'
import { useToast } from '../components/Toast'
import { openFinanceService } from '../services/openFinanceService'
import { classNames } from '../lib/classNames'
import type { OpenFinanceResponse, ConnectionStatus, Account } from '../types/openFinance'

interface ExpandedConnection {
  [key: string]: boolean
}

const OpenFinancePage = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { addToast } = useToast()
  const [bankConnections, setBankConnections] = useState<OpenFinanceResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedConnections, setExpandedConnections] = useState<ExpandedConnection>({})
  const [accountsLoading, setAccountsLoading] = useState<{ [key: string]: boolean }>({})
  const [accountsByConnection, setAccountsByConnection] = useState<{ [key: string]: Account[] }>({})
  const [creatingAccount, setCreatingAccount] = useState<{ [key: string]: boolean }>({})
  const [syncingAccount, setSyncingAccount] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const fetchConnections = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await openFinanceService.getItems(token)
        setBankConnections(response)
      } catch (err) {
        console.error('Error fetching bank connections:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConnections()
  }, [token])

  const getStatusLabel = (status: ConnectionStatus): string => {
    switch (status) {
      case 'UPDATED':
        return 'Conectado'
      case 'LOGIN_ERROR':
        return 'Erro de Login'
      case 'UPDATING':
        return 'Atualizando'
      case 'OUTDATED':
        return 'Desatualizado'
      default:
        return 'Desconhecido'
    }
  }

  const getActionLabel = (status: ConnectionStatus): string => {
    switch (status) {
      case 'UPDATED':
        return 'Desconectar'
      case 'LOGIN_ERROR':
        return 'Reconectar'
      case 'UPDATING':
        return 'Aguarde'
      case 'OUTDATED':
        return 'Atualizar'
      default:
        return 'Reconectar'
    }
  }

  const getStatusClass = (status: ConnectionStatus): string => {
    switch (status) {
      case 'UPDATED':
        return 'connected'
      case 'LOGIN_ERROR':
        return 'error'
      case 'UPDATING':
        return 'updating'
      case 'OUTDATED':
        return 'outdated'
      default:
        return 'unknown'
    }
  }

  const toggleAccountsExpanded = async (connectionId: string) => {
    const isExpanded = expandedConnections[connectionId]
    
    if (isExpanded) {
      setExpandedConnections(prev => ({ ...prev, [connectionId]: false }))
    } else {
      if (!accountsByConnection[connectionId]) {
        await loadAccountsForConnection(connectionId)
      }
      setExpandedConnections(prev => ({ ...prev, [connectionId]: true }))
    }
  }

  const loadAccountsForConnection = async (connectionId: string) => {
    if (!token) return
    
    try {
      setAccountsLoading(prev => ({ ...prev, [connectionId]: true }))
      const accounts = await openFinanceService.getAccountsNotSynced(token, connectionId)
      setAccountsByConnection(prev => ({ ...prev, [connectionId]: accounts }))
    } catch (err) {
      console.error(`Error fetching accounts for connection ${connectionId}:`, err)
      setAccountsByConnection(prev => ({ ...prev, [connectionId]: [] }))
    } finally {
      setAccountsLoading(prev => ({ ...prev, [connectionId]: false }))
    }
  }

  const handleCreateAndSyncAccount = async (connectionId: string, account: Account) => {
    if (!token) return

    const accountKey = `${connectionId}-${account.account_id}`

    try {
      setCreatingAccount(prev => ({ ...prev, [accountKey]: true }))
      
      const createdAccount = await openFinanceService.createAccount(token, {
        open_finance_connection: connectionId,
        account_id: account.account_id,
        owner: account.owner || 'Conta sem nome',
        balance: account.balance,
        type: account.type,
        currency_code: account.currency_code,
      })

      setCreatingAccount(prev => ({ ...prev, [accountKey]: false }))
      setSyncingAccount(prev => ({ ...prev, [accountKey]: true }))
      
      if (createdAccount?.id) {
        await openFinanceService.syncTransactions(token, createdAccount.id)
      }

      addToast('Conta sincronizada com sucesso! Vá para a página de Transações para ver os dados.', 'success')
      
      await loadAccountsForConnection(connectionId)
    } catch (err) {
      console.error('Error creating/syncing account:', err)
      addToast('Erro ao sincronizar conta. Tente novamente.', 'error')
    } finally {
      setCreatingAccount(prev => ({ ...prev, [accountKey]: false }))
      setSyncingAccount(prev => ({ ...prev, [accountKey]: false }))
    }
  }

  const formatCurrency = (balance: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(balance)
  }

  return (
    <>
      <PageHeader
        title="Conexões Bancárias"
        subtitle="Gerencie suas integrações via Open Finance."
        rightSlot={
          <button type="button" className="btn-connect" onClick={() => navigate('/widget')}>
            <span>+</span> Nova Conexão
          </button>
        }
      />

      <section className="security-badge">
        <span className="security-icon" aria-hidden="true">
          🔒
        </span>
        <div>
          <strong>Ambiente Seguro:</strong> Seus dados são criptografados e sincronizados apenas para leitura via APIs oficiais do Open Finance.
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Instituições Conectadas</span>
          </div>

          {isLoading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Carregando conexões...</div>
          ) : (
            <div className="bank-list">
              {bankConnections.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  Nenhuma conexão encontrada. Clique em "Nova Conexão" para começar.
                </div>
              ) : (
                bankConnections.map((connection) => (
                  <div key={connection.id}>
                    <article
                      className={classNames('bank-card', connection.status === 'LOGIN_ERROR' && 'bank-card-error')}
                    >
                      <div className="bank-header">
                        <div className="bank-logo">
                          <img
                            src={connection.institution_image_url}
                            alt={connection.institution_name}
                            style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              e.currentTarget.parentElement!.textContent = connection.institution_name.charAt(0)
                            }}
                          />
                        </div>
                        <div className="bank-details">
                          <h3>{connection.institution_name}</h3>
                          <p>ID: {connection.id}</p>
                        </div>
                      </div>
                      <div className={classNames('connection-status', getStatusClass(connection.status))}>
                        <div className="status-dot" />
                        <span>{getStatusLabel(connection.status)}</span>
                        <button
                          type="button"
                          className={classNames(
                            'btn-inline',
                            connection.status === 'UPDATED' ? 'danger-text' : 'btn-reconnect',
                          )}
                        >
                          {getActionLabel(connection.status)}
                        </button>
                      </div>
                    </article>

                    {connection.status === 'UPDATED' && (
                      <div style={{ padding: '0 0 16px 0' }}>
                        <button
                          onClick={() => toggleAccountsExpanded(connection.id)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: expandedConnections[connection.id] ? '#f0f0f0' : '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            color: '#3b82f6',
                            fontWeight: '500',
                            fontSize: '14px',
                          }}
                        >
                          {expandedConnections[connection.id] ? '▼' : '▶'} Contas Disponíveis
                        </button>

                        {expandedConnections[connection.id] && (
                          <div style={{
                            border: '1px solid #e5e7eb',
                            borderTop: 'none',
                            borderRadius: '0 0 4px 4px',
                            padding: '16px',
                            backgroundColor: '#fafafa',
                          }}>
                            {accountsLoading[connection.id] ? (
                              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                Carregando contas...
                              </div>
                            ) : accountsByConnection[connection.id]?.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                Nenhuma conta disponível para sincronizar.
                              </div>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {accountsByConnection[connection.id]?.map((account) => {
                                  const accountKey = `${connection.id}-${account.account_id}`
                                  const isCreating = creatingAccount[accountKey]
                                  const isSyncing = syncingAccount[accountKey]
                                  const isProcessing = isCreating || isSyncing

                                  return (
                                    <div
                                      key={account.account_id}
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px',
                                        background: '#ffffff',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                      }}
                                    >
                                      <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                          {account.owner || account.type}
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                          Tipo: {account.type} • Saldo: {formatCurrency(account.balance, account.currency_code)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                          ID: {account.account_id}
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => handleCreateAndSyncAccount(connection.id, account)}
                                        disabled={isProcessing}
                                        style={{
                                          padding: '8px 16px',
                                          background: isProcessing ? '#9ca3af' : '#10b981',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '4px',
                                          cursor: isProcessing ? 'not-allowed' : 'pointer',
                                          fontSize: '14px',
                                          fontWeight: '500',
                                          marginLeft: '12px',
                                          whiteSpace: 'nowrap',
                                        }}
                                      >
                                        {isCreating ? 'Criando...' : isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                                      </button>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

export default OpenFinancePage
