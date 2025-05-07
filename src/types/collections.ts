import { TargetBucket } from "./shared";

export type TargetPeriodKey = "weekly" | "monthly" | "quarterly" | "yearly";

export interface RevenueTargetSummary {
    weekly: RevenueTargetWithActuals[];
    monthly: RevenueTargetWithActuals[];
    quarterly: RevenueTargetWithActuals[];
    yearly: RevenueTargetWithActuals[];
}

export interface RevenueTargetWithActuals {
    id: string;
    name: string;
    targetAmount: number;
    targetPeriod: string; // weekly, monthly, etc.
    targetType?: string; // e.g., "Revenue"
    fiscalYear?: string;
    weekStartDate?: string;
    weekEndDate?: string;
    weekNumber?: number;
    month?: string;
    quarter?: string;
    notes?: string;
    actualsSummary: RevenueActualsSummary;
    buckets: RevenueBucket[];
}

export interface RevenueActualsSummary {
    recordCount: number;
    totalAmount: number;
    transactionIds: string[];
}

export interface RevenueBucket {
    bucketName: string;       // date, week start, month, or quarter name
    bucketType: string;       // "daily", "weekly", "monthly", "quarterly"
    recordCount: number;
    totalAmount: number;
    transactionIds: string[];
}

export interface RevenueTargetBucket extends TargetBucket {
    transactionIds: string[];
}
