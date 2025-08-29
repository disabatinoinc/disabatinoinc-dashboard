"use client";

import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    Tooltip,
    Button,
    CircularProgress
} from "@mui/material";
import { Download } from "@mui/icons-material";
import axios from "axios";
import { ReportSnapshot } from "@/types/reports";

const headCells = [
    { id: "fileName", label: "Filename" },
    { id: "reportType", label: "Type" },
    { id: "periodStart", label: "Start" },
    { id: "periodEnd", label: "End" },
    { id: "createdDate", label: "Created Date" },
    { id: "download", label: "Download" },
];

export default function CollectionsSnapshots() {
    const [snapshots, setSnapshots] = useState<ReportSnapshot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("https://reports.disabatinoinc.io/reports/collections/snapshots")
            .then((res) => {
                setSnapshots(res.data.snapshots || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching snapshots:", err);
                setLoading(false);
            });
    }, []);

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>Collections Snapshots</Typography>
            <TableContainer
                component={Paper}
                sx={{
                    background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: "800px",
                    overflowY: "auto"
                }}
            >
                <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sx={{
                                        color: "#d1d5db",
                                        backgroundColor: "#121929",
                                        textTransform: "uppercase",
                                        fontSize: "0.75rem",
                                        padding: "6px",
                                        borderBottom: "1px solid #374151"
                                    }}
                                >
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length} align="center">
                                    <CircularProgress size={24} sx={{ color: "#d1d5db", mt: 2 }} />
                                </TableCell>
                            </TableRow>
                        ) : (
                            snapshots.map((row) => (
                                <TableRow key={row.id} sx={{ borderBottom: "1px solid #374151", '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                                    <TableCell sx={{ color: '#d1d5db', fontSize: '0.75rem', padding: '6px' }}>{row.fileName}</TableCell>
                                    <TableCell sx={{ color: '#d1d5db', fontSize: '0.75rem', padding: '6px' }}>{row.reportType}</TableCell>
                                    <TableCell sx={{ color: '#d1d5db', fontSize: '0.75rem', padding: '6px' }}>{row.periodStart}</TableCell>
                                    <TableCell sx={{ color: '#d1d5db', fontSize: '0.75rem', padding: '6px' }}>{row.periodEnd}</TableCell>
                                    <TableCell sx={{ color: '#d1d5db', fontSize: '0.75rem', padding: '6px' }}>{row.createdDate}</TableCell>
                                    <TableCell sx={{ padding: '6px' }}>
                                        <Tooltip title="Download" arrow>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => window.open(row.url, "_blank")}
                                                sx={{
                                                    color: "#d1d5db",
                                                    borderColor: "#374151",
                                                    fontSize: "0.7rem",
                                                    '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                                                    textTransform: "none"
                                                }}
                                            >
                                                <Download fontSize="small" sx={{ mr: 1 }} /> Download
                                            </Button>
                                        </Tooltip>
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
