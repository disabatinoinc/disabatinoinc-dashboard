export const getFiscalQuarterLabel = (month: string): string => {
    switch (month) {
        case "April":
        case "May":
        case "June":
            return "Q1 (Apr-Jun)";
        case "July":
        case "August":
        case "September":
            return "Q2 (Jul-Sep)";
        case "October":
        case "November":
        case "December":
            return "Q3 (Oct-Dec)";
        case "January":
        case "February":
        case "March":
            return "Q4 (Jan-Mar)";
        default:
            return ""; // fallback in case of unexpected input
    }
};