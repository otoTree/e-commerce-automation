import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number
  children: React.ReactNode
  hover?: boolean
  pulse?: boolean
  bounce?: boolean
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ 
    className, 
    children, 
    delay = 0, 
    hover = true, 
    pulse = false, 
    bounce = false,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, delay)

      return () => clearTimeout(timer)
    }, [delay])

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-700 ease-out transform",
          // 进入动画
          isVisible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-8 opacity-0 scale-95",
          // 悬停效果
          hover && isHovered && "scale-105 shadow-xl",
          // 脉冲效果
          pulse && "animate-pulse",
          // 弹跳效果
          bounce && "animate-bounce",
          className
        )}
        onMouseEnter={() => hover && setIsHovered(true)}
        onMouseLeave={() => hover && setIsHovered(false)}
        style={{
          transitionDelay: `${delay}ms`
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
