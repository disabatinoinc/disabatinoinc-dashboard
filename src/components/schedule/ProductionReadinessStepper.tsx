'use client';

import React, { useState } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Typography,
    Collapse
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

import ProjectSummaryCard from "./ProjectSummaryCard";
import { DocumentsCard } from "./DocumentsCard";
import { ProductionNotesCard } from "./ProductionNotesCard";

import {
    ReadinessResponse,
    ProductionNotesResponse,
    OpportunitySummary,
    ProjectReviewStatusResponse
} from "@/types/productionReadiness";
import { PicturesCard } from "./PicturesCard";
import { ProductionReviewCard } from "./ProductionReviewCard";
import { PurchasingReviewCard } from "./PurchasingReviewCard";

// ------------------------------------------------------
// Custom Step Icon
// ------------------------------------------------------
function CustomStepperIcon(props: any) {
    const { active, completed } = props;

    if (completed) {
        return (
            <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 36 }} />
        );
    }

    return (
        <RadioButtonUncheckedIcon
            sx={{
                color: active ? "#60a5fa" : "#475569",
                fontSize: 36
            }}
        />
    );
}



// ------------------------------------------------------
// Stepper Component
// ------------------------------------------------------
export interface ProductionReadinessStepperProps {
    opportunity: OpportunitySummary | null;
    documents: ReadinessResponse;
    productionNotes: ProductionNotesResponse;
    closedWonSignedComplete: boolean;
    reviewStatus: ProjectReviewStatusResponse;
    onRefresh: () => void;
}

export default function ProductionReadinessStepper({
    opportunity,
    documents,
    productionNotes,
    closedWonSignedComplete,
    reviewStatus,
    onRefresh
}: ProductionReadinessStepperProps) {

    const [openStep, setOpenStep] = useState<number | null>(null);
    const toggleStep = (index: number) => {
        setOpenStep(prev => (prev === index ? null : index));
    };

    const photosRequired =
        documents.readiness.details.find(d => d.type === "photos")?.required ?? false;
    const productionReviewed = reviewStatus?.productionReview?.reviewed ?? false;
    const purchasingReviewed = reviewStatus?.purchasingReview?.reviewed ?? false;

    const reviewStepComplete = productionReviewed && purchasingReviewed;



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


                {/* ------------------------------------------------------
                    STEP 1 — PROJECT CLOSED WON SIGNED
                ------------------------------------------------------ */}
                <Step completed={closedWonSignedComplete}>
                    <StepLabel
                        icon={
                            <CustomStepperIcon
                                completed={closedWonSignedComplete}
                                active={openStep === 0}
                            />
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={() => toggleStep(0)}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography variant="h6"
                                sx={{ color: "#cbd5e1", "&:hover": { color: "#fff" } }}>
                                Project Closed Won Signed
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 0 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s"
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 0}>
                        <Box sx={{ ml: 7, mt: 1, mb: 2 }}>
                            {opportunity && (
                                <ProjectSummaryCard {...opportunity} />
                            )}
                        </Box>
                    </Collapse>
                </Step>



                {/* ------------------------------------------------------
                    STEP 2 — PRODUCTION NOTES + PHOTOS (2 Business Days)
                ------------------------------------------------------ */}
                <Step completed={productionNotes.notesComplete}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        sx={{ cursor: "pointer" }}
                        onClick={() => toggleStep(1)}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography variant="h6"
                                sx={{ color: "#cbd5e1", "&:hover": { color: "#fff" } }}>
                                Production Notes & Photos — {productionNotes.completionPercentage}%
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 1 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s"
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 1}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <ProductionNotesCard
                                data={productionNotes}
                                salesforceLink={opportunity?.salesforceLink ?? ""}
                            />
                            {/* ⭐ NEW PICTURES CARD GOES HERE */}
                            <PicturesCard photos={documents.documents.photos} isRequired={photosRequired} />
                        </Box>
                    </Collapse>
                </Step>



                {/* ------------------------------------------------------
    STEP 3 — PRODUCTION / PURCHASING REVIEW
------------------------------------------------------ */}
                <Step completed={reviewStepComplete}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        sx={{ cursor: "pointer" }}
                        onClick={() => toggleStep(2)}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography variant="h6"
                                sx={{ color: "#cbd5e1", "&:hover": { color: "#fff" } }}>
                                Production / Purchasing Review
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 2 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s"
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 2}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <ProductionReviewCard review={reviewStatus.productionReview} />
                            <PurchasingReviewCard review={reviewStatus.purchasingReview} />
                        </Box>
                    </Collapse>
                </Step>



                {/* ------------------------------------------------------
                    STEP 4 — DOCUMENTS — PRE-IPM
                ------------------------------------------------------ */}
                <Step completed={documents.readiness.missing.length === 0}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        sx={{ cursor: "pointer" }}
                        onClick={() => toggleStep(3)}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography variant="h6"
                                sx={{ color: "#cbd5e1", "&:hover": { color: "#fff" } }}>
                                Project Documents — Pre-IPM ({documents.readiness.percentage}%)
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 3 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s"
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 3}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <DocumentsCard data={documents} onRefresh={onRefresh} />
                        </Box>
                    </Collapse>
                </Step>



                {/* ------------------------------------------------------
                    STEP 5 — IPM
                ------------------------------------------------------ */}
                <Step completed={false}>
                    <StepLabel
                        StepIconComponent={CustomStepperIcon}
                        sx={{ cursor: "pointer" }}
                        onClick={() => toggleStep(4)}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Typography variant="h6"
                                sx={{ color: "#cbd5e1", "&:hover": { color: "#fff" } }}>
                                IPM
                            </Typography>

                            <ExpandMoreIcon
                                sx={{
                                    color: "#e5e7eb",
                                    transform: openStep === 4 ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "0.2s"
                                }}
                            />
                        </Box>
                    </StepLabel>

                    <Collapse in={openStep === 4}>
                        <Box sx={{ ml: 7, mt: 1 }}>
                            <Typography sx={{ color: "#94a3b8", fontStyle: "italic" }}>
                                (IPM details will go here)
                            </Typography>
                        </Box>
                    </Collapse>
                </Step>


            </Stepper>
        </Box>
    );
}
