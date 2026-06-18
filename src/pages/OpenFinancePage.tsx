import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../contexts/useAuth'
import { openFinanceService } from '../services/openFinanceService'
import { syncLogs } from '../data/mockData'
import { classNames } from '../lib/classNames'
import type { OpenFinanceResponse, ConnectionStatus } from '../types/openFinance'

const OpenFinancePage = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [bankConnections, setBankConnections] = useState<OpenFinanceResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        <section className="card col-span-2">
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
                  <article
                    key={connection.id}
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
                ))
              )}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title">Log de Sincronização</span>
          </div>
          <ul className="sync-log-list">
            {syncLogs.map((log) => (
              <li key={`${log.title}-${log.time}`}>
                <span className={classNames('sync-title', log.tone)}>{log.tone === 'success' ? '✓' : '!'} {log.title}</span>
                <br />
                {log.detail}
                <br />
                <span className="sync-time">{log.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export default OpenFinancePage
