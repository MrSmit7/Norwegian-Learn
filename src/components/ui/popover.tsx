import * as React from "react"
import { cn } from "@/lib/utils"

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}
export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
}

export function Popover({ children, className, ...props }: PopoverProps) {
  return <div className={cn("relative inline-block", className)} {...props}>{children}</div>
}

export function PopoverTrigger({ children, className, onClick, asChild = false, ...props }: PopoverTriggerProps) {
  return (
    <button
      className={cn("inline-flex items-center justify-center", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function PopoverContent({ children, className, ...props }: PopoverContentProps) {
  return (
    <div className={cn("absolute z-50 mt-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md", className)} {...props}>
      {children}
    </div>
  )
}