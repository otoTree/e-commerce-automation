import * as React from "react"
import { useState, useEffect } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 2000,
  delay = 0,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0
}) => {
  const [currentValue, setCurrentValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      const startTime = Date.now()
      const startValue = 0
      const endValue = value

      const animate = () => {
        const now = Date.now()
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // 使用缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        const animatedValue = startValue + (endValue - startValue) * easeOutCubic
        
        setCurrentValue(animatedValue)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }
      
      animate()
    }, delay)

    return () => clearTimeout(timer)
  }, [value, duration, delay])

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return Math.floor(num).toLocaleString()
  }

  return (
    <span className={className}>
      {prefix}{formatNumber(currentValue)}{suffix}
    </span>
  )
}

export { AnimatedNumber }
