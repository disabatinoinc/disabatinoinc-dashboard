import { BaseTargetWithActuals, TargetBucket, TargetPeriodKey } from "./shared";

export interface SalesTargetBucket extends TargetBucket {
    opportunityIds: string[];
}

export type SalesTargetWithActuals = BaseTargetWithActuals & {
    actualsSummary: {
        recordCount: number;
        totalAmount: number;
        opportunityIds: string[];
    };
    buckets: SalesTargetBucket[];
};

export type SalesTargetSummary = Record<TargetPeriodKey, SalesTargetWithActuals[]>;
