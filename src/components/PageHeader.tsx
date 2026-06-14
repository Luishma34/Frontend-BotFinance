import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle: string
  rightSlot?: ReactNode
}

const PageHeader = ({ title, subtitle, rightSlot }: PageHeaderProps) => {
  return (
    <header className="header">
      <div className="page-title">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {rightSlot}
    </header>
  )
}

export default PageHeader
