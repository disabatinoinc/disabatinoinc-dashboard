"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, TableSortLabel,
    CircularProgress, Tooltip, Checkbox, Toolbar,
    Button, ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { useSnackbar } from 'notistack';
import { api } from "@/utils/apiClient";
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

const stageQueryMap: Record<StageDisplayLabel, string> = {
    "Closed Won Signed": "closed-won-signed",
    "Ready to be Scheduled": "ready-to-be-scheduled",
    "Scheduled": "scheduled",
    "Work in Progress": "work-in-progress"
};

const stageOptions = {
    "Closed Won Signed": "Closed Won - Signed",
    "Ready to be Scheduled": "Ready to be Scheduled",
    "Scheduled": "Scheduled",
    "Work in Progress": "Work in Progress"
} as const;

type StageDisplayLabel = keyof typeof stageOptions;

const ProjectManagementDetails = () => {
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
    const [selectedStage, setSelectedStage] = useState<StageDisplayLabel>("Work in Progress");

    const handleRequestSort = (property: keyof JobTrackingRow) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const fetchData = () => {
        setLoading(true);
        const stageParam = stageQueryMap[selectedStage];

        api.get("/salesforce/buildertrend-mappings", {
            params: {
                stage: stageParam,
                page: 1,
                limit: 250,
                skipCache: true
            }
        })
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
    };

    useEffect(() => {
        fetchData();
    }, [selectedStage]);

    const filteredRows = useMemo(() => {
        return rows.filter(row => row.stage === stageOptions[selectedStage]);
    }, [rows, selectedStage]);

    const sortedRows = useMemo(() => {
        return [...filteredRows].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
            if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredRows, order, orderBy]);

    const handleSelectRow = (opportunityId: string) => {
        setSelectedRowsSet((prev) => {
            const updated = new Set(prev);
            if (updated.has(opportunityId)) {
                updated.delete(opportunityId);
            } else {
                updated.add(opportunityId);
            }
            return new Set(updated);
        });
    };

    const handleSelectAll = () => {
        const unmappedRows = sortedRows.filter(row => !row.jobMapped);
        const allUnmappedIds = unmappedRows.map(row => row.opportunityId);
        if (allUnmappedIds.every(id => selectedRowsSet.has(id))) {
            setSelectedRowsSet(new Set());
        } else {
            setSelectedRowsSet(new Set(allUnmappedIds));
        }
    };

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleCreateJobs = async () => {
        const selectedIds = Array.from(selectedRowsSet);
        if (selectedIds.length === 0) return;

        try {
            const res = await api.post("/buildertrend/create-jobs", { opportunityIds: selectedIds });
            const { successful, errors } = res.data;

            if (successful.length > 0) {
                enqueueSnackbar(`${successful.length} job${successful.length > 1 ? 's' : ''} created successfully.`, { variant: 'success' });
            }

            if (errors.length > 0) {
                const messageLines = errors.map((err: { opportunityId: string; message: string }) =>
                    `• ${err.opportunityId}: ${err.message}`
                );

                enqueueSnackbar(`Errors occurred for ${errors.length} job(s):\n${messageLines.join('\n')}`, {
                    variant: 'error',
                    persist: true,
                    action: (key) => (
                        <Button onClick={() => closeSnackbar(key)} sx={{ color: 'white', fontSize: '0.75rem' }}>
                            Dismiss
                        </Button>
                    )
                });
            }

            setSelectedRowsSet(new Set());
            const refetch = await api.get("/salesforce/buildertrend-mappings");
            setRows(refetch.data);
        } catch (error) {
            console.error("Error creating Buildertrend jobs:", error);
            enqueueSnackbar("Unexpected error creating Buildertrend jobs.", { variant: 'error' });
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: "white" }}>
                    Project Management Details
                </Typography>
            </Box>

            <Typography variant="body2" sx={{ marginBottom: 2, color: "#9ca3af" }}>
                {`In the "${selectedStage}" stage, ${filteredRows.length} job${filteredRows.length !== 1 ? 's are' : ' is'} active — 
                        ${filteredRows.filter(row => row.jobMapped).length} ${filteredRows.filter(row => row.jobMapped).length === 1 ? 'is' : 'are'} synced to Buildertrend 
                        (${filteredRows.length > 0
                        ? Math.round((filteredRows.filter(row => row.jobMapped).length / filteredRows.length) * 100)
                        : 0}%).`}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <ToggleButtonGroup
                    value={selectedStage}
                    exclusive
                    onChange={(_, value) => value && setSelectedStage(value)}
                    sx={{
                        backgroundColor: '#121929',
                        borderRadius: "12px",
                        border: "1px solid #374151"
                    }}
                >
                    {Object.keys(stageOptions).map((label) => (
                        <ToggleButton
                            key={label}
                            value={label}
                            sx={{
                                color: '#d1d5db',
                                borderRadius: "12px",
                                fontSize: '0.75rem',
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
                                    color: 'white'
                                }
                            }}
                        >
                            {label}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                        textTransform: "none",
                        fontSize: "0.75rem",
                        display: {
                            xs: "none",
                            sm: "inline-flex",
                        },
                    }}
                >
                    Refresh
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                        exportToCSV<JobTrackingRow>("project-management-summary", sortedRows, headCells.map(h => ({
                            label: h.label,
                            key: h.id
                        })))
                    }
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                        textTransform: "none",
                        fontSize: "0.75rem",
                        display: {
                            xs: "none",
                            sm: "inline-flex",
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
                <Box>
                    <Button
                        onClick={() => setSelectedRowsSet(new Set())}
                        disabled={selectedRowsSet.size === 0}
                        variant="outlined"
                        sx={{
                            color: "#d1d5db",
                            borderColor: "#374151",
                            fontSize: "0.75rem",
                            textTransform: "none",
                            mr: 1
                        }}
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={handleCreateJobs}
                        variant="contained"
                        disabled={selectedRowsSet.size === 0}
                        sx={{
                            backgroundColor: "#42de80",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            "&:hover": {
                                backgroundColor: "#3ac06f",
                                outline: "white"
                            },
                            borderColor: "#374151",
                        }}
                    >
                        Create ({selectedRowsSet.size}) Job{selectedRowsSet.size === 1 ? "" : "s"} in Buildertrend
                    </Button>
                </Box>
            </Toolbar>

            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    padding: "0px 4px 4px 4px",
                    background: "linear-gradient(to bottom right, #121929, #0c111c, #000000)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    maxHeight: "800px",
                    overflowY: "auto"
                }}
            >
                <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" sx={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                                backgroundColor: '#121929'
                            }}>
                                <Tooltip title="Select All" arrow>
                                    <Checkbox
                                        checked={
                                            sortedRows.filter(row => !row.jobMapped)
                                                .every(row => selectedRowsSet.has(row.opportunityId)) &&
                                            sortedRows.some(row => !row.jobMapped)
                                        }
                                        indeterminate={
                                            sortedRows.some(row => !row.jobMapped && selectedRowsSet.has(row.opportunityId)) &&
                                            !sortedRows.filter(row => !row.jobMapped)
                                                .every(row => selectedRowsSet.has(row.opportunityId))
                                        }
                                        onChange={handleSelectAll}
                                        sx={{ color: "#9ca3af" }}
                                        disableRipple
                                    />
                                </Tooltip>
                            </TableCell>
                            {headCells.map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    size={(cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName' && cell.id !== 'projectManager') ? "small" : "medium"}
                                    sx={{
                                        color: "#d1d5db",
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        backgroundColor: '#121929',
                                        fontSize: "0.75rem",
                                        textTransform: "uppercase",
                                        padding: "6px",
                                        width: (cell.id !== 'opportunityName' && cell.id !== 'buildertrendJobName' && cell.id !== 'projectManager') ? "75px" : "120px",
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === cell.id}
                                        direction={orderBy === cell.id ? order : "asc"}
                                        onClick={() => handleRequestSort(cell.id)}
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
                                            maxWidth: "100%",
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
                                <TableCell colSpan={headCells.length + 1} align="center">
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

export default ProjectManagementDetails;
