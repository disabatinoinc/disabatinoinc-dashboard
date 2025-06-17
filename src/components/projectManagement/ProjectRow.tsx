"use client";

import React from "react";
import {
    TableRow, TableCell, Checkbox
} from "@mui/material";

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
                    size={(cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName' && cell.id !== 'projectManager') ? "small" : "medium"}
                    sx={{
                        color:
                            cell.id === "jobMapped"
                                ? row[cell.id]
                                    ? "#42de80"
                                    : "#ef4444"
                                : "#d1d5db",
                        fontSize: "0.75rem",
                        paddingLeft: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: (cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName' && cell.id !== 'projectManager') ? "75px" : "120px",
                    }}
                >
                    {cell.id === "jobMapped"
                        ? row[cell.id] ? "true" : "false"
                        : cell.id === "opportunityName" ? (
                            <a
                                href={`https://d41000000gobkeao.lightning.force.com/lightning/r/Opportunity/${row.opportunityId}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#42a5f5",
                                    textDecoration: "underline",
                                    fontSize: "0.75rem",
                                    display: "inline-block",
                                    maxWidth: "100%",
                                    // whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "120px"
                                }}
                            >
                                {row.opportunityName}
                            </a>
                        ) : cell.id === "buildertrendJobName" && row.buildertrendJobId ? (
                            <a
                                href={`https://buildertrend.net/app/JobPage/${row.buildertrendJobId}/1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#42a5f5",
                                    textDecoration: "underline",
                                    fontSize: "0.75rem",
                                    display: "inline-block",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    width: "120px"
                                }}
                            >
                                {row.buildertrendJobName}
                            </a>
                        ) : (
                            row[cell.id]
                        )}
                </TableCell>
            ))}
        </TableRow>
    );
};

export default React.memo(ProjectRow);