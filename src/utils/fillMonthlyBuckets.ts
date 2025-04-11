

import { TargetBucket } from "@/types/sales";
import {
    endOfMonth,
    startOfWeek,
    addWeeks,
    format,
    isBefore,
    parseISO,
    addDays,
} from "date-fns";

export const fillMonthlyBuckets = (
    buckets: TargetBucket[],
    monthStart: string,
    fiscalYearStart: string = "2025-04-01"
): TargetBucket[] => {
    const start = parseISO(monthStart);
    const end = endOfMonth(start);
    const fiscalStart = parseISO(fiscalYearStart);

    const filled: TargetBucket[] = [];

    let current = startOfWeek(start, { weekStartsOn: 0 });
    if (isBefore(current, fiscalStart)) {
        current = fiscalStart; // ⛔ don't start before fiscal year
    }

    let isFirstBucket = true;

    while (current <= end) {
        const bucketName = format(current, "yyyy-MM-dd");
        const match = buckets.find((b) => b.bucketName === bucketName);
        const weekEnd = addDays(current, 6);

        filled.push(
            match
                ? { ...match, label: `${format(current, "MMM d")} - ${format(weekEnd, "MMM d")}` }
                : {
                    bucketName,
                    bucketType: "weekly",
                    totalAmount: 0,
                    recordCount: 0,
                    opportunityIds: [],
                    label: `${format(current, "MMM d")} - ${format(weekEnd, "MMM d")}`,
                }
        );

        if (isFirstBucket) {
            // 🛠 After first bucket (which may start mid-week), reset to next Sunday
            current = startOfWeek(addWeeks(current, 1), { weekStartsOn: 0 });
            isFirstBucket = false;
        } else {
            current = addWeeks(current, 1);
        }
    }

    return filled;
};
