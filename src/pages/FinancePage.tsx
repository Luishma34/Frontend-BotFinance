import { useEffect, useState, useCallback } from 'react'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import PayableModal from '../components/PayableModal'
import ReceivableModal from '../components/ReceivableModal'
import { useAuth } from '../contexts/useAuth'
import { financialService } from '../services/financialService'
import type { Payable, Receivable, CreatePayableRequest, CreateReceivableRequest } from '../services/financialService'

const FinancePage = () => {
  const { token } = useAuth()
  const [payables, setPayables] = useState<Payable[]>([])
  const [receivables, setReceivables] = useState<Receivable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPayableModal, setShowPayableModal] = useState(false)
  const [showReceivableModal, setShowReceivableModal] = useState(false)
  const [editingPayable, setEditingPayable] = useState<Payable | null>(null)
  const [editingReceivable, setEditingReceivable] = useState<Receivable | null>(null)

  const loadData = useCallback(async () => {
    if (!token) {
      setError('Token não encontrado')
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const [payablesData, receivablesData] = await Promise.all([
        financialService.getPayables(token),
        financialService.getReceivables(token),
      ])
      setPayables(payablesData)
      setReceivables(receivablesData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleDeletePayable = async (id: string) => {
    if (!token || !confirm('Tem certeza que deseja deletar esta conta a pagar?')) return
    try {
      await financialService.deletePayable(token, id)
      setPayables(payables.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  const handleDeleteReceivable = async (id: string) => {
    if (!token || !confirm('Tem certeza que deseja deletar esta conta a receber?')) return
    try {
      await financialService.deleteReceivable(token, id)
      setReceivables(receivables.filter(r => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar')
    }
  }

  const handleSavePayable = async (data: CreatePayableRequest) => {
    if (!token) return
    try {
      if (editingPayable) {
        const updated = await financialService.updatePayable(token, editingPayable.id, data)
        setPayables(payables.map(p => p.id === editingPayable.id ? updated : p))
        setEditingPayable(null)
      } else {
        const created = await financialService.createPayable(token, data)
        setPayables([...payables, created])
      }
      setShowPayableModal(false)
      setEditingPayable(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  const handleSaveReceivable = async (data: CreateReceivableRequest) => {
    if (!token) return
    try {
      if (editingReceivable) {
        const updated = await financialService.updateReceivable(token, editingReceivable.id, data)
        setReceivables(receivables.map(r => r.id === editingReceivable.id ? updated : r))
        setEditingReceivable(null)
      } else {
        const created = await financialService.createReceivable(token, data)
        setReceivables([...receivables, created])
      }
      setShowReceivableModal(false)
      setEditingReceivable(null)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const getReceivableStatusLabel = (status: string) => {
    const statusMap: Record<string, { label: string; tone: 'success' | 'pending' | 'warning' }> = {
      'pending': { label: 'Pendente', tone: 'pending' },
      'received': { label: 'Recebido', tone: 'success' },
      'overdue': { label: 'Atrasado', tone: 'warning' },
    }
    return statusMap[status] || { label: status, tone: 'pending' }
  }

  if (loading) return <div className="loading">Carregando...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <>
      <PageHeader
        title="Lançamentos Financeiros"
        subtitle="Gerencie suas contas a pagar e receber."
        rightSlot={
          <button type="button" className="btn-primary" onClick={() => setShowPayableModal(true)}>
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
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {payables.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Nenhuma conta a pagar registrada</td>
                </tr>
              ) : (
                payables.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.due_date)}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>
                      <StatusBadge
                        tone={item.status}
                        label={item.status === 'pending' ? 'Pendente' : item.status === 'overdue' ? 'Atrasado' : 'Pago'}
                      />
                    </td>
                    <td>
                      <button className="btn-action" onClick={() => setEditingPayable(item)}>Editar</button>
                      <button className="btn-action btn-action-danger" onClick={() => handleDeletePayable(item.id)}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-with-gap">
        <div className="card-header">
          <span className="card-title">Previsão de Entradas (Contas a Receber)</span>
          <button type="button" className="btn-secondary" onClick={() => setShowReceivableModal(true)}>
            + Adicionar
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Previsão</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {receivables.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Nenhuma conta a receber registrada</td>
                </tr>
              ) : (
                receivables.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.forecast_date)}</td>
                    <td>{item.client}</td>
                    <td>{formatCurrency(item.value)}</td>
                    <td>
                      <StatusBadge tone="pending" label={item.status} />
                    </td>
                    <td>
                      <button className="btn-action" onClick={() => setEditingReceivable(item)}>Editar</button>
                      <button className="btn-action btn-action-danger" onClick={() => handleDeleteReceivable(item.id)}>Deletar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PayableModal
        isOpen={showPayableModal || editingPayable !== null}
        onClose={() => {
          setShowPayableModal(false)
          setEditingPayable(null)
        }}
        onSubmit={handleSavePayable}
        initialData={editingPayable ? {
          description: editingPayable.description,
          category: editingPayable.category,
          value: editingPayable.value,
          due_date: editingPayable.due_date,
          status: editingPayable.status,
        } : undefined}
        isEditing={editingPayable !== null}
      />

      <ReceivableModal
        isOpen={showReceivableModal || editingReceivable !== null}
        onClose={() => {
          setShowReceivableModal(false)
          setEditingReceivable(null)
        }}
        onSubmit={handleSaveReceivable}
        initialData={editingReceivable ? {
          client: editingReceivable.client,
          value: editingReceivable.value,
          forecast_date: editingReceivable.forecast_date,
          status: editingReceivable.status,
        } : undefined}
        isEditing={editingReceivable !== null}
      />
    </>
  )
}

export default FinancePage