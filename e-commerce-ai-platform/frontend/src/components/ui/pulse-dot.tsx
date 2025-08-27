import * as React from "react"
import { cn } from "@/lib/utils"

interface PulseDotProps {
  size?: "sm" | "md" | "lg"
  color?: "green" | "red" | "yellow" | "blue" | "purple"
  className?: string
  animate?: boolean
}

const PulseDot: React.FC<PulseDotProps> = ({
  size = "md",
  color = "green",
  className = "",
  animate = true
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  const colorClasses = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500", 
    blue: "bg-blue-500",
    purple: "bg-purple-500"
  }

  const pulseColorClasses = {
    green: "bg-green-400",
    red: "bg-red-400", 
    yellow: "bg-yellow-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400"
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      <div className={cn(
        "rounded-full",
        sizeClasses[size],
        colorClasses[color]
      )} />
      
      {animate && (
        <>
          <div className={cn(
            "absolute top-0 left-0 rounded-full animate-ping",
            sizeClasses[size],
            pulseColorClasses[color],
            "opacity-75"
          )} />
          <div className={cn(
            "absolute top-0 left-0 rounded-full animate-pulse",
            sizeClasses[size],
            pulseColorClasses[color],
            "opacity-50"
          )} />
        </>
      )}
    </div>
  )
}

export { PulseDot }
