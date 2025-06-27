import { BaseTargetWithActuals } from "@/types/shared";
import { formatISO, getMonthIndex, getQuarterStartEnd } from "./getStartEndDates";

export function getStartEndFromTarget(
    target: BaseTargetWithActuals,
    fiscalYear: string
): { startDate: string; endDate: string } {
    switch (target.targetPeriod) {
        case "weekly":
            return {
                startDate: target.weekStartDate!,
                endDate: target.weekEndDate!
            };

        case "monthly": {
            const year = parseInt(fiscalYear, 10);
            const month = getMonthIndex(target.month!);
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);
            return { startDate: formatISO(start), endDate: formatISO(end) };
        }

        case "quarterly":
            const match = target.quarter?.match(/Q\d/);
            if (!match) throw new Error("Invalid quarterly bucket name");
            return getQuarterStartEnd(match[0], fiscalYear);

        case "yearly": {
            const year = parseInt(fiscalYear, 10); // fiscalYear = 2025 means FY2025 → Apr 1, 2025 to Mar 31, 2026
            return {
                startDate: formatISO(new Date(year, 3, 1)),  // April 1 of fiscal year
                endDate: formatISO(new Date(year + 1, 2, 31)) // March 31 of following year
            };
        }

        default:
            throw new Error("Unknown target period");
    }
}
