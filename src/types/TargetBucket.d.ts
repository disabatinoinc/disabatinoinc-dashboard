export type TargetBucket = {
    bucketName: string;        // e.g., "2025-04-03", "April", "Q2 (Jul–Sep)"
    bucketType: "daily" | "weekly" | "monthly" | "quarterly";
    recordCount: number;
    totalAmount: number;
    opportunityIds: string[];
    label?: string;
};