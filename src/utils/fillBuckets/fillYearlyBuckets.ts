import { TargetBucket } from "@/types/shared";

// Unified type that supports both Sales and Revenue buckets
type BucketWithExtras = TargetBucket & {
    opportunityIds?: string[];
    transactionIds?: string[];
};

const fiscalQuarterOrder = [
    "Q1 (Apr-Jun)",
    "Q2 (Jul-Sep)",
    "Q3 (Oct-Dec)",
    "Q4 (Jan-Mar)",
];

export const fillYearlyBuckets = (
    buckets: BucketWithExtras[]
): BucketWithExtras[] => {
    return fiscalQuarterOrder.map((quarter) => {
        const match = buckets.find((b) => b.bucketName === quarter);

        if (match) {
            return { ...match, label: quarter };
        }

        return {
            bucketName: quarter,
            bucketType: "quarterly",
            totalAmount: 0,
            recordCount: 0,
            opportunityIds: [],
            transactionIds: [],
            label: quarter,
        };
    });
};
