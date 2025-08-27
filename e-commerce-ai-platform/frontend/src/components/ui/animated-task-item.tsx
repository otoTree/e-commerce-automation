import * as React from "react"
import { useState } from "react"
import { PulseDot } from "./pulse-dot"
import { AnimatedProgress } from "./animated-progress"
import { AnimatedCard } from "./animated-card"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  name: string
  type: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  updatedAt: string
}

interface AnimatedTaskItemProps {
  task: Task
  delay?: number
}

const statusConfig = {
  pending: {
    color: "yellow" as const,
    label: "等待中",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
  },
  running: {
    color: "green" as const,
    label: "运行中", 
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  completed: {
    color: "blue" as const,
    label: "已完成",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  failed: {
    color: "red" as const,
    label: "失败",
    bgColor: "bg-red-50 dark:bg-red-900/20"
  }
}

const AnimatedTaskItem: React.FC<AnimatedTaskItemProps> = ({
  task,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const status = statusConfig[task.status]

  return (
    <AnimatedCard
      delay={delay}
      hover={false}
      className={cn(
        "transition-all duration-300 ease-out border rounded-xl p-4",
        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
        status.bgColor,
        isHovered && "ring-2 ring-blue-500/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        {/* 左侧信息 */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* 状态指示器 */}
          <div className="flex-shrink-0">
            <PulseDot 
              color={status.color} 
              animate={task.status === "running"}
              size="md"
            />
          </div>

          {/* 任务信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className={cn(
                "font-semibold text-gray-900 dark:text-white truncate transition-all duration-300",
                isHovered && "text-blue-600 dark:text-blue-400"
              )}>
                {task.name}
              </h4>
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full transition-all duration-300",
                task.status === "running" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                task.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                task.status === "completed" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" :
                "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              )}>
                {status.label}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {task.type} • {new Date(task.updatedAt).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

            {/* 进度条 */}
            {(task.status === "running" || task.progress > 0) && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>进度</span>
                  <span>{task.progress}%</span>
                </div>
                <AnimatedProgress
                  value={task.progress}
                  delay={delay + 300}
                  duration={1000}
                  color={status.color}
                  className="h-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div className={cn(
          "flex items-center space-x-2 opacity-0 transition-all duration-300",
          isHovered && "opacity-100 translate-x-0",
          !isHovered && "translate-x-2"
        )}>
          {task.status === "running" && (
            <button className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200 hover:scale-110">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
            </button>
          )}
          
          {task.status === "pending" && (
            <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 hover:scale-110">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 010 5H9" />
              </svg>
            </button>
          )}
          
          {task.status === "failed" && (
            <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 hover:scale-110">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </AnimatedCard>
  )
}

export { AnimatedTaskItem }
