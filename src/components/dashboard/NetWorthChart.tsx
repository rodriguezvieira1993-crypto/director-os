"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart, BarChart, Bar, Cell, ReferenceLine } from "recharts"
import { SavingsThermometer } from "./SavingsThermometer"

export type MetricType = "netWorth" | "income" | "expenses" | "savings"
export type TimeRangeType = "1M" | "3M" | "6M" | "1Y" | "YTD" | "ALL"

interface NetWorthChartProps {
    metric: MetricType
    timeRange: TimeRangeType
}

// Mock Data Generators
const generateData = (metric: MetricType) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return months.map((month, i) => {
        let value = 0
        if (metric === "netWorth") value = 5000 + (i * 1500) + Math.random() * 500
        if (metric === "income") value = 3000 + Math.random() * 1000
        if (metric === "expenses") value = 2000 + Math.random() * 500
        if (metric === "savings") value = 0;
        return { month, value: Math.round(value) }
    })
}

interface NetWorthChartProps {
    metric: MetricType
    timeRange: TimeRangeType
    data?: { month: string, value: number }[]
}

export function NetWorthChart({ metric, timeRange, data }: NetWorthChartProps) {
    const chartData = data || generateData(metric)


    const getColor = () => {
        if (metric === "netWorth") return "#fff"; // White
        if (metric === "income") return "#22c55e"; // Green
        if (metric === "expenses") return "#ef4444"; // Red
        if (metric === "savings") return "#3b82f6"; // Default Blue (overridden by cells)
        return "#fff"
    }

    const color = getColor();
    const isBarChart = metric === "income" || metric === "expenses";
    const isSavings = metric === "savings";

    if (isSavings) {
        // For Savings, we show the Thermometer visualization of the *current* status (last month)
        // or an average. For now, let's show the last data point as the "current" status.
        const lastValue = chartData[chartData.length - 1].value;
        return <SavingsThermometer value={lastValue} />
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            {isBarChart ? (
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#ffffff10' }}
                        contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333", borderRadius: "8px" }}
                        itemStyle={{ color: color }}
                        formatter={(value: number | undefined) => [`$${value ?? 0}`, "Total"]}
                    />
                    <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            ) : (
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1f1f1f", borderColor: "#333", borderRadius: "8px" }}
                        itemStyle={{ color: color }}
                        formatter={(value: number | undefined) => [`$${value ?? 0}`, "Valor"]}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#gradient-${metric})`}
                    />
                </AreaChart>
            )}
        </ResponsiveContainer>
    )
}
