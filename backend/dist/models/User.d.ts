import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    user_id: string;
    username: string;
    email: string;
    phone?: string;
    password_hash: string;
    profile: {
        first_name?: string;
        last_name?: string;
        display_name?: string;
        avatar_url?: string;
        bio?: string;
        date_of_birth?: Date;
        gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
        addresses: Array<{
            address_id: string;
            type: 'home' | 'work' | 'billing' | 'shipping' | 'other';
            label?: string;
            recipient_name: string;
            company?: string;
            address_line_1: string;
            address_line_2?: string;
            city: string;
            state_province: string;
            postal_code: string;
            country: string;
            phone?: string;
            is_default: boolean;
            created_at: Date;
            updated_at: Date;
        }>;
        social_media: {
            facebook?: string;
            twitter?: string;
            instagram?: string;
            linkedin?: string;
            website?: string;
        };
    };
    account: {
        status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'deleted';
        email_verified: boolean;
        phone_verified: boolean;
        two_factor_enabled: boolean;
        verification: {
            email_verification_token?: string;
            email_verification_expires?: Date;
            phone_verification_code?: string;
            phone_verification_expires?: Date;
            password_reset_token?: string;
            password_reset_expires?: Date;
        };
        security: {
            last_password_change: Date;
            failed_login_attempts: number;
            account_locked_until?: Date;
            login_history: Array<{
                timestamp: Date;
                ip_address: string;
                user_agent: string;
                location?: {
                    country?: string;
                    region?: string;
                    city?: string;
                };
                success: boolean;
                failure_reason?: string;
            }>;
        };
    };
    preferences: {
        language: string;
        timezone: string;
        currency: string;
        date_format: string;
        time_format: '12h' | '24h';
        notifications: {
            email: {
                marketing: boolean;
                order_updates: boolean;
                security_alerts: boolean;
                product_recommendations: boolean;
                price_alerts: boolean;
                newsletter: boolean;
            };
            sms: {
                order_updates: boolean;
                security_alerts: boolean;
                delivery_notifications: boolean;
            };
            push: {
                enabled: boolean;
                order_updates: boolean;
                promotions: boolean;
                recommendations: boolean;
            };
        };
        shopping: {
            preferred_categories: string[];
            price_range: {
                min?: number;
                max?: number;
            };
            preferred_brands: string[];
            size_preferences: {
                clothing?: string;
                shoes?: string;
            };
            delivery_preferences: {
                preferred_time?: string;
                special_instructions?: string;
            };
        };
        privacy: {
            profile_visibility: 'public' | 'friends' | 'private';
            show_online_status: boolean;
            allow_friend_requests: boolean;
            data_processing_consent: boolean;
            marketing_consent: boolean;
            analytics_consent: boolean;
        };
    };
    roles: Array<{
        role_name: string;
        granted_at: Date;
        granted_by: mongoose.Types.ObjectId;
        expires_at?: Date;
    }>;
    permissions: string[];
    stats: {
        total_orders: number;
        total_spent: number;
        loyalty_points: number;
        referral_count: number;
        review_count: number;
        average_rating: number;
        activity: {
            last_login: Date;
            last_order: Date;
            last_review: Date;
            total_logins: number;
            days_active: number;
        };
    };
    ai_profile: {
        interests: Array<{
            category: string;
            weight: number;
            last_updated: Date;
        }>;
        behavior_patterns: {
            shopping_frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
            preferred_shopping_time: string;
            price_sensitivity: 'low' | 'medium' | 'high';
            brand_loyalty: 'low' | 'medium' | 'high';
            impulse_buying_tendency: number;
        };
        recommendations: {
            product_affinity: Map<string, number>;
            category_preferences: Map<string, number>;
            seasonal_patterns: Map<string, number>;
            last_recommendation_update: Date;
        };
    };
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at?: Date;
    deleted_by?: mongoose.Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
    generateRefreshToken(): string;
    toJSON(): any;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map