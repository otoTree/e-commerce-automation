# 文件管理数据模型设计

## 1. 文件主表 (files)

存储系统中所有文件的基本信息和元数据。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 文件唯一标识
  file_id: String,                  // 文件编号（可读性强）
  original_name: String,            // 原始文件名
  display_name: String,             // 显示名称
  description: String,              // 文件描述
  
  // 文件属性
  file_info: {
    // 基本属性
    size: Number,                   // 文件大小（字节）
    mime_type: String,              // MIME类型
    extension: String,              // 文件扩展名
    encoding: String,               // 文件编码
    
    // 哈希信息
    checksums: {
      md5: String,                  // MD5哈希
      sha1: String,                 // SHA1哈希
      sha256: String                // SHA256哈希
    },
    
    // 媒体信息（图片/视频）
    media_info: {
      // 图片信息
      image: {
        width: Number,              // 宽度
        height: Number,             // 高度
        format: String,             // 图片格式
        color_space: String,        // 色彩空间
        has_alpha: Boolean,         // 是否有透明通道
        dpi: Number,                // 分辨率
        
        // EXIF信息
        exif: {
          camera_make: String,      // 相机品牌
          camera_model: String,     // 相机型号
          taken_at: Date,           // 拍摄时间
          gps_location: {
            latitude: Number,       // 纬度
            longitude: Number       // 经度
          },
          settings: {
            iso: Number,            // ISO值
            aperture: String,       // 光圈
            shutter_speed: String,  // 快门速度
            focal_length: String    // 焦距
          }
        }
      },
      
      // 视频信息
      video: {
        duration: Number,           // 时长（秒）
        width: Number,              // 宽度
        height: Number,             // 高度
        frame_rate: Number,         // 帧率
        bit_rate: Number,           // 比特率
        codec: String,              // 编解码器
        
        // 音频轨道
        audio_tracks: [{
          codec: String,            // 音频编解码器
          sample_rate: Number,      // 采样率
          channels: Number,         // 声道数
          bit_rate: Number          // 比特率
        }]
      },
      
      // 音频信息
      audio: {
        duration: Number,           // 时长（秒）
        sample_rate: Number,        // 采样率
        channels: Number,           // 声道数
        bit_rate: Number,           // 比特率
        codec: String,              // 编解码器
        
        // 元数据
        metadata: {
          title: String,            // 标题
          artist: String,           // 艺术家
          album: String,            // 专辑
          genre: String,            // 流派
          year: Number              // 年份
        }
      },
      
      // 文档信息
      document: {
        page_count: Number,         // 页数
        word_count: Number,         // 字数
        language: String,           // 语言
        
        // 文档属性
        properties: {
          title: String,            // 标题
          author: String,           // 作者
          subject: String,          // 主题
          keywords: [String],       // 关键词
          created_at: Date,         // 创建时间
          modified_at: Date         // 修改时间
        }
      }
    }
  },
  
  // 存储信息
  storage: {
    // 存储提供商
    provider: String,               // 存储提供商：local, aws_s3, azure_blob, google_cloud, aliyun_oss
    
    // 存储路径
    storage_path: String,           // 存储路径
    bucket_name: String,            // 存储桶名称
    region: String,                 // 存储区域
    
    // 访问信息
    access_info: {
      public_url: String,           // 公开访问URL
      private_url: String,          // 私有访问URL
      cdn_url: String,              // CDN访问URL
      expires_at: Date,             // URL过期时间
      
      // 访问令牌
      access_tokens: [{
        token: String,              // 访问令牌
        permissions: [String],      // 权限列表
        expires_at: Date,           // 过期时间
        created_for: ObjectId       // 创建给谁
      }]
    },
    
    // 备份信息
    backup: {
      enabled: Boolean,             // 启用备份
      backup_locations: [{
        provider: String,           // 备份提供商
        path: String,               // 备份路径
        last_backup: Date,          // 最后备份时间
        status: String              // 备份状态
      }],
      retention_days: Number        // 保留天数
    }
  },
  
  // 文件分类
  categorization: {
    // 业务分类
    business_category: String,      // 业务分类：product_image, user_avatar, document, marketing_material
    sub_category: String,           // 子分类
    
    // 标签系统
    tags: [{
      name: String,                 // 标签名称
      category: String,             // 标签分类
      color: String,                // 标签颜色
      added_by: ObjectId,           // 添加者
      added_at: Date                // 添加时间
    }],
    
    // 自动分类
    auto_classification: {
      ai_tags: [String],            // AI生成标签
      confidence_scores: [Number],  // 置信度分数
      detected_objects: [String],   // 检测到的对象
      scene_classification: String, // 场景分类
      content_moderation: {
        is_safe: Boolean,           // 内容安全
        adult_content: Number,      // 成人内容评分
        violence_content: Number,   // 暴力内容评分
        racy_content: Number        // 不当内容评分
      }
    }
  },
  
  // 关联信息
  associations: {
    // 关联实体
    related_entities: [{
      entity_type: String,          // 实体类型：product, user, order, campaign
      entity_id: ObjectId,          // 实体ID
      relationship: String,         // 关系类型：primary_image, gallery, attachment, avatar
      order: Number,                // 排序
      metadata: Mixed               // 关联元数据
    }],
    
    // 文件组
    file_groups: [{
      group_id: ObjectId,           // 组ID
      group_name: String,           // 组名称
      role: String,                 // 在组中的角色：original, thumbnail, preview, variant
      order: Number                 // 排序
    }],
    
    // 版本关系
    versioning: {
      is_version: Boolean,          // 是否为版本文件
      parent_file_id: ObjectId,     // 父文件ID
      version_number: String,       // 版本号
      version_type: String,         // 版本类型：major, minor, patch
      
      // 版本历史
      version_history: [{
        version: String,            // 版本号
        file_id: ObjectId,          // 文件ID
        created_at: Date,           // 创建时间
        created_by: ObjectId,       // 创建者
        changes: String             // 变更说明
      }]
    }
  },
  
  // 处理信息
  processing: {
    // 处理状态
    status: String,                 // 处理状态：pending, processing, completed, failed
    
    // 处理任务
    tasks: [{
      task_id: String,              // 任务ID
      task_type: String,            // 任务类型：thumbnail, resize, compress, watermark, format_convert
      status: String,               // 任务状态
      progress: Number,             // 进度百分比
      started_at: Date,             // 开始时间
      completed_at: Date,           // 完成时间
      error_message: String,        // 错误信息
      
      // 任务配置
      config: {
        // 缩略图配置
        thumbnail: {
          sizes: [{
            width: Number,          // 宽度
            height: Number,         // 高度
            quality: Number,        // 质量
            format: String          // 格式
          }]
        },
        
        // 压缩配置
        compression: {
          quality: Number,          // 压缩质量
          format: String,           // 输出格式
          progressive: Boolean      // 渐进式
        },
        
        // 水印配置
        watermark: {
          type: String,             // 水印类型：text, image
          content: String,          // 水印内容
          position: String,         // 位置
          opacity: Number,          // 透明度
          size: Number              // 大小
        }
      },
      
      // 输出文件
      output_files: [{
        file_id: ObjectId,          // 输出文件ID
        variant_type: String,       // 变体类型
        size: String                // 尺寸标识
      }]
    }],
    
    // AI处理
    ai_processing: {
      // 内容分析
      content_analysis: {
        completed: Boolean,         // 是否完成
        results: {
          objects: [String],        // 识别对象
          scenes: [String],         // 场景识别
          text_content: String,     // 文本内容（OCR）
          faces: [{
            confidence: Number,     // 置信度
            age_range: String,      // 年龄范围
            gender: String,         // 性别
            emotions: [String]      // 情绪
          }]
        }
      },
      
      // 质量评估
      quality_assessment: {
        overall_score: Number,      // 总体评分
        sharpness: Number,          // 清晰度
        brightness: Number,         // 亮度
        contrast: Number,           // 对比度
        color_balance: Number,      // 色彩平衡
        composition: Number         // 构图评分
      },
      
      // 智能优化建议
      optimization_suggestions: [{
        type: String,               // 建议类型
        description: String,        // 建议描述
        confidence: Number,         // 置信度
        auto_applicable: Boolean    // 是否可自动应用
      }]
    }
  },
  
  // 访问控制
  access_control: {
    // 可见性
    visibility: String,             // 可见性：public, private, restricted, internal
    
    // 权限设置
    permissions: {
      // 默认权限
      default_permissions: [String], // 默认权限：read, write, delete, share
      
      // 用户权限
      user_permissions: [{
        user_id: ObjectId,          // 用户ID
        permissions: [String],      // 权限列表
        granted_by: ObjectId,       // 授权者
        granted_at: Date,           // 授权时间
        expires_at: Date            // 过期时间
      }],
      
      // 角色权限
      role_permissions: [{
        role: String,               // 角色
        permissions: [String],      // 权限列表
        conditions: Mixed           // 权限条件
      }]
    },
    
    // 共享设置
    sharing: {
      is_shareable: Boolean,        // 是否可共享
      share_links: [{
        link_id: String,            // 链接ID
        url: String,                // 共享URL
        permissions: [String],      // 权限
        password: String,           // 访问密码
        expires_at: Date,           // 过期时间
        max_downloads: Number,      // 最大下载次数
        download_count: Number,     // 已下载次数
        created_by: ObjectId,       // 创建者
        created_at: Date            // 创建时间
      }]
    },
    
    // 访问限制
    restrictions: {
      ip_whitelist: [String],       // IP白名单
      ip_blacklist: [String],       // IP黑名单
      country_restrictions: [String], // 国家限制
      time_restrictions: {
        allowed_hours: [{
          start: String,            // 开始时间
          end: String               // 结束时间
        }],
        allowed_days: [Number]      // 允许的星期
      }
    }
  },
  
  // 使用统计
  usage_stats: {
    // 访问统计
    access_stats: {
      total_views: Number,          // 总浏览次数
      total_downloads: Number,      // 总下载次数
      unique_viewers: Number,       // 独立浏览者
      unique_downloaders: Number,   // 独立下载者
      
      // 最近访问
      recent_access: [{
        user_id: ObjectId,          // 用户ID
        action: String,             // 动作：view, download, share
        timestamp: Date,            // 时间戳
        ip_address: String,         // IP地址
        user_agent: String,         // 用户代理
        referrer: String            // 来源
      }],
      
      // 热度统计
      popularity: {
        daily_views: [{
          date: Date,               // 日期
          views: Number,            // 浏览次数
          downloads: Number         // 下载次数
        }],
        trending_score: Number,     // 趋势评分
        peak_usage_time: Date       // 峰值使用时间
      }
    },
    
    // 性能统计
    performance_stats: {
      avg_load_time: Number,        // 平均加载时间
      cache_hit_rate: Number,       // 缓存命中率
      bandwidth_usage: Number,      // 带宽使用量
      
      // CDN统计
      cdn_stats: {
        cache_hits: Number,         // 缓存命中
        cache_misses: Number,       // 缓存未命中
        origin_requests: Number,    // 源站请求
        data_transfer: Number       // 数据传输量
      }
    }
  },
  
  // 安全信息
  security: {
    // 病毒扫描
    virus_scan: {
      last_scan: Date,              // 最后扫描时间
      scan_result: String,          // 扫描结果：clean, infected, suspicious
      scan_engine: String,          // 扫描引擎
      threat_details: [{
        threat_name: String,        // 威胁名称
        severity: String,           // 严重程度
        description: String         // 描述
      }]
    },
    
    // 内容审核
    content_moderation: {
      status: String,               // 审核状态：pending, approved, rejected
      moderator_id: ObjectId,       // 审核员ID
      moderated_at: Date,           // 审核时间
      rejection_reason: String,     // 拒绝原因
      
      // 自动审核
      auto_moderation: {
        ai_score: Number,           // AI评分
        flags: [String],            // 标记
        confidence: Number          // 置信度
      }
    },
    
    // 加密信息
    encryption: {
      is_encrypted: Boolean,        // 是否加密
      encryption_algorithm: String, // 加密算法
      key_id: String,               // 密钥ID
      encrypted_at: Date            // 加密时间
    }
  },
  
  // 生命周期管理
  lifecycle: {
    // 状态管理
    status: String,                 // 状态：active, archived, deleted, quarantined
    
    // 归档设置
    archival: {
      auto_archive: Boolean,        // 自动归档
      archive_after_days: Number,   // 归档天数
      archived_at: Date,            // 归档时间
      archive_location: String,     // 归档位置
      
      // 归档策略
      archive_policy: {
        trigger_conditions: [{
          type: String,             // 条件类型
          value: Mixed              // 条件值
        }],
        retention_period: Number,   // 保留期
        auto_delete: Boolean        // 自动删除
      }
    },
    
    // 删除设置
    deletion: {
      soft_delete: Boolean,         // 软删除
      delete_after_days: Number,    // 删除天数
      deleted_at: Date,             // 删除时间
      deleted_by: ObjectId,         // 删除者
      deletion_reason: String,      // 删除原因
      
      // 恢复信息
      recovery_info: {
        can_recover: Boolean,       // 可恢复
        recovery_deadline: Date,    // 恢复截止时间
        recovery_cost: Number       // 恢复成本
      }
    }
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId
}
```

### 索引设计

```javascript
// 唯一索引
db.files.createIndex({ "file_id": 1 }, { unique: true })
db.files.createIndex({ "storage.storage_path": 1 }, { unique: true })

// 查询索引
db.files.createIndex({ "categorization.business_category": 1, "lifecycle.status": 1 })
db.files.createIndex({ "file_info.mime_type": 1, "lifecycle.status": 1 })
db.files.createIndex({ "created_by": 1, "created_at": -1 })
db.files.createIndex({ "associations.related_entities.entity_type": 1, "associations.related_entities.entity_id": 1 })
db.files.createIndex({ "processing.status": 1 })
db.files.createIndex({ "access_control.visibility": 1 })
db.files.createIndex({ "is_deleted": 1, "lifecycle.status": 1 })

// 哈希索引（去重）
db.files.createIndex({ "file_info.checksums.md5": 1 })
db.files.createIndex({ "file_info.checksums.sha256": 1 })

// 标签索引
db.files.createIndex({ "categorization.tags.name": 1 })
db.files.createIndex({ "categorization.auto_classification.ai_tags": 1 })

// 时间索引
db.files.createIndex({ "created_at": -1 })
db.files.createIndex({ "updated_at": -1 })
db.files.createIndex({ "lifecycle.archival.archived_at": 1 })

// 文本搜索索引
db.files.createIndex({ 
  "original_name": "text", 
  "display_name": "text",
  "description": "text",
  "categorization.tags.name": "text"
})

// 地理位置索引
db.files.createIndex({ "file_info.media_info.image.exif.gps_location": "2dsphere" })
```

## 2. 文件变体表 (file_variants)

存储文件的各种变体版本（缩略图、不同尺寸等）。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 变体唯一标识
  parent_file_id: ObjectId,         // 父文件ID
  variant_type: String,             // 变体类型：thumbnail, preview, compressed, watermarked, resized
  variant_name: String,             // 变体名称
  
  // 变体配置
  variant_config: {
    // 尺寸配置
    dimensions: {
      width: Number,                // 宽度
      height: Number,               // 高度
      aspect_ratio: String,         // 宽高比
      resize_method: String         // 缩放方法：fit, fill, crop, stretch
    },
    
    // 质量配置
    quality: {
      compression_level: Number,    // 压缩级别
      format: String,               // 输出格式
      quality_score: Number,        // 质量评分
      file_size_reduction: Number   // 文件大小减少百分比
    },
    
    // 处理参数
    processing_params: {
      filters: [String],            // 应用的滤镜
      adjustments: {
        brightness: Number,         // 亮度调整
        contrast: Number,           // 对比度调整
        saturation: Number,         // 饱和度调整
        sharpness: Number           // 锐化程度
      },
      
      // 水印设置
      watermark: {
        enabled: Boolean,           // 启用水印
        type: String,               // 水印类型
        content: String,            // 水印内容
        position: String,           // 位置
        opacity: Number             // 透明度
      }
    }
  },
  
  // 文件信息
  file_info: {
    size: Number,                   // 文件大小
    mime_type: String,              // MIME类型
    checksum: String,               // 文件校验和
    
    // 存储信息
    storage_path: String,           // 存储路径
    public_url: String,             // 公开URL
    cdn_url: String                 // CDN URL
  },
  
  // 使用场景
  usage_contexts: [{
    context: String,                // 使用场景：web_display, mobile_app, email, print
    priority: Number,               // 优先级
    auto_select: Boolean            // 自动选择
  }],
  
  // 生成信息
  generation_info: {
    generated_at: Date,             // 生成时间
    generation_method: String,      // 生成方法：auto, manual, ai
    processing_time: Number,        // 处理时间（毫秒）
    
    // 生成参数
    generation_params: {
      algorithm: String,            // 使用算法
      model_version: String,        // 模型版本
      parameters: Mixed             // 具体参数
    }
  },
  
  // 状态管理
  status: String,                   // 状态：generating, ready, failed, outdated
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  is_deleted: Boolean
}
```

### 索引设计

```javascript
// 关联索引
db.file_variants.createIndex({ "parent_file_id": 1, "variant_type": 1 })
db.file_variants.createIndex({ "parent_file_id": 1, "status": 1 })

// 查询索引
db.file_variants.createIndex({ "variant_type": 1, "status": 1 })
db.file_variants.createIndex({ "status": 1 })
db.file_variants.createIndex({ "is_deleted": 1 })
```

## 3. 文件操作日志表 (file_operations)

记录所有文件操作的详细日志。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 日志唯一标识
  file_id: ObjectId,                // 文件ID
  operation_type: String,           // 操作类型：upload, download, view, edit, delete, share, copy, move
  
  // 操作详情
  operation_details: {
    // 操作者信息
    operator: {
      user_id: ObjectId,            // 用户ID
      ip_address: String,           // IP地址
      user_agent: String,           // 用户代理
      session_id: String,           // 会话ID
      location: {
        country: String,            // 国家
        region: String,             // 地区
        city: String                // 城市
      }
    },
    
    // 操作参数
    parameters: {
      // 上传参数
      upload: {
        upload_method: String,      // 上传方式：form, api, drag_drop
        chunk_upload: Boolean,      // 分块上传
        total_chunks: Number,       // 总块数
        upload_session_id: String   // 上传会话ID
      },
      
      // 下载参数
      download: {
        download_type: String,      // 下载类型：direct, stream, zip
        range_request: Boolean,     // 范围请求
        bytes_transferred: Number   // 传输字节数
      },
      
      // 编辑参数
      edit: {
        edit_type: String,          // 编辑类型：metadata, content, permissions
        changes: Mixed,             // 变更内容
        previous_values: Mixed      // 之前的值
      },
      
      // 共享参数
      share: {
        share_type: String,         // 共享类型：link, email, direct
        recipients: [String],       // 接收者
        permissions: [String],      // 权限
        expiry_date: Date           // 过期日期
      }
    }
  },
  
  // 操作结果
  result: {
    status: String,                 // 结果状态：success, failed, partial
    error_code: String,             // 错误代码
    error_message: String,          // 错误消息
    
    // 性能指标
    performance: {
      duration: Number,             // 操作耗时（毫秒）
      bytes_processed: Number,      // 处理字节数
      throughput: Number            // 吞吐量（字节/秒）
    }
  },
  
  // 上下文信息
  context: {
    request_id: String,             // 请求ID
    trace_id: String,               // 追踪ID
    referrer: String,               // 来源页面
    
    // 业务上下文
    business_context: {
      module: String,               // 业务模块
      feature: String,              // 功能特性
      workflow_id: String,          // 工作流ID
      batch_id: String              // 批次ID
    }
  },
  
  // 时间信息
  timestamp: Date,                  // 操作时间戳
  
  // 通用字段
  created_at: Date
}
```

### 索引设计

```javascript
// 关联索引
db.file_operations.createIndex({ "file_id": 1, "timestamp": -1 })
db.file_operations.createIndex({ "operation_details.operator.user_id": 1, "timestamp": -1 })

// 查询索引
db.file_operations.createIndex({ "operation_type": 1, "timestamp": -1 })
db.file_operations.createIndex({ "result.status": 1, "timestamp": -1 })
db.file_operations.createIndex({ "timestamp": -1 })

// 业务索引
db.file_operations.createIndex({ "context.business_context.module": 1, "timestamp": -1 })
db.file_operations.createIndex({ "context.request_id": 1 })
```

## 数据关系说明

### 关系类型
- **files ↔ file_variants**: 一对多关系（原文件对应多个变体）
- **files ↔ file_operations**: 一对多关系（文件对应多个操作记录）
- **files ↔ products/users/orders**: 多对多关系（通过associations字段）
- **files ↔ files**: 多对多关系（文件组、版本关系）

### 数据一致性
1. 文件删除时级联删除相关变体和操作日志
2. 文件移动时更新所有关联记录
3. 权限变更时同步更新访问控制
4. 存储位置变更时更新URL信息

### 查询优化
1. 文件列表查询使用分类和状态索引
2. 关联查询使用实体类型和ID索引
3. 操作日志查询使用时间索引
4. 文件搜索使用全文索引

## 业务规则

### 文件上传规则
1. **文件大小限制**: 根据文件类型设置不同限制
2. **格式验证**: 验证文件扩展名和MIME类型
3. **病毒扫描**: 上传后自动进行病毒扫描
4. **重复检测**: 基于哈希值检测重复文件
5. **自动分类**: AI自动识别和分类文件内容

### 访问控制规则
1. **权限继承**: 子文件继承父文件夹权限
2. **最小权限原则**: 默认最小权限，按需授权
3. **时间限制**: 支持临时访问权限
4. **IP限制**: 支持基于IP的访问控制
5. **审计日志**: 记录所有权限变更

### 存储优化规则
1. **智能分层**: 根据访问频率自动分层存储
2. **CDN加速**: 热门文件自动推送到CDN
3. **压缩优化**: 自动生成优化版本
4. **缓存策略**: 智能缓存管理
5. **成本优化**: 基于使用模式优化存储成本

### AI增强功能
1. **智能标签**: 自动生成描述性标签
2. **内容识别**: 识别图片中的对象和场景
3. **质量评估**: 自动评估文件质量
4. **优化建议**: 提供文件优化建议
5. **异常检测**: 检测异常访问模式
6. **智能归档**: 基于使用模式自动归档

### 安全保护
1. **加密存储**: 敏感文件自动加密
2. **访问审计**: 详细记录访问日志
3. **内容审核**: AI自动内容审核
4. **防盗链**: 防止未授权访问
5. **水印保护**: 自动添加版权水印

### 生命周期管理
1. **自动归档**: 基于策略自动归档旧文件
2. **智能删除**: 安全删除过期文件
3. **版本控制**: 自动管理文件版本
4. **备份策略**: 多重备份保护
5. **恢复机制**: 支持文件恢复