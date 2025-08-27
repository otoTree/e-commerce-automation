import * as React from "react"
import { AnimatedCard } from "./animated-card"
import { AnimatedProgress } from "./animated-progress"
import { AnimatedNumber } from "./animated-number"
import { PulseDot } from "./pulse-dot"
import { cn } from "@/lib/utils"
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Activity,
  Server,
  Database,
  Wifi
} from "lucide-react"

interface SystemStatusProps {
  systemStatus: {
    cpu: number
    memory: number
    disk: number
    network?: {
      upload: number
      download: number
    }
    services?: {
      [key: string]: boolean
    }
  }
  delay?: number
}

const resourceConfig = [
  {
    key: 'cpu',
    label: 'CPU使用率',
    icon: Cpu,
    color: 'blue' as const
  },
  {
    key: 'memory', 
    label: '内存使用率',
    icon: MemoryStick,
    color: 'green' as const
  },
  {
    key: 'disk',
    label: '磁盘使用率', 
    icon: HardDrive,
    color: 'yellow' as const
  }
]

const serviceLabels: Record<string, string> = {
  backend: "后端服务",
  scriptsService: "脚本服务", 
  database: "数据库",
  redis: "缓存服务"
}

const AnimatedSystemStatus: React.FC<SystemStatusProps> = ({
  systemStatus,
  delay = 0
}) => {
  const getUsageColor = (value: number) => {
    if (value >= 80) return "red"
    if (value >= 60) return "yellow"
    return "green"
  }

  return (
    <AnimatedCard
      delay={delay}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-500"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
          <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          系统状态
        </h3>
      </div>

      {/* 资源使用情况 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {resourceConfig.map((resource, index) => {
          const value = systemStatus[resource.key as keyof typeof systemStatus] as number
          const usageColor = getUsageColor(value)
          
          return (
            <div
              key={resource.key}
              className={cn(
                "p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
                "bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800",
                "border-gray-200 dark:border-gray-600"
              )}
            >
              <div className="flex items-center space-x-3 mb-3">
                <resource.icon className={cn(
                  "h-5 w-5",
                  usageColor === "red" ? "text-red-500" :
                  usageColor === "yellow" ? "text-yellow-500" :
                  "text-green-500"
                )} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {resource.label}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className={cn(
                    "text-2xl font-bold",
                    usageColor === "red" ? "text-red-600 dark:text-red-400" :
                    usageColor === "yellow" ? "text-yellow-600 dark:text-yellow-400" :
                    "text-green-600 dark:text-green-400"
                  )}>
                    <AnimatedNumber
                      value={value}
                      delay={delay + index * 200}
                      suffix="%"
                      duration={1500}
                    />
                  </span>
                </div>
                
                <AnimatedProgress
                  value={value}
                  delay={delay + index * 200 + 300}
                  color={usageColor}
                  className="h-2"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* 网络状态 */}
      {systemStatus.network && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">网络状态</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">上传速度</div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                <AnimatedNumber
                  value={systemStatus.network.upload}
                  delay={delay + 1000}
                  suffix=" MB/s"
                  decimals={1}
                />
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">下载速度</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                <AnimatedNumber
                  value={systemStatus.network.download}
                  delay={delay + 1200}
                  suffix=" MB/s"
                  decimals={1}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 服务状态 */}
      {systemStatus.services && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">服务状态</h4>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Object.values(systemStatus.services).filter(Boolean).length}/
              {Object.keys(systemStatus.services).length} 运行中
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(systemStatus.services).map(([service, status], index) => (
              <div
                key={service}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border transition-all duration-300",
                  "hover:shadow-sm hover:scale-[1.02]",
                  status 
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                )}
                style={{ animationDelay: `${delay + 1400 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <PulseDot
                    color={status ? "green" : "red"}
                    animate={status}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {serviceLabels[service] || service}
                  </span>
                </div>
                
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  status
                    ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                )}>
                  {status ? "运行" : "停止"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatedCard>
  )
}

export { AnimatedSystemStatus }
