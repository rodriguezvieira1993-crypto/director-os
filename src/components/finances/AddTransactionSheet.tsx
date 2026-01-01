"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Transaction, TransactionType, CATEGORIES } from "@/types/finance"
import { ArrowDownCircle, ArrowUpCircle, PiggyBank } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddTransactionSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (transaction: Omit<Transaction, "id">) => void
}

export function AddTransactionSheet({ open, onOpenChange, onSave }: AddTransactionSheetProps) {
    const [type, setType] = useState<TransactionType>("expense")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [description, setDescription] = useState("")

    // Reset form when opened
    useEffect(() => {
        if (open) {
            setAmount("")
            setCategory("")
            setDescription("")
            setDate(new Date().toISOString().split('T')[0])
            setType("expense")
        }
    }, [open])

    const handleSave = () => {
        if (!amount || !category) return

        onSave({
            type,
            amount: parseFloat(amount),
            category,
            date: new Date(date),
            description
        })
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[500px]">
                <SheetHeader>
                    <SheetTitle>Nuevo Movimiento</SheetTitle>
                    <SheetDescription>
                        Registra un ingreso o gasto para mantener tus finanzas al día.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    {/* Type Toggle */}
                    <div className="grid grid-cols-3 gap-4">
                        <div
                            onClick={() => setType("income")}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-accent/5",
                                type === "income"
                                    ? "border-green-500 bg-green-500/10 text-green-500"
                                    : "border-muted/20 text-muted-foreground hover:border-green-500/50"
                            )}
                        >
                            <ArrowUpCircle className="h-6 w-6" />
                            <span className="font-bold text-sm">Ingreso</span>
                        </div>
                        <div
                            onClick={() => setType("expense")}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-accent/5",
                                type === "expense"
                                    ? "border-red-500 bg-red-500/10 text-red-500"
                                    : "border-muted/20 text-muted-foreground hover:border-red-500/50"
                            )}
                        >
                            <ArrowDownCircle className="h-6 w-6" />
                            <span className="font-bold text-sm">Gasto</span>
                        </div>
                        <div
                            onClick={() => setType("savings")}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-accent/5",
                                type === "savings"
                                    ? "border-blue-500 bg-blue-500/10 text-blue-500"
                                    : "border-muted/20 text-muted-foreground hover:border-blue-500/50"
                            )}
                        >
                            <PiggyBank className="h-6 w-6" />
                            <span className="font-bold text-sm">Ahorro</span>
                        </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Monto</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    className="pl-7 text-lg font-bold"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Fecha</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Grid */}
                    <div className="space-y-3">
                        <Label>Categoría</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {CATEGORIES[type].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={cn(
                                        "text-xs px-2 py-2 rounded-md border transition-all truncate",
                                        category === cat
                                            ? type === "income"
                                                ? "border-green-500 bg-green-500/10 text-green-500 font-medium shadow-sm"
                                                : type === "expense"
                                                    ? "border-red-500 bg-red-500/10 text-red-500 font-medium shadow-sm"
                                                    : "border-blue-500 bg-blue-500/10 text-blue-500 font-medium shadow-sm"
                                            : "border-transparent bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Notas (Opcional)</Label>
                        <Textarea
                            id="description"
                            placeholder="¿De qué fue este movimiento?"
                            className="resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <SheetFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} className="w-full sm:w-auto" disabled={!amount || !category}>
                        Guardar Movimiento
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
