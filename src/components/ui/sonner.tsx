"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as "light" | "dark" | "system"}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      style={{
        "--toast-bg": "var(--background)",
        "--toast-foreground": "var(--foreground)",
        "--toast-border": "var(--border)",
        "--toast-radius": "var(--radius)",
        "--toast-shadow": "var(--shadow-lg)",
        "--toast-success": "#39D0A4",
        "--toast-error": "#FF4D4D",
        "--toast-warning": "#FFB020",
        "--toast-info": "#6060D0",
      } as React.CSSProperties}
    />
  )
}
