import { useState, useEffect } from 'react'
import type { CreateReceivableRequest } from '../services/financialService'

interface ReceivableModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateReceivableRequest) => Promise<void>
  initialData?: {
    client: string
    value: number
    forecast_date: string
    status: string
  }
  isEditing?: boolean
}

const ReceivableModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }: ReceivableModalProps) => {
  const [formData, setFormData] = useState<CreateReceivableRequest>({
    client: '',
    value: 0,
    forecast_date: '',
    status: 'pending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client,
        value: initialData.value,
        forecast_date: initialData.forecast_date.split('T')[0],
        status: initialData.status,
      })
    } else {
      setFormData({
        client: '',
        value: 0,
        forecast_date: '',
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
        <h2>{isEditing ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente</label>
            <input
              type="text"
              name="client"
              value={formData.client}
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
            <label>Previsão</label>
            <input
              type="date"
              name="forecast_date"
              value={formData.forecast_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="pending">Pendente</option>
              <option value="received">Recebido</option>
              <option value="overdue">Atrasado</option>
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

export default ReceivableModal
