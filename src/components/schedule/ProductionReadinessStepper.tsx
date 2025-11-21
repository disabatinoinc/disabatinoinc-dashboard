'use client';

import React, { useState } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Collapse,
    StepIconProps
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { DocumentsCard } from "./DocumentsCard";
import { ProductionNotesCard } from "./ProductionNotesCard";
import {
    ReadinessResponse,
    ProductionNotesResponse,
    OpportunitySummary
} from "@/types/productionReadiness";
import ProjectSummaryCard from "./ProjectSummaryCard";


// ⭐ Custom Step Icon (unchanged)
function CustomStepperIcon(props: StepIconProps) {
    const { active, completed } = props;

    if (completed) {
        return (
            <CheckCircleIcon
                sx={{
                    color: "#22c55e",
                    fontSize: 36,
                }}
            />
        );
    }

    if (active) {
        return (
            <RadioButtonUncheckedIcon
                sx={{
                    color: "#60a5fa",
                    fontSize: 36
                }}
            />
        );
    }

    return (
        <RadioButtonUncheckedIcon
            sx={{
                color: "#475569",
                fontSize: 36
            }}
        />
    );
}


export interface ProductionReadinessStepperProps {
    opportunity: OpportunitySummary | null;
    documents: ReadinessResponse;
    productionNotes: ProductionNotesResponse;
    closedWonSignedComplete: boolean;
    onRefresh: () => void;
}

export default function ProductionReadinessStepper({
    opportunity,
    documents,
    productionNotes,
    closedWonSignedComplete,
    onRefresh
}: ProductionReadinessStepperProps) {

    // ⭐ Track open step
    const [openStep, setOpenStep] = useState<number | null>(null);

    const toggleStep = (index: number) => {
        setOpenStep(prev => (prev === index ? null : index));
    };

    return (
        <Box sx={{ width: "1200px", color: "#e5e7eb" }}>
            <Stepper
                activeStep={-1}
                orientation="vertical"
                sx={{
                    "& .MuiStepIcon-root": { width: 36, height: 36 },
                    "& .MuiSvgIcon-root": { fontSize: 36 }
                }}
            >

                {/* -------------------------------
                    STEP 1 — CLOSED WON SIGNED
                -------------------------------- */}
                <Step completed={closedWonSignedComplete} sx={{
                    cursor: "pointer",
                    "&:hover .MuiStepLabel-root": {
                        cursor: "pointer",
                    },
                    "&:hover .MuiStepIcon-root": {
                        cursor: "pointer",
                    }
                }}>
                    <StepLabel
                        onClick={() => toggleStep(0)}
                        sx={{ cursor: "pointer" }}
                        icon={
                            <CustomStepperIcon
                                completed={closedWonSignedComplete}
                                active={openStep === 0}
                                icon={0}
                            />
                        }
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#cbd5e1", // slate-300
                                    transition: "color 0.15s ease",
                                    "&:hover": {
                                        color: "#ffffff"
                                    }
                                }}
                            >
                                Project Closed Won Signed
                            </Typography>

                            {/* Expand Icon */}
                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 0 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s",
                                    ml: 1
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 0}>
                        <Box sx={{ ml: 7, mt: 1, mb: 2 }}>
                            {opportunity && (
                                <ProjectSummaryCard
                                    projectNo={opportunity.projectNo}
                                    opportunityName={opportunity.opportunityName}
                                    division={opportunity.division}
                                    ownerName={opportunity.ownerName}
                                    ownerEmail={opportunity.ownerEmail}
                                    salesAssistantName={opportunity.salesAssistantName}
                                    salesAssistantEmail={opportunity.salesAssistantEmail}
                                    projectManagerName={opportunity.projectManagerName}
                                    projectManagerEmail={opportunity.projectManagerEmail}
                                    jobAddress={opportunity.jobAddress}
                                    salesforceLink={opportunity.salesforceLink}
                                    oneDriveLink={opportunity.oneDriveLink}
                                />
                            )}
                        </Box>
                    </Collapse>
                </Step>


                {/* -------------------------------
                    STEP 2 — PRODUCTION NOTES
                -------------------------------- */}
                <Step completed={productionNotes.notesComplete} sx={{
                    cursor: "pointer",
                    "&:hover .MuiStepLabel-root": {
                        cursor: "pointer",
                    },
                    "&:hover .MuiStepIcon-root": {
                        cursor: "pointer",
                    }
                }}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        onClick={() => toggleStep(1)}
                        sx={{ cursor: "pointer" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#cbd5e1", // slate-300
                                    transition: "color 0.15s ease",
                                    "&:hover": {
                                        color: "#ffffff"
                                    }
                                }}
                            >
                                Production Notes — {productionNotes.completionPercentage}%
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 1 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s",
                                    ml: 1
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 1}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <ProductionNotesCard data={productionNotes} />
                        </Box>
                    </Collapse>
                </Step>


                {/* -------------------------------
                    STEP 3 — DOCUMENTS
                -------------------------------- */}
                <Step completed={documents.readiness.missing.length === 0} sx={{
                    cursor: "pointer",
                    "&:hover .MuiStepLabel-root": {
                        cursor: "pointer",
                    },
                    "&:hover .MuiStepIcon-root": {
                        cursor: "pointer",
                    }
                }}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        onClick={() => toggleStep(2)}
                        sx={{ cursor: "pointer" }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: "#cbd5e1", // slate-300
                                    transition: "color 0.15s ease",
                                    "&:hover": {
                                        color: "#ffffff"
                                    }
                                }}
                            >
                                Project Documents — {documents.readiness.percentage}%
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 2 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s",
                                    ml: 1
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 2}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <DocumentsCard data={documents} onRefresh={onRefresh} />
                        </Box>
                    </Collapse>
                </Step>

            </Stepper >
        </Box >
    );
}
