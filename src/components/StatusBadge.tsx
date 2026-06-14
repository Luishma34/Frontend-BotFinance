import { classNames } from '../lib/classNames'

type BadgeTone = 'paid' | 'pending' | 'overdue'

interface StatusBadgeProps {
  tone: BadgeTone
  label: string
}

const StatusBadge = ({ tone, label }: StatusBadgeProps) => {
  return (
    <span className={classNames('status-badge', `status-${tone}`)}>
      {label}
    </span>
  )
}

export default StatusBadge
