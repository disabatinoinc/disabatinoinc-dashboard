import React from "react";
import {
    TableRow, TableCell, Checkbox, Tooltip, Box
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export type JobTrackingRow = {
    opportunityId: string;
    projectManager: string;
    opportunityName: string;
    projectNumber: string;
    stage: string;
    buildertrendJobName: string;
    buildertrendJobId: string;
    buildertrendJobStatus: string;
    jobMapped: boolean;
};

export type RowProps = {
    row: JobTrackingRow;
    isSelected: boolean;
    onSelect: (id: string) => void;
    headCells: { id: keyof JobTrackingRow; label: string }[];
};

const ProjectRow: React.FC<RowProps> = ({ row, isSelected, onSelect, headCells }) => {
    return (
        <TableRow
            key={row.opportunityId}
            sx={{
                borderTop: "1px solid #374151",
                cursor: "pointer",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" }
            }}
        >
            <TableCell padding="checkbox">
                <Checkbox
                    checked={isSelected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelect(row.opportunityId);
                    }}
                    sx={{ color: "#9ca3af" }}
                />
            </TableCell>
            {headCells.map((cell) => (
                <TableCell
                    key={cell.id}
                    sx={{
                        color:
                            cell.id === "jobMapped"
                                ? row[cell.id]
                                    ? "#42de80" // green for true
                                    : "#ef4444" // red for false
                                : "#d1d5db",
                        fontSize: "0.75rem",
                        padding: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {cell.id === "jobMapped"
                        ? row[cell.id] ? "true" : "false"
                        : row[cell.id]}
                </TableCell>
            ))}
        </TableRow>
    );
};

export default React.memo(ProjectRow);