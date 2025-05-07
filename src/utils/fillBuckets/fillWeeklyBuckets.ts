import { TargetBucket } from "@/types/shared";
import { format, parseISO } from "date-fns";

// Shared bucket type that supports both Sales and Revenue targets
type BucketWithExtras = TargetBucket & {
    opportunityIds?: string[];
    transactionIds?: string[];
};

export const fillWeeklyBuckets = (
    buckets: BucketWithExtras[]
): BucketWithExtras[] => {
    const fullWeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return fullWeekDays.map((day) => {
        const match = buckets.find((b) => {
            try {
                const date = parseISO(b.bucketName);
                const weekday = format(date, "eee");
                return weekday === day;
            } catch {
                return false;
            }
        });

        if (match) {
            return { ...match, label: day };
        }

        return {
            bucketName: "",
            totalAmount: 0,
            recordCount: 0,
            opportunityIds: [],
            transactionIds: [],
            bucketType: "daily",
            label: day,
        };
    });
};
