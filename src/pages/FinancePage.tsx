import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { payables, receivables } from '../data/mockData'

const FinancePage = () => {
  return (
    <>
      <PageHeader
        title="Lançamentos Financeiros"
        subtitle="Gerencie suas contas a pagar e receber."
        rightSlot={
          <button type="button" className="btn-primary">
            + Novo Lançamento
          </button>
        }
      />

      <section className="card">
        <div className="card-header">
          <span className="card-title">Próximos Vencimentos (Contas a Pagar)</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vencimento</th>
                <th>Descrição</th>
                <th>Categoria (IA)</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {payables.map((item) => (
                <tr key={`${item.dueDate}-${item.description}`}>
                  <td>{item.dueDate}</td>
                  <td>{item.description}</td>
                  <td>{item.category}</td>
                  <td>{item.value}</td>
                  <td>
                    <StatusBadge
                      tone={item.status}
                      label={item.status === 'pending' ? 'Pendente' : item.status === 'overdue' ? 'Atrasado' : 'Pago'}
                    />
                  </td>
                  <td>...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-with-gap">
        <div className="card-header">
          <span className="card-title">Previsão de Entradas (Contas a Receber)</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Previsão</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((item) => (
                <tr key={`${item.forecastDate}-${item.client}`}>
                  <td>{item.forecastDate}</td>
                  <td>{item.client}</td>
                  <td>{item.value}</td>
                  <td>
                    <StatusBadge tone="pending" label={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default FinancePage
