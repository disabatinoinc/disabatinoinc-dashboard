'use client';

import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    IconButton,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExternalLink, FolderOpen } from "lucide-react";
import { useState } from "react";

function CopyBlock({ label, value }: { label: string; value?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (value) {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {label}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#1f2937",
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                    border: "1px solid #374151",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ color: "white", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {value || "—"}
                </Typography>

                <Tooltip title={copied ? "Copied" : "Copy"} arrow>
                    <IconButton size="small" onClick={handleCopy} sx={{ color: "#9ca3af" }}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

type ProjectSummaryProps = {
    projectNo: string;
    opportunityName: string;
    ownerName: string;
    ownerEmail: string;
    salesAssistantName: string;
    salesAssistantEmail: string;
    projectManagerName: string;
    projectManagerEmail: string;
    division: string;
    jobAddress: string;
    salesforceLink: string;
    oneDriveLink: string;
};

export default function ProjectSummaryCard(props: ProjectSummaryProps) {
    const {
        projectNo,
        opportunityName,
        division,
        ownerName,
        ownerEmail,
        salesAssistantName,
        salesAssistantEmail,
        projectManagerName,
        projectManagerEmail,
        jobAddress,
        salesforceLink,
        oneDriveLink,
    } = props;

    return (
        <Accordion
            disableGutters
            sx={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: 3,
                minWidth: "1200px",
                color: "white",
                "&:before": { display: "none" },
                overflow: "hidden",
            }}
        >
            {/* SUMMARY BAR */}
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8" }} />}
                sx={{
                    backgroundColor: "#111827",
                    "& .MuiAccordionSummary-content": {
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        width: "100%",
                    },
                }}
            >
                <Typography variant="h6" sx={{ color: "white" }}>
                    Project Summary
                </Typography>

                <Typography variant="body2" sx={{ opacity: 0.65 }}>
                    ({opportunityName})
                </Typography>

                {/* push buttons to right */}
                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Open in Salesforce">
                        <IconButton
                            onClick={() => window.open(salesforceLink, "_blank")}
                            sx={{
                                color: "#60A5FA",
                                "&:hover": { color: "#93C5FD" }
                            }}
                        >
                            <ExternalLink size={20} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Open in OneDrive">
                        <IconButton
                            onClick={() => window.open(oneDriveLink, "_blank")}
                            sx={{
                                color: "#FACC15",
                                "&:hover": { color: "#FDE047" }
                            }}
                        >
                            <FolderOpen size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </AccordionSummary>

            {/* DETAILS */}
            <AccordionDetails sx={{ p: 3 }}>
                <Card sx={{ background: "transparent", boxShadow: "none" }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Top Basic Project Info */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <CopyBlock label="Project Number" value={projectNo} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CopyBlock label="Opportunity Name" value={opportunityName} />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <CopyBlock label="Division" value={division} />
                            </Grid>
                        </Grid>

                        {/* Address */}
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CopyBlock label="Job Address" value={jobAddress} />
                            </Grid>
                        </Grid>

                        <Typography variant="subtitle1" sx={{ color: "#d1d5db", mt: 1 }}>
                            Team Contacts
                        </Typography>

                        {/* Owner / SA / PM */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <CopyBlock label="Owner" value={ownerName} />
                                <Box mt={1}>
                                    <CopyBlock label="Owner Email" value={ownerEmail} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <CopyBlock label="Sales Assistant" value={salesAssistantName} />
                                <Box mt={1}>
                                    <CopyBlock label="Sales Assistant Email" value={salesAssistantEmail} />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <CopyBlock label="Project Manager" value={projectManagerName} />
                                <Box mt={1}>
                                    <CopyBlock label="PM Email" value={projectManagerEmail} />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </AccordionDetails>
        </Accordion>
    );
}
