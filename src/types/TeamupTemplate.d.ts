/* ---------- Types ---------- */
export interface TeamupTemplateSummary {
    projectNumber: string;
    opportunityId: string;
    opportunityName: string;
    accountName: string;
    summary: { zip: string; totalHours: number };
    owner: { fullName: string; initials: string };
    projectManager: { fullName: string; initials: string };
    jobAddress: { street: string; city: string; state: string; postalCode: string };
    timeline: string;
}

export interface LaborOpportunityItem {
    id: string;
    name: string;
    productName: string;
    category: string;
    crews?: string[];
    totalLaborHrs?: number;
    plantLaborHrs?: number;
    orderQty?: number;
    estimatedByUnit?: string;
    orderUnit?: string;
    hours?: number;
    hoursSource?: string;
}

// Subcontractor line item structure
export interface SubcontractorOpportunityItem {
    id: string;
    name: string;
    subcontractorName?: string;
    productName: string;
    category: string;
    priceSold?: number | null;
    unitPrice?: number | null;
    proposedCost?: number | null;
    proposedMaterialCost?: number | null;
    proposedMaterialCostFormula?: number | null;
    totalMaterialCost?: number | null;
    totalProposedMaterialCost?: number | null;
    proposedPrice?: number | null;
    totalProposedPrice?: number | null;
    totalPrice?: number | null;
    orderQty?: number | null;
    orderUnit?: string | null;
    estimatedByUnit?: string | null;
    subCategory?: string | null;
    catalog?: string | null;
}

export interface TeamupGoal {
    id: string;
    name: string;
    pgNumber: string;
    projectNumber: string;
    totalLaborHours: number;
    proposalNotes?: string | null;
    sortOrder?: number;
    projectGoalCrews?: string[];
    projectGoalSubs?: string[];
    teamupCrewEventSuggestions?: string;
    teamupSubEventSuggestions?: string[];
    laborOpportunityItems?: LaborOpportunityItem[]; // ✅ Labor breakdown
    subcontractorOpportunityItems?: SubcontractorOpportunityItem[]; // ✅ Sub breakdown
}
