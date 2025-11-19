'use client';

import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Card, CardHeader, CardContent, LinearProgress, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { oneDriveApi } from "@/utils/apiClient";
import ProjectSummaryCard from "./ProjectSummaryCard";
import { ReadinessResponse, DOCUMENT_ORDER } from "@/types/productionReadiness";
import DocumentAccordion from "./DocumentAccordion";
import ProjectReadinessSkeleton from "./ProjectReadinessSkeleton";


const PROJECT_PATTERN = /^S-\d{1,6}$/;

export default function ProductionReadinessScoreCard() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [projectNumber, setProjectNumber] = useState("");
    const [error, setError] = useState("");
    const [data, setData] = useState<ReadinessResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchReadiness = useCallback(
        async (pn?: string) => {
            try {
                setLoading(true);
                const proj = (pn ?? projectNumber).toUpperCase();

                // Validate project number format
                if (!PROJECT_PATTERN.test(proj)) {
                    setError("Project number must be in format S-###### (e.g., S-007352)");
                    setLoading(false);
                    return;
                }

                // Hit OneDrive service
                const res = await oneDriveApi.get("/projects/documents/metadata", {
                    params: { projectNumber: proj }
                });

                setData(res.data);
                setProjectNumber(proj);
                setError("");

                router.replace(`?projectNumber=${encodeURIComponent(proj)}`);

            } catch (err) {
                console.error("Error fetching readiness metadata:", err);
                setError("Unable to fetch readiness information.");
            } finally {
                setLoading(false);
            }
        },
        [projectNumber, router]
    );

    // Auto-load from ?projectNumber=S-000001
    useEffect(() => {
        const pn = searchParams.get("projectNumber");
        if (pn && pn.toUpperCase() !== projectNumber) {
            if (PROJECT_PATTERN.test(pn)) {
                fetchReadiness(pn);
            } else {
                setProjectNumber(pn);
                setError("Format must be S-###### (e.g., S-007352)");
            }
        }
    }, [searchParams, projectNumber, fetchReadiness]);

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

            {/* SEARCH BAR MATCHING TEAMUP PAGE */}
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
                    onClick={() => fetchReadiness(projectNumber)}
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

            {/* LOADING */}
            {loading && (
                <Box sx={{ width: "100%", mt: 2 }}>
                    <ProjectReadinessSkeleton />
                </Box>
            )}

            {/* EMPTY */}
            {!loading && !data && (
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
                        Enter a project number above to fetch readiness score.
                    </Typography>
                </Box>
            )}

            {/* DATA LOADED */}
            {!loading && data && (
                <>
                    {/* PROJECT SUMMARY */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ width: "100%", maxWidth: "1200px" }}
                    >
                        <ProjectSummaryCard
                            opportunityName={data.opportunityName}
                            projectNo={data.projectNo}
                            division={data.division}
                            ownerName={data.ownerName}
                            ownerEmail={data.ownerEmail}
                            salesAssistantName={data.salesAssistantName}
                            salesAssistantEmail={data.salesAssistantEmail}
                            projectManagerName={data.projectManagerName}
                            projectManagerEmail={data.projectManagerEmail}
                            jobAddress={data.jobAddress}
                        />
                    </motion.div>

                    {/* SCORE CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ width: "100%", maxWidth: "1200px", marginTop: "24px" }}
                    >
                        <Card
                            sx={{
                                bgcolor: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: 3,
                                mb: 2,
                            }}
                        >
                            <CardHeader
                                title={<Typography variant="h5">Readiness Score</Typography>}
                            />
                            <CardContent>
                                <Box display="flex" gap={4} alignItems="center">
                                    <Typography variant="h2" fontWeight="900" color="green">
                                        {data.readiness.percentage}%
                                    </Typography>
                                    <Box flex={1}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={data.readiness.percentage}
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                        <Typography variant="body2" color="grey.400" mt={1}>
                                            {data.readiness.completed}/{data.readiness.required.length}{" "}
                                            required items uploaded
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* MISSING SECTION */}
                    {data.readiness.missing.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ width: "100%", maxWidth: "1200px" }}
                        >
                            <Card
                                sx={{
                                    bgcolor: "rgba(127,29,29,0.3)",
                                    border: "1px solid #b91c1c",
                                    borderRadius: 3,
                                    p: 3,
                                    mt: 1,
                                }}
                            >
                                <Typography variant="h6" color="error" mb={2}>
                                    Missing Required Items
                                </Typography>

                                {data.readiness.missing.map((m) => (
                                    <Typography
                                        key={m}
                                        sx={{ textTransform: "capitalize", color: "#e2e8f0" }}
                                    >
                                        {m.replace(/([A-Z])/g, " $1").toLowerCase()}
                                    </Typography>
                                ))}
                            </Card>
                        </motion.div>
                    )}

                    {/* DOCUMENT ACCORDIONS */}
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: "1200px",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            mt: 4,
                        }}
                    >
                        {data.readiness.details
                            .sort((a, b) => DOCUMENT_ORDER.indexOf(a.type) - DOCUMENT_ORDER.indexOf(b.type))
                            .map((detail) => (
                                <DocumentAccordion
                                    key={detail.type}
                                    detail={detail}
                                    doc={data.documents[detail.type]}
                                    projectNo={data.projectNo}
                                    onUploaded={() => fetchReadiness(data.projectNo)}
                                />
                            ))}
                    </Box>


                </>
            )}
        </Box>

    );
}
