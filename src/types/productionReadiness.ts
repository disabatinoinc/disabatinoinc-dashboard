// ---------------------------------------------
// 📁 O N E D R I V E   D O C U M E N T S
// ---------------------------------------------

export type FileEntry = {
    name: string;
    webUrl: string;
    version: number | null;
    language: string | null;
    modified: string | null;
    modifiedBy: string | null;
};

export type DocumentEntry = {
    folderLink: string | null;
    exists: boolean;
    count: number;
    files: FileEntry[];
};

export type DocumentType =
    | "signedContract"
    | "photos"
    | "approvedPermit"
    | "finalStamped"
    | "designsRenders"
    | "selectionsSheet"
    | "productionTickets";

export type ReadinessDetail = {
    type: DocumentType;
    required: boolean;
    exists: boolean;
};

export interface ReadinessResponse {
    projectNo: string;

    // Salesforce Metadata
    opportunityId: string;
    opportunityName: string;
    salesforceOpportunityLink: string;
    projectFolderLink: string;
    ownerName: string;
    ownerEmail: string;
    salesAssistantName: string;
    salesAssistantEmail: string;
    projectManagerName: string;
    projectManagerEmail: string;
    division: string;

    jobStreet: string;
    jobCity: string;
    jobState: string;
    jobZip: string;
    jobAddress: string;

    // OneDrive data
    projectFolderId: string;
    projectFolderPath: string;
    documents: Record<DocumentType, DocumentEntry>;

    // Readiness summary
    readiness: {
        score: number;
        percentage: number;
        required: DocumentType[];
        completed: number;
        details: ReadinessDetail[];
        missing: DocumentType[];
    };
}

// Labels & Order
export const DOCUMENT_LABELS: Record<DocumentType, string> = {
    signedContract: "Contract",
    photos: "Photos",
    designsRenders: "Designs & Renders",
    selectionsSheet: "Selections Sheet",
    approvedPermit: "Permit",
    finalStamped: "Final Stamped Plans",
    productionTickets: "Production Tickets",
};

export const DOCUMENT_ORDER: DocumentType[] = [
    "signedContract",
    "photos",
    "designsRenders",
    "selectionsSheet",
    "approvedPermit",
    "finalStamped",
    "productionTickets",
];


// ---------------------------------------------
// 🟧  P R O D U C T I O N   N O T E S
// ---------------------------------------------

export interface ProductionNotesField {
    label: string;
    value: string | number | boolean | null;
    isComplete: boolean;
}

export interface ProductionNotesSection {
    label: string;
    fields: ProductionNotesField[];
}

export interface ProductionNotesResponse {
    projectNo: string;
    completionPercentage: number;
    notesComplete: boolean;

    // ➕ NEW FIELDS MATCHING API RESPONSE
    requiredFields: string[];
    missingRequiredFields: string[];

    sections: ProductionNotesSection[];
}


// ---------------------------------------------
// 🟦  P R O J E C T   S U M M A R Y
// ---------------------------------------------

export interface OpportunitySummary {
    opportunityName: string;
    projectNo: string;
    division: string;
    ownerName: string;
    ownerEmail: string;
    salesAssistantName: string;
    salesAssistantEmail: string;
    projectManagerName: string;
    projectManagerEmail: string;
    jobAddress: string;
    salesforceLink: string;
    oneDriveLink: string;
}

export interface ProjectReviewStatusResponse {
    projectNo: string;

    productionReview: {
        reviewed: boolean;
        reviewDate: string | null;   // ISO date or null
        ipmNeeded: boolean;
        ipmDate: string | null;      // ISO date or null
    };

    purchasingReview: {
        reviewed: boolean;
        reviewDate: string | null;   // ISO date or null
        selectionsRequired: boolean;
        selectionsDate: string | null; // ISO date or null
    };
}
