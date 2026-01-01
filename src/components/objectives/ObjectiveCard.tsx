"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Objective, ObjectiveStatus } from "@/types/objective"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"

interface ObjectiveCardProps {
    objective: Objective
    onClick?: () => void
    onDelete?: (id: string) => void
}

const getStatusConfig = (status: ObjectiveStatus) => {
    switch (status) {
        case "ON_TRACK":
            return { label: "En Camino", variant: "success" as const, color: "bg-green-500" }
        case "AT_RISK":
            return { label: "Riesgo", variant: "warning" as const, color: "bg-yellow-500" }
        case "BEHIND":
            return { label: "Atrasado", variant: "danger" as const, color: "bg-red-500" }
        case "COMPLETED":
            return { label: "Completado", variant: "default" as const, color: "bg-primary" }
        default:
            return { label: "Desconocido", variant: "secondary" as const, color: "bg-secondary" }
    }
}

export function ObjectiveCard({ objective, onClick, onDelete }: ObjectiveCardProps) {
    const statusConfig = getStatusConfig(objective.status)

    return (
        <Card
            className="w-full bg-card hover:bg-accent/10 transition-all border-border/40 cursor-pointer hover:border-primary/20 hover:shadow-lg hover:scale-[1.01] group relative"
            onClick={onClick}
        >
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(objective.id)
                    }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">

                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-md bg-secondary/50 text-xl w-10 h-10 flex items-center justify-center">
                            {objective.icon || "🎯"}
                        </div>
                    </div>
                    <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                </div>
                <CardTitle className="text-lg font-bold">{objective.title}</CardTitle>
                <CardDescription className="flex justify-between items-center mt-2">
                    <span>Progreso General</span>
                    <span className="font-mono">{objective.progress}%</span>
                </CardDescription>
                <Progress value={objective.progress} className="h-2 mt-2" indicatorColor={statusConfig.color} />
            </CardHeader>
            <CardContent>
                <div className="space-y-3 mt-2">
                    {objective.keyResults.map((kr) => (
                        <div key={kr.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                            {kr.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            ) : (
                                <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                            )}
                            <span className={cn(kr.completed && "line-through opacity-50")}>
                                {kr.title}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
