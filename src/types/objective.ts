export interface KeyResult {
    id: string
    title: string
    startValue?: number
    currentValue: number
    targetValue: number
    unit: string
    type: "numerical" | "currency" | "percentage" | "boolean"
    completed: boolean
    templateId?: string
    description?: string
    icon?: string
    frequency?: string[]
}

export type ObjectiveStatus = "ON_TRACK" | "AT_RISK" | "BEHIND" | "COMPLETED"

export interface Objective {
    id: string
    title: string
    category: string
    icon: string
    status: ObjectiveStatus
    progress: number
    keyResults: KeyResult[]
}
