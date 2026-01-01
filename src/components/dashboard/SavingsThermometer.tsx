"use client"

import { cn } from "@/lib/utils"

interface SavingsThermometerProps {
    value: number // Current value (e.g., 34%)
    max?: number // Max scale value (default 100)
    goal?: number // Target value (e.g., 20%)
    label?: string
    totalGoalAmount?: number
}

export function SavingsThermometer({ value, max = 100, goal = 20, label = "Tasa de Ahorro", totalGoalAmount }: SavingsThermometerProps) {
    // Clamp value to max to prevent overflow
    const clampedValue = Math.min(Math.max(value, 0), max)
    const percentage = (clampedValue / max) * 100
    const goalPercentage = (goal / max) * 100

    // Dynamic Color Logic
    const getColor = (val: number) => {
        if (val < 0) return "bg-red-500"
        if (val < 10) return "bg-orange-500"
        if (val < 20) return "bg-yellow-500"
        return "bg-green-500"
    }

    const fillColor = getColor(value);

    return (
        <div className="flex flex-col items-center justify-center h-[350px] w-full">
            <div className="relative h-[250px] w-12 bg-secondary/50 rounded-t-full border-4 border-secondary shadow-inner">

                {/* Liquid Fill */}
                <div
                    className={cn("absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out rounded-t-full", fillColor)}
                    style={{ height: `${percentage}%` }}
                />

                {/* Bulb (Bottom) */}
                <div className={cn("absolute -bottom-6 -left-[6px] w-[60px] h-[60px] rounded-full border-4 border-secondary shadow-xl z-10 flex items-center justify-center", fillColor)}>
                    <span className="text-white font-bold text-lg drop-shadow-md">{value}%</span>
                </div>
            </div>

            {/* Scale/Ticks (Decorative) */}
            <div className="absolute h-[250px] ml-20 flex flex-col justify-between py-2 text-xs text-muted-foreground/50">
                <span>{max}%</span>
                <span>{max * 0.75}%</span>
                <span>{max * 0.5}%</span>
                <span>{max * 0.25}%</span>
                <span className="mb-6">0%</span>
            </div>

            <div className="mt-12 text-center">
                <h4 className="text-muted-foreground text-sm uppercase tracking-widest">{label}</h4>
                <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xs text-white/50">Este {value >= goal ? "mes vas genial 🚀" : "mes toca apretarse el cinturón 📉"}</p>
                    {totalGoalAmount !== undefined && (
                        <p className="text-sm font-medium text-blue-400 mt-1">
                            Meta Acumulada: ${totalGoalAmount.toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
