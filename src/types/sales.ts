import { TargetBucket, TargetPeriod } from "./shared";

export interface SalesTargetBucket extends TargetBucket {
    opportunityIds: string[];
}

export type SalesTargetWithActuals = {
    id: string;
    name: string;
    targetAmount: number;
    targetPeriod: TargetPeriod;
    targetType?: string;
    fiscalYear?: string;
    notes?: string;

    // Optional fields depending on targetPeriod
    weekStartDate?: string;
    weekEndDate?: string;
    weekNumber?: number;
    month?: string;
    quarter?: string;

    actualsSummary: {
        recordCount: number;
        totalAmount: number;
        opportunityIds: string[];
    };

    buckets: SalesTargetBucket[];
};

export type SalesTargetSummary = Record<TargetPeriodKey, SalesTargetWithActuals[]>;

export type TargetPeriodKey = "weekly" | "monthly" | "quarterly" | "yearly";
