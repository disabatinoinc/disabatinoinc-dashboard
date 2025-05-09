// types/reports.ts

export type SalesSnapshot = {
    id: number;
    fileName: string;
    periodStart: string;   // ISO date string
    periodEnd: string;     // ISO date string
    reportType: string;
    createdDate: string;   // ISO date string
    url: string;
};