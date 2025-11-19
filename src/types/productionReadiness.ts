export type FileEntry = {
    name: string;
    webUrl: string;
    version: number | null;
    language: string | null;
    modified: string | null;
    modifiedBy: string | null;
};

export type DocumentEntry = {
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

    // 🔥 Newly added project + Salesforce metadata
    opportunityId: string;
    opportunityName: string;
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

    projectFolderId: string;
    projectFolderPath: string;

    documents: Record<DocumentType, DocumentEntry>;

    readiness: {
        score: number;
        percentage: number;
        required: DocumentType[];
        completed: number;
        details: ReadinessDetail[];
        missing: DocumentType[];
    };
}

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