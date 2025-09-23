import mongoose, { Document } from 'mongoose';
export type MetricType = 'traffic' | 'conversion' | 'engagement' | 'revenue' | 'cost' | 'roi' | 'brand' | 'customer_satisfaction';
export type DataSourceType = 'google_analytics' | 'yandex_metrica' | 'facebook_ads' | 'google_ads' | 'platform_api' | 'manual' | 'crm' | 'email_marketing';
export type ReportFrequency = 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export interface IPerformanceTracking extends Document {
    task_id: mongoose.Types.ObjectId;
    product_id: string;
    tracking_id: string;
    tracking_config: {
        name: string;
        description: string;
        platform: string;
        campaign_id?: string;
        strategy_id?: string;
        tracking_period: {
            start_date: Date;
            end_date?: Date;
            is_ongoing: boolean;
        };
        data_collection: {
            frequency: ReportFrequency;
            auto_sync: boolean;
            data_sources: {
                source_type: DataSourceType;
                source_name: string;
                api_endpoint?: string;
                credentials_id?: string;
                last_sync?: Date;
                sync_status: 'active' | 'inactive' | 'error';
                error_message?: string;
            }[];
        };
    };
    metrics_definition: {
        primary_metrics: {
            metric_id: string;
            name: string;
            type: MetricType;
            description: string;
            unit: string;
            calculation_method: string;
            target_value?: number;
            benchmark_value?: number;
            weight: number;
        }[];
        secondary_metrics: {
            metric_id: string;
            name: string;
            type: MetricType;
            description: string;
            unit: string;
            calculation_method: string;
            target_value?: number;
        }[];
        custom_metrics: {
            metric_id: string;
            name: string;
            formula: string;
            dependencies: string[];
            description: string;
            unit: string;
        }[];
    };
    performance_data: {
        current_metrics: {
            metric_id: string;
            value: number;
            timestamp: Date;
            data_source: string;
            confidence_level?: number;
        }[];
        historical_data: {
            date: Date;
            period_type: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
            metrics: {
                metric_id: string;
                value: number;
                change_from_previous?: number;
                change_percentage?: number;
            }[];
            events?: {
                event_type: string;
                description: string;
                impact_score?: number;
            }[];
        }[];
        trends: {
            metric_id: string;
            trend_direction: 'up' | 'down' | 'stable' | 'volatile';
            trend_strength: number;
            trend_duration: number;
            seasonal_pattern?: {
                pattern_type: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
                peak_periods: string[];
                low_periods: string[];
            };
            forecast: {
                next_period_prediction: number;
                confidence_interval: {
                    lower: number;
                    upper: number;
                };
                forecast_accuracy?: number;
            };
        }[];
    };
    targets_and_benchmarks: {
        targets: {
            metric_id: string;
            target_type: 'absolute' | 'percentage_increase' | 'relative_to_benchmark';
            target_value: number;
            timeframe: string;
            priority: 'high' | 'medium' | 'low';
            achievement_status: 'not_started' | 'in_progress' | 'achieved' | 'missed' | 'exceeded';
            achievement_percentage?: number;
        }[];
        benchmarks: {
            benchmark_type: 'industry_average' | 'competitor' | 'historical' | 'best_practice';
            benchmark_source: string;
            metrics: {
                metric_id: string;
                benchmark_value: number;
                our_value: number;
                performance_gap: number;
                performance_ratio: number;
            }[];
            last_updated: Date;
        }[];
    };
    insights: {
        automated_insights: {
            insight_id: string;
            type: 'anomaly' | 'trend' | 'correlation' | 'opportunity' | 'risk';
            title: string;
            description: string;
            confidence_score: number;
            impact_level: 'low' | 'medium' | 'high' | 'critical';
            affected_metrics: string[];
            recommended_actions: string[];
            generated_at: Date;
            status: 'new' | 'reviewed' | 'acted_upon' | 'dismissed';
        }[];
        manual_insights: {
            insight_id: string;
            title: string;
            description: string;
            category: string;
            impact_assessment: string;
            action_items: {
                action: string;
                priority: 'high' | 'medium' | 'low';
                assigned_to?: mongoose.Types.ObjectId;
                due_date?: Date;
                status: 'pending' | 'in_progress' | 'completed';
            }[];
            created_by: mongoose.Types.ObjectId;
            created_at: Date;
        }[];
        correlations: {
            metric_pair: [string, string];
            correlation_coefficient: number;
            significance_level: number;
            relationship_type: 'positive' | 'negative' | 'no_correlation';
            business_interpretation: string;
        }[];
    };
    reporting: {
        automated_reports: {
            report_id: string;
            name: string;
            frequency: ReportFrequency;
            recipients: {
                user_id: mongoose.Types.ObjectId;
                email: string;
                role: string;
            }[];
            content_config: {
                include_summary: boolean;
                include_trends: boolean;
                include_insights: boolean;
                include_recommendations: boolean;
                metrics_to_include: string[];
                chart_types: string[];
            };
            delivery_method: 'email' | 'dashboard' | 'api' | 'slack';
            last_sent?: Date;
            next_scheduled?: Date;
            is_active: boolean;
        }[];
        dashboard_config: {
            layout: {
                widget_id: string;
                widget_type: 'metric_card' | 'chart' | 'table' | 'gauge' | 'text';
                position: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                };
                config: Record<string, any>;
            }[];
            refresh_interval: number;
            theme: 'light' | 'dark' | 'auto';
            filters: {
                date_range: {
                    start: Date;
                    end: Date;
                };
                platforms: string[];
                metrics: string[];
            };
        };
    };
    alerts: {
        alert_rules: {
            rule_id: string;
            name: string;
            description: string;
            metric_id: string;
            condition: {
                operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'percentage_change';
                threshold_value: number;
                comparison_period?: string;
            };
            severity: 'info' | 'warning' | 'critical';
            notification_channels: {
                channel_type: 'email' | 'sms' | 'slack' | 'webhook';
                recipients: string[];
                template?: string;
            }[];
            is_active: boolean;
            cooldown_period: number;
            last_triggered?: Date;
        }[];
        alert_history: {
            alert_id: string;
            rule_id: string;
            triggered_at: Date;
            metric_value: number;
            threshold_value: number;
            severity: string;
            message: string;
            acknowledged: boolean;
            acknowledged_by?: mongoose.Types.ObjectId;
            acknowledged_at?: Date;
            resolved: boolean;
            resolved_at?: Date;
        }[];
    };
    data_quality: {
        quality_score: number;
        quality_checks: {
            check_type: 'completeness' | 'accuracy' | 'consistency' | 'timeliness' | 'validity';
            status: 'passed' | 'failed' | 'warning';
            score: number;
            details: string;
            last_checked: Date;
        }[];
        data_freshness: {
            source: string;
            last_updated: Date;
            expected_frequency: string;
            delay_minutes: number;
            status: 'fresh' | 'stale' | 'missing';
        }[];
        anomalies: {
            detected_at: Date;
            metric_id: string;
            anomaly_type: 'spike' | 'drop' | 'missing_data' | 'outlier';
            severity: 'low' | 'medium' | 'high';
            description: string;
            resolved: boolean;
        }[];
    };
    created_at: Date;
    updated_at: Date;
    last_data_sync: Date;
    created_by: mongoose.Types.ObjectId;
    updateMetric(metricId: string, value: number, dataSource?: string): Promise<IPerformanceTracking>;
}
export declare const PerformanceTracking: mongoose.Model<IPerformanceTracking, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceTracking, {}, {}> & IPerformanceTracking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default PerformanceTracking;
//# sourceMappingURL=PerformanceTracking.d.ts.map