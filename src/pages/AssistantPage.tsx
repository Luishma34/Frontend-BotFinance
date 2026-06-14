import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import { chatMessages } from '../data/mockData'

const AssistantPage = () => {
  const [draft, setDraft] = useState('')
  const normalizedDraft = useMemo(() => draft.trim(), [draft])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!normalizedDraft) {
      return
    }
    setDraft('')
  }

  return (
    <>
      <PageHeader title="Assistente Financeiro" subtitle="Tire dúvidas e receba análises estratégicas." />

      <section className="chat-container">
        <div className="chat-history" aria-live="polite">
          {chatMessages.map((message, index) => (
            <article key={`${message.author}-${index}`} className={`message ${message.author}`}>
              {message.text.split('\n').map((line) => (
                <p key={line}>{line}</p>
              ))}
            </article>
          ))}
        </div>

        <form className="chat-input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Digite sua pergunta (ex: Como reduzir meus custos?)..."
          />
          <button type="submit" className="btn-send" disabled={!normalizedDraft}>
            Enviar
          </button>
        </form>
      </section>
    </>
  )
}

export default AssistantPage
