# MongoDB 数据库设计文档

## 系统概述

电商AI系统是一个集成了人工智能功能的电商管理平台，主要包含以下核心模块：
- 用户管理系统
- 商品管理系统
- 任务管理系统
- 商品集合管理
- 营销活动管理
- 文件管理系统
- 统计分析系统

## 数据实体关系分析

### 核心实体

1. **用户 (User)**
   - 系统的核心实体，包含基本用户信息
   - 关联：用户配置、任务、营销活动、文件

2. **商品 (Product)**
   - 电商系统的核心商品实体
   - 关联：分类、变体、集合、任务、文件

3. **任务 (Task)**
   - 系统工作流的核心，管理各种业务任务
   - 关联：用户、商品、模板、历史记录

4. **集合 (Collection)**
   - 商品的逻辑分组
   - 关联：商品、营销活动

5. **营销活动 (Campaign)**
   - 营销推广活动管理
   - 关联：用户、商品、集合、模板、指标

6. **文件 (File)**
   - 系统文件资源管理
   - 关联：用户、商品、任务、营销活动

### 实体关系图

```
User (1) -----> (N) Task
User (1) -----> (N) Campaign
User (1) -----> (N) File
User (1) -----> (1) UserProfile
User (1) -----> (1) UserPreferences

Product (1) -----> (N) ProductVariant
Product (N) -----> (1) Category
Product (N) -----> (N) Collection (M:N)
Product (1) -----> (N) Task
Product (1) -----> (N) File

Task (N) -----> (1) User (assignee)
Task (N) -----> (1) User (creator)
Task (N) -----> (1) TaskTemplate
Task (1) -----> (N) TaskHistory

Collection (N) -----> (N) Product (M:N)
Collection (1) -----> (N) Campaign

Campaign (N) -----> (1) User (creator)
Campaign (N) -----> (1) CampaignTemplate
Campaign (1) -----> (N) CampaignMetrics

File (N) -----> (1) User (uploader)
```

## 数据模型设计原则

### 1. 文档结构设计
- **嵌入式文档**：用于一对一或一对少量的关系
- **引用**：用于一对多或多对多的关系
- **混合模式**：根据查询模式优化

### 2. 索引策略
- 为常用查询字段创建索引
- 复合索引优化复杂查询
- 文本索引支持搜索功能

### 3. 数据一致性
- 使用事务处理关键业务操作
- 软删除保持数据完整性
- 版本控制支持数据追踪

### 4. 性能优化
- 合理的文档大小控制
- 分页查询优化
- 缓存策略设计

## 集合命名规范

- 使用复数形式：`users`, `products`, `tasks`
- 小写字母和下划线：`user_profiles`, `product_variants`
- 语义清晰：`campaign_metrics`, `task_histories`

## 字段命名规范

- 使用小写字母和下划线：`created_at`, `updated_at`
- 布尔字段使用 `is_` 前缀：`is_active`, `is_deleted`
- 外键使用 `_id` 后缀：`user_id`, `product_id`
- 数组字段使用复数：`tags`, `images`, `variants`

## 通用字段

所有集合都包含以下通用字段：

```javascript
{
  _id: ObjectId,           // MongoDB 自动生成的主键
  created_at: Date,        // 创建时间
  updated_at: Date,        // 更新时间
  created_by: ObjectId,    // 创建者ID（引用users集合）
  updated_by: ObjectId,    // 更新者ID（引用users集合）
  is_deleted: Boolean,     // 软删除标记
  deleted_at: Date,        // 删除时间
  deleted_by: ObjectId,    // 删除者ID
  version: Number          // 版本号，用于乐观锁
}
```

## 数据类型约定

- **ObjectId**：MongoDB对象ID，用于文档引用
- **String**：文本数据，支持索引和搜索
- **Number**：数值数据，包括整数和浮点数
- **Boolean**：布尔值，true/false
- **Date**：日期时间，ISO格式
- **Array**：数组，存储多个值
- **Object**：嵌入式文档
- **Mixed**：混合类型，灵活存储

## 下一步计划

1. 设计用户相关数据模型
2. 设计商品相关数据模型
3. 设计任务管理数据模型
4. 设计其他业务模型
5. 创建Mongoose模型文件
6. 配置数据库连接和索引