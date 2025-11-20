'use client';

import {
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

import {
    ReadinessResponse,
    DocumentType,
    ReadinessDetail,
    DOCUMENT_ORDER,
} from "@/types/productionReadiness";
import DocumentAccordion from "./DocumentAccordion";

export interface DocumentsCardProps {
    data: ReadinessResponse;
    onRefresh: () => void;
}

export function DocumentsCard({ data, onRefresh }: DocumentsCardProps) {
    const readiness = data.readiness;
    const documents = data.documents;
    const details = readiness.details;

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                Project Documents Readiness
            </Typography>

            <LinearProgress
                variant="determinate"
                value={readiness.percentage}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {readiness.completed}/{readiness.required.length} required items uploaded
            </Typography>

            {/* DOCUMENT ACCORDIONS */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                }}
            ></Box>
            {readiness.missing.length > 0 && (
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

                    {readiness.missing.map((m: DocumentType) => (
                        <Typography
                            key={m}
                            sx={{ color: "#fecaca", textTransform: "capitalize" }}
                        >
                            • {m.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Typography>
                    ))}
                </Box>
            )}

            {details
                .sort(
                    (a: ReadinessDetail, b: ReadinessDetail) =>
                        DOCUMENT_ORDER.indexOf(a.type) -
                        DOCUMENT_ORDER.indexOf(b.type)
                )
                .map((detail: ReadinessDetail) => (
                    <DocumentAccordion
                        key={detail.type}
                        detail={detail}
                        doc={data.documents[detail.type]}
                        projectNo={data.projectNo}
                        onUploaded={() => fetchReadiness(data.projectNo)}
                    />
                ))}
        </Box>
    );
}
