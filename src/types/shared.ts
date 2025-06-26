export type BucketType = "daily" | "weekly" | "monthly" | "quarterly";

export interface TargetBucket {
    bucketName: string;
    bucketType: BucketType;
    recordCount: number;
    totalAmount: number;
    label?: string;
}