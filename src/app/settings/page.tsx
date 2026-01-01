"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/context/DataProvider"
import { AlertTriangle, Copy, Database, RefreshCw, Trash2 } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
    const { transactions, objectives, resetData, repairDatabase } = useData()
    const [copied, setCopied] = useState(false)

    const handleCopyData = () => {
        const data = {
            transactions,
            objectives
        }
        navigator.clipboard.writeText(JSON.stringify(data, null, 2))
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        if (confirm("¿Estás seguro? Esto borrará todas tus transacciones y restablecerá los objetivos predeterminados. Esta acción no se puede deshacer.")) {
            resetData()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">Administra tus datos y preferencias de la aplicación.</p>
            </div>

            <div className="grid gap-6">
                {/* Data Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Gestión de Datos
                        </CardTitle>
                        <CardDescription>
                            Tus datos se almacenan localmente en tu navegador. Aquí puedes exportarlos o reiniciarlos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/20">
                            <div>
                                <h3 className="font-medium">Exportar Datos (JSON)</h3>
                                <p className="text-sm text-muted-foreground">Copia todos tus datos al portapapeles para guardarlos externamente.</p>
                            </div>
                            <Button variant="outline" onClick={handleCopyData}>
                                <Copy className="mr-2 h-4 w-4" />
                                {copied ? "Copiado!" : "Copiar Datos"}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg border-yellow-500/20 bg-yellow-500/10">
                            <div>
                                <h3 className="font-medium text-yellow-500">Reparar Base de Datos</h3>
                                <p className="text-sm text-muted-foreground">Si tus objetivos no se guardan, usa esto para reinicializar la conexión.</p>
                            </div>
                            <Button variant="secondary" onClick={() => repairDatabase()}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reparar Conexión
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20 bg-destructive/10">
                            <div>
                                <h3 className="font-medium text-destructive">Reiniciar Base de Datos</h3>
                                <p className="text-sm text-muted-foreground">Borra todas las transacciones y restaura los objetivos iniciales.</p>
                            </div>
                            <Button variant="destructive" onClick={handleReset}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Reiniciar Todo
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Preview Section (Read Only) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visor de Datos Crudos</CardTitle>
                        <CardDescription>
                            Vista previa de lo que está almacenado actualmente en LocalStorage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs font-mono">
                            <pre>{JSON.stringify({ transactions, objectives }, null, 2)}</pre>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
