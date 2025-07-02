/* ProjectsVelocityDetails.tsx */
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
    TextField,
} from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import { ProjectsStageDetailsSkeleton } from "./ProjectsStageDetailsSkeleton";

interface VelocityRow {
    [key: string]: unknown;
    opportunityId: string;
    opportunityName: string;
    owner: string;
    projectManager: string;
    projectNumber: string;
    stage: string;
    movementType: "entered" | "exited" | "stayed";
    movementDate: string | null; // yyyy-MM-dd
}

/* ---------- constants ---------- */
const STAGE_OPTIONS = [
    { value: "closed-won-signed", label: "Closed Won - Signed" },
    { value: "ready-to-be-scheduled", label: "Ready to be Scheduled" },
    { value: "scheduled", label: "Scheduled" },
    { value: "work-in-progress", label: "Work in Progress" },
    { value: "closed-won-paid", label: "Closed Won - Paid" },
];
const MOVE_OPTIONS = [
    { value: "all", label: "All Movements" },
    { value: "entered", label: "Entered" },
    { value: "exited", label: "Exited" },
    { value: "stayed", label: "Stayed" },
];

/* ---------- helpers ---------- */
function todayISO(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
}
function twoWeeksAgoISO(): string {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d.toISOString().slice(0, 10);
}

/* ---------- component ---------- */
export default function ProjectsVelocityDetails() {
    /* URL params */
    const q = useSearchParams();
    const router = useRouter();
    const [stage, setStage] = useState(q.get("stage") ?? "closed-won-signed");
    const [movement, setMovement] = useState(q.get("movement") ?? "all");
    const [startDate, setStartDate] = useState(q.get("startDate") ?? twoWeeksAgoISO());
    const [endDate, setEndDate] = useState(q.get("endDate") ?? todayISO());

    /* data state */
    const [rows, setRows] = useState<VelocityRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState<keyof VelocityRow>("movementDate");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    interface VelocityParams {
        stageName: string;
        startDate: string;
        endDate: string;
        movementType?: string;
    }

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params: VelocityParams = {
                stageName: stage,
                startDate,
                endDate,
            };
            if (movement !== "all") params.movementType = movement;

            const res = await api.get<VelocityRow[]>(
                "/salesforce/opportunities/velocity-details",
                { params }
            );
            setRows(res.data);
        } catch (e) {
            console.error("velocity fetch error", e);
        } finally {
            setLoading(false);
        }
    }, [stage, movement, startDate, endDate]);

    useEffect(() => {
        fetchData();          // returns a Promise, but we don't return it from useEffect
    }, [fetchData]);

    /* keep url in sync */
    useEffect(() => {
        const sp = new URLSearchParams({
            stage,
            movement,
            startDate,
            endDate,
        });
        router.replace(`?${sp.toString()}`);
    }, [stage, movement, startDate, endDate, router]);

    /* sorting */
    const handleSort = (prop: keyof VelocityRow) => {
        const isAsc = orderBy === prop && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(prop);
    };
    const sorted = useMemo(() => {
        return [...rows].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal === bVal) return 0;
            return order === "asc" ? (aVal! < bVal! ? -1 : 1) : aVal! > bVal! ? -1 : 1;
        });
    }, [rows, order, orderBy]);

    /* export */
    const handleExport = () =>
        exportToCSV("projects-velocity", rows, [
            { label: "Opportunity", key: "opportunityName" },
            { label: "Project #", key: "projectNumber" },
            { label: "Owner", key: "owner" },
            { label: "PM", key: "projectManager" },
            { label: "Stage", key: "stage" },
            { label: "Movement", key: "movementType" },
            { label: "Date", key: "movementDate" },
        ]);

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 1 }}>
                Project Velocity Details
            </Typography>

            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1 }}>
                {`${rows.length.toLocaleString()} records (${startDate} ➜ ${endDate})`}
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
                {/* stage */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: "#9ca3af" }}>Stage</InputLabel>
                    <Select
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                        input={<OutlinedInput label="Stage" />}
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6b7280" },
                        }}
                    >
                        {STAGE_OPTIONS.map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                                {o.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* movement */}
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel sx={{ color: "#9ca3af" }}>Movement</InputLabel>
                    <Select
                        value={movement}
                        onChange={(e) => setMovement(e.target.value)}
                        input={<OutlinedInput label="Movement" />}
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6b7280" },
                        }}
                    >
                        {MOVE_OPTIONS.map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                                {o.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* dates */}
                <TextField
                    type="date"
                    size="small"
                    label="Start"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        "& fieldset": { borderColor: "#374151" },
                    }}
                />
                <TextField
                    type="date"
                    size="small"
                    label="End"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        "& fieldset": { borderColor: "#374151" },
                    }}
                />

                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        fontSize: "0.75rem",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#1f2937", borderColor: "#6b7280" },
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
                        "&:hover": { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                    }}
                >
                    Export CSV
                </Button>
            </Box>

            {/* table */}
            <TableContainer
                component={Paper}
                sx={{
                    p: "0 4px 4px",
                    background:
                        "linear-gradient(to bottom right,#121929 0%,#0c111c 50%,#000 100%)",
                    border: "1px solid #374151",
                    borderRadius: 2,
                    maxHeight: 800,
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {[
                                { id: "opportunityName", label: "Opportunity" },
                                { id: "projectNumber", label: "Project #" },
                                { id: "projectManager", label: "PM" },
                                { id: "stage", label: "Stage" },
                                { id: "movementType", label: "Movement" },
                                { id: "movementDate", label: "Date" },
                            ].map((col) => (
                                <TableCell key={col.id} sx={{ color: "#d1d5db", background: "#121929" }}>
                                    <TableSortLabel
                                        active={orderBy === (col.id as keyof VelocityRow)}
                                        direction={orderBy === col.id ? order : "asc"}
                                        onClick={() => handleSort(col.id as keyof VelocityRow)}
                                        sx={{
                                            color: "#d1d5db",
                                            "&.Mui-active": { color: "white" },
                                            "& .MuiTableSortLabel-icon": { color: "white !important" },
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
                            sorted.map((r) => (
                                <TableRow key={r.opportunityId}>
                                    <TableCell>
                                        <a
                                            href={`https://d41000000gobkeao.lightning.force.com/lightning/r/Opportunity/${r.opportunityId}/view`}
                                            target="_blank"
                                            style={{ color: "#3b82f6", fontSize: "0.75rem" }}
                                        >
                                            {r.opportunityName}
                                        </a>
                                    </TableCell>
                                    <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {r.projectNumber}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {r.projectManager}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {r.stage}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {r.movementType}
                                    </TableCell>
                                    <TableCell sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {r.movementDate
                                            ? new Date(r.movementDate).toLocaleDateString()
                                            : "-"}
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
