import { SalesTargetWithActuals } from "@/types/sales";
import {
    isWithinInterval,
    format,
    parseISO,
} from "date-fns";

// WEEKLY
export const findCurrentWeeklyTarget = (targets: SalesTargetWithActuals[]): SalesTargetWithActuals | undefined => {
    const today = new Date();

    return targets.find((t) => {
        if (!t.weekStartDate || !t.weekEndDate) return false;

        const start = parseISO(t.weekStartDate);
        const end = parseISO(t.weekEndDate);
        return isWithinInterval(today, { start, end });
    });
};

// MONTHLY
export const findCurrentMonthlyTarget = (targets: SalesTargetWithActuals[]): SalesTargetWithActuals | undefined => {
    const thisMonthName = format(new Date(), "MMMM");
    return targets.find((t) => t.month === thisMonthName);
};

// QUARTERLY
export const findCurrentQuarterlyTarget = (targets: SalesTargetWithActuals[]): SalesTargetWithActuals | undefined => {
    debugger;
    const monthIndex = new Date().getMonth(); // 0 = Jan
    const fiscalQuarter = (() => {
        if (monthIndex >= 3 && monthIndex <= 5) return "Q1 (Apr-Jun)";
        if (monthIndex >= 6 && monthIndex <= 8) return "Q2 (Jul-Sep)";
        if (monthIndex >= 9 && monthIndex <= 11) return "Q3 (Oct-Dec)";
        return "Q4 (Jan-Mar)";
    })();

    let currentQuarter = targets.find((t) => t.quarter === fiscalQuarter);
    return currentQuarter;
};

// YEARLY
export const findCurrentYearlyTarget = (targets: SalesTargetWithActuals[]): SalesTargetWithActuals | undefined => {
    const currentFY = new Date().getMonth() >= 3
        ? new Date().getFullYear().toString()
        : (new Date().getFullYear() - 1).toString();

    return targets.find((t) => t.fiscalYear === currentFY);
};
