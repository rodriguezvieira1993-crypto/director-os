"use client"

import { useState } from "react"
import { NetWorthChart, MetricType, TimeRangeType } from "@/components/dashboard/NetWorthChart"
import { cn } from "@/lib/utils"
import { useData } from "@/context/DataProvider"

export default function Home() {
  const { transactions } = useData()
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("netWorth")
  const [timeRange, setTimeRange] = useState<TimeRangeType>("1Y")

  // Helper to get totals
  const getTotal = (type: string, monthFiltered = false) => {
    const now = new Date()
    return transactions
      .filter(t => {
        if (type !== 'all' && t.type !== type) return false
        if (monthFiltered) {
          return t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear()
        }
        return true
      })
      .reduce((sum, t) => sum + t.amount, 0)
  }

  // Net Worth = Total Income - Total Expenses (All time)
  // Assuming 'savings' is just shifting money, so it stays in Net Worth. 
  // 'expense' actually leaves the system.
  const totalIncomeAll = getTotal('income')
  const totalExpenseAll = getTotal('expense')
  const netWorth = totalIncomeAll - totalExpenseAll

  // Monthly stats
  const monthlyIncome = getTotal('income', true)
  const monthlyExpenses = getTotal('expense', true)
  const monthlySavings = getTotal('savings', true) // Explicit savings transactions this month

  // Savings rate (Month) basically explicit savings / income
  const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0

  const metrics = [
    {
      id: "netWorth" as MetricType,
      label: "Patrimonio Neto",
      value: `$${netWorth.toLocaleString()}`,
      change: "Total acumulado",
    },
    {
      id: "income" as MetricType,
      label: "Ingresos (Mes)",
      value: `$${monthlyIncome.toLocaleString()}`,
      change: "Este mes",
    },
    {
      id: "expenses" as MetricType,
      label: "Gastos (Mes)",
      value: `$${monthlyExpenses.toLocaleString()}`,
      change: "Este mes",
    },
    {
      id: "savings" as MetricType,
      label: "Ahorro (Mes)",
      value: `$${monthlySavings.toLocaleString()}`,
      change: `${savingsRate}% Tasa`,
    },
  ]

  // Chart Data Aggregation
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
      } else if (selectedMetric === 'netWorth') {
        // For Net Worth chart, typically we want cumulative but bar chart is monthly change?
        // The original mock was a line chart for Net Worth.
        // Let's show Monthly Net Flow (Income - Expense) for simpler visualization in a bar chart,
        // or strict Net Worth (Accumulated).
        // Let's stick to Monthly Net Flow for visual clarity in this chart type for now.
        if (t.type === 'income') data[monthIndex].value += t.amount
        if (t.type === 'expense') data[monthIndex].value -= t.amount
      }
    })
    return data
  })()

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
        {/* Time Filter */}
        <div className="flex items-center space-x-2 bg-secondary/50 p-1 rounded-lg">
          {(["1M", "3M", "6M", "1Y", "YTD"] as TimeRangeType[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                timeRange === range
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => setSelectedMetric(metric.id)}
            className={cn(
              "p-6 bg-card text-card-foreground rounded-xl border shadow-sm cursor-pointer transition-all hover:bg-accent/50",
              selectedMetric === metric.id ? "ring-2 ring-primary border-primary" : ""
            )}
          >
            <h3 className="font-semibold text-sm tracking-tight">{metric.label}</h3>
            <div className="text-2xl font-bold mt-2">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Area del Gráfico Principal */}
      <div className="p-6 bg-card text-card-foreground rounded-xl border shadow-sm min-h-[400px]">
        <h3 className="font-semibold text-lg mb-4">
          Evolución de {metrics.find(m => m.id === selectedMetric)?.label}
        </h3>
        <NetWorthChart metric={selectedMetric} timeRange={timeRange} data={chartData} />
      </div>
    </>
  )
}
