import type {
  BankConnection,
  CashFlowBar,
  ChatMessage,
  ConnectedAccount,
  DreLine,
  ExpenseCompositionItem,
  InsightItem,
  KpiCardData,
  NavItem,
  PayableItem,
  ReceivableItem,
  ReportSummaryItem,
  SyncLogItem,
} from '../types'

export const navItems: NavItem[] = [
  { route: 'dashboard', label: 'Visão Geral', icon: '📊', path: '/' },
  { route: 'assistant', label: 'Assistente IA', icon: '🤖', path: '/assistente' },
  { route: 'finance', label: 'Financeiro', icon: '💰', path: '/financeiro' },
  { route: 'reports', label: 'Relatórios', icon: '📈', path: '/relatorios' },
  { route: 'open-finance', label: 'Open Finance', icon: '🏦', path: '/open-finance' },
]

export const dashboardCards: KpiCardData[] = [
  {
    title: 'Saldo Total',
    icon: '💰',
    amount: 'R$ 48.250,00',
    trend: { direction: 'positive', label: '▲ 12% vs mês anterior' },
  },
  { title: 'Receitas (Jan)', icon: '⬇', amount: 'R$ 15.400,00' },
  { title: 'Despesas (Jan)', icon: '⬆', amount: 'R$ 8.230,00' },
]

export const dashboardInsights: InsightItem[] = [
  {
    icon: '💡',
    title: 'Oportunidade de Economia',
    description:
      'Identifiquei 3 assinaturas de software duplicadas este mês. Cancelando-as, você pode economizar R$ 450,00/mês. Deseja ver os detalhes?',
  },
  {
    icon: '⚠️',
    title: 'Risco de Fluxo de Caixa',
    description:
      'Atenção: Há uma previsão de saldo negativo para o dia 20/01 devido ao vencimento de fornecedores. Sugiro antecipar recebíveis.',
  },
]

export const connectedAccounts: ConnectedAccount[] = [
  { name: 'Banco Inter', mask: '**** 4432', balance: 'R$ 12.000', logoVariant: 'light' },
  { name: 'Nubank PJ', mask: '**** 8891', balance: 'R$ 36.250', logoVariant: 'dark' },
]

export const cashFlowBars: CashFlowBar[] = [
  { month: 'Ago', heightPercent: 60, type: 'income' },
  { month: 'Set', heightPercent: 50, type: 'income' },
  { month: 'Out', heightPercent: 75, type: 'income' },
  { month: 'Nov', heightPercent: 80, type: 'expense', muted: true },
  { month: 'Dez', heightPercent: 90, type: 'income' },
  { month: 'Jan', heightPercent: 65, type: 'income' },
]

export const chatMessages: ChatMessage[] = [
  {
    author: 'bot',
    text: 'Olá, Luis! Analisei suas transações recentes. Notei que os gastos com fornecedores aumentaram 15% em relação ao mês passado. Gostaria de entender o motivo?',
  },
  {
    author: 'user',
    text: 'Sim, por favor. E como está minha previsão de caixa para o final do mês?',
  },
  {
    author: 'bot',
    text: '1. Sobre os Fornecedores: O aumento veio principalmente da categoria Matéria-prima, com dois pagamentos extras para a TechSuply Ltda.\n\n2. Previsão de Caixa (HU-10): Baseado nas contas a pagar cadastradas, seu saldo projetado para dia 31/01 é de R$ 12.500,00. Isso é positivo, mas recomendo cautela com novos investimentos até dia 15.',
  },
]

export const payables: PayableItem[] = [
  {
    dueDate: '08/01/2026',
    description: 'Servidor AWS',
    category: 'Tecnologia',
    value: 'R$ 450,00',
    status: 'pending',
  },
  {
    dueDate: '05/01/2026',
    description: 'Aluguel Escritório',
    category: 'Infraestrutura',
    value: 'R$ 2.200,00',
    status: 'overdue',
  },
  {
    dueDate: '02/01/2026',
    description: 'Pagamento Fornecedor A',
    category: 'Produtos',
    value: 'R$ 1.500,00',
    status: 'paid',
  },
]

export const receivables: ReceivableItem[] = [
  {
    forecastDate: '15/01/2026',
    client: 'Cliente X - Contrato BPO',
    value: 'R$ 5.000,00',
    status: 'Aguardando',
  },
  {
    forecastDate: '20/01/2026',
    client: 'Consultoria Tech',
    value: 'R$ 3.200,00',
    status: 'Aguardando',
  },
]

export const reportSummary: ReportSummaryItem[] = [
  { label: 'Receita Bruta', value: '+ R$ 45.000,00', tone: 'positive' },
  { label: 'Despesas Variáveis', value: '- R$ 12.500,00', tone: 'negative' },
  { label: 'Despesas Fixas', value: '- R$ 8.000,00', tone: 'negative' },
  { label: 'Lucro Operacional', value: '= R$ 24.500,00', tone: 'primary' },
  { label: 'Margem', value: '54%', tone: 'neutral' },
]

export const dreLines: DreLine[] = [
  {
    category: 'Receitas de Serviços',
    amount: 'R$ 45.000,00',
    percent: '100%',
    status: 'paid',
    statusLabel: 'Confirmado',
  },
  {
    category: 'Pessoal e Salários',
    amount: 'R$ 15.000,00',
    percent: '33%',
    status: 'paid',
    statusLabel: 'Confirmado',
  },
  {
    category: 'Marketing e Vendas',
    amount: 'R$ 3.200,00',
    percent: '7%',
    status: 'pending',
    statusLabel: 'Em aberto',
  },
  {
    category: 'Impostos',
    amount: 'R$ 2.300,00',
    percent: '5%',
    status: 'overdue',
    statusLabel: 'Provisão',
  },
]

export const expenseComposition: ExpenseCompositionItem[] = [
  { label: 'Pessoal', percent: 60, color: 'var(--primary-color)' },
  { label: 'Operacional', percent: 25, color: 'var(--secondary-color)' },
  { label: 'Outros', percent: 15, color: 'var(--warning-color)' },
]

export const bankConnections: BankConnection[] = [
  {
    bankInitial: 'I',
    bankName: 'Banco Inter',
    account: 'Conta PJ • Final 4432',
    status: 'connected',
    statusLabel: 'Sincronizado há 5 min',
    actionLabel: 'Desconectar',
    accentColor: '#FF7A00',
  },
  {
    bankInitial: 'N',
    bankName: 'Nubank',
    account: 'Conta Corrente • Final 8891',
    status: 'connected',
    statusLabel: 'Sincronizado há 12 min',
    actionLabel: 'Desconectar',
    accentColor: '#820AD1',
  },
  {
    bankInitial: 'B',
    bankName: 'Bradesco Empresas',
    account: 'Conexão expirada',
    status: 'error',
    statusLabel: 'Requer atenção',
    actionLabel: 'Reconectar',
  },
]

export const syncLogs: SyncLogItem[] = [
  {
    title: 'Sucesso',
    detail: 'Importação de Extrato (Inter)',
    time: 'Hoje, 15:54',
    tone: 'success',
  },
  {
    title: 'Sucesso',
    detail: 'Importação de Extrato (Nubank)',
    time: 'Hoje, 15:47',
    tone: 'success',
  },
  {
    title: 'Pendente',
    detail: 'Conciliação Automática',
    time: 'Aguardando dados',
    tone: 'pending',
  },
]
