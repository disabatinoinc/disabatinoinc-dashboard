
import { TargetBucket } from "@/types/sales";
import { format, parseISO } from "date-fns";


export const fillWeeklyBuckets = (buckets: TargetBucket[]): TargetBucket[] => {
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

        return match
            ? { ...match, label: day }
            : {
                bucketName: "",
                totalAmount: 0,
                recordCount: 0,
                opportunityIds: [],
                bucketType: "daily",
                label: day,
            };
    });
};
