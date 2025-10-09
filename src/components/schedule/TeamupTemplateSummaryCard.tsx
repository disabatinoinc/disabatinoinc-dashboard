'use client';

import { Card, CardContent } from "@mui/material";
import { Typography, Box, IconButton, Tooltip, Grid, Divider } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { TeamupTemplateSummary } from "@/types/TeamupTemplate";

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
                    <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{ color: "#9ca3af" }}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

export default function TeamupTemplateSummaryCard({ data }: { data: TeamupTemplateSummary }) {
    const { projectNumber, /* opportunityId, */ opportunityName, summary, owner, projectManager, jobAddress } = data;


    return (
        <Card sx={{ backgroundColor: "#111827", border: "1px solid #374151", color: "white", mt: 4, minWidth: "1200px" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h5" sx={{ color: "white" }}>
                    Project Summary
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <CopyBlock label="Opportunity Name" value={opportunityName} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <CopyBlock label="Project Number" value={projectNumber} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <CopyBlock label="Zip Code" value={summary?.zip} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <CopyBlock label="Total Hours" value={summary?.totalHours?.toString()} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2, borderColor: "#374151" }} />
                <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>Sales Rep & Project Manager</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Sales Rep" value={owner?.fullName} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Sales Rep Initials" value={owner?.initials} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Project Manager" value={projectManager?.fullName} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="PM Initials" value={projectManager?.initials} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2, borderColor: "#374151" }} />
                <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>Job Address</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Job Street" value={jobAddress?.street} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Job City" value={jobAddress?.city} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Job State" value={jobAddress?.state} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Job Zip" value={jobAddress?.postalCode} />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
