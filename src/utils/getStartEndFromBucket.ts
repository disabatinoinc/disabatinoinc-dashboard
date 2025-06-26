import { formatISO, getMonthIndex, getQuarterStartEnd } from "./getStartEndDates";

type BucketType = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

export function getStartEndFromBucket(bucket: {
    bucketName: string;
    bucketType: BucketType;
}, fiscalYear: string): { startDate: string; endDate: string } {
    const { bucketName, bucketType } = bucket;

    switch (bucketType) {
        case "daily":
            return { startDate: bucketName, endDate: bucketName };

        case "weekly":
            if (bucket.bucketType === "weekly") {
                const start = new Date(bucket.bucketName);
                const end = new Date(start);
                end.setDate(start.getDate() + 6);

                return {
                    startDate: start.toISOString().split("T")[0],
                    endDate: end.toISOString().split("T")[0],
                };
            }

        case "monthly": {
            const year = parseInt(fiscalYear, 10);
            const month = getMonthIndex(bucketName);
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);
            return { startDate: formatISO(start), endDate: formatISO(end) };
        }

        case "quarterly": {
            const match = bucketName.match(/Q\d/);
            if (!match) throw new Error("Invalid quarterly bucket name");
            return getQuarterStartEnd(match[0], fiscalYear);
        }

        case "yearly": {
            const year = parseInt(fiscalYear, 10);
            return {
                startDate: formatISO(new Date(year, 0, 1)),
                endDate: formatISO(new Date(year, 11, 31))
            };
        }

        default:
            throw new Error("Unknown bucket type");
    }
}
