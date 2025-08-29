// types/reports.ts

export type ReportSnapshot = {
    id: number;
    fileName: string;
    periodStart: string;   // ISO date string
    periodEnd: string;     // ISO date string
    reportType: string;
    createdDate: string;   // ISO date string
    url: string;
};