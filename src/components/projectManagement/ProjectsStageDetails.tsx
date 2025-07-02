"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Box,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    TableSortLabel,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import { formatCurrency } from "@/utils/formatters";
import { exportToCSV } from "@/utils/exportCSV";
import { ProjectsStageDetailsSkeleton } from "./ProjectsStageDetailsSkeleton";

interface StageOpportunity {
    [key: string]: unknown;

    opportunityId: string;
    opportunityName: string;
    projectNo: string;
    owner: string;
    projectManager: string;
    createdDate: string;
    stage: string;
    closedWonSignedDate: string | "Pending" | "Unknown";
    readyToBeScheduledDate: string | "Pending" | "Unknown";
    scheduledDate: string | "Pending" | "Unknown";
    workInProgressDate: string | "Pending" | "Unknown";
    closedWonPaidDate: string | "Pending" | "Unknown";
    daysInCurrentStage: number;
    originalOpportunityAmount: number;
    changeRequestAmount: number;
    totalOpportunityAmount: number;
}

const STAGE_OPTIONS = [
    { value: "all", label: "All" },
    { value: "closed-won-signed", label: "Closed Won - Signed" },
    { value: "ready-to-be-scheduled", label: "Ready to be Scheduled" },
    { value: "scheduled", label: "Scheduled" },
    { value: "work-in-progress", label: "Work in Progress" },
    { value: "closed-won-paid", label: "Closed Won - Paid" },
];

// ---------- helper ----------
const stageStart = (
    row: StageOpportunity
): string | "Pending" | "Unknown" => {
    const map: Record<string, string | "Pending" | "Unknown"> = {
        "Closed Won - Signed": row.closedWonSignedDate,
        "Ready to be Scheduled": row.readyToBeScheduledDate,
        Scheduled: row.scheduledDate,
        "Work in Progress": row.workInProgressDate,
        "Closed Won-Paid": row.closedWonPaidDate,
    };
    return map[row.stage] ?? "Pending";
};

const baseCellSx = {
    color: "#d1d5db",
    paddingLeft: "4px",
    fontSize: "0.75rem",
    minWidth: "90px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center" as const,
    borderBottom: "1px solid #374151",
};
const linkCellSx = { ...baseCellSx, textAlign: "left" as const };
const headerCellSx = {
    ...baseCellSx,
    backgroundColor: "#121929",
    borderBottom: "1px solid rgb(224, 224, 224)",
};

// ---------- component ----------
export default function ProjectsStageDetails() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialStage = searchParams.get("stage") ?? "all";

    const [selectedStage, setSelectedStage] = useState(initialStage);
    const [data, setData] = useState<StageOpportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] =
        useState<keyof StageOpportunity | "stageStart">("daysInCurrentStage");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    // fetch
    const fetchData = useCallback(() => {
        setLoading(true);
        api
            .get(
                `/salesforce/opportunities/stage-details?stage=${encodeURIComponent(
                    selectedStage
                )}`
            )
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error fetching stage details:", err))
            .finally(() => setLoading(false));
    }, [selectedStage]);

    useEffect(fetchData, [fetchData]);
    useEffect(
        () => {
            router.replace(`?stage=${selectedStage}`);
        },
        [selectedStage, router]
    );

    // sort
    const handleRequestSort = (
        prop: keyof StageOpportunity | "stageStart"
    ) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };

    const getVal = useCallback(
        (row: StageOpportunity) =>
            orderBy === "stageStart" ? stageStart(row) : row[orderBy],
        [orderBy]
    );

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = getVal(a);
            const bVal = getVal(b);
            if (aVal === bVal) return 0;
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            return order === "asc" ? (aVal < bVal ? -1 : 1) : aVal > bVal ? -1 : 1;
        });
    }, [data, order, getVal]);

    // summary
    const overallTotal = useMemo(
        () =>
            data.reduce((sum, d) => sum + d.totalOpportunityAmount, 0),
        [data]
    );

    // export handler
    const handleExport = () => {
        const processed = data.map((r) => ({ ...r, stageStart: stageStart(r) }));
        exportToCSV("project-stage-details", processed, [
            { label: "Opportunity Name", key: "opportunityName" },
            { label: "Project", key: "projectNo" },
            { label: "PM", key: "projectManager" },
            { label: "Created", key: "createdDate" },
            { label: "Stage", key: "stage" },
            { label: "Stage Start", key: "stageStart" },
            { label: "Days In Stage", key: "daysInCurrentStage" },
            { label: "Original", key: "originalOpportunityAmount" },
            { label: "Change Orders", key: "changeRequestAmount" },
            { label: "Total", key: "totalOpportunityAmount" },
        ]);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 1 }}>
                Project Stage Details
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                {`${data.length.toLocaleString()} opportunities · ${formatCurrency(
                    overallTotal
                )} total`}
            </Typography>

            {/* controls */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 2,
                    mb: 2,
                }}
            >
                <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="stage-label" sx={{ color: "#9ca3af" }}>
                        Stage
                    </InputLabel>
                    <Select
                        labelId="stage-label"
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        input={<OutlinedInput label="Stage" />}
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#374151",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#6b7280",
                            },
                        }}
                    >
                        {STAGE_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        fontSize: "0.75rem",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#1f2937",
                            borderColor: "#6b7280",
                        },
                    }}
                >
                    Refresh
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={handleExport}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        "&:hover": {
                            borderColor: "#6b7280",
                            backgroundColor: "#1f2937",
                        },
                    }}
                >
                    Export CSV
                </Button>
            </Box>

            {/* table */}
            <TableContainer
                component={Paper}
                sx={{
                    mt: 2,
                    p: "0px 4px 4px 4px",
                    background:
                        "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: "800px",
                    overflowY: "auto",
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                { id: "opportunityName", label: "Opportunity Name" },
                                { id: "projectNo", label: "Project No." },
                                { id: "projectManager", label: "PM" },
                                { id: "createdDate", label: "Created" },
                                { id: "stage", label: "Stage" },
                                { id: "stageStart", label: "Stage Start" },
                                { id: "daysInCurrentStage", label: "Days In Stage" },
                                { id: "originalOpportunityAmount", label: "Original" },
                                { id: "changeRequestAmount", label: "Change Orders" },
                                { id: "totalOpportunityAmount", label: "Total" },
                            ].map((col) => (
                                <TableCell key={col.id} sx={headerCellSx}>
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={orderBy === col.id ? order : "asc"}
                                        onClick={() =>
                                            handleRequestSort(col.id as keyof StageOpportunity | "stageStart")
                                        }
                                        sx={{
                                            color: "#d1d5db",
                                            "&.Mui-active": { color: "white" },
                                            "& .MuiTableSortLabel-icon": {
                                                color: "white !important",
                                            },
                                            "&:hover": { color: "white" },
                                        }}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <ProjectsStageDetailsSkeleton />
                        ) : (
                            sortedData.map((row) => (
                                <TableRow
                                    key={row.opportunityId}
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                                    }}
                                >
                                    <TableCell sx={linkCellSx}>
                                        <a
                                            href={`https://d41000000gobkeao.lightning.force.com/lightning/r/Opportunity/${row.opportunityId}/view`}
                                            target="_blank"
                                            style={{
                                                color: "#3b82f6",
                                                textDecoration: "underline",
                                                fontSize: "0.75rem",
                                            }}
                                        >
                                            {row.opportunityName}
                                        </a>
                                    </TableCell>

                                    <TableCell sx={baseCellSx}>{row.projectNo}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.projectManager}</TableCell>

                                    <TableCell sx={baseCellSx}>
                                        {new Date(row.createdDate).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell sx={baseCellSx}>{row.stage}</TableCell>

                                    <TableCell sx={baseCellSx}>
                                        {stageStart(row) !== "Pending" && stageStart(row) !== "Unknown"
                                            ? new Date(stageStart(row) as string).toLocaleDateString()
                                            : stageStart(row)}
                                    </TableCell>

                                    <TableCell sx={baseCellSx}>{row.daysInCurrentStage}</TableCell>

                                    <TableCell sx={baseCellSx}>
                                        {formatCurrency(row.originalOpportunityAmount)}
                                    </TableCell>
                                    <TableCell sx={baseCellSx}>
                                        {formatCurrency(row.changeRequestAmount)}
                                    </TableCell>
                                    <TableCell sx={{ ...baseCellSx, color: "#42de80" }}>
                                        {formatCurrency(row.totalOpportunityAmount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
