export type CollectionSummary = {
    opportunityId: string;
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
    punchListLink?: string | null;
    punchListAssignee?: string | null;
    punchListDueDate?: string | null;
    punchListNotes?: string | null;
    hasPunchList: boolean;
}