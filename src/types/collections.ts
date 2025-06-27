import { BaseTargetWithActuals, TargetBucket } from "./shared";

export interface RevenueTargetSummary {
    weekly: RevenueTargetWithActuals[];
    monthly: RevenueTargetWithActuals[];
    quarterly: RevenueTargetWithActuals[];
    yearly: RevenueTargetWithActuals[];
}

export type RevenueTargetWithActuals = BaseTargetWithActuals & {
    actualsSummary: RevenueActualsSummary;
    buckets: RevenueTargetBucket[];
};

export interface RevenueActualsSummary {
    recordCount: number;
    totalAmount: number;
    transactionIds: string[];
}

export interface RevenueTargetBucket extends TargetBucket {
    transactionIds: string[];
}

export interface RevenueTargetBucket extends TargetBucket {
    transactionIds: string[];
}
