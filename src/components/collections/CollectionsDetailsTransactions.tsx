// CollectionsDetailsTransactions.tsx
"use client";

import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Box, TableSortLabel, Button, TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { api } from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import { CollectionsDetailsSkeleton } from "./CollectionsDetailsSkeleton";

interface Transaction extends Record<string, unknown> {
    Id: number;
    CustomerName: string;
    ProjectNumber: string;
    Type: string;
    Date: string;
    InvoiceNumber: string;
    Memo: string;
    Amount: number;
}

type RawTransaction = {
    Id: number;
    CustomerName: string;
    ProjectNumber: string;
    Type: string;
    Date: string;
    InvoiceNumber: string;
    Memo: string;
    Amount: string;
};

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

const headerCellSx = {
    ...baseCellSx,
    backgroundColor: '#121929',
    borderBottom: "1px solid rgb(224, 224, 224);",
};

const CollectionsDetailsTransactions = () => {
    const searchParams = useSearchParams();
    const [data, setData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderBy, setOrderBy] = useState<keyof Transaction>("Date");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    const getTypeParam = () => {
        const param = searchParams.get("type");
        return param === "Invoice" || param === "Payment" ? param : "Any";
    };
    const [typeFilter, setTypeFilter] = useState<string>(getTypeParam());

    const getDateParam = (key: string): Date | null => {
        const param = searchParams.get(key);
        return param && !isNaN(Date.parse(param)) ? new Date(param) : null;
    };

    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(defaultStart.getDate() - defaultStart.getDay());
    defaultStart.setHours(0, 0, 0, 0);

    const defaultEnd = new Date(today);
    defaultEnd.setDate(defaultEnd.getDate() + (6 - defaultEnd.getDay()));
    defaultEnd.setHours(23, 59, 59, 999);

    const [fromDate, setFromDate] = useState<Date | null>(() => getDateParam("startDate") || defaultStart);
    const [toDate, setToDate] = useState<Date | null>(() => getDateParam("endDate") || defaultEnd);

    const fetchData = useCallback(() => {
        if (fromDate && toDate) {
            setLoading(true);
            const start = fromDate.toISOString().split("T")[0];
            const end = toDate.toISOString().split("T")[0];
            api.get(`/transactions/date-range?startDate=${start}&endDate=${end}`)
                .then((res) => {
                    const allData: Transaction[] = res.data.data.map((item: RawTransaction) => ({
                        ...item,
                        Amount: parseFloat(item.Amount) || 0
                    }));
                    const filtered = typeFilter === "Any" ? allData : allData.filter(t => t.Type === typeFilter);
                    setData(filtered);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [fromDate, toDate, typeFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRequestSort = (property: keyof Transaction) => {
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

    const totalPaid = data.filter(t => t.Type === "Payment").reduce((sum, t) => sum + t.Amount, 0);
    const totalBilled = data.filter(t => t.Type === "Invoice").reduce((sum, t) => sum + t.Amount, 0);
    const countPaid = data.filter(t => t.Type === "Payment").length;
    const countBilled = data.filter(t => t.Type === "Invoice").length;

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>Collections Details</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 1 }}>
                Showing {data.length} transaction{data.length !== 1 ? 's' : ''}: {countBilled} Invoice{countBilled !== 1 ? 's' : ''}, {countPaid} Payment{countPaid !== 1 ? 's' : ''}. Total Invoiced: {formatCurrency(totalBilled)} | Total Paid: {formatCurrency(totalPaid)}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, mb: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel sx={{ color: '#9ca3af' }}>Type</InputLabel>
                    <Select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        label="Type"
                        sx={{ color: 'white', '& fieldset': { borderColor: '#374151' } }}
                    >
                        <MenuItem value="Any">Any</MenuItem>
                        <MenuItem value="Invoice">Invoice</MenuItem>
                        <MenuItem value="Payment">Payment</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    type="date"
                    label="Start Date"
                    size="small"
                    value={fromDate?.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => setFromDate(e.target.value ? new Date(e.target.value) : null)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ input: { color: "white" }, label: { color: "#9ca3af" }, '& fieldset': { borderColor: '#374151' }, '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer' } }}
                />
                <TextField
                    type="date"
                    label="End Date"
                    size="small"
                    value={toDate?.toISOString().split("T")[0] ?? ""}
                    onChange={(e) => setToDate(e.target.value ? new Date(e.target.value) : null)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ input: { color: "white" }, label: { color: "#9ca3af" }, '& fieldset': { borderColor: '#374151' }, '& input::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer' } }}
                />
                <Button variant="outlined" size="small" onClick={fetchData} sx={{ color: "#d1d5db", borderColor: "#374151", fontSize: "0.75rem", textTransform: "none", '&:hover': { backgroundColor: "#1f2937", borderColor: "#6b7280" } }}>Refresh</Button>
                <Button variant="outlined" size="small" onClick={() => exportToCSV("collections-details", data, [
                    { label: "Date", key: "Date" },
                    { label: "Customer", key: "CustomerName" },
                    { label: "Project Number", key: "ProjectNumber" },
                    { label: "Type", key: "Type" },
                    { label: "Memo", key: "Memo" },
                    { label: "Invoice #", key: "InvoiceNumber" },
                    { label: "Amount", key: "Amount" },
                ])} sx={{ color: "#d1d5db", borderColor: "#374151", '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" }, textTransform: "none", fontSize: "0.75rem" }}>Export CSV</Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2, background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)", border: "1px solid #374151", borderRadius: "12px", maxHeight: "800px" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {(["Date", "Customer", "Project #", "Type", "Memo", "Invoice #", "Amount"] as const).map((label) => (
                                <TableCell
                                    key={label}
                                    sx={headerCellSx}
                                    sortDirection={orderBy === label ? order : false}
                                >
                                    <TableSortLabel
                                        active={orderBy === label}
                                        direction={orderBy === label ? order : "asc"}
                                        onClick={() => handleRequestSort(label as keyof Transaction)}
                                        sx={{
                                            color: '#d1d5db',
                                            '&.Mui-active': { color: 'white' },
                                            '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                        }}
                                    >
                                        {label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <CollectionsDetailsSkeleton />
                        ) : (
                            sortedData.map((row) => (
                                <TableRow key={row.Id}>
                                    <TableCell sx={baseCellSx}>{row.Date.split("T")[0]}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.CustomerName}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.ProjectNumber}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.Type}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.Memo}</TableCell>
                                    <TableCell sx={baseCellSx}>{row.InvoiceNumber}</TableCell>
                                    <TableCell sx={{ ...baseCellSx, color: '#42de80' }}>{formatCurrency(row.Amount)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CollectionsDetailsTransactions;