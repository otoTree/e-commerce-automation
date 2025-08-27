'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Users,
  Zap,
  Shield,
  Settings,
  TrendingUp,
  PlayCircle,
  FileText,
  Video,
  Download
} from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: '全部', icon: BookOpen },
    { id: 'getting-started', name: '入门指南', icon: PlayCircle },
    { id: 'tasks', name: '任务管理', icon: Settings },
    { id: 'automation', name: '自动化脚本', icon: Zap },
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'analytics', name: '数据分析', icon: TrendingUp },
  ];

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: '如何开始使用电商AI自动化平台？',
      answer: '首先注册账户并完成邮箱验证，然后按照引导教程完成基础配置。您可以从创建第一个简单的商品抓取任务开始熟悉平台功能。',
      popularity: 95
    },
    {
      id: 2,
      category: 'tasks',
      question: '如何创建和管理自动化任务？',
      answer: '在任务管理页面点击"创建新任务"，选择任务类型（如商品抓取、价格监控等），配置相关参数，然后启动任务。您可以在任务列表中查看运行状态和进度。',
      popularity: 88
    },
    {
      id: 3,
      category: 'automation',
      question: '支持哪些电商平台的数据抓取？',
      answer: '目前支持淘宝、京东、天猫、拼多多、亚马逊等主流电商平台。我们持续增加新的平台支持，您也可以提交需求。',
      popularity: 92
    },
    {
      id: 4,
      category: 'security',
      question: '如何保护我的账户安全？',
      answer: '建议启用两步验证、定期更换密码、监控登录历史。平台采用企业级安全标准，所有数据都经过加密处理。',
      popularity: 76
    },
    {
      id: 5,
      category: 'analytics',
      question: '如何查看和导出数据分析报告？',
      answer: '在数据分析页面可以查看各种维度的统计图表，支持自定义时间范围和筛选条件。所有报告都支持PDF和Excel格式导出。',
      popularity: 84
    },
    {
      id: 6,
      category: 'tasks',
      question: '任务失败了怎么办？',
      answer: '检查任务配置和目标网站状态，查看错误日志获取详细信息。大部分问题可以通过调整参数或重试解决。如需帮助请联系技术支持。',
      popularity: 79
    }
  ];

  const quickLinks = [
    { title: '入门教程', desc: '5分钟快速上手', icon: PlayCircle, url: '#' },
    { title: 'API文档', desc: '开发者接口文档', icon: FileText, url: '#' },
    { title: '视频教程', desc: '详细操作演示', icon: Video, url: '#' },
    { title: '下载中心', desc: '客户端和工具下载', icon: Download, url: '#' },
  ];

  const popularArticles = [
    { title: '商品抓取最佳实践', views: 12450, category: '使用指南' },
    { title: '如何设置价格监控规则', views: 8930, category: '高级功能' },
    { title: '自动化脚本开发指南', views: 7620, category: '开发文档' },
    { title: '数据导出与分析', views: 6540, category: '数据分析' },
    { title: '常见错误解决方案', views: 5890, category: '故障排除' },
  ];

  const contactOptions = [
    {
      type: '在线客服',
      desc: '实时聊天支持',
      icon: MessageCircle,
      action: '开始对话',
      available: true,
      hours: '9:00-18:00'
    },
    {
      type: '电话支持',
      desc: '400-888-9999',
      icon: Phone,
      action: '拨打电话',
      available: true,
      hours: '9:00-18:00'
    },
    {
      type: '邮件支持',
      desc: 'support@example.com',
      icon: Mail,
      action: '发送邮件',
      available: true,
      hours: '24小时内回复'
    }
  ];

  const filteredFaq = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* 页面标题和搜索 */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <HelpCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            帮助中心
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          找到您需要的答案，快速解决问题
        </p>
        
        {/* 搜索框 */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索帮助文档、常见问题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 快速链接 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <link.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.desc}
                </p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 float-right mt-2" />
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 主要内容区域 */}
        <div className="lg:col-span-2 space-y-8">
          {/* FAQ 分类 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              常见问题
            </h2>
            
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>

            {/* FAQ 列表 */}
            <div className="space-y-4">
              {filteredFaq.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{faq.popularity}% 有用</span>
                        </div>
                      </div>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                        {faq.answer}
                      </p>
                      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-600">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          这个答案有帮助吗？
                        </span>
                        <Button variant="outline" size="sm">
                          👍 有用
                        </Button>
                        <Button variant="outline" size="sm">
                          👎 无用
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-8">
          {/* 热门文章 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              热门文章
            </h3>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {article.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{article.category}</span>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 联系支持 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              联系支持
            </h3>
            <div className="space-y-4">
              {contactOptions.map((option, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <option.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {option.type}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {option.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          option.available 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {option.hours}
                        </span>
                        <Button size="sm" variant="outline">
                          {option.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 反馈建议 */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              没找到答案？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              告诉我们您的问题，帮助我们改进服务
            </p>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              提交反馈
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
