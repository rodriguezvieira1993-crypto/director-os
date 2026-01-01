"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Objective, KeyResult } from "@/types/objective"
import { Trash2, Plus, Save, Settings2 } from "lucide-react"
import { EmojiPicker } from "./EmojiPicker"
import { KPIEditor } from "./KPIEditor"

interface ObjectiveDetailSheetProps {
    objective: Objective | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave?: (updatedObjective: Objective) => void
    onDelete?: (id: string) => void
}

export function ObjectiveDetailSheet({ objective, open, onOpenChange, onSave, onDelete }: ObjectiveDetailSheetProps) {
    const [editedIcon, setEditedIcon] = useState<string | undefined>(objective?.icon)
    const [editedKeyResults, setEditedKeyResults] = useState<KeyResult[]>(objective?.keyResults || [])

    // KPI Editor State
    const [selectedKPI, setSelectedKPI] = useState<KeyResult | null>(null)
    const [isKPIEditorOpen, setIsKPIEditorOpen] = useState(false)

    // Reset state when opening a new objective
    useEffect(() => {
        if (objective) {
            setEditedIcon(objective.icon)
            setEditedKeyResults(objective.keyResults || [])
        }
    }, [objective, open])

    if (!objective) return null

    // Helper to calc progress
    const calculateOverallProgress = (krs: KeyResult[]) => {
        if (!krs.length) return 0
        const total = krs.reduce((acc, kr) => {
            const start = kr.startValue ?? 0
            const current = kr.currentValue
            const target = kr.targetValue

            if (target === start) return acc + (current >= target ? 100 : 0)

            const progress = ((current - start) / (target - start)) * 100
            return acc + Math.min(100, Math.max(0, progress))
        }, 0)
        return Math.round(total / krs.length)
    }

    const currentProgress = calculateOverallProgress(editedKeyResults)

    const handleSave = () => {
        if (onSave) {
            onSave({
                ...objective,
                icon: editedIcon || objective.icon,
                keyResults: editedKeyResults,
                progress: currentProgress
            })
        }
        onOpenChange(false)
    }

    // ... (rest of handlers)
    const handleAddKPI = () => {
        const newKPI: KeyResult = {
            id: crypto.randomUUID(),
            title: "",
            type: "numerical",
            currentValue: 0,
            targetValue: 100,
            unit: "%",
            completed: false
        }
        setSelectedKPI(newKPI)
        setIsKPIEditorOpen(true)
    }

    const handleEditKPI = (kpi: KeyResult) => {
        setSelectedKPI(kpi)
        setIsKPIEditorOpen(true)
    }

    const handleSaveKPIDetails = (updatedKPI: KeyResult) => {
        if (editedKeyResults.some(k => k.id === updatedKPI.id)) {
            // Update existing
            setEditedKeyResults(editedKeyResults.map(k => k.id === updatedKPI.id ? updatedKPI : k))
        } else {
            // Add new
            setEditedKeyResults([...editedKeyResults, updatedKPI])
        }
        setIsKPIEditorOpen(false)
    }

    const handleDeleteKPI = (id: string, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent opening editor
        setEditedKeyResults(editedKeyResults.filter(kpi => kpi.id !== id))
    }

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="sm:max-w-[540px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Detalles del Objetivo</SheetTitle>
                        <div className="flex items-center justify-between mb-2">
                            <Badge variant={objective.status === 'ON_TRACK' ? 'success' : 'secondary'}>
                                {objective.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{objective.category}</span>
                        </div>
                        <div className="mr-8 flex items-center gap-4">
                            <EmojiPicker
                                value={editedIcon}
                                onChange={setEditedIcon}
                            />
                            <Input
                                defaultValue={objective.title}
                                className="text-2xl font-bold bg-transparent border-0 px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50 flex-1"
                            />
                        </div>
                        <SheetDescription>
                            Define y ajusta los KPIs para alcanzar este objetivo.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-6 space-y-8">
                        {/* Progress Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progreso General</span>
                                <span className="font-bold">{currentProgress}%</span>
                            </div>
                            <Progress value={currentProgress} className="h-3" />
                        </div>

                        {/* KPIs Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">KPIs (Indicadores Clave)</h3>
                                <Button variant="outline" size="sm" onClick={handleAddKPI}>
                                    <Plus className="w-4 h-4 mr-2" /> Agregar KPI
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {editedKeyResults.map((kr) => (
                                    <div
                                        key={kr.id}
                                        className="p-4 rounded-lg bg-secondary/20 border border-border/50 space-y-3 cursor-pointer hover:bg-secondary/40 transition-colors group relative"
                                        onClick={() => handleEditKPI(kr)}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-background/50 text-base">
                                                    {kr.icon || "•"}
                                                </div>
                                                <span className="font-medium text-base">{kr.title || "Nuevo KPI (Click para editar)"}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                                                onClick={(e) => handleDeleteKPI(kr.id, e)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="line-clamp-1">
                                            {kr.description}
                                            {kr.frequency && kr.frequency.length > 0 ? ` • ${kr.frequency.join(", ")}` : ""}
                                        </div>

                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                    <span>Progreso</span>
                                                    <span>
                                                        {kr.unit === '$'
                                                            ? `$${kr.currentValue} / $${kr.targetValue}`
                                                            : `${kr.currentValue} / ${kr.targetValue} ${kr.unit || ''}`
                                                        }
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={
                                                        kr.startValue !== undefined
                                                            ? Math.min(100, Math.max(0, ((kr.currentValue - kr.startValue) / (kr.targetValue - kr.startValue)) * 100))
                                                            : Math.min(100, Math.max(0, (kr.currentValue / (kr.targetValue || 1)) * 100))
                                                    }
                                                    className="h-1.5"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <SheetFooter className="mt-8 flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Cambios
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet >

            <KPIEditor
                open={isKPIEditorOpen}
                onOpenChange={setIsKPIEditorOpen}
                kpi={selectedKPI}
                onSave={handleSaveKPIDetails}
            />
        </>
    )
}
