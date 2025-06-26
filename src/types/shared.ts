export type BucketType = "daily" | "weekly" | "monthly" | "quarterly";

export type TargetPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export interface TargetBucket {
    bucketName: string;
    bucketType: BucketType;
    recordCount: number;
    totalAmount: number;
    label?: string;
}