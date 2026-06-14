import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { dreLines, expenseComposition, reportSummary } from '../data/mockData'

const ReportsPage = () => {
  const pieGradient = `conic-gradient(${expenseComposition
    .map((item, index) => {
      const start = expenseComposition.slice(0, index).reduce((acc, current) => acc + current.percent, 0)
      const end = start + item.percent
      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')})`

  return (
    <>
      <PageHeader title="Relatórios Estratégicos" subtitle="Análise de desempenho e fechamento mensal." />

      <div className="report-controls">
        <select className="select-input" defaultValue="Janeiro 2026">
          <option>Janeiro 2026</option>
          <option>Fevereiro 2026</option>
          <option>Último Trimestre</option>
          <option>Anual 2025</option>
        </select>
        <select className="select-input" defaultValue="Todos os Centros de Custo">
          <option>Todos os Centros de Custo</option>
          <option>Operacional</option>
          <option>Marketing</option>
        </select>
        <button type="button" className="btn-export">
          <span>⬇</span> Exportar PDF
        </button>
      </div>

      <div className="dashboard-grid">
        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Demonstrativo de Resultado (DRE Simplificado) - Jan/2026</span>
          </div>

          <div className="report-summary">
            {reportSummary.map((item) => (
              <div className="summary-item" key={item.label}>
                <span className="summary-label">{item.label}</span>
                <span className={`summary-value tone-${item.tone ?? 'neutral'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Realizado</th>
                  <th>% da Receita</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dreLines.map((line) => (
                  <tr key={line.category}>
                    <td>{line.category}</td>
                    <td>{line.amount}</td>
                    <td>{line.percent}</td>
                    <td>
                      <StatusBadge tone={line.status} label={line.statusLabel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card col-span-2">
          <div className="card-header">
            <span className="card-title">Composição de Despesas</span>
          </div>
          <div className="expenses-wrap">
            <div className="expenses-chart" style={{ background: pieGradient }} />
            <ul className="expenses-legend">
              {expenseComposition.map((item) => (
                <li key={item.label}>
                  <span style={{ color: item.color }}>●</span> {item.label} ({item.percent}%)
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <span className="card-title">Ações</span>
          </div>
          <p className="actions-note">O mês de Janeiro ainda possui lançamentos pendentes.</p>
          <button type="button" className="btn-primary btn-block">
            Realizar Pré-Fechamento
          </button>
        </section>
      </div>
    </>
  )
}

export default ReportsPage
