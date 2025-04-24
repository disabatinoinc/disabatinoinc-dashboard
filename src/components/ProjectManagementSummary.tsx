"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, TableSortLabel,
    CircularProgress, Tooltip, Checkbox, Toolbar,
    Button
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import api from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import ProjectRow from "./ProjectRow";

type JobTrackingRow = {
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



const ProjectManagementSummary = () => {
    const headCells: { id: keyof JobTrackingRow; label: string }[] = useMemo(() => ([
        { id: "projectManager", label: "Project Manager" },
        { id: "opportunityName", label: "Opportunity Name" },
        { id: "projectNumber", label: "Project No." },
        { id: "stage", label: "Stage" },
        { id: "buildertrendJobName", label: "BT Job Name" },
        { id: "buildertrendJobId", label: "BT Job ID" },
        { id: "buildertrendJobStatus", label: "BT Job Status" },
        { id: "jobMapped", label: "Job Mapped" }
    ]), []);


    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof JobTrackingRow>("opportunityName");
    const [rows, setRows] = useState<JobTrackingRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowsSet, setSelectedRowsSet] = useState<Set<string>>(new Set());


    const handleRequestSort = (property: keyof JobTrackingRow) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    useEffect(() => {
        setLoading(true);

        api.get("/salesforce/buildertrend-mappings")
            .then((response) => {
                const data = response.data;

                if (Array.isArray(data)) {
                    setRows(data);
                } else if (data && Array.isArray(data.data)) {
                    setRows(data.data);
                } else {
                    console.error("Unexpected API response:", data);
                    setRows([]);
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching Buildertrend mappings:", error);
                setRows([]);
                setLoading(false);
            });
    }, []);

    const sortedRows = useMemo(() => {
        return [...rows].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [rows, order, orderBy]);

    const handleSelectRow = (opportunityId: string) => {
        performance.mark("row-select-start");
        setSelectedRowsSet((prev) => {
            const updated = new Set(prev);
            if (updated.has(opportunityId)) {
                updated.delete(opportunityId);
            } else {
                updated.add(opportunityId);
            }
            return new Set(updated); // return new instance to trigger state update
        });
    };

    const handleCreateJobs = async () => {
        try {
            const res = await api.post("/buildertrend/create-jobs", {
                opportunityIds: Array.from(selectedRowsSet),
            });
            console.log("Created jobs:", res.data);
            setSelectedRowsSet(new Set()); // Reset after creation
            // Optional: re-fetch data
        } catch (error) {
            console.error("Error creating Buildertrend jobs:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
                Project Management Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        exportToCSV<JobTrackingRow>("project-management-summary", sortedRows, headCells.map(h => ({
                            label: h.label,
                            key: h.id as keyof JobTrackingRow
                        })))
                    }
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                        textTransform: "none",
                        fontSize: "0.75rem",
                        display: {
                            xs: "none", // hide on mobile
                            sm: "inline-flex", // show on tablet and up
                        },
                    }}
                >
                    Export CSV
                </Button>
            </Box>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 1, px: 0 }}>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                    {selectedRowsSet.size} selected
                </Typography>
                <Button
                    onClick={handleCreateJobs}
                    variant="contained"
                    disabled={selectedRowsSet.size === 0}
                    sx={{
                        backgroundColor: "#42de80",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        "&:hover": { backgroundColor: "#3ac06f" },
                    }}
                >
                    Create Job(s) in Buildertrend
                </Button>
            </Toolbar>
            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    padding: "4px",
                    background: "linear-gradient(to bottom right, #121929, #0c111c, #000000)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "100%"
                }}
            >
                <Table sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" />
                            {headCells.map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    size={(cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName') ? "small" : "medium"}
                                    sx={{
                                        color: "#d1d5db",
                                        fontSize: "0.75rem",
                                        textTransform: "uppercase",
                                        padding: "6px",
                                        maxWidth: (cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName') ? "100px" : "150px",
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === cell.id}
                                        direction={orderBy === cell.id ? order : "asc"}
                                        onClick={() => handleRequestSort(cell.id as keyof JobTrackingRow)}
                                        sx={{
                                            color: "#d1d5db",
                                            '&.Mui-active': { color: "white" },
                                            '& .MuiTableSortLabel-icon': { color: "white !important" },
                                            '&:hover': { color: 'white' },
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {cell.label}
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
                            sortedRows.map((row) => (
                                <ProjectRow
                                    key={row.opportunityId}
                                    row={row}
                                    isSelected={selectedRowsSet.has(row.opportunityId)}
                                    onSelect={handleSelectRow}
                                    headCells={headCells}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProjectManagementSummary;
