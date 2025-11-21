'use client';

import {
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ExternalLink, CheckCircle, XCircle, Circle } from "lucide-react";
import React from "react";

import {
    ProductionNotesResponse,
    ProductionNotesSection,
    ProductionNotesField
} from "@/types/productionReadiness";

export interface ProductionNotesCardProps {
    data: ProductionNotesResponse;
    salesforceLink: string;   // ← NEW PROP
}

export function ProductionNotesCard({ data, salesforceLink }: ProductionNotesCardProps) {
    const isRequired = true;
    const isDone = data.missingRequiredFields.length === 0;

    let statusIcon;
    if (isDone && isRequired) {
        statusIcon = <CheckCircle color="rgb(34,197,94)" size={22} />;
    } else if (!isDone && isRequired) {
        statusIcon = <XCircle color="rgb(239,68,68)" size={22} />;
    } else {
        statusIcon = <Circle color="#475569" size={18} />;
    }

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>

            {/* HEADER WITH SF LINK ON RIGHT */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}
            >
                {/* LEFT SIDE: Status Icon + Title */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 1 }}>{statusIcon}</Box>
                    <Typography variant="h5">Production Notes</Typography>
                </Box>

                {/* RIGHT SIDE: ACTION ICONS */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Open in Salesforce">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(salesforceLink, "_blank");
                            }}
                            sx={{
                                color: "#60A5FA",
                                "&:hover": { color: "#93C5FD" }
                            }}
                        >
                            <ExternalLink size={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={data.completionPercentage}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {isDone
                    ? "All required items completed"
                    : `${data.missingRequiredFields.length} required items missing`}
            </Typography>

            {/* Missing Required Items */}
            {data.missingRequiredFields.length > 0 && (
                <Box
                    sx={{
                        background: "rgba(127,29,29,0.35)",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        border: "1px solid #b91c1c"
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1, color: "#fca5a5" }}>
                        Missing Required Items
                    </Typography>

                    {data.missingRequiredFields.map((item) => (
                        <Typography
                            key={item}
                            sx={{ color: "#fecaca", textTransform: "capitalize" }}
                        >
                            • {item}
                        </Typography>
                    ))}
                </Box>
            )}

            {/* Sections */}
            {data.sections.map((section: ProductionNotesSection) => (
                <Accordion
                    key={section.label}
                    sx={{ background: "#0f172a", color: "#e5e7eb", mb: 1 }}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#e5e7eb" }} />}>
                        <Typography sx={{ fontWeight: 600 }}>{section.label}</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        {section.fields.map((f: ProductionNotesField) => (
                            <Box
                                key={f.label}
                                sx={{
                                    mb: 1,
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography>{f.label}</Typography>
                                {f.isComplete ? (
                                    <Chip label="Done" color="success" size="small" />
                                ) : (
                                    <Chip label="Missing" color="error" size="small" />
                                )}
                            </Box>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}
