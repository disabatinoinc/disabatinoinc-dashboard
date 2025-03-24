type CSVColumn<T> = { label: string; key: keyof T };

export const exportToCSV = <T extends Record<string, unknown>>(
    baseFilename: string,
    rows: T[],
    columns: CSVColumn<T>[]
) => {
    if (!rows || rows.length === 0) return;

    const headers = columns.map(col => col.label);
    const keys = columns.map(col => col.key);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
            keys.map((key) => `"${row[key] ?? ""}"`).join(",")
        ),
    ].join("\n");

    const today = new Date().toISOString().split("T")[0];
    const filename = `${baseFilename}-${today}.csv`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
