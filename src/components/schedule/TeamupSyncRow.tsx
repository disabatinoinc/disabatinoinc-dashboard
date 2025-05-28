'use client';

import React from "react";
import {
    TableRow, TableCell, Checkbox
} from "@mui/material";

export type TeamupScheduleRow = {
    teamupScheduleItemId: string;
    scheduleItemName: string;
    crewName: string;
    startDateTeamup: string;
    endDateTeamup: string;
    syncedDate: string;
    syncStatus: string;
    syncMessage: string;
};

type RowProps = {
    row: TeamupScheduleRow;
    isSelected: boolean;
    onSelect: (id: string) => void;
};

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "pending": return "#60a5fa";      // Blue
        case "synced": return "#42de80";  // Green
        case "not synced": return "#facc15";  // Yellow
        case "error": return "#ef4444";    // Red
        default: return "#d1d5db";         // Gray
    }
};

const formatDate = (datetime: string) =>
    datetime && datetime.includes("T") ? datetime.split("T")[0] : datetime;

const TeamupSyncRow: React.FC<RowProps> = ({ row, isSelected, onSelect }) => {
    return (
        <TableRow
            key={row.teamupScheduleItemId}
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
                        onSelect(row.teamupScheduleItemId);
                    }}
                    sx={{ color: "#9ca3af" }}
                />
            </TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>{row.scheduleItemName}</TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>{row.crewName.toUpperCase()}</TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>{formatDate(row.startDateTeamup)}</TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>{formatDate(row.endDateTeamup)}</TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>{formatDate(row.syncedDate)}</TableCell>
            <TableCell sx={{ color: statusColor(row.syncStatus), fontSize: "0.75rem", fontWeight: 500 }}>
                {row.syncStatus}
            </TableCell>
            <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                {row.syncMessage || "-"}
            </TableCell>
        </TableRow>
    );
};

export default React.memo(TeamupSyncRow);
