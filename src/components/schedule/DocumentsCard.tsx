'use client';

import {
    Typography,
    Box,
    LinearProgress,
} from "@mui/material";
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

const PRE_IPM_REQUIRED: DocumentType[] = [
    "signedContract",
    "photos",
    "designsRenders"
];


export function DocumentsCard({ data }: DocumentsCardProps) {
    const readiness = data.readiness;
    const details = readiness.details;
    const preIpmDetails = details.map((d) => ({
        ...d,
        required: PRE_IPM_REQUIRED.includes(d.type)
    }));
    const preIpmMissing = preIpmDetails.filter(d => d.required && !d.exists);
    const preIpmCompleted = preIpmDetails.filter(d => d.required && d.exists).length;

    const preIpmPercentage = Math.round(
        (preIpmCompleted / PRE_IPM_REQUIRED.length) * 100
    );

    function onRefresh(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>
            <Typography variant="h5" sx={{ mb: 1 }}>
                Project Documents Readiness
            </Typography>

            <LinearProgress
                variant="determinate"
                value={preIpmPercentage}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {preIpmCompleted}/{PRE_IPM_REQUIRED.length} required items uploaded
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
            {preIpmMissing.length > 0 && (
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

                    {preIpmMissing.map((m) => (
                        <Typography
                            key={m.type}
                            sx={{ color: "#fecaca", textTransform: "capitalize" }}
                        >
                            • {m.type.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </Typography>
                    ))}
                </Box>
            )}

            {preIpmDetails
                .sort((a, b) =>
                    DOCUMENT_ORDER.indexOf(a.type) -
                    DOCUMENT_ORDER.indexOf(b.type)
                )
                .map((detail) => (
                    <DocumentAccordion
                        key={detail.type}
                        detail={detail}
                        doc={data.documents[detail.type]}
                        projectNo={data.projectNo}
                        onUploaded={onRefresh}
                    />
                ))}
        </Box>
    );
}
