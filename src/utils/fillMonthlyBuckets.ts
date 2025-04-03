
import { TargetBucket } from "@/types/TargetBucket";
import {
    startOfMonth,
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
    fiscalYearStart: string = "2025-04-01" // default, can be overridden
): TargetBucket[] => {
    const start = parseISO(monthStart);
    const end = endOfMonth(start);
    const fiscalStart = parseISO(fiscalYearStart);

    const filled: TargetBucket[] = [];

    let current = startOfWeek(start, { weekStartsOn: 0 });
    if (isBefore(current, fiscalStart)) {
        current = fiscalStart; // ⛔ don't start before fiscal year
    }

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

        current = addWeeks(current, 1);
    }

    return filled;
};
