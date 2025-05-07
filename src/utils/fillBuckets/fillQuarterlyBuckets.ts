import { TargetBucket } from "@/types/shared";

const getQuarterMonths = (quarterLabel: string): string[] => {
    switch (quarterLabel) {
        case "Q1 (Apr-Jun)": return ["April", "May", "June"];
        case "Q2 (Jul-Sep)": return ["July", "August", "September"];
        case "Q3 (Oct-Dec)": return ["October", "November", "December"];
        case "Q4 (Jan-Mar)": return ["January", "February", "March"];
        default: return [];
    }
};

// Shared bucket type that allows sales or revenue extension
type BucketWithExtras = TargetBucket & {
    opportunityIds?: string[];
    transactionIds?: string[];
};

export const fillQuarterlyBuckets = (
    buckets: BucketWithExtras[],
    quarterLabel: string
): BucketWithExtras[] => {
    const months = getQuarterMonths(quarterLabel);

    return months.map((month) => {
        const match = buckets.find((b) => b.bucketName === month);

        if (match) {
            return { ...match, label: month.slice(0, 3) };
        }

        return {
            bucketName: month,
            bucketType: "monthly",
            totalAmount: 0,
            recordCount: 0,
            opportunityIds: [],
            transactionIds: [],
            label: month.slice(0, 3),
        };
    });
};
