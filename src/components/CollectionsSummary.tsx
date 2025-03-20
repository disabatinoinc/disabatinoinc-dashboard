"use client"

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TableSortLabel, Tooltip, ToggleButtonGroup, ToggleButton, Divider, Skeleton, CircularProgress } from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { CollectionSummary } from "@/types/CollectionSummary";
import api from "@/utils/apiClient";

const sampleData: CollectionSummary[] = [
    {
        opportunityName: "Pennock, Brett Residence-Pool Deck 2022 - v.3 - v.4",
        projectNumber: "S-005616",
        stageName: "Work in Progress",
        jobState: "PA",
        projectManager: "Vinny Esposito",
        originalOpportunityAmount: 28563,
        changeRequestAmount: -789,
        totalOpportunityAmount: 27774,
        totalBilled: 1976,
        totalPaid: 0,
        billedOutstanding: 1976,
        totalOppOutstanding: 27774,
        nextBillingMilestone: "Initial",
    },
    {
        opportunityName: "Boesen, Joshua Residence- Pool 2024 - v.3",
        projectNumber: "S-006230",
        stageName: "Work in Progress",
        jobState: "PA",
        projectManager: "Vinny Esposito",
        originalOpportunityAmount: 139218,
        changeRequestAmount: 13420,
        totalOpportunityAmount: 152638,
        totalBilled: 64537,
        totalPaid: 64537,
        billedOutstanding: 0,
        totalOppOutstanding: 88101,
        nextBillingMilestone: "Initial",
    },
];

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
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState<keyof CollectionSummary>("opportunityName");

    const handleRequestSort = (property: keyof CollectionSummary) => {
        const isAscending = orderBy === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderBy(property);
    };

    const milestoneOrder = ["Initial", "Scheduling", "First Day", "Milestone", "Final", "Punch List"];

    const [projects, setProjects] = useState<CollectionSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/collections/summary/work-in-progress")
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
    }, []);

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
                    value="Work in Progress"
                    exclusive
                    sx={{ backgroundColor: '#121929', borderRadius: "12px", border: "1px solid #374151" }}
                >
                    <ToggleButton value="Closed Won Signed" sx={{ color: '#d1d5db', borderRadius: "12px", fontSize: '0.75rem', '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.1) !important', color: 'white' } }}>Closed Won Signed</ToggleButton>
                    <ToggleButton value="Ready to be Scheduled" sx={{ color: '#d1d5db', borderRadius: "12px", fontSize: '0.75rem', '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.1) !important', color: 'white' } }}>Ready to be Scheduled</ToggleButton>
                    <ToggleButton value="Scheduled" sx={{ color: '#d1d5db', borderRadius: "12px", fontSize: '0.75rem', '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.1) !important', color: 'white' } }}>Scheduled</ToggleButton>
                    <ToggleButton value="Work in Progress" sx={{ color: '#d1d5db', borderRadius: "12px", fontSize: '0.75rem', '&.Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.1) !important', color: 'white' } }}>Work in Progress</ToggleButton>
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
                        {loading ? (
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
