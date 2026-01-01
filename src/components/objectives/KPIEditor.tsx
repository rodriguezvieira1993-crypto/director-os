"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { KeyResult } from "@/types/objective"
import { Save, Dumbbell, BookOpen, DollarSign, ShoppingCart, Star } from "lucide-react"

interface KPIEditorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    kpi: KeyResult | null
    onSave: (kpi: KeyResult) => void
}

const DAYS = [
    { value: "Mon", label: "L" },
    { value: "Tue", label: "M" },
    { value: "Wed", label: "M" },
    { value: "Thu", label: "J" },
    { value: "Fri", label: "V" },
    { value: "Sat", label: "S" },
    { value: "Sun", label: "D" },
]

export function KPIEditor({ open, onOpenChange, kpi, onSave }: KPIEditorProps) {
    const [editedKPI, setEditedKPI] = useState<KeyResult | null>(kpi)

    useEffect(() => {
        setEditedKPI(kpi)
    }, [kpi])

    if (!editedKPI) return null

    const handleSave = () => {
        if (editedKPI) {
            onSave(editedKPI)
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Personalizar KPI</DialogTitle>
                    <DialogDescription>
                        Configura los detalles de tu meta.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Header: Icon + Title */}
                    <div className="flex gap-3">
                        <div className="flex items-center justify-center h-10 w-10 text-2xl bg-secondary/30 rounded-md border border-border/50 shrink-0">
                            {editedKPI.icon || "🎯"}
                        </div>
                        <div className="grid gap-1 flex-1">
                            <Label htmlFor="title" className="sr-only">Título</Label>
                            <Input
                                id="title"
                                value={editedKPI.title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedKPI({ ...editedKPI, title: e.target.value })}
                                placeholder="Título del objetivo..."
                                className="font-semibold text-lg"
                            />
                        </div>
                    </div>

                    {/* CORE NUMERICAL TRACKING */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-1">
                            <Label htmlFor="startValue" className="text-xs font-medium text-muted-foreground uppercase">Inicio</Label>
                            <Input
                                id="startValue"
                                type="number"
                                placeholder="0"
                                value={editedKPI.startValue ?? 0}
                                onChange={(e) => setEditedKPI({ ...editedKPI, startValue: Number(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="currentValue" className="text-xs font-medium text-muted-foreground uppercase">Actual</Label>
                            <Input
                                id="currentValue"
                                type="number"
                                placeholder="0"
                                value={editedKPI.currentValue}
                                onChange={(e) => setEditedKPI({ ...editedKPI, currentValue: Number(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="targetValue" className="text-xs font-medium text-muted-foreground uppercase">Meta</Label>
                            <Input
                                id="targetValue"
                                type="number"
                                placeholder="100"
                                value={editedKPI.targetValue}
                                onChange={(e) => setEditedKPI({ ...editedKPI, targetValue: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    {/* Optional Description */}
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notas (Opcional)</Label>
                        <Input
                            id="description"
                            placeholder="Detalles extra..."
                            value={editedKPI.description || ""}
                            onChange={(e) => setEditedKPI({ ...editedKPI, description: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={handleSave} className="w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Configuración
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
