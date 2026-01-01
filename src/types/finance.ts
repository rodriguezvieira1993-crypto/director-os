export type TransactionType = 'income' | 'expense' | 'savings'

export interface Transaction {
    id: string
    date: Date
    amount: number
    type: TransactionType
    category: string
    description?: string
}

export const CATEGORIES = {
    income: ["Salario", "Freelance", "Agencia", "Inversiones", "Otros"],
    expense: ["Vivienda", "Comida", "Transporte", "Ocio", "Salud", "Educación", "Suscripciones", "Otros"],
    savings: ["Fondo de Emergencia", "Inversión", "Retiro", "Ahorro General", "Objetivos", "Otro"]
}
