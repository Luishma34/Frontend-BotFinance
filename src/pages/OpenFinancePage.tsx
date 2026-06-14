import PageHeader from '../components/PageHeader'
import { bankConnections, syncLogs } from '../data/mockData'
import { classNames } from '../lib/classNames'

const OpenFinancePage = () => {
  return (
    <>
      <PageHeader
        title="Conexões Bancárias"
        subtitle="Gerencie suas integrações via Open Finance."
        rightSlot={
          <button type="button" className="btn-connect">
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

          <div className="bank-list">
            {bankConnections.map((connection) => (
              <article
                key={connection.bankName}
                className={classNames('bank-card', connection.status === 'error' && 'bank-card-error')}
              >
                <div className="bank-header">
                  <div
                    className="bank-logo"
                    style={
                      connection.accentColor
                        ? { background: connection.accentColor, color: '#fff' }
                        : undefined
                    }
                  >
                    {connection.bankInitial}
                  </div>
                  <div className="bank-details">
                    <h3>{connection.bankName}</h3>
                    <p>{connection.account}</p>
                  </div>
                </div>
                <div className={classNames('connection-status', connection.status)}>
                  <div className="status-dot" />
                  <span>{connection.statusLabel}</span>
                  <button
                    type="button"
                    className={classNames(
                      'btn-inline',
                      connection.status === 'connected' ? 'danger-text' : 'btn-reconnect',
                    )}
                  >
                    {connection.actionLabel}
                  </button>
                </div>
              </article>
            ))}
          </div>
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
