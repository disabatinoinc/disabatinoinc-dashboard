"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Box,
    Typography,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Button,
    CircularProgress,
    TableSortLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { api } from "@/utils/apiClient";

interface CollectionScheduleItem {
    opportunityName: string | null;
    owner: string | null;
    projectNumber: string | null;
    projectManager: string | null;
    date: string;
    milestone: "Initial" | "Scheduling" | "First Day" | "Milestone" | "Final" | null;
    percent: number;
    invoiceAmount: number | null;
    totalOpportunityAmount: number | null;
}

// Define the headers and which key they sort on:
const headCells: { id: keyof CollectionScheduleItem; label: string }[] = [
    { id: "opportunityName", label: "Opportunity Name" },
    { id: "owner", label: "Owner" },
    { id: "projectNumber", label: "Project No." },
    { id: "projectManager", label: "Project Manager" },
    { id: "date", label: "Date" },
    { id: "milestone", label: "Milestone" },
    { id: "totalOpportunityAmount", label: "Total Opp. Amount" },
    { id: "percent", label: "Invoice % of Total" },
    { id: "invoiceAmount", label: "Invoice Amount" },
];

function formatDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

export default function CollectionsSchedule() {
    const [items, setItems] = useState<CollectionScheduleItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(() => formatDate(new Date()));
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 3);
        return formatDate(d);
    });

    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof CollectionScheduleItem>("opportunityName");
    const [managerFilter, setManagerFilter] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/buildertrend/schedule-items/invoices", {
                params: { startDate, endDate, pageNumber: 1, pageSize: 100 },
            });
            setItems(res.data.items);
        } catch (err) {
            console.error("Error fetching collections schedule:", err);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSort = (property: keyof CollectionScheduleItem) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // 1) sort
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const aVal = a[orderBy];
            const bVal = b[orderBy];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (typeof aVal === "number" && typeof bVal === "number") {
                return order === "asc" ? aVal - bVal : bVal - aVal;
            }
            if (orderBy === "date") {
                const aTime = new Date(aVal as string).getTime();
                const bTime = new Date(bVal as string).getTime();
                return order === "asc" ? aTime - bTime : bTime - aTime;
            }
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();
            if (aStr < bStr) return order === "asc" ? -1 : 1;
            if (aStr > bStr) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [items, order, orderBy]);

    // 2) extract distinct project managers for the dropdown
    const uniqueManagers = useMemo(() => {
        const set = new Set<string>();
        items.forEach((i) => {
            if (i.projectManager) set.add(i.projectManager);
        });
        return Array.from(set).sort();
    }, [items]);

    // 3) apply manager filter before rendering
    const displayed = useMemo(() => {
        return managerFilter
            ? sortedItems.filter((r) => r.projectManager === managerFilter)
            : sortedItems;
    }, [sortedItems, managerFilter]);

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
                Upcoming Collections Schedule
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 2,
                    mb: 2,
                }}
            >
                {/* Project Manager filter moved before Start Date */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: "#9ca3af" }}>Project Manager</InputLabel>
                    <Select
                        value={managerFilter}
                        label="Project Manager"
                        onChange={(e) => setManagerFilter(e.target.value)}
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {uniqueManagers.map((pm) => (
                            <MenuItem key={pm} value={pm}>
                                {pm}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Start Date"
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ input: { color: "white" }, label: { color: "#9ca3af" } }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ input: { color: "white" }, label: { color: "#9ca3af" } }}
                />
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#1f2937" },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    background:
                        "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: 600,
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            {headCells.map((head) => (
                                <TableCell
                                    key={head.id}
                                    align="center"
                                    sx={{
                                        color: "#d1d5db",
                                        backgroundColor: "#121929",
                                        borderBottom: "1px solid #374151",
                                        fontSize: "0.75rem",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === head.id}
                                        direction={order}
                                        onClick={() => handleRequestSort(head.id)}
                                        sx={{
                                            color: "#d1d5db",
                                            '&.Mui-active': { color: "white" },
                                            '& .MuiTableSortLabel-icon': { color: "white !important" },
                                            '&:hover': { color: 'white' },
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: "center",
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: "100%"
                                        }}
                                    >
                                        {head.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length} align="center">
                                    <CircularProgress color="inherit" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayed.map((row) => (
                                <TableRow
                                    key={`${row.projectNumber}-${row.date}-${row.milestone}`}
                                    sx={{ "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" } }}
                                >
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.opportunityName}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.owner}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.projectNumber}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.projectManager}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {new Date(row.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.milestone}
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.totalOpportunityAmount != null
                                            ? formatCurrency(row.totalOpportunityAmount)
                                            : "-"}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#d1d5db", fontSize: "0.75rem" }}>
                                        {row.percent}%
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "#42de80", fontSize: "0.75rem" }}>
                                        {row.invoiceAmount != null ? formatCurrency(row.invoiceAmount) : "-"}
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
