import * as React from "react"
import { LucideIcon } from "lucide-react"
import { AnimatedCard } from "./animated-card"
import { AnimatedNumber } from "./animated-number"
import { cn } from "@/lib/utils"

interface AnimatedStatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: "blue" | "green" | "yellow" | "purple" | "red" | "indigo"
  delay?: number
  trend?: {
    value: number
    type: "up" | "down" | "neutral"
    label?: string
  }
  suffix?: string
  prefix?: string
  className?: string
}

const colorVariants = {
  blue: {
    icon: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    border: "border-blue-200 dark:border-blue-800",
    glow: "shadow-blue-500/20"
  },
  green: {
    icon: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    gradient: "from-green-500/10 via-green-500/5 to-transparent",
    border: "border-green-200 dark:border-green-800",
    glow: "shadow-green-500/20"
  },
  yellow: {
    icon: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
    gradient: "from-yellow-500/10 via-yellow-500/5 to-transparent",
    border: "border-yellow-200 dark:border-yellow-800",
    glow: "shadow-yellow-500/20"
  },
  purple: {
    icon: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    border: "border-purple-200 dark:border-purple-800",
    glow: "shadow-purple-500/20"
  },
  red: {
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    gradient: "from-red-500/10 via-red-500/5 to-transparent",
    border: "border-red-200 dark:border-red-800",
    glow: "shadow-red-500/20"
  },
  indigo: {
    icon: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    border: "border-indigo-200 dark:border-indigo-800",
    glow: "shadow-indigo-500/20"
  }
}

const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  delay = 0,
  trend,
  suffix = "",
  prefix = "",
  className
}) => {
  const colors = colorVariants[color]
  const numericValue = typeof value === 'number' ? value : 0

  return (
    <AnimatedCard
      delay={delay}
      className={cn(
        "relative overflow-hidden border bg-gradient-to-br from-white via-white to-gray-50/50",
        "dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/50",
        "hover:shadow-2xl transition-all duration-500",
        colors.border,
        className
      )}
    >
      {/* 背景渐变效果 */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        colors.gradient
      )} />
      
      {/* 光晕效果 */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl blur-xl",
        colors.glow
      )} />

      <div className="relative p-4 sm:p-6 min-h-[110px] sm:min-h-[130px]">
        <div className="flex items-start space-x-3 sm:space-x-4 h-full">
          {/* 图标区域 */}
          <div className={cn(
            "relative p-3 sm:p-4 rounded-xl transition-all duration-300 flex-shrink-0 self-center",
            colors.iconBg,
            "group-hover:scale-110 group-hover:rotate-3"
          )}>
            <Icon className={cn("h-6 w-6 sm:h-8 sm:w-8 transition-colors duration-300", colors.icon)} />
            
            {/* 图标光晕 */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300",
              colors.iconBg
            )} />
          </div>

          {/* 内容区域 */}
          <div className="stat-card-layout flex-1 min-w-0">
            {/* 第一行：标题 */}
            <div>
              <p className="stat-card-title text-gray-600 dark:text-gray-400 transition-colors duration-300">
                {title}
              </p>
            </div>
            
            {/* 第二行：数值 */}
            <div>
              <h3 className="stat-card-value text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-gray-900 dark:text-white transition-colors duration-300">
                {typeof value === 'number' ? (
                  <AnimatedNumber
                    value={numericValue}
                    delay={delay + 200}
                    duration={1500}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={suffix === '%' ? 1 : 0}
                  />
                ) : (
                  <span className="animate-pulse">{value}</span>
                )}
              </h3>
            </div>
              
            {/* 第三行：趋势指示器 */}
            {trend && (
              <div className="stat-card-trend">
                {/* 趋势箭头和百分比 */}
                <div className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-300",
                  trend.type === "up" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                  trend.type === "down" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" :
                  "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                  "hover:scale-105 font-medium"
                )}>
                  <span className={cn(
                    "transition-transform duration-300",
                    trend.type === "up" ? "animate-bounce" : 
                    trend.type === "down" ? "animate-pulse" : ""
                  )}>
                    {trend.type === "up" ? "↗" : trend.type === "down" ? "↘" : "→"}
                  </span>
                  <span className="font-semibold">
                    <AnimatedNumber
                      value={Math.abs(trend.value)}
                      delay={delay + 500}
                      duration={1000}
                      suffix="%"
                      decimals={1}
                    />
                  </span>
                </div>
                
                {/* 趋势标签 */}
                {trend.label && (
                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                    {trend.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className={cn(
          "absolute bottom-0 left-6 right-6 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500",
          colors.gradient.replace('bg-gradient-to-br', 'bg-gradient-to-r')
        )} />
      </div>
    </AnimatedCard>
  )
}

export { AnimatedStatCard }

