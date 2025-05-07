

import { TargetBucket } from "@/types/shared";
import {
    endOfMonth,
    startOfWeek,
    addWeeks,
    format,
    isBefore,
    parseISO,
    addDays,
} from "date-fns";

// Allow buckets to have opportunityIds or transactionIds
type BucketWithExtras = TargetBucket & {
    opportunityIds?: string[];
    transactionIds?: string[];
};

export const fillMonthlyBuckets = (
    buckets: BucketWithExtras[],
    monthStart: string,
    fiscalYearStart: string = "2025-04-01"
): BucketWithExtras[] => {
    const start = parseISO(monthStart);
    const end = endOfMonth(start);
    const fiscalStart = parseISO(fiscalYearStart);

    const filled: BucketWithExtras[] = [];

    let current = startOfWeek(start, { weekStartsOn: 0 });
    if (isBefore(current, fiscalStart)) {
        current = fiscalStart; // 🧱 Don't go before fiscal year
    }

    let isFirstBucket = true;

    while (current <= end) {
        const bucketName = format(current, "yyyy-MM-dd");
        const weekEnd = addDays(current, 6);
        const label = `${format(current, "MMM d")} - ${format(weekEnd, "MMM d")}`;

        const match = buckets.find((b) => b.bucketName === bucketName);

        if (match) {
            filled.push({ ...match, label });
        } else {
            filled.push({
                bucketName,
                bucketType: "weekly",
                totalAmount: 0,
                recordCount: 0,
                opportunityIds: [],
                transactionIds: [],
                label,
            });
        }

        // Adjust for the first partial week
        if (isFirstBucket) {
            current = startOfWeek(addWeeks(current, 1), { weekStartsOn: 0 });
            isFirstBucket = false;
        } else {
            current = addWeeks(current, 1);
        }
    }

    return filled;
};