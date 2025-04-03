import { TargetBucket } from "@/types/sales";

const fiscalQuarterOrder = [
    "Q1 (Apr-Jun)",
    "Q2 (Jul-Sep)",
    "Q3 (Oct-Dec)",
    "Q4 (Jan-Mar)",
];

export const fillYearlyBuckets = (buckets: TargetBucket[]): TargetBucket[] => {
    return fiscalQuarterOrder.map((quarter) => {
        const match = buckets.find((b) => b.bucketName === quarter);

        return match
            ? { ...match, label: quarter }
            : {
                bucketName: quarter,
                bucketType: "quarterly",
                totalAmount: 0,
                recordCount: 0,
                opportunityIds: [],
                label: quarter,
            };
    });
};
