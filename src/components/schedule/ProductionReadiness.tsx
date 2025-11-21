'use client';

import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { oneDriveApi, api } from "@/utils/apiClient";
import ProjectReadinessSkeleton from "./ProjectReadinessSkeleton";
import ProductionReadinessStepper from "./ProductionReadinessStepper";
import { ProductionNotesResponse, ReadinessResponse } from "@/types/productionReadiness";

const PROJECT_PATTERN = /^S-\d{1,6}$/;

export default function ProductionReadiness() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [projectNumber, setProjectNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [documentsData, setDocumentsData] = useState<ReadinessResponse | null>(null);
    const [notesData, setNotesData] = useState<ProductionNotesResponse | null>(null);
    // const [opportunityData, setOpportunityData] = useState<OpportunitySummary | null>(null);

    /**
     * Fetch BOTH:
     * 1. OneDrive Document Readiness
     * 2. Salesforce Production Notes
     * 3. Summary details (from your existing OneDrive metadata response)
     */
    const fetchAllReadiness = useCallback(
        async (pn?: string) => {
            try {
                setLoading(true);

                const proj = (pn ?? projectNumber).toUpperCase();

                if (!PROJECT_PATTERN.test(proj)) {
                    setError("Project number must be in format S-###### (e.g., S-007352)");
                    setLoading(false);
                    return;
                }

                // Fetch documents readiness from OneDrive service
                const docRes = await oneDriveApi.get("/projects/documents/metadata", {
                    params: { projectNumber: proj },
                });

                // Fetch production notes readiness from Salesforce
                const notesRes = await api.get(
                    "/salesforce/projects/production-notes",
                    { params: { projectNo: proj } }
                );

                setDocumentsData(docRes.data);
                setNotesData(notesRes.data.data);

                // Summary details for project header
                // setOpportunityData({
                //     opportunityName: docRes.data.opportunityName,
                //     projectNo: docRes.data.projectNo,
                //     division: docRes.data.division,
                //     ownerName: docRes.data.ownerName,
                //     ownerEmail: docRes.data.ownerEmail,
                //     salesAssistantName: docRes.data.salesAssistantName,
                //     salesAssistantEmail: docRes.data.salesAssistantEmail,
                //     projectManagerName: docRes.data.projectManagerName,
                //     projectManagerEmail: docRes.data.projectManagerEmail,
                //     jobAddress: docRes.data.jobAddress,
                //     salesforceLink: docRes.data.salesforceOpportunityLink,
                //     oneDriveLink: docRes.data.projectFolderLink,
                // });

                setProjectNumber(proj);
                setError("");

                router.replace(`?projectNumber=${encodeURIComponent(proj)}`);
            } catch (err) {
                console.error("Error fetching readiness:", err);
                setError("Unable to fetch readiness information.");
            } finally {
                setLoading(false);
            }
        },
        [projectNumber, router]
    );

    /**
     * Auto-load from URL query params
     */
    useEffect(() => {
        const pn = searchParams.get("projectNumber");
        if (pn && pn.toUpperCase() !== projectNumber) {
            if (PROJECT_PATTERN.test(pn)) {
                fetchAllReadiness(pn);
            } else {
                setProjectNumber(pn);
                setError("Format must be S-###### (e.g., S-007352)");
            }
        }
    }, [searchParams, projectNumber, fetchAllReadiness]);

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "#030712",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: 2,
            }}
        >
            {/* HEADER */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    mt: 2,
                }}
            >
                <Typography variant="h4">Production Readiness</Typography>
            </Box>

            {/* SEARCH BAR */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    gap: 2,
                    mb: 2,
                }}
            >
                <TextField
                    label="Project Number"
                    variant="outlined"
                    value={projectNumber}
                    onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        setProjectNumber(value);
                        if (value && !PROJECT_PATTERN.test(value)) {
                            setError("Project number must be in format S-###### (e.g., S-007352)");
                        } else {
                            setError("");
                        }
                    }}
                    error={!!error}
                    helperText={error || "Enter a project number like S-007352"}
                    sx={{
                        input: { color: "white", textTransform: "uppercase" },
                        label: { color: "#6b7280" },
                        "& .MuiFormHelperText-root": { color: "#6b7280" },
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: "#374151" },
                            "&:hover fieldset": { borderColor: "#6b7280" },
                            "&.Mui-focused fieldset": { borderColor: "#60A5FA" },
                        },
                        width: "300px",
                    }}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                />

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => fetchAllReadiness(projectNumber)}
                    disabled={!projectNumber || !!error}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#1f2937",
                            borderColor: "#6b7280",
                        },
                        "&.Mui-disabled": {
                            color: "#6b7280",
                            borderColor: "#374151",
                            opacity: 0.6,
                            backgroundColor: "transparent",
                        },
                    }}
                >
                    Fetch Readiness
                </Button>
            </Box>

            {/* LOADING STATE */}
            {loading && (
                <Box sx={{ width: "100%", mt: 2 }}>
                    <ProjectReadinessSkeleton />
                </Box>
            )}

            {/* FIRST LOAD (no project selected) */}
            {!loading && !documentsData && !notesData && (
                <Box
                    sx={{
                        width: "1200px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60vh",
                        textAlign: "center",
                        color: "#9ca3af",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No project selected
                    </Typography>
                    <Typography variant="body2">
                        Enter a project number above to fetch readiness.
                    </Typography>
                </Box>
            )}

            {/* LOADED */}
            {!loading && documentsData && notesData && (
                <ProductionReadinessStepper
                    documents={documentsData}
                    productionNotes={notesData}
                    closedWonSignedComplete={true}
                    onRefresh={() => fetchAllReadiness(projectNumber)}
                />
            )}
        </Box>
    );
}
