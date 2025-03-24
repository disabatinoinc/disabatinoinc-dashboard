"use client"

import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, TableSortLabel, Tooltip,
    ToggleButtonGroup, ToggleButton, CircularProgress
} from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { CollectionSummary } from "@/types/CollectionSummary";
import api from "@/utils/apiClient";

const headCells: { id: keyof CollectionSummary; label: string }[] = [
    { id: "opportunityName", label: "Opportunity Name" },
    { id: "projectNumber", label: "Project" },
    { id: "projectManager", label: "Project Manager" },
    { id: "totalBilled", label: "Billed" },
    { id: "totalPaid", label: "Paid" },
    { id: "billedOutstanding", label: "Billed Outstanding" },
    { id: "nextBillingMilestone", label: "Next Milestone" },
    { id: "totalOpportunityAmount", label: "Total Opportunity" },
    { id: "totalOppOutstanding", label: "Opportunity Outstanding" },
];

const CollectionsSummary = () => {
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState<keyof CollectionSummary>("opportunityName");
    const [sorting, setSorting] = useState(false);

    const handleRequestSort = (property: keyof CollectionSummary) => {
        setSorting(true);
        const isAscending = orderBy === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderBy(property);

        // Simulate delay to reflect actual processing time
        setTimeout(() => {
            setSorting(false);
        }, 500); // Adjust this duration if needed
    };

    const milestoneOrder = ["Initial", "Scheduling", "First Day", "Milestone", "Final", "Punch List"];

    const [projects, setProjects] = useState<CollectionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStage, setSelectedStage] = useState("Work in Progress");

    const stageToEndpoint: Record<string, string> = {
        "Closed Won Signed": "closed-won-signed",
        "Ready to be Scheduled": "ready-to-be-scheduled",
        "Scheduled": "scheduled",
        "Work in Progress": "work-in-progress",
    };

    useEffect(() => {
        const endpoint = stageToEndpoint[selectedStage];
        if (!endpoint) return;

        setLoading(true);

        api.get(`/collections/summary/${endpoint}`)
            .then((response) => {
                const data = response.data;
                if (Array.isArray(data)) {
                    setProjects(data);
                } else if (data && Array.isArray(data.data)) {
                    setProjects(data.data);
                } else {
                    console.error("Unexpected API response:", data);
                    setProjects([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [selectedStage]);


    const sortedData = [...projects].sort((a, b) => {
        if (orderBy === "nextBillingMilestone") {
            return order === "asc"
                ? milestoneOrder.indexOf(a[orderBy]) - milestoneOrder.indexOf(b[orderBy])
                : milestoneOrder.indexOf(b[orderBy]) - milestoneOrder.indexOf(a[orderBy]);
        }
        if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
        if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white" }}>Collections Summary</Typography>
            <Typography variant="body2" sx={{ marginBottom: 2, color: "#9ca3af" }}>
                {`Displaying ${projects.length} opportunities totaling 
                $${projects.reduce((sum, item) => sum + item.totalOpportunityAmount, 0).toLocaleString()} 
                in opportunity amounts, $${projects.reduce((sum, item) => sum + item.billedOutstanding, 0).toLocaleString()} 
                in billed outstanding, and $${projects.reduce((sum, item) => sum + item.totalOppOutstanding, 0).toLocaleString()} 
                in opportunity outstanding.`}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                    value={selectedStage}
                    exclusive
                    onChange={(_, value) => {
                        if (value !== null) {
                            setSelectedStage(value);
                        }
                    }}
                    sx={{ backgroundColor: '#121929', borderRadius: "12px", border: "1px solid #374151" }}
                >
                    {Object.keys(stageToEndpoint).map((label) => (
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
            <TableContainer
                component={Paper}
                sx={{
                    marginTop: 2,
                    padding: 2,
                    background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                    border: "1px solid #374151",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "100%"
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
                                        textTransform: "uppercase",
                                        padding: '4px',
                                        width: headCell.id !== 'opportunityName' ? "75px" : "120px",

                                    }}
                                >
                                    <TableSortLabel
                                        sx={
                                            {
                                                color: '#d1d5db',
                                                '&.Mui-active': { color: 'white' },
                                                '& .MuiTableSortLabel-icon': { color: 'white !important' },
                                                '&:hover': { color: 'white' }
                                            }}
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? (order as 'asc' | 'desc') : 'asc'}
                                        onClick={() => handleRequestSort(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(loading || sorting) ? (
                            <TableRow>
                                <TableCell colSpan={headCells.length} align="center">
                                    <CircularProgress color="inherit" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData.map((row, index) => (
                                <TableRow key={index} sx={{
                                    borderTop: "1px solid #374151",
                                    borderBottom: "1px solid #374151",
                                    cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                }} onClick={() => console.log('Row clicked:', row)}>
                                    {headCells.map((headCell) => (
                                        <TableCell key={headCell.id} sx={{
                                            borderTop: "none",
                                            borderBottom: "none",
                                            width: headCell.id !== 'opportunityName' ? "75px" : "120px",
                                            color: headCell.id === 'totalPaid' || headCell.id === 'totalOpportunityAmount' ? '#42de80' : '#d1d5db',
                                            paddingLeft: '4px',
                                            fontSize: '0.75rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }} >
                                            <Tooltip title={row[headCell.id]} arrow>
                                                <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {typeof row[headCell.id] === "number" ? formatCurrency(row[headCell.id] as number) : row[headCell.id]}
                                                </Box>
                                            </Tooltip>
                                            {/* {typeof row[headCell.id] === "number" ? formatCurrency(row[headCell.id] as number) : row[headCell.id]} */}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CollectionsSummary;
