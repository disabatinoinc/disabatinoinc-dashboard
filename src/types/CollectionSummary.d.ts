export type CollectionSummary = {
    opportunityName: string;
    projectNumber: string;
    stageName: string;
    jobState: string;
    projectManager: string;
    originalOpportunityAmount: number;
    changeRequestAmount: number;
    totalOpportunityAmount: number;
    totalBilled: number;
    totalPaid: number;
    billedOutstanding: number;
    totalOppOutstanding: number;
    nextBillingMilestone: string;
}