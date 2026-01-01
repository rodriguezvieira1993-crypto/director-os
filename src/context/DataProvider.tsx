"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Transaction } from '@/types/finance'
import { Objective } from '@/types/objective'
import { toast } from 'sonner'

interface DataContextType {
    transactions: Transaction[]
    objectives: Objective[]
    addTransaction: (transaction: Omit<Transaction, "id">) => void
    deleteTransaction: (id: string) => void
    addObjective: (objective: Objective) => void
    updateObjective: (objective: Objective) => void
    deleteObjective: (id: string) => void
    resetData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const STORAGE_KEYS = {
    TRANSACTIONS: 'director-os-transactions',
    OBJECTIVES: 'director-os-objectives'
}

const INITIAL_OBJECTIVES: Objective[] = [
    {
        id: "1",
        title: "Estar en forma y saludable",
        category: "Salud",
        icon: "💪",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "1-1", title: "Peso ideal", startValue: 85, currentValue: 85, targetValue: 75, unit: "kg", type: "numerical", completed: false, templateId: "exercise" },
            { id: "1-2", title: "Correr 5k", startValue: 0, currentValue: 0, targetValue: 5, unit: "km", type: "numerical", completed: false, templateId: "exercise" }
        ]
    },
    {
        id: "2",
        title: "Independencia: Nuevo Apartamento",
        category: "Vida",
        icon: "🏢",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "2-1", title: "Ahorro Inicial Mudanza", currentValue: 0, targetValue: 1200, unit: "$", type: "currency", completed: false, templateId: "money" },
            { id: "2-2", title: "Renta Mensual Sostenible", currentValue: 0, targetValue: 200, unit: "$/mes", type: "currency", completed: false, templateId: "money" }
        ]
    },
    {
        id: "3",
        title: "Upgrade Personal: Imagen y Tech",
        category: "Estilo",
        icon: "🕶️",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "3-1", title: "Comprar iPhone", currentValue: 0, targetValue: 1000, unit: "$", type: "currency", completed: false, templateId: "buy" },
            { id: "3-2", title: "Renovar Guardarropa", currentValue: 0, targetValue: 500, unit: "$", type: "currency", completed: false, templateId: "buy" }
        ]
    },
    {
        id: "4",
        title: "Desarrollo Profesional & Agencia",
        category: "Carrera",
        icon: "🚀",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "4-1", title: "Facturación Agencia", currentValue: 0, targetValue: 22000, unit: "$", type: "currency", completed: false, templateId: "money" },
            { id: "4-2", title: "Abrir Sede CCS", currentValue: 0, targetValue: 1, unit: "sede", type: "boolean", completed: false, description: "Buscar oficina y contratar equipo base" },
            { id: "4-3", title: "Crear super CRM", currentValue: 0, targetValue: 100, unit: "%", type: "numerical", completed: false, description: "Mejor que los del mercado" }
        ]
    },
    {
        id: "5",
        title: "Libertad Financiera Personal",
        category: "Finanzas",
        icon: "💰",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "5-1", title: "Facturación Mensual Personal", currentValue: 0, targetValue: 1000, unit: "$/mes", type: "currency", completed: false, templateId: "money" }
        ]
    },
    {
        id: "6",
        title: "Vehículo Propio",
        category: "Metas",
        icon: "🚗",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "6-1", title: "Comprar Carro o Moto", currentValue: 0, targetValue: 3000, unit: "$", type: "currency", completed: false, templateId: "buy" }
        ]
    },
    {
        id: "7",
        title: "Crecimiento y Trámites",
        category: "Vida",
        icon: "🎓",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "7-1", title: "Licenciatura", currentValue: 0, targetValue: 100, unit: "%", type: "numerical", completed: false, templateId: "reading", description: "Comenzar estudios" },
            { id: "7-2", title: "Pasaporte Venezolano", currentValue: 0, targetValue: 1, unit: "doc", type: "boolean", completed: false, description: "Cita y trámite" },
            { id: "7-3", title: "Licencia de Conducir", currentValue: 0, targetValue: 1, unit: "doc", type: "boolean", completed: false }
        ]
    },
    {
        id: "8",
        title: "Viajes y Experiencias",
        category: "Vida",
        icon: "✈️",
        status: "ON_TRACK",
        progress: 0,
        keyResults: [
            { id: "8-1", title: "Viaje con Familia/Amigos", currentValue: 0, targetValue: 1500, unit: "$", type: "currency", completed: false, templateId: "money" }
        ]
    }
]

import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [objectives, setObjectives] = useState<Objective[]>([])
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    // 1. Auth Listener
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            if (session) {
                fetchData(session.user.id)
            } else {
                setIsLoading(false)
                if (pathname !== '/login') {
                    router.push('/login')
                }
            }
        }

        checkAuth()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                fetchData(session.user.id)
            } else {
                setTransactions([])
                setObjectives([])
                setIsLoading(false)
                if (pathname !== '/login') {
                    router.push('/login')
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [pathname, router])

    const fetchData = async (userId: string) => {
        setIsLoading(true)

        // Fetch Transactions
        const { data: txData, error: txError } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false })

        if (txData) {
            const mappedTransactions: Transaction[] = txData.map((t: any) => ({
                id: t.id,
                amount: t.amount,
                description: t.description,
                category: t.category,
                type: t.type,
                date: new Date(t.date)
            }))
            setTransactions(mappedTransactions)
        }

        // Fetch Objectives
        const { data: objData, error: objError } = await supabase
            .from('objectives')
            .select('*')
            .order('created_at', { ascending: true })

        if (objData && objData.length > 0) {
            const mappedObjectives: Objective[] = objData.map((o: any) => ({
                id: o.id,
                title: o.title,
                category: o.category,
                icon: o.icon,
                status: o.status,
                progress: o.progress,
                keyResults: o.key_results || []
            }))
            setObjectives(mappedObjectives)
        } else {
            // Seed initial data if empty
            // Optional: Auto-insert? For now just setting state is safer to avoid loops
            setObjectives(INITIAL_OBJECTIVES)
        }

        setIsLoading(false)
    }

    const addTransaction = async (newTx: Omit<Transaction, "id">) => {
        if (!session) return

        const dbTransaction = {
            user_id: session.user.id,
            amount: newTx.amount,
            description: newTx.description,
            category: newTx.category,
            type: newTx.type,
            date: newTx.date.toISOString() // PG timestamp
        }

        const { data, error } = await supabase
            .from('transactions')
            .insert(dbTransaction)
            .select()
            .single()

        if (data) {
            const transaction: Transaction = {
                ...newTx,
                id: data.id,
            }
            setTransactions(prev => [transaction, ...prev])
        }
    }

    const deleteTransaction = async (id: string) => {
        if (!session) return
        await supabase.from('transactions').delete().eq('id', id)
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    const addObjective = async (objective: Objective) => {
        if (!session) return

        const dbObjective = {
            user_id: session.user.id,
            title: objective.title,
            category: objective.category,
            icon: objective.icon,
            status: objective.status,
            progress: objective.progress,
            key_results: objective.keyResults
        }

        const { data } = await supabase.from('objectives').insert(dbObjective).select().single()

        if (data) {
            const newObj = { ...objective, id: data.id }
            setObjectives(prev => [...prev, newObj])
        }
    }

    const updateObjective = async (updatedObjective: Objective) => {
        if (!session) return

        // 1. Handle Initial/Mock Data (IDs like "1", "2") -> INSERT instead of UPDATE
        if (updatedObjective.id.length < 10) {
            const dbObjective = {
                user_id: session.user.id,
                title: updatedObjective.title,
                category: updatedObjective.category,
                icon: updatedObjective.icon,
                status: updatedObjective.status,
                progress: updatedObjective.progress,
                key_results: updatedObjective.keyResults
            }

            const { data, error } = await supabase.from('objectives').insert(dbObjective).select().single()

            if (error) {
                console.error("Error creating initial objective:", error)
                toast.error("Error al guardar por primera vez")
                return
            }

            // Replace the mock object with the real DB object in state
            setObjectives(prev => prev.map(obj =>
                obj.id === updatedObjective.id ? { ...updatedObjective, id: data.id } : obj
            ))
            toast.success("Objetivo inicial guardado en nube")
            return
        }

        // 2. Normal Update (Existing UUID)
        const dbObjective = {
            title: updatedObjective.title,
            category: updatedObjective.category,
            icon: updatedObjective.icon,
            status: updatedObjective.status,
            progress: updatedObjective.progress,
            key_results: updatedObjective.keyResults
        }

        const { error } = await supabase.from('objectives').update(dbObjective).eq('id', updatedObjective.id)

        if (error) {
            console.error("Error updating objective:", error)
            toast.error("Error al guardar cambios")
            return
        }

        setObjectives(prev => prev.map(obj =>
            obj.id === updatedObjective.id ? updatedObjective : obj
        ))
        toast.success("Cambios guardados")
    }

    const deleteObjective = async (id: string) => {
        if (!session) return

        // If it's a mock ID, just remove from state
        if (id.length < 10) {
            setObjectives(prev => prev.filter(obj => obj.id !== id))
            return
        }

        const { error } = await supabase.from('objectives').delete().eq('id', id)

        if (error) {
            toast.error("Error al eliminar")
            return
        }

        setObjectives(prev => prev.filter(obj => obj.id !== id))
        toast.success("Objetivo eliminado")
    }

    const resetData = async () => {
        if (!session) return
        await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('objectives').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        // Re-seed Logic could be added here, but for now just clear local state
        // User can see "Empty" or logic above will show Initial if DB empty on refresh
        setTransactions([])
        setObjectives(INITIAL_OBJECTIVES)
    }

    return (
        <DataContext.Provider value={{
            transactions,
            objectives,
            addTransaction,
            deleteTransaction,
            addObjective,
            updateObjective,
            deleteObjective,
            resetData
        }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => {
    const context = useContext(DataContext)
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider')
    }
    return context
}
