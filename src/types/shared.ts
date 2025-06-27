export type BucketType = "daily" | "weekly" | "monthly" | "quarterly";

export type TargetPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export type TargetPeriodKey = "weekly" | "monthly" | "quarterly" | "yearly";

export interface TargetBucket {
    bucketName: string;
    bucketType: BucketType;
    recordCount: number;
    totalAmount: number;
    label?: string;
}

export interface BaseTargetWithActuals {
    id: string;
    name: string;
    targetAmount: number;
    targetPeriod: TargetPeriod;
    targetType?: string;
    fiscalYear?: string;
    notes?: string;

    weekStartDate?: string;
    weekEndDate?: string;
    weekNumber?: number;
    month?: string;
    quarter?: string;
}