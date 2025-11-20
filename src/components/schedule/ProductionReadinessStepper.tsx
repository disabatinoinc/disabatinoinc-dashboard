'use client';

import React, { useState } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Collapse,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import { DocumentsCard } from "./DocumentsCard";
import { ProductionNotesCard } from "./ProductionNotesCard";
import {
    OpportunitySummary,
    ReadinessResponse,
    ProductionNotesResponse
} from "@/types/productionReadiness";


// ⭐ Custom Step Icon (unchanged)
function CustomStepperIcon(props: any) {
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
    projectNo: string;
    opportunity: OpportunitySummary | null;
    documents: ReadinessResponse;
    productionNotes: ProductionNotesResponse;
    closedWonSignedComplete: boolean;
    onRefresh: () => void;
}

export default function ProductionReadinessStepper({
    projectNo,
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
                <Step completed={closedWonSignedComplete}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        onClick={() => toggleStep(0)}
                        sx={{ cursor: "pointer" }}
                        icon={
                            <CustomStepperIcon
                                completed={closedWonSignedComplete}
                                active={openStep === 0}
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
                            <Typography variant="h6" sx={{ color: "#22c55e" }}>
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
                            <Typography color="gray">No additional info needed.</Typography>
                        </Box>
                    </Collapse>
                </Step>


                {/* -------------------------------
                    STEP 2 — PRODUCTION NOTES
                -------------------------------- */}
                <Step completed={productionNotes.notesComplete} >
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
                            <Typography variant="h6">
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
                <Step completed={documents.readiness.missing.length === 0}>
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
                            <Typography variant="h6">
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
