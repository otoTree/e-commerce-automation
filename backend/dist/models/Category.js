import mongoose, { Document, Schema } from 'mongoose';
// 分类Schema定义
const CategorySchema = new Schema({
    // 基础信息
    category_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        maxlength: 1000
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    // 层级结构
    parent_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    level: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    path: {
        type: String,
        required: true,
        index: true
    },
    children: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
    // 显示设置
    display: {
        icon: { type: String },
        color: { type: String, match: /^#[0-9A-F]{6}$/i },
        image: { type: Schema.Types.ObjectId, ref: 'File' },
        banner_image: { type: Schema.Types.ObjectId, ref: 'File' },
        sort_order: { type: Number, default: 0 },
        is_featured: { type: Boolean, default: false },
        show_in_menu: { type: Boolean, default: true },
        show_in_footer: { type: Boolean, default: false }
    },
    // SEO设置
    seo: {
        meta_title: { type: String, maxlength: 60 },
        meta_description: { type: String, maxlength: 160 },
        meta_keywords: [{ type: String }],
        canonical_url: { type: String },
        og_title: { type: String, maxlength: 60 },
        og_description: { type: String, maxlength: 160 },
        og_image: { type: String }
    },
    // 分类属性模板
    attribute_templates: [{
            name: { type: String, required: true, trim: true },
            type: {
                type: String,
                enum: ['text', 'number', 'boolean', 'select', 'multiselect', 'date'],
                required: true
            },
            required: { type: Boolean, default: false },
            options: [{ type: String }],
            default_value: { type: Schema.Types.Mixed },
            validation: {
                min: { type: Number },
                max: { type: Number },
                pattern: { type: String }
            },
            display_order: { type: Number, default: 0 },
            is_filterable: { type: Boolean, default: false },
            is_searchable: { type: Boolean, default: false }
        }],
    // 分类规则
    rules: {
        product_rules: {
            min_price: { type: Number, min: 0 },
            max_price: { type: Number, min: 0 },
            required_attributes: [{ type: String }],
            auto_tags: [{ type: String }],
            default_shipping_class: { type: String }
        },
        commission_rules: {
            commission_rate: { type: Number, min: 0, max: 100 },
            commission_type: {
                type: String,
                enum: ['percentage', 'fixed'],
                default: 'percentage'
            },
            min_commission: { type: Number, min: 0 },
            max_commission: { type: Number, min: 0 }
        },
        tax_rules: {
            tax_class: { type: String, default: 'standard' },
            tax_rate: { type: Number, min: 0, max: 100 },
            tax_exempt: { type: Boolean, default: false }
        }
    },
    // 统计信息
    stats: {
        product_count: { type: Number, default: 0 },
        active_product_count: { type: Number, default: 0 },
        total_sales: { type: Number, default: 0 },
        total_revenue: { type: Number, default: 0 },
        avg_rating: { type: Number, min: 0, max: 5, default: 0 },
        view_count: { type: Number, default: 0 },
        monthly_stats: [{
                month: { type: Date, required: true },
                product_count: { type: Number, default: 0 },
                sales: { type: Number, default: 0 },
                revenue: { type: Number, default: 0 },
                views: { type: Number, default: 0 }
            }]
    },
    // 状态管理
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'hidden'],
        default: 'public'
    },
    // 访问控制
    access_control: {
        user_groups: [{ type: String }],
        geographic_restrictions: [{ type: String }],
        age_restrictions: {
            min_age: { type: Number, min: 0, max: 100 },
            requires_verification: { type: Boolean, default: false }
        }
    },
    // 通用字段
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
CategorySchema.index({ category_id: 1 }, { unique: true });
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ parent_category: 1 });
CategorySchema.index({ level: 1 });
CategorySchema.index({ path: 1 });
CategorySchema.index({ status: 1, visibility: 1 });
CategorySchema.index({ 'display.sort_order': 1 });
CategorySchema.index({ 'display.is_featured': 1 });
CategorySchema.index({ is_deleted: 1 });
// 复合索引
CategorySchema.index({
    parent_category: 1,
    'display.sort_order': 1,
    status: 1
});
CategorySchema.index({
    level: 1,
    'display.show_in_menu': 1,
    status: 1
});
// 文本搜索索引
CategorySchema.index({
    name: 'text',
    description: 'text',
    'seo.meta_keywords': 'text'
});
// 中间件
// 保存前生成category_id
CategorySchema.pre('save', function (next) {
    if (!this.category_id) {
        this.category_id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});
// 保存前生成slug
CategorySchema.pre('save', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});
// 保存前更新路径
CategorySchema.pre('save', async function (next) {
    if (this.isModified('parent_category') || this.isModified('slug')) {
        if (this.parent_category) {
            const parent = await this.constructor.findById(this.parent_category);
            if (parent) {
                this.level = parent.level + 1;
                this.path = `${parent.path}/${this.slug}`;
            }
        }
        else {
            this.level = 0;
            this.path = `/${this.slug}`;
        }
    }
    next();
});
// 保存后更新父分类的children数组
CategorySchema.post('save', async function (doc) {
    if (doc.parent_category) {
        await this.constructor.findByIdAndUpdate(doc.parent_category, { $addToSet: { children: doc._id } });
    }
});
// 删除前移除父分类的children引用
CategorySchema.pre('deleteOne', async function (next) {
    const doc = await this.getQuery();
    if (doc && doc.parent_category) {
        await this.model.findByIdAndUpdate(doc.parent_category, { $pull: { children: doc._id } });
    }
    next();
});
// 更新时间戳
CategorySchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
// 虚拟字段
// 是否为根分类
CategorySchema.virtual('is_root').get(function () {
    return !this.parent_category;
});
// 是否有子分类
CategorySchema.virtual('has_children').get(function () {
    return this.children && this.children.length > 0;
});
// 面包屑导航
CategorySchema.virtual('breadcrumbs').get(function () {
    return this.path.split('/').filter(Boolean);
});
// 静态方法
// 获取根分类
CategorySchema.statics.getRootCategories = function () {
    return this.find({
        parent_category: null,
        is_deleted: false,
        status: 'active',
        visibility: 'public'
    }).sort({ 'display.sort_order': 1 });
};
// 获取分类树
CategorySchema.statics.getCategoryTree = async function (parentId = null, maxDepth = 3) {
    const categories = await this.find({
        parent_category: parentId,
        is_deleted: false,
        status: 'active'
    })
        .populate('children')
        .sort({ 'display.sort_order': 1 })
        .lean();
    if (maxDepth > 0) {
        for (const category of categories) {
            category.children = await this.getCategoryTree(category._id, maxDepth - 1);
        }
    }
    return categories;
};
// 根据路径查找分类
CategorySchema.statics.findByPath = function (path) {
    return this.findOne({ path, is_deleted: false });
};
// 搜索分类
CategorySchema.statics.search = function (query) {
    return this.find({
        $text: { $search: query },
        is_deleted: false,
        status: 'active',
        visibility: 'public'
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
};
// 实例方法
// 获取所有祖先分类
CategorySchema.methods.getAncestors = async function () {
    const ancestors = [];
    let current = this;
    while (current.parent_category) {
        current = await this.constructor.findById(current.parent_category);
        if (current) {
            ancestors.unshift(current);
        }
        else {
            break;
        }
    }
    return ancestors;
};
// 获取所有后代分类
CategorySchema.methods.getDescendants = async function () {
    const descendants = [];
    const getChildren = async (categoryId) => {
        const children = await this.constructor.find({
            parent_category: categoryId,
            is_deleted: false
        });
        for (const child of children) {
            descendants.push(child);
            await getChildren(child._id);
        }
    };
    await getChildren(this._id);
    return descendants;
};
// 移动分类
CategorySchema.methods.moveTo = async function (newParentId) {
    // 移除旧父分类的引用
    if (this.parent_category) {
        await this.constructor.findByIdAndUpdate(this.parent_category, { $pull: { children: this._id } });
    }
    // 更新新父分类
    this.parent_category = newParentId;
    // 重新计算层级和路径
    if (newParentId) {
        const newParent = await this.constructor.findById(newParentId);
        if (newParent) {
            this.level = newParent.level + 1;
            this.path = `${newParent.path}/${this.slug}`;
        }
    }
    else {
        this.level = 0;
        this.path = `/${this.slug}`;
    }
    await this.save();
    // 更新所有后代的路径
    const descendants = await this.getDescendants();
    for (const descendant of descendants) {
        const ancestors = await descendant.getAncestors();
        descendant.level = ancestors.length;
        descendant.path = '/' + [...ancestors.map((a) => a.slug), descendant.slug].join('/');
        await descendant.save();
    }
};
// 更新统计信息
CategorySchema.methods.updateStats = async function () {
    // 这里可以实现统计信息的更新逻辑
    // 例如统计该分类下的商品数量、销售额等
    const Product = mongoose.model('Product');
    const stats = await Product.aggregate([
        {
            $match: {
                $or: [
                    { 'category.primary_category': this._id },
                    { 'category.secondary_categories': this._id }
                ],
                is_deleted: false
            }
        },
        {
            $group: {
                _id: null,
                product_count: { $sum: 1 },
                active_product_count: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                total_sales: { $sum: '$sales_stats.total_sold' },
                total_revenue: { $sum: '$sales_stats.total_revenue' },
                avg_rating: { $avg: '$reviews.average_rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        this.stats = {
            ...this.stats,
            ...stats[0],
            view_count: this.stats.view_count // 保持现有的浏览量
        };
        await this.save();
    }
};
// 创建并导出模型
export const Category = mongoose.model('Category', CategorySchema);
export default Category;
//# sourceMappingURL=Category.js.map