import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../contexts/useAuth'
import { dashboardService } from '../services/dashboardService'
import { classNames } from '../lib/classNames'
import type { KpiCardData, CashFlowBar } from '../types'
import type { AccountConnectedResponse, InsightsResponse } from '../types/openFinance'

const DashboardPage = () => {
  const { username, token } = useAuth()
  const displayName = username ?? 'Usuário'
  const [dashboardCards, setDashboardCards] = useState<KpiCardData[]>([])
  const [cashFlowBars, setCashFlowBars] = useState<CashFlowBar[]>([])
  const [accountConnected, setAccountConnected] = useState<AccountConnectedResponse[]>([])
  const [insights, setInsights] = useState<InsightsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function getInsights() {
    try {
      const insightsResponse = await dashboardService.getInsights(token)
      sessionStorage.setItem('insights', JSON.stringify(insightsResponse))

      return insightsResponse
    } catch (insightsError) {
      sessionStorage.setItem('insights', '{"insights": [], "summary": "Ocorreu um erro. Uma nova tentativa será feita em breve."}')
      console.error('Error fetching insights:', insightsError)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }

      try {
        const [statisticsResponse, historyResponse, accountConnectedResponse] = await Promise.all([
          dashboardService.getBalanceStatistics(token),
          dashboardService.getBalanceHistory(token),
          dashboardService.getAccountConnected(token),
        ])

        const cards: KpiCardData[] = [
          {
            title: 'Saldo Total',
            icon: '💰',
            amount: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(statisticsResponse.total),
          },
          {
            title: `Receitas (${statisticsResponse.statistics.month})`,
            icon: '',
            amount: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(statisticsResponse.statistics.revenues),
          },
          {
            title: `Despesas (${statisticsResponse.statistics.month})`,
            icon: '',
            amount: new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(statisticsResponse.statistics.expenses),
          },
        ]
        setDashboardCards(cards)

        const allMonths = new Set([
          ...historyResponse.revenue_months.map((r) => r.month),
          ...historyResponse.expense_months.map((e) => e.month),
        ])
        const sortedMonths = Array.from(allMonths).slice(-6)

        const maxValue = Math.max(
          ...historyResponse.revenue_months.map((r) => r.value),
          ...historyResponse.expense_months.map((e) => e.value)
        )

        const bars: CashFlowBar[] = []
        sortedMonths.forEach((month) => {
          const revenue = historyResponse.revenue_months.find((r) => r.month === month)
          const expense = historyResponse.expense_months.find((e) => e.month === month)

          if (revenue) {
            bars.push({
              month,
              heightPercent: (revenue.value / maxValue) * 100,
              value: revenue.value,
              type: 'income',
            })
          }
          if (expense) {
            bars.push({
              month,
              heightPercent: (Math.abs(expense.value) / maxValue) * 100,
              value: expense.value,
              type: 'expense',
            })
          }
        })

        setCashFlowBars(bars)    
        setAccountConnected(accountConnectedResponse)
      } catch (err) {
        setError('Failed to fetch dashboard data')
        console.error('Error fetching dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    const loadInsights = async () => {
      const insights = sessionStorage.getItem('insights')
      if (insights) {
        setInsights(JSON.parse(insights))
      } else {
        setInsights(await getInsights())
      }
    }
    
    loadInsights()
  }, [token])

  return (
    <>
      <PageHeader
        title="Visão Geral"
        subtitle={`Bem-vindo de volta, ${displayName}!`}
        rightSlot={
          <div className="user-profile">
            <span>Minha Empresa Ltda</span>
            <div className="avatar">{displayName.slice(0, 2).toUpperCase()}</div>
          </div>
        }
      />

      <div className="dashboard-grid">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Carregando dados...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
        ) : (
          dashboardCards.map((card) => (
            <article className="card" key={card.title}>
              <div className="card-header">
                <span className="card-title">{card.title}</span>
                {card.icon ? <span>{card.icon}</span> : null}
              </div>
              <div className="amount" style={card.title.includes("Receitas") ? {color: 'green'} :  card.title.includes("Total") ? {color: '#fff'} : { color: '#ef4444' }}>{card.amount}</div>
              {card.trend ? (
                <div className={classNames('trend', card.trend.direction)}>{card.trend.label}</div>
              ) : null}
            </article>
          ))
        )}

        <section className="card ai-card col-span-2 insights-container">
          <div className="card-header insights-header">
            <span className="card-title">✨ Insights do BotFinance</span>
            <p>{insights?.summary || 'Carregando...'}</p>
          </div>
          {insights?.insights?.map((insight) => (
            <article className="insight-item" key={insight.title}>
              <span className="insight-icon" aria-hidden="true">
                {insight.icon}
              </span>
              <div className="insight-content">
                <h4><span>{insight.title}</span><span className={`insight-type ${insight.type}`}>{insight.type.replace('_', ' ')}</span></h4>
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
            {accountConnected.map((account) => (
              <article className="account-item" key={account.owner}>
                <div className="account-meta">
                  <div>
                    <div className="account-name">{account.type == "CREDIT" ? "Cartão de Crédito" : account.owner}</div>
                    <div className="account-mask">{account.type}</div>
                  </div>
                </div>
                <span className="account-balance">{account.balance.toLocaleString('en-US', { style: 'currency', currency: account.currency_code })}</span>
              </article>
            ))}
            <a href="/open-finance" className="btn-dashed">
              + Conectar nova conta
            </a>
          </div>
        </section>

        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Fluxo de Caixa (Últimos 6 Meses)</span>
          </div>
          <div className="chart-container" role="img" aria-label="Fluxo de caixa dos últimos seis meses">
            {cashFlowBars.length > 0 ? (
              <div className="chart-bars-wrapper">
                {Array.from(new Set(cashFlowBars.map((bar) => bar.month))).map((month) => (
                  <div className="bar-group" key={month}>
                    <div className="bars-pair">
                      {cashFlowBars
                        .filter((bar) => bar.month === month)
                        .map((bar) => (
                          <div
                            key={`${month}-${bar.type}`}
                            className={classNames('bar', bar.type === 'income' ? 'bar-income' : 'bar-expense')}
                            style={{ height: `${bar.heightPercent}%` }}
                            title={`${bar.type === 'income' ? 'Receitas' : 'Despesas'}: ${bar.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                          />
                        ))}
                    </div>
                    <div className="month-label">{month}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                Nenhum dado de histórico disponível.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default DashboardPage
