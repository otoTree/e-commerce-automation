import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">电商AI助手</h1>
          <p className="text-lg text-muted-foreground mb-8">
            智能产品数据提取与插件健康监控平台
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/products"
          >
            产品数据管理
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/plugins"
          >
            插件健康监控
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/tasks"
          >
            任务管理
          </Link>
           <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/operation"
          >
            产品运营
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-6xl">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">产品数据提取</h3>
            <p className="text-muted-foreground mb-4">
              支持从1688和Ozon平台自动提取产品信息，包括价格、图片、规格等详细数据。
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 智能HTML解析</li>
              <li>• 多平台支持</li>
              <li>• 数据验证与清洗</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">插件健康监控</h3>
            <p className="text-muted-foreground mb-4">
              实时监控浏览器插件运行状态，提供性能指标和错误诊断。
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 实时状态监控</li>
              <li>• 性能指标统计</li>
              <li>• 错误日志记录</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">任务管理系统</h3>
            <p className="text-muted-foreground mb-4">
              统一管理和跟踪系统中的各类任务，提供完整的任务生命周期管理。
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 任务状态跟踪</li>
              <li>• 进度可视化</li>
              <li>• 统计分析报告</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          了解更多
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          部署应用
        </a>
      </footer>
    </div>
  );
}
