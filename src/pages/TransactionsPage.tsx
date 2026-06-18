import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useAuth } from '../contexts/useAuth'
import { openFinanceService } from '../services/openFinanceService'
import type { Transaction } from '../types/openFinance'

const TransactionsPage = () => {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }

      try {
        const response = await openFinanceService.getSyncedTransactions(token, currentPage, pageSize)
        setTransactions(response.results)
        setTotalPages(response.total_pages)
        setTotal(response.total)
      } catch (err) {
        setError('Failed to fetch transactions')
        console.error('Error fetching transactions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [token, currentPage, pageSize])

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  return (
    <>
      <PageHeader
        title="Transações"
        subtitle="Visualize todas as suas transações sincronizadas."
      />

      <div className="dashboard-grid">
        <section className="card col-span-3">
          <div className="card-header">
            <span className="card-title">Histórico de Transações</span>
            <div className="card-actions">
              <span className="text-muted">Total: {total} transações</span>
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
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{formatDate(transaction.date)}</td>
                        <td>{transaction.description}</td>
                        <td>
                          <span className={`transaction-type ${getTransactionTypeClass(transaction.type)}`}>
                            {getTransactionTypeLabel(transaction.type)}
                          </span>
                        </td>
                        <td className="text-muted">{transaction.transaction_id}</td>
                        <td className={getTransactionTypeClass(transaction.type)}>
                          {formatAmount(transaction.amount, transaction.currency_code)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
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
