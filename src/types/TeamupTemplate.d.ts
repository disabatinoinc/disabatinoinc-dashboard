/* ---------- Types ---------- */
export interface TeamupTemplateSummary {
    projectNumber: string;
    opportunityId: string;
    opportunityName: string;
    summary: { zip: string; totalHours: number };
    owner: { fullName: string; initials: string };
    projectManager: { fullName: string; initials: string };
    jobAddress: { street: string; city: string; state: string; postalCode: string };
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
}