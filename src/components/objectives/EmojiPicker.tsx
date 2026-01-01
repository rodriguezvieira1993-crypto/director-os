"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const EMOJI_GRID = [
    "🎯", "🏆", "🔥", "🚀", "⭐", "📅", // General & Productivity
    "💰", "💸", "💳", "🏦", "📈", "💎", // Finance
    "🏋️", "🏃", "🥗", "🧠", "💊", "🩺", // Health
    "💻", "📱", "🤖", "📚", "🎓", "💡", // Tech & Education
    "🏠", "🚗", "✈️", "🌴", "🎨", "🎵"  // Lifestyle
]

interface EmojiPickerProps {
    value?: string
    onChange: (emoji: string) => void
    className?: string
}

export function EmojiPicker({ value, onChange, className }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={cn("relative", className)}>
            <Button
                variant="outline"
                className="w-16 h-16 text-3xl border-dashed border-2 flex items-center justify-center bg-transparent hover:bg-secondary/50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value || "😊"}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop to close on click outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Picker Container */}
                    <div className="absolute top-full mt-2 left-0 z-50 w-[240px] bg-[#1f1f1f] border border-border rounded-lg shadow-xl p-3 grid grid-cols-6 gap-2 animate-in fade-in zoom-in-95 duration-100">
                        {EMOJI_GRID.map((emoji) => (
                            <button
                                key={emoji}
                                className={cn(
                                    "flex items-center justify-center p-2 rounded-md hover:bg-white/10 text-xl transition-colors",
                                    value === emoji && "bg-primary/20 ring-1 ring-primary"
                                )}
                                onClick={() => {
                                    onChange(emoji)
                                    setIsOpen(false)
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
