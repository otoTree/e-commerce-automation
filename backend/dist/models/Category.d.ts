import mongoose, { Document } from 'mongoose';
export interface ICategory extends Document {
    category_id: string;
    name: string;
    description?: string;
    slug: string;
    parent_category?: mongoose.Types.ObjectId;
    level: number;
    path: string;
    children: mongoose.Types.ObjectId[];
    display: {
        icon?: string;
        color?: string;
        image?: mongoose.Types.ObjectId;
        banner_image?: mongoose.Types.ObjectId;
        sort_order: number;
        is_featured: boolean;
        show_in_menu: boolean;
        show_in_footer: boolean;
    };
    seo: {
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string[];
        canonical_url?: string;
        og_title?: string;
        og_description?: string;
        og_image?: string;
    };
    attribute_templates: Array<{
        name: string;
        type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date';
        required: boolean;
        options?: string[];
        default_value?: any;
        validation?: {
            min?: number;
            max?: number;
            pattern?: string;
        };
        display_order: number;
        is_filterable: boolean;
        is_searchable: boolean;
    }>;
    rules: {
        product_rules: {
            min_price?: number;
            max_price?: number;
            required_attributes: string[];
            auto_tags: string[];
            default_shipping_class?: string;
        };
        commission_rules: {
            commission_rate?: number;
            commission_type: 'percentage' | 'fixed';
            min_commission?: number;
            max_commission?: number;
        };
        tax_rules: {
            tax_class?: string;
            tax_rate?: number;
            tax_exempt: boolean;
        };
    };
    stats: {
        product_count: number;
        active_product_count: number;
        total_sales: number;
        total_revenue: number;
        avg_rating: number;
        view_count: number;
        monthly_stats: Array<{
            month: Date;
            product_count: number;
            sales: number;
            revenue: number;
            views: number;
        }>;
    };
    status: 'active' | 'inactive' | 'archived';
    visibility: 'public' | 'private' | 'hidden';
    access_control: {
        user_groups?: string[];
        geographic_restrictions?: string[];
        age_restrictions?: {
            min_age?: number;
            requires_verification: boolean;
        };
    };
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    is_deleted: boolean;
    deleted_at?: Date;
    deleted_by?: mongoose.Types.ObjectId;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Category;
//# sourceMappingURL=Category.d.ts.map