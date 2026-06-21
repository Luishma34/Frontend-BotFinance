import { useState, useEffect } from 'react'
import type { CreatePayableRequest } from '../services/financialService'

interface PayableModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePayableRequest) => Promise<void>
  initialData?: {
    description: string
    category: string
    value: number
    due_date: string
    status: string
  }
  isEditing?: boolean
}

const PayableModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }: PayableModalProps) => {
  const [formData, setFormData] = useState<CreatePayableRequest>({
    description: '',
    category: '',
    value: 0,
    due_date: '',
    status: 'pending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        category: initialData.category,
        value: initialData.value,
        due_date: initialData.due_date.split('T')[0],
        status: initialData.status,
      })
    } else {
      setFormData({
        description: '',
        category: '',
        value: 0,
        due_date: '',
        status: 'pending',
      })
    }
    setError(null)
  }, [initialData, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await onSubmit(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isEditing ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              name="value"
              step="0.01"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Vencimento</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pendente</option>
              <option value="overdue">Atrasado</option>
              <option value="paid">Pago</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PayableModal
