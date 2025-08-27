import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  delay?: number
  duration?: number
  showPercentage?: boolean
  color?: "blue" | "green" | "yellow" | "red" | "purple"
}

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500", 
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  purple: "bg-purple-500"
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className = "",
  barClassName = "",
  delay = 0,
  duration = 1500,
  showPercentage = false,
  color = "blue"
}) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      
      const startTime = Date.now()
      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 使用缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const animatedValue = percentage * easeOutCubic
        
        setCurrentValue(animatedValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [percentage, delay, duration])

  return (
    <div className={cn("relative", className)}>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out rounded-full relative overflow-hidden",
            colorClasses[color],
            barClassName
          )}
          style={{ width: `${currentValue}%` }}
        >
          {/* 光泽效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          
          {/* 流动效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse animation-delay-500" />
        </div>
      </div>
      
      {showPercentage && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-right">
          {Math.round(currentValue)}%
        </div>
      )}
    </div>
  )
}

export { AnimatedProgress }
