import { TargetBucket } from "@/types/TargetBucket";

const fiscalMonthOrder = [
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December",
    "January", "February", "March"
];

const getQuarterMonths = (quarterLabel: string): string[] => {
    switch (quarterLabel) {
        case "Q1 (Apr-Jun)": return ["April", "May", "June"];
        case "Q2 (Jul-Sep)": return ["July", "August", "September"];
        case "Q3 (Oct-Dec)": return ["October", "November", "December"];
        case "Q4 (Jan-Mar)": return ["January", "February", "March"];
        default: return [];
    }
};

export const fillQuarterlyBuckets = (
    buckets: TargetBucket[],
    quarterLabel: string
): TargetBucket[] => {
    const months = getQuarterMonths(quarterLabel);

    return months.map((month) => {
        const match = buckets.find((b) => b.bucketName === month);

        return match
            ? { ...match, label: month.slice(0, 3) } // e.g. "Jul"
            : {
                bucketName: month,
                bucketType: "monthly",
                totalAmount: 0,
                recordCount: 0,
                opportunityIds: [],
                label: month.slice(0, 3),
            };
    });
};
