import { RevenueTargetWithActuals } from "@/types/collections";
import {
    isWithinInterval,
    format,
    parseISO,
} from "date-fns";

// WEEKLY
export const findCurrentWeeklyTarget = (targets: RevenueTargetWithActuals[]): RevenueTargetWithActuals | undefined => {
    const today = new Date();

    const filteredTargets = targets.find((t) => {
        if (!t.weekStartDate || !t.weekEndDate) return false;

        const start = parseISO(t.weekStartDate);
        const end = parseISO(t.weekEndDate);
        return isWithinInterval(today, { start, end });
    });
    return filteredTargets;
};

// MONTHLY
export const findCurrentMonthlyTarget = (targets: RevenueTargetWithActuals[]): RevenueTargetWithActuals | undefined => {
    const thisMonthName = format(new Date(), "MMMM");
    const filteredTargets = targets.find((t) => t.month === thisMonthName);
    return filteredTargets;
};

// QUARTERLY
export const findCurrentQuarterlyTarget = (targets: RevenueTargetWithActuals[]): RevenueTargetWithActuals | undefined => {
    const monthIndex = new Date().getMonth(); // 0 = Jan
    const fiscalQuarter = (() => {
        if (monthIndex >= 3 && monthIndex <= 5) return "Q1 (Apr-Jun)";
        if (monthIndex >= 6 && monthIndex <= 8) return "Q2 (Jul-Sep)";
        if (monthIndex >= 9 && monthIndex <= 11) return "Q3 (Oct-Dec)";
        return "Q4 (Jan-Mar)";
    })();

    const currentQuarter = targets.find((t) => t.quarter === fiscalQuarter);
    return currentQuarter;
};

// YEARLY
export const findCurrentYearlyTarget = (targets: RevenueTargetWithActuals[]): RevenueTargetWithActuals | undefined => {
    const currentFY = new Date().getMonth() >= 3
        ? new Date().getFullYear().toString()
        : (new Date().getFullYear() - 1).toString();

    return targets.find((t) => t.fiscalYear === currentFY);
};
