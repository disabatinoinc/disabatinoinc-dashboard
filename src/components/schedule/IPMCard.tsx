'use client';

import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, LinearProgress, Chip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import { ProjectReviewStatusResponse } from "@/types/productionReadiness";

interface IPMCardProps {
    review: ProjectReviewStatusResponse;
}

export function IPMCard({ review }: IPMCardProps) {
    const ipmNeeded = review.productionReview.ipmNeeded;
    const ipmScheduled = !!review.productionReview.ipmDate;

    // Completion rules
    const isDone = !ipmNeeded || ipmScheduled;

    const statusIcon = isDone
        ? <CheckCircle color="rgb(34,197,94)" size={22} />
        : <XCircle color="rgb(239,68,68)" size={22} />;

    const completionPct = isDone ? 100 : 0;

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                {statusIcon}
                <Typography variant="h5" sx={{ ml: 1 }}>IPM</Typography>
            </Box>

            {/* Progress */}
            <LinearProgress
                variant="determinate"
                value={completionPct}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {isDone
                    ? ipmNeeded
                        ? "IPM scheduled"
                        : "IPM not required"
                    : "IPM required — not scheduled"
                }
            </Typography>

            {/* Card */}
            <Accordion sx={{ background: "#0f172a", color: "#e5e7eb" }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#e5e7eb" }} />}>
                    <Typography sx={{ fontWeight: 600 }}>IPM Details</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography>IPM Needed</Typography>
                        <Chip label={ipmNeeded ? "Yes" : "No"} color={ipmNeeded ? "success" : "default"} size="small" />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography>IPM Scheduled</Typography>
                        <Chip label={ipmScheduled ? "Yes" : "No"} color={ipmScheduled ? "success" : "error"} size="small" />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>IPM Date</Typography>
                        <Typography>{review.productionReview.ipmDate ? new Date(review.productionReview.ipmDate).toLocaleDateString() : "—"}</Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
