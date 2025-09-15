import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  FileText, 
  Copy, 
  Download, 
  Edit3, 
  Wand2,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowRight
} from 'lucide-react';
import type { OperationTask, GeneratedContent, ContentType } from '../../types/operations';

interface ContentGenerationProps {
  task: OperationTask;
}

export function ContentGeneration({ task }: ContentGenerationProps) {
  const [generating, setGenerating] = useState(false);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>(['title', 'description']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['ozon']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['ru']);
  const [customRequirements, setCustomRequirements] = useState('');
  const [activeContent, setActiveContent] = useState<GeneratedContent | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    if (task.progress.content === 'completed') {
      loadGeneratedContents();
    }
  }, [task.id]);

  const loadGeneratedContents = async () => {
    // 模拟加载已生成的内容
    const mockContents: GeneratedContent[] = [
      {
        id: 'content-001',
        taskId: task.id,
        type: 'title',
        platform: 'ozon',
        language: 'ru',
        content: 'Беспроводные наушники TWS с активным шумоподавлением - Премиум качество звука',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'content-002',
        taskId: task.id,
        type: 'description',
        platform: 'ozon',
        language: 'ru',
        content: 'Откройте для себя новый уровень звука с нашими беспроводными наушниками TWS. Технология активного шумоподавления блокирует до 95% внешних шумов, позволяя вам полностью погрузиться в музыку. Время работы до 8 часов на одном заряде, а с кейсом - до 32 часов. Быстрая зарядка за 15 минут дает 3 часа прослушивания. Идеально подходят для работы, спорта и путешествий.',
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'content-003',
        taskId: task.id,
        type: 'keywords',
        platform: 'ozon',
        language: 'ru',
        content: 'беспроводные наушники, TWS, шумоподавление, bluetooth наушники, спортивные наушники, качественный звук, долгая батарея, быстрая зарядка',
        status: 'approved',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    setContents(mockContents);
    if (mockContents.length > 0) {
      setActiveContent(mockContents[0]);
      setEditingContent(mockContents[0].content);
    }
  };

  const contentTypes = [
    { id: 'title', name: '商品标题', description: '吸引眼球的商品标题' },
    { id: 'description', name: '商品描述', description: '详细的商品介绍' },
    { id: 'features', name: '特性列表', description: '商品核心特性' },
    { id: 'keywords', name: '关键词', description: 'SEO优化关键词' }
  ];

  const platforms = [
    { id: 'ozon', name: 'OZON' },
    { id: 'wildberries', name: 'Wildberries' },
    { id: 'yandex_market', name: 'Yandex Market' },
    { id: 'avito', name: 'Avito' }
  ];

  const languages = [
    { id: 'ru', name: '俄语' },
    { id: 'en', name: '英语' }
  ];

  const handleTypeChange = (typeId: ContentType, checked: boolean) => {
    if (checked) {
      setSelectedTypes([...selectedTypes, typeId]);
    } else {
      setSelectedTypes(selectedTypes.filter(t => t !== typeId));
    }
  };

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    } else {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
    }
  };

  const handleLanguageChange = (langId: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages([...selectedLanguages, langId]);
    } else {
      setSelectedLanguages(selectedLanguages.filter(l => l !== langId));
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      loadGeneratedContents();
      setGenerating(false);
    }, 3000);
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // 这里可以添加toast提示
  };

  const handleSaveEdit = () => {
    if (activeContent) {
      const updatedContents = contents.map(c => 
        c.id === activeContent.id 
          ? { ...c, content: editingContent, updatedAt: new Date() }
          : c
      );
      setContents(updatedContents);
      setActiveContent({ ...activeContent, content: editingContent });
    }
  };

  const handleApproveContent = (contentId: string) => {
    const updatedContents = contents.map(c => 
      c.id === contentId ? { ...c, status: 'approved' as const } : c
    );
    setContents(updatedContents);
  };

  const handleRejectContent = (contentId: string) => {
    const updatedContents = contents.map(c => 
      c.id === contentId ? { ...c, status: 'rejected' as const } : c
    );
    setContents(updatedContents);
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'title': return '📝';
      case 'description': return '📄';
      case 'features': return '⭐';
      case 'keywords': return '🔍';
      case 'images': return '🖼️';
      case 'video': return '🎥';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  if (task.progress.content === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            内容生成配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 内容类型选择 */}
            <div>
              <Label className="text-base font-medium">选择生成内容类型</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {contentTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={type.id}
                      checked={selectedTypes.includes(type.id as ContentType)}
                      onCheckedChange={(checked) => 
                        handleTypeChange(type.id as ContentType, checked as boolean)
                      }
                    />
                    <label htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span>{getContentTypeIcon(type.id as ContentType)}</span>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 平台选择 */}
            <div>
              <Label className="text-base font-medium">目标平台</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {platforms.map(platform => (
                  <div key={platform.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={platform.id}
                      checked={selectedPlatforms.includes(platform.id)}
                      onCheckedChange={(checked) => 
                        handlePlatformChange(platform.id, checked as boolean)
                      }
                    />
                    <label htmlFor={platform.id} className="cursor-pointer font-medium">
                      {platform.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 语言选择 */}
            <div>
              <Label className="text-base font-medium">内容语言</Label>
              <div className="flex gap-3 mt-3">
                {languages.map(lang => (
                  <div key={lang.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={lang.id}
                      checked={selectedLanguages.includes(lang.id)}
                      onCheckedChange={(checked) => 
                        handleLanguageChange(lang.id, checked as boolean)
                      }
                    />
                    <label htmlFor={lang.id} className="cursor-pointer font-medium">
                      {lang.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 自定义要求 */}
            <div>
              <Label htmlFor="requirements">特殊要求（可选）</Label>
              <Textarea
                id="requirements"
                placeholder="例如：突出降噪功能，面向商务人群，语调专业..."
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                rows={3}
              />
            </div>

            {/* 生成按钮 */}
            <div className="flex justify-center">
              <Button 
                onClick={handleGenerate}
                disabled={generating || selectedTypes.length === 0}
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    开始生成内容
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            正在生成内容...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <p className="text-muted-foreground mt-4">
                AI正在根据商品分析结果生成优质内容...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 内容概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              内容生成完成
            </div>
            <Button variant="outline" onClick={handleGenerate}>
              <Plus className="w-4 h-4 mr-2" />
              生成更多
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{contents.length}</div>
              <div className="text-sm text-muted-foreground">总内容数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {contents.filter(c => c.status === 'approved').length}
              </div>
              <div className="text-sm text-muted-foreground">已通过</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {contents.filter(c => c.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">待审核</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {contents.filter(c => c.status === 'rejected').length}
              </div>
              <div className="text-sm text-muted-foreground">已拒绝</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 内容列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>生成的内容</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contents.map(content => (
                  <div 
                    key={content.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      activeContent?.id === content.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      setActiveContent(content);
                      setEditingContent(content.content);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{getContentTypeIcon(content.type)}</span>
                        <span className="font-medium capitalize">{content.type}</span>
                      </div>
                      <Badge className={getStatusColor(content.status)}>
                        {getStatusText(content.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {content.platform} • {content.language.toUpperCase()}
                    </div>
                    <p className="text-sm line-clamp-2">{content.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 内容编辑器 */}
        <div className="lg:col-span-2">
          {activeContent ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getContentTypeIcon(activeContent.type)}</span>
                    <span className="capitalize">{activeContent.type}</span>
                    <Badge variant="outline">{activeContent.platform}</Badge>
                    <Badge variant="outline">{activeContent.language.toUpperCase()}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyContent(activeContent.content)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      复制
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      保存
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    rows={activeContent.type === 'description' ? 8 : 4}
                    className="font-mono"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {activeContent.status !== 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveContent(activeContent.id)}
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          通过
                        </Button>
                      )}
                      {activeContent.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectContent(activeContent.id)}
                        >
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          拒绝
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      字符数: {editingContent.length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  选择内容进行编辑
                </h3>
                <p className="text-gray-500">
                  从左侧列表中选择一个内容进行查看和编辑
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 下一步操作 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">内容生成完成！</h3>
              <p className="text-sm text-muted-foreground">
                已生成 {contents.filter(c => c.status === 'approved').length} 个通过的内容，
                可以继续制定营销策略
              </p>
            </div>
            <Button>
              制定营销策略
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContentGeneration;