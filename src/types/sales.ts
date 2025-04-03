export type TargetBucket = {
    bucketName: string;
    bucketType: "daily" | "weekly" | "monthly" | "quarterly";
    recordCount: number;
    totalAmount: number;
    opportunityIds: string[];
    label?: string; // added by frontend for chart display
};

export type SalesTargetWithActuals = {
    id: string;
    name: string;
    targetAmount: number;
    targetPeriod: "weekly" | "monthly" | "quarterly" | "yearly";
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

    buckets: TargetBucket[];
};

export type SalesTargetSummary = Record<TargetPeriodKey, SalesTargetWithActuals[]>;

export type TargetPeriodKey = "weekly" | "monthly" | "quarterly" | "yearly";
