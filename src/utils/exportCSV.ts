type CSVColumn = { label: string; key: string };

export const exportToCSV = (
    baseFilename: string,
    rows: any[],
    columns: CSVColumn[]
) => {
    if (!rows || rows.length === 0) return;

    const headers = columns.map(col => col.label);
    const keys = columns.map(col => col.key);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => keys.map((k) => `"${row[k] ?? ""}"`).join(","))
    ].join("\n");

    const today = new Date().toISOString().split("T")[0]; // e.g., 2025-03-24
    const filename = `${baseFilename}-${today}.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
