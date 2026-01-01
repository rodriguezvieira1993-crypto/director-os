"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ObjectiveCard } from "@/components/objectives/ObjectiveCard"
import { ObjectiveDetailSheet } from "@/components/objectives/ObjectiveDetailSheet"
import { Objective } from "@/types/objective"
import { useData } from "@/context/DataProvider"
import { Plus } from "lucide-react"

export default function ObjectivesPage() {
    const { objectives, addObjective, updateObjective, deleteObjective } = useData()
    const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const handleObjectiveClick = (obj: Objective) => {
        setSelectedObjective(obj)
        setIsSheetOpen(true)
    }

    const handleSaveObjective = (obj: Objective) => {
        const exists = objectives.find(o => o.id === obj.id)
        if (exists) {
            updateObjective(obj)
        } else {
            addObjective(obj)
        }
        setIsSheetOpen(false)
        setSelectedObjective(null)
    }

    const handleDeleteObjective = (id: string) => {
        deleteObjective(id)
        setIsSheetOpen(false)
        setSelectedObjective(null)
    }

    const handleNewObjective = () => {
        const newObjective: Objective = {
            id: crypto.randomUUID(),
            title: "Nuevo Objetivo",
            category: "General",
            icon: "🎯",
            status: "ON_TRACK",
            progress: 0,
            keyResults: []
        }
        setSelectedObjective(newObjective)
        setIsSheetOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Objetivos (OKRs)</h2>
                    <p className="text-muted-foreground">Define y rastrea tus objetivos trimestrales y anuales.</p>
                </div>
                <Button onClick={handleNewObjective}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Objetivo
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {objectives.map((obj) => (
                    <ObjectiveCard
                        key={obj.id}
                        objective={obj}
                        onClick={() => handleObjectiveClick(obj)}
                        onDelete={handleDeleteObjective}
                    />
                ))}
            </div>

            <ObjectiveDetailSheet
                objective={selectedObjective}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleSaveObjective}
                onDelete={handleDeleteObjective}
            />
        </div>
    )
}
