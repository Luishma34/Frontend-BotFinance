import PageHeader from '../components/PageHeader'
import { cashFlowBars, connectedAccounts, dashboardCards, dashboardInsights } from '../data/mockData'
import { classNames } from '../lib/classNames'

const DashboardPage = () => {
  return (
    <>
      <PageHeader
        title="Visão Geral"
        subtitle="Bem-vindo de volta, Emanuel!"
        rightSlot={
          <div className="user-profile">
            <span>Minha Empresa Ltda</span>
            <div className="avatar">LM</div>
          </div>
        }
      />

      <div className="dashboard-grid">
        {dashboardCards.map((card) => (
          <article className="card" key={card.title}>
            <div className="card-header">
              <span className="card-title">{card.title}</span>
              {card.icon ? <span>{card.icon}</span> : null}
            </div>
            <div className="amount">{card.amount}</div>
            {card.trend ? (
              <div className={classNames('trend', card.trend.direction)}>{card.trend.label}</div>
            ) : null}
          </article>
        ))}

        <section className="card ai-card col-span-2">
          <div className="card-header">
            <span className="card-title">✨ Insights do BotFinance</span>
          </div>
          {dashboardInsights.map((insight) => (
            <article className="insight-item" key={insight.title}>
              <span className="insight-icon" aria-hidden="true">
                {insight.icon}
              </span>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title">Contas Conectadas</span>
          </div>

          <div className="accounts-list">
            {connectedAccounts.map((account) => (
              <article className="account-item" key={account.name}>
                <div className="account-meta">
                  <div className={classNames('account-logo', account.logoVariant === 'dark' && 'dark')} />
                  <div>
                    <div className="account-name">{account.name}</div>
                    <div className="account-mask">{account.mask}</div>
                  </div>
                </div>
                <span className="account-balance">{account.balance}</span>
              </article>
            ))}
            <button type="button" className="btn-dashed">
              + Conectar nova conta
            </button>
          </div>
        </section>

        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Fluxo de Caixa (Últimos 6 Meses)</span>
          </div>
          <div className="chart-container" role="img" aria-label="Fluxo de caixa dos últimos seis meses">
            {cashFlowBars.map((bar) => (
              <div className="bar-group" key={bar.month}>
                <div
                  className={classNames('bar', bar.type === 'income' ? 'bar-income' : 'bar-expense', bar.muted && 'muted')}
                  style={{ height: `${bar.heightPercent}%` }}
                />
                <div className="month-label">{bar.month}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default DashboardPage
