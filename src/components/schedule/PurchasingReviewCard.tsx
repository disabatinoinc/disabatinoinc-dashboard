'use client';

import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CheckCircle, XCircle } from "lucide-react";

import { ProjectReviewStatusResponse } from "@/types/productionReadiness";

interface PurchasingReviewCardProps {
    review: ProjectReviewStatusResponse["purchasingReview"];
}

export function PurchasingReviewCard({
    review
}: PurchasingReviewCardProps) {
    const isDone = review.reviewed;

    const statusIcon = isDone
        ? <CheckCircle color="rgb(34,197,94)" size={22} />
        : <XCircle color="rgb(239,68,68)" size={22} />;

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {statusIcon}
                <Typography variant="h5">Purchasing Review</Typography>
            </Box>

            <LinearProgress
                variant="determinate"
                value={isDone ? 100 : 0}
                sx={{ height: 10, borderRadius: 2, mt: 1, mb: 1 }}
            />

            <Typography sx={{ color: "#9ca3af", mb: 2 }}>
                {isDone
                    ? `Completed on ${review.reviewDate ?? "Unknown date"}`
                    : "Review not completed"}
            </Typography>

            <Accordion sx={{ background: "#0f172a", color: "#e5e7eb", mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#e5e7eb" }} />}>
                    <Typography sx={{ fontWeight: 600 }}>Review Details</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <Row label="Selections Required" value={review.selectionsRequired} />

                    {review.selectionsRequired && (
                        <Row
                            label="Selections Completed"
                            value={review.selectionsDate !== null}
                        />
                    )}
                </AccordionDetails>
            </Accordion>

        </Box>
    );
}

function Row({ label, value }: { label: string; value: boolean }) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>{label}</Typography>
            <Chip
                label={value ? "Yes" : "No"}
                color={value ? "success" : "default"}
                size="small"
            />
        </Box>
    );
}
