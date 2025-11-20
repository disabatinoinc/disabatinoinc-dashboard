'use client';

import {
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
    Chip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

import {
    ProductionNotesResponse,
    ProductionNotesSection,
    ProductionNotesField
} from "@/types/productionReadiness";

export interface ProductionNotesCardProps {
    data: ProductionNotesResponse;
}

export function ProductionNotesCard({ data }: ProductionNotesCardProps) {
    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                Production Notes Readiness
            </Typography>

            <LinearProgress
                variant="determinate"
                value={data.completionPercentage}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {data.missingRequiredFields.length === 0
                    ? "All required items completed"
                    : `${data.missingRequiredFields.length} required items missing`}
            </Typography>

            {/* Missing Required Fields */}
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

            {/* Render Sections */}
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
