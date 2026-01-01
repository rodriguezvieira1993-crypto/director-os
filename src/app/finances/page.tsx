"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, ArrowUpRight, ArrowDownRight, DollarSign, Wallet, CreditCard, PiggyBank, Trash2 } from "lucide-react"
import { NetWorthChart, MetricType } from "@/components/dashboard/NetWorthChart"
import { AddTransactionSheet } from "@/components/finances/AddTransactionSheet"
import { Transaction } from "@/types/finance"
import { useData } from "@/context/DataProvider"
import { cn } from "@/lib/utils"

export default function FinancesPage() {
    const { transactions, addTransaction, objectives, deleteTransaction } = useData()
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("income")

    // Calculate Total Savings Goal (Excluding Business/Revenue)
    const totalSavingsNeeded = objectives.reduce((total, obj) => {
        const objTotal = obj.keyResults?.reduce((krTotal, kr) => {
            const titleLower = kr.title.toLowerCase()
            // Exclude "Facturación", "Ingreso", "Agencia" revenue
            const isRevenue = titleLower.includes("factur") ||
                titleLower.includes("ingreso") ||
                titleLower.includes("sueldo")

            if (isRevenue) return krTotal;

            if (kr.type === 'currency' && kr.targetValue) {
                return krTotal + kr.targetValue
            }
            return krTotal
        }, 0) || 0
        return total + objTotal
    }, 0)

    // Calculate Totals
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const netSavings = totalIncome - totalExpenses

    const totalSaved = transactions
        .filter(t => t.type === 'savings')
        .reduce((sum, t) => sum + t.amount, 0)
    const savingsRate = totalIncome > 0 ? Math.round((totalSaved / totalIncome) * 100) : 0

    // Calculate Chart Data
    const chartData = (() => {
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const data = months.map(month => ({ month, value: 0 }))

        transactions.forEach(t => {
            const monthIndex = t.date.getMonth()
            if (selectedMetric === 'income' && t.type === 'income') {
                data[monthIndex].value += t.amount
            } else if (selectedMetric === 'expenses' && t.type === 'expense') {
                data[monthIndex].value += t.amount
            } else if (selectedMetric === 'savings' && t.type === 'savings') {
                data[monthIndex].value += t.amount
            }
        })

        // For Savings, we probably want cumulative or just monthly net flow? 
        // "Ahorro Neto" usually implies monthly flow. Let's stick to monthly flow for now.
        // If it's Net Worth, it would be cumulative. Use "savings" as monthly net flow.

        return data
    })()

    const handleAddTransaction = (newTx: Omit<Transaction, "id">) => {
        addTransaction(newTx)
        setIsSheetOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Finanzas</h2>
                    <p className="text-muted-foreground">Control de ingresos, gastos y profundidad financiera.</p>
                </div>
                <Button onClick={() => setIsSheetOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Movimiento
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card
                    className={cn(
                        "cursor-pointer transition-all hover:bg-accent/50",
                        selectedMetric === "income" ? "ring-2 ring-green-500 border-green-500" : ""
                    )}
                    onClick={() => setSelectedMetric("income")}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos (Mes)</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Basado en tus movimientos</p>
                    </CardContent>
                </Card>
                <Card
                    className={cn(
                        "cursor-pointer transition-all hover:bg-accent/50",
                        selectedMetric === "expenses" ? "ring-2 ring-red-500 border-red-500" : ""
                    )}
                    onClick={() => setSelectedMetric("expenses")}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gastos (Mes)</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Basado en tus movimientos</p>
                    </CardContent>
                </Card>
                <Card
                    className={cn(
                        "cursor-pointer transition-all hover:bg-accent/50",
                        selectedMetric === "savings" ? "ring-2 ring-blue-500 border-blue-500" : ""
                    )}
                    onClick={() => setSelectedMetric("savings")}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ahorro Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalSaved.toLocaleString()}</div>
                        <p className={cn("text-xs font-medium", savingsRate > 20 ? "text-green-500" : "text-yellow-500")}>
                            {savingsRate}% Tasa de Ahorro
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                {/* Chart Area */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>
                            {selectedMetric === "income" && "Evolución de Ingresos"}
                            {selectedMetric === "expenses" && "Evolución de Gastos"}
                            {selectedMetric === "savings" && "Evolución de Ahorro"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <NetWorthChart metric={selectedMetric} timeRange="1Y" data={chartData} savingsGoal={totalSavingsNeeded} />
                    </CardContent>
                </Card>

                {/* Recent Transactions List */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Transacciones Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {transactions.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No hay movimientos aún.</p>
                            ) : (
                                transactions.slice(0, 5).map((t) => (
                                    <div key={t.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-9 w-9 rounded-full flex items-center justify-center border",
                                                t.type === 'income' ? "bg-green-500/10 border-green-500/20" :
                                                    t.type === 'expense' ? "bg-red-500/10 border-red-500/20" :
                                                        "bg-blue-500/10 border-blue-500/20"
                                            )}>
                                                {t.type === 'income' ? <Wallet className="h-4 w-4 text-green-500" /> :
                                                    t.type === 'expense' ? <CreditCard className="h-4 w-4 text-red-500" /> :
                                                        <PiggyBank className="h-4 w-4 text-blue-500" />
                                                }
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{t.description || t.category}</p>
                                                <p className="text-xs text-muted-foreground">{t.category} • {t.date.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "font-medium",
                                                t.type === 'income' ? "text-green-500" :
                                                    t.type === 'expense' ? "text-foreground" :
                                                        "text-blue-500"
                                            )}>
                                                {t.type === 'income' ? "+" : t.type === 'expense' ? "-" : ""}${t.amount.toLocaleString()}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => deleteTransaction(t.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AddTransactionSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleAddTransaction}
            />
        </div>
    )
}
