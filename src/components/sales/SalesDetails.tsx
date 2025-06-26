"use client"

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Box, TableSortLabel, CircularProgress, Button,
    TextField
} from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { api } from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import { SalesDetailsSkeleton } from "./SalesDetailsSkeleton";


interface SalesOpportunity extends Record<string, unknown> {
    opportunityId: string;
    opportunityName: string;
    projectNumber: string;
    owner: string;
    createdDate: string;
    closedWonSignedDate: string;
    originalOpportunityAmount: number;
    changeRequestAmount: number;
    totalOpportunityAmount: number;
}

interface SalesSummary {
    totalSigned: number;
    totalOpportunityAmount: number;
    totalOriginalAmount: number;
    totalChangeRequestAmount: number;
}

const baseCellSx = {
    color: '#d1d5db',
    paddingLeft: '4px',
    fontSize: '0.75rem',
    minWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center' as const,
    borderBottom: "1px solid #374151",
};

const linkCellSx = {
    ...baseCellSx,
    textAlign: 'left' as const,
    borderBottom: "1px solid #374151",
};

const headerCellSx = {
    ...baseCellSx,
    backgroundColor: '#121929',
    borderBottom: "1px solid rgb(224, 224, 224);",
};

const SalesDetails = () => {
    const [data, setData] = useState<SalesOpportunity[]>([]);
    const [summary, setSummary] = useState<SalesSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState<keyof SalesOpportunity>("closedWonSignedDate");
    const [order, setOrder] = useState<"asc" | "desc">("desc");
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0); // optional: zero out time

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999); // optional: end of day

    const searchParams = useSearchParams();

    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - defaultStart.getDay());
    defaultStart.setHours(0, 0, 0, 0);

    const defaultEnd = new Date();
    defaultEnd.setDate(defaultEnd.getDate() + (6 - defaultEnd.getDay()));
    defaultEnd.setHours(23, 59, 59, 999);

    const getDateParam = (key: string): Date | null => {
        const param = searchParams.get(key);
        if (param && !isNaN(Date.parse(param))) {
            return new Date(param);
        }
        return null;
    };

    const [fromDate, setFromDate] = useState<Date | null>(() => getDateParam("startDate") || defaultStart);
    const [toDate, setToDate] = useState<Date | null>(() => getDateParam("endDate") || defaultEnd);

    const fetchData = useCallback(() => {
        if (fromDate && toDate) {
            setLoading(true);
            const start = fromDate.toISOString().split("T")[0];
            const end = toDate.toISOString().split("T")[0];

            api
                .get(`/salesforce/opportunities/sold?startDate=${start}&endDate=${end}`)
                .then((res) => {
                    setData(res.data.data);
                    setSummary(res.data.summary);
                })
                .catch((err) => {
                    console.error("Error fetching sales details:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [fromDate, toDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSort = (property: keyof SalesOpportunity) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const sortedData = [...data].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        return order === "asc" ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
    });

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 1 }}>Sales Details</Typography>

            {summary && (
                <Typography variant="body2" sx={{ marginBottom: 2, color: "#9ca3af" }}>
                    {`Showing ${summary.totalSigned} signed opportunities totaling 
                    ${formatCurrency(summary.totalOpportunityAmount)}.
                    Original: ${formatCurrency(summary.totalOriginalAmount)}, 
                    Change Orders: ${formatCurrency(summary.totalChangeRequestAmount)}`}
                </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, mb: 2 }}>
                <TextField
                    type="date"
                    label="Start Date"
                    size="small"
                    value={fromDate?.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : null;
                        setFromDate(newDate);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '& fieldset': { borderColor: '#374151' },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                            cursor: 'pointer'
                        }
                    }}
                />

                <TextField
                    type="date"
                    label="End Date"
                    size="small"
                    value={toDate?.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : null;
                        setToDate(newDate);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                        input: { color: "white" },
                        label: { color: "#9ca3af" },
                        '& fieldset': { borderColor: '#374151' },
                        '& input::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)',
                            cursor: 'pointer'
                        }
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
                        "&:hover": {
                            backgroundColor: "#1f2937",
                            borderColor: "#6b7280"
                        }
                    }}
                >
                    Refresh
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                        exportToCSV("sales-details", data, [
                            { label: "Opportunity Name", key: "opportunityName" },
                            { label: "Project", key: "projectNumber" },
                            { label: "Owner", key: "owner" },
                            { label: "Created", key: "createdDate" },
                            { label: "Signed Date", key: "closedWonSignedDate" },
                            { label: "Original Amount", key: "originalOpportunityAmount" },
                            { label: "Change Orders", key: "changeRequestAmount" },
                            { label: "Total Amount", key: "totalOpportunityAmount" },
                        ]);
                    }}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                        textTransform: "none",
                        fontSize: "0.75rem",
                    }}
                >
                    Export CSV
                </Button>
            </Box>

            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    padding: "0px 4px 4px 4px",
                    background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "100%",
                    maxHeight: "800px",
                    overflowY: "auto"
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {[
                                { id: "opportunityName", label: "Opportunity Name" },
                                { id: "projectNumber", label: "Project Number" },
                                { id: "owner", label: "Owner" },
                                { id: "createdDate", label: "Created" },
                                { id: "closedWonSignedDate", label: "Signed Date" },
                                { id: "originalOpportunityAmount", label: "Original" },
                                { id: "changeRequestAmount", label: "Change Orders" },
                                { id: "totalOpportunityAmount", label: "Total" },
                            ].map((col) => (
                                <TableCell key={col.id} sx={headerCellSx}>
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={orderBy === col.id ? order : "asc"}
                                        onClick={() => handleRequestSort(col.id as keyof SalesOpportunity)}
                                        sx={{
                                            color: '#d1d5db',
                                            '&.Mui-active': { color: 'white' },
                                            "& .MuiTableSortLabel-icon": { color: "white !important" },
                                            '&:hover': { color: 'white' },
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
                            <SalesDetailsSkeleton />
                        ) : (
                            sortedData.map((row) => (
                                <TableRow key={row.opportunityId} sx={{
                                    cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }}>
                                    <TableCell sx={linkCellSx}>
                                        <a
                                            href={`https://d41000000gobkeao.lightning.force.com/lightning/r/Opportunity/${row.opportunityId}/view`}
                                            style={{ color: "#3b82f6", textDecoration: "underline", fontSize: "0.75rem" }}
                                            target="_blank"
                                        >
                                            {row.opportunityName}
                                        </a>
                                    </TableCell>
                                    <TableCell sx={baseCellSx}>{row.projectNumber}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.owner}</TableCell>
                                    <TableCell sx={baseCellSx}>{new Date(row.createdDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={baseCellSx}>{new Date(row.closedWonSignedDate).toLocaleDateString()}</TableCell>
                                    <TableCell sx={baseCellSx}>{formatCurrency(row.originalOpportunityAmount)}</TableCell>
                                    <TableCell sx={baseCellSx}>{formatCurrency(row.changeRequestAmount)}</TableCell>
                                    <TableCell style={{ color: "#42de80" }} sx={baseCellSx}>{formatCurrency(row.totalOpportunityAmount)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SalesDetails;
