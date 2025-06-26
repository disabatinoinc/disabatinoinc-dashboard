export function formatISO(date: Date): string {
    return date.toISOString().split("T")[0];
}

export function getMonthIndex(monthName: string): number {
    return new Date(`${monthName} 1, 2000`).getMonth(); // Safe because year doesn't matter
}

export function getQuarterStartEnd(
    quarter: string,
    fiscalYear: string
): { startDate: string; endDate: string } {
    debugger;
    const fy = parseInt(fiscalYear, 10);

    let start: Date;
    let end: Date;

    switch (quarter) {
        case "Q1":
            start = new Date(fy, 3, 1); // Apr 1
            end = new Date(fy, 6, 0);   // Jun 30
            break;
        case "Q2":
            start = new Date(fy, 6, 1); // Jul 1
            end = new Date(fy, 9, 0);   // Sep 30
            break;
        case "Q3":
            start = new Date(fy, 9, 1); // Oct 1
            end = new Date(fy, 12, 0);  // Dec 31
            break;
        case "Q4":
            start = new Date(fy + 1, 0, 1); // Jan 1 of NEXT year
            end = new Date(fy + 1, 3, 0);   // Mar 31 of NEXT year
            break;
        default:
            throw new Error(`Invalid quarter: ${quarter}`);
    }

    return {
        startDate: formatISO(start),
        endDate: formatISO(end),
    };
}