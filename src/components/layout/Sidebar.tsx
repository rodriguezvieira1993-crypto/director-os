"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Target,
    Wallet,
    Settings,
    LogOut
} from "lucide-react"

import Link from "next/link"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 min-h-screen border-r bg-background", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">

                    <div className="space-y-1">
                        <Link href="/" passHref>
                            <Button
                                variant={pathname === "/" ? "secondary" : "ghost"}
                                className="w-full justify-center cursor-pointer h-10 px-0"
                                title="Panel de Control"
                            >
                                <LayoutDashboard className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/objectives" passHref>
                            <Button
                                variant={pathname?.startsWith("/objectives") ? "secondary" : "ghost"}
                                className="w-full justify-center cursor-pointer h-10 px-0"
                                title="Objetivos"
                            >
                                <Target className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/finances" passHref>
                            <Button
                                variant={pathname?.startsWith("/finances") ? "secondary" : "ghost"}
                                className="w-full justify-center cursor-pointer h-10 px-0"
                                title="Finanzas"
                            >
                                <Wallet className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/settings" passHref>
                            <Button
                                variant={pathname?.startsWith("/settings") ? "secondary" : "ghost"}
                                className="w-full justify-center cursor-pointer h-10 px-0"
                                title="Configuración"
                            >
                                <Settings className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-3 py-2 mt-auto border-t">
                    <Button
                        variant="ghost"
                        className="w-full justify-center cursor-pointer h-10 px-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Cerrar Sesión"
                        onClick={async () => {
                            const { supabase } = await import('@/lib/supabase')
                            await supabase.auth.signOut()
                            window.location.href = '/login'
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
