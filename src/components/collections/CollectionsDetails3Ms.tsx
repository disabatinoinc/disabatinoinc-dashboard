"use client"

import React, { useEffect, useMemo, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Typography, Box, TableSortLabel, Tooltip,
    ToggleButtonGroup, ToggleButton, CircularProgress, Button,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
} from "@mui/material";
import { formatCurrency } from "@/utils/formatters";
import { CollectionSummary } from "@/types/CollectionSummary";
import { api } from "@/utils/apiClient";
import { exportToCSV } from "@/utils/exportCSV";
import PunchListModal from "./PunchListModal";


const headCells: { id: keyof CollectionSummary | "dynamicDate"; label: string }[] = [
    { id: "opportunityName", label: "Opportunity Name" },
    { id: "projectNumber", label: "Project" },
    { id: "projectManager", label: "Project Manager" },
    { id: "totalBilled", label: "Billed" },
    { id: "totalPaid", label: "Paid" },
    { id: "billedOutstanding", label: "Billed Outstanding" },
    { id: "nextBillingMilestone", label: "Next Milestone" },
    { id: "dynamicDate", label: "Key Date" }, // now valid
    { id: "totalOpportunityAmount", label: "Total Opportunity" },
    { id: "totalOppOutstanding", label: "Opportunity Outstanding" },
];

type ExportRow = CollectionSummary & { dynamicDate?: string };

const ProjectsCollectionsDetails = () => {
    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState<keyof CollectionSummary | "dynamicDate">("opportunityName");
    const [sorting, setSorting] = useState(false);
    const [openPunchListModal, setOpenPunchListModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<CollectionSummary | null>(null);
    const [managerFilter, setManagerFilter] = useState<string>("");
    const [projects, setProjects] = useState<CollectionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStage, setSelectedStage] = useState("Work in Progress");

    const getDynamicDate = (row: CollectionSummary) => {
        if (selectedStage === "Closed Won Signed" || selectedStage === "Ready to be Scheduled") {
            return row.closedWonSignedDate;
        } else if (selectedStage === "Scheduled") {
            return row.tentativeStartDate;
        } else if (selectedStage === "Work in Progress") {
            return row.workInProgressDate;
        }
        return null;
    };

    // extract distinct PMs
    const uniqueManagers = useMemo(() => {
        const s = new Set<string>();
        projects.forEach(p => { if (p.projectManager) s.add(p.projectManager); });
        return Array.from(s).sort();
    }, [projects]);

    // apply PM filter before sorting
    const displayedProjects = useMemo(() => {
        return managerFilter
            ? projects.filter(p => p.projectManager === managerFilter)
            : projects;
    }, [projects, managerFilter]);

    const handleRequestSort = (property: keyof CollectionSummary | "dynamicDate") => {
        setSorting(true);
        const isAscending = orderBy === property && order === "asc";
        setOrder(isAscending ? "desc" : "asc");
        setOrderBy(property);
        setTimeout(() => setSorting(false), 500);
    };


    const milestoneOrder = ["Initial", "Scheduling", "First Day", "Milestone", "Final", "Punch List"];

    const stageToEndpoint = useMemo<Record<string, string>>(() => ({
        "Closed Won Signed": "closed-won-signed",
        "Ready to be Scheduled": "ready-to-be-scheduled",
        "Scheduled": "scheduled",
        "Work in Progress": "work-in-progress",
    }), []);

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
    }, [selectedStage, stageToEndpoint]);



    const sortedData = useMemo(() => {
        return [...displayedProjects].sort((a, b) => {
            let aVal: any, bVal: any;

            if (orderBy === "dynamicDate") {
                aVal = getDynamicDate(a) ? new Date(getDynamicDate(a)!).getTime() : -Infinity;
                bVal = getDynamicDate(b) ? new Date(getDynamicDate(b)!).getTime() : -Infinity;
            } else if (orderBy === "nextBillingMilestone") {
                aVal = a.nextBillingMilestone || "";
                bVal = b.nextBillingMilestone || "";
                const iA = milestoneOrder.indexOf(aVal);
                const iB = milestoneOrder.indexOf(bVal);
                return order === "asc" ? iA - iB : iB - iA;
            } else {
                aVal = a[orderBy] ?? "";
                bVal = b[orderBy] ?? "";
            }

            if (aVal < bVal) return order === "asc" ? -1 : 1;
            if (aVal > bVal) return order === "asc" ? 1 : -1;
            return 0;
        });
    }, [displayedProjects, order, orderBy, selectedStage]);

    const refetchCollectionsSummary = async () => {
        const endpoint = stageToEndpoint[selectedStage];
        if (!endpoint) return;

        try {
            setLoading(true);
            const response = await api.get(`/collections/summary/${endpoint}?skipCache=true`); // 🆕 Force fresh fetch
            const data = response.data;

            if (Array.isArray(data)) {
                setProjects(data);
            } else if (data && Array.isArray(data.data)) {
                setProjects(data.data);
            } else {
                console.error("Unexpected API response:", data);
                setProjects([]);
            }
        } catch (error) {
            console.error("Error refetching collections summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const getHeadCells = (): { id: keyof CollectionSummary | "dynamicDate"; label: string }[] => {
        let dynamicLabel = "Key Date";
        if (selectedStage === "Closed Won Signed" || selectedStage === "Ready to be Scheduled") {
            dynamicLabel = "Closed Won Signed Date";
        } else if (selectedStage === "Scheduled") {
            dynamicLabel = "Scheduled Start Date";
        } else if (selectedStage === "Work in Progress") {
            dynamicLabel = "Work In Progress Date";
        }

        return [
            { id: "opportunityName", label: "Opportunity Name" },
            { id: "projectNumber", label: "Project" },
            { id: "projectManager", label: "Project Manager" },
            { id: "totalBilled", label: "Billed" },
            { id: "totalPaid", label: "Paid" },
            { id: "billedOutstanding", label: "Billed Outstanding" },
            { id: "nextBillingMilestone", label: "Next Milestone" },
            { id: "dynamicDate", label: dynamicLabel },
            { id: "totalOpportunityAmount", label: "Total Opportunity" },
            { id: "totalOppOutstanding", label: "Opportunity Outstanding" },
        ];
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white" }}>3Ms Collections Details</Typography>
            <Typography variant="body2" sx={{ marginBottom: 2, color: "#9ca3af" }}>
                {`Displaying ${projects.length} opportunities totaling 
                $${projects.reduce((sum, item) => sum + item.totalOpportunityAmount, 0).toLocaleString()} 
                in opportunity amounts, $${projects.reduce((sum, item) => sum + item.billedOutstanding, 0).toLocaleString()} 
                in billed outstanding, and $${projects.reduce((sum, item) => sum + item.totalOppOutstanding, 0).toLocaleString()} 
                in opportunity outstanding.`}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1 }}>
                {/* ← Project Manager filter */}
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: "#9ca3af" }}>Project Manager</InputLabel>
                    <Select
                        value={managerFilter}
                        onChange={e => setManagerFilter(e.target.value)}
                        input={<OutlinedInput label="Project Manager" />}
                        sx={{
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#374151" },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#6b7280" }
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {uniqueManagers.map(pm => (
                            <MenuItem key={pm} value={pm}>{pm}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={refetchCollectionsSummary}
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
                    onClick={() => {
                        const exportRows: ExportRow[] = sortedData.map((row) => ({
                            ...row,
                            dynamicDate: getDynamicDate(row) || "",
                        }));

                        exportToCSV<ExportRow>(
                            "collections-summary",
                            exportRows,
                            getHeadCells().map((h) => ({
                                label: h.label,
                                key: h.id as keyof ExportRow,
                            }))
                        );
                    }}
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
                    maxHeight: "800px", // 👈 LIMIT HEIGHT
                    overflowY: "auto"
                }}
            >
                <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            {getHeadCells().map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    size={headCell.id !== 'opportunityName' ? "small" : "medium"}
                                    sx={{
                                        color: "#d1d5db",
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 10,
                                        backgroundColor: '#121929',
                                        textTransform: "uppercase",
                                        padding: '4px',
                                        width: headCell.id !== 'opportunityName' ? "100px" : "150px",
                                        textOverflow: 'ellipsis',
                                        fontSize: '0.75rem'

                                    }}
                                >
                                    <TableSortLabel
                                        sx={
                                            {
                                                color: '#d1d5db',
                                                '&.Mui-active': { color: 'white' },
                                                "& .MuiTableSortLabel-icon": {
                                                    color: "white !important",
                                                    // "@media (max-width:600px)": {
                                                    //     display: "none",
                                                    // },
                                                },
                                                '&:hover': { color: 'white' },
                                                // 👇 Apply flexbox layout
                                                display: "flex",
                                                flexDirection: {
                                                    xs: "column", // stack text & icon vertically on mobile
                                                    sm: "row",    // default horizontal layout on larger screens
                                                },
                                                alignItems: "center", // center icon under label
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: "100%",
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
                                    {getHeadCells().map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            size={headCell.id !== 'opportunityName' ? "small" : "medium"}
                                            sx={{
                                                borderTop: "none",
                                                borderBottom: "none",
                                                width: headCell.id !== 'opportunityName' ? "75px" : "120px",
                                                color: headCell.id === 'totalPaid' || headCell.id === 'totalOpportunityAmount' ? '#42de80' : '#d1d5db',
                                                paddingLeft: '4px',
                                                fontSize: '0.75rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Tooltip title={String(headCell.id === "dynamicDate" ? getDynamicDate(row) : row[headCell.id] ?? "")} arrow>
                                                <Box>
                                                    {headCell.id === "dynamicDate" ? (
                                                        (() => {
                                                            const dynamicDate = getDynamicDate(row);
                                                            return dynamicDate ? new Date(dynamicDate).toLocaleDateString() : null;
                                                        })()
                                                    ) : headCell.id === "nextBillingMilestone" && ["Final", "Punch List"].includes(row[headCell.id] as string) ? (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedProject(row);
                                                                setOpenPunchListModal(true);
                                                            }}
                                                            sx={{
                                                                textTransform: "none",
                                                                color: row.hasPunchList ? "#3b82f6" : "#d1d5db",
                                                                textDecoration: "underline",
                                                                fontSize: '0.75rem',
                                                                padding: 0
                                                            }}
                                                        >
                                                            {row[headCell.id]}
                                                        </Button>
                                                    ) : headCell.id === "opportunityName" ? (
                                                        <a
                                                            href={`https://d41000000gobkeao.lightning.force.com/lightning/r/Opportunity/${row.opportunityId}/view`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            style={{
                                                                color: "#3b82f6",
                                                                textDecoration: "underline",
                                                                fontSize: "0.75rem"
                                                            }}
                                                        >
                                                            {row[headCell.id]}
                                                        </a>
                                                    ) : (
                                                        typeof row[headCell.id] === "number"
                                                            ? formatCurrency(row[headCell.id] as number)
                                                            : row[headCell.id]
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <PunchListModal
                open={openPunchListModal}
                onClose={() => setOpenPunchListModal(false)}
                project={selectedProject}
                onRefetch={refetchCollectionsSummary}
            />
        </Box>
    );
};

export default ProjectsCollectionsDetails;
