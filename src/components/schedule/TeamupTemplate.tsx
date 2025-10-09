'use client';

import React, { useState, useCallback, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import TeamupTemplateSummaryCard from "./TeamupTemplateSummaryCard";
import { ProjectGoalAccordion } from "./TeamupTemplateGoalAccordion";
import TeamupTemplateSkeleton from "./TeamupTemplateSkeleton";
import { scheduleApi } from "@/utils/apiClient";
import { useRouter, useSearchParams } from "next/navigation";
import { TeamupTemplateSummary, TeamupGoal } from "@/types/TeamupTemplate";

// Move pattern to module scope so it's stable (no missing-deps warning)
const PROJECT_PATTERN = /^S-\d{1,6}$/;

// Shape returned by API for this page: top-level summary + goals
type TeamupTemplateResponse = TeamupTemplateSummary & {
    goals?: TeamupGoal[];
};

export default function TeamupTemplate() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [projectNumber, setProjectNumber] = useState("");
    const [error, setError] = useState("");
    const [data, setData] = useState<TeamupTemplateResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchTeamupTemplate = useCallback(
        async (pn?: string) => {
            try {
                setLoading(true);
                const proj = (pn ?? projectNumber).toUpperCase();

                // validate before calling
                if (!PROJECT_PATTERN.test(proj)) {
                    setError("Project number must be in format S-###### (e.g., S-007380)");
                    setLoading(false);
                    return;
                }

                const params = { projectNumber: proj };
                const res = await scheduleApi.get<TeamupTemplateResponse>("/salesforce/teamup-template", { params });
                setData(res.data);
                setProjectNumber(proj);
                setError("");

                // Update URL query param without scrolling
                router.replace(`?projectNumber=${encodeURIComponent(proj)}`, { scroll: false });
            } catch (err) {
                console.error("Error fetching teamup template:", err);
            } finally {
                setLoading(false);
            }
        },
        [projectNumber, router]
    );

    // On first mount, read ?projectNumber=... and fetch if present
    useEffect(() => {
        const pn = searchParams.get("projectNumber");
        if (pn && pn.toUpperCase() !== projectNumber.toUpperCase()) {
            if (PROJECT_PATTERN.test(pn.toUpperCase())) {
                fetchTeamupTemplate(pn);
            } else {
                setProjectNumber(pn.toUpperCase());
                setError("Project number must be in format S-###### (e.g., S-007380)");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once on mount

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setProjectNumber(value);

        if (value && !PROJECT_PATTERN.test(value)) {
            setError("Project number must be in format S-###### (e.g., S-007380)");
        } else {
            setError("");
        }
    };

    const handleSubmit = () => {
        if (!error && projectNumber) {
            fetchTeamupTemplate(projectNumber);
        }
    };

    return (
        <Box sx={{ color: "white" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Teamup Template
            </Typography>
            <Box
                sx={{
                    minWidth: "1200px",
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
                    onChange={handleChange}
                    error={!!error}
                    helperText={error || "Enter a project number like S-007380"}
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
                        mb: 2,
                    }}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                />

                <Box>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSubmit}
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
                                color: "#6b7280", // muted text
                                borderColor: "#374151", // keep same border
                                opacity: 0.6, // subtle dim
                                backgroundColor: "transparent", // no background
                            },
                        }}
                    >
                        Fetch Template
                    </Button>
                </Box>
            </Box>

            {/* Loading state */}
            {loading && <TeamupTemplateSkeleton />}

            {/* No data + not loading */}
            {!loading && !data && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60vh",
                        color: "#9ca3af",
                        textAlign: "center",
                        flexDirection: "column",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No project selected
                    </Typography>
                    <Typography variant="body2">
                        Enter a project number above to fetch the Teamup Template.
                    </Typography>
                </Box>
            )}

            {/* Data loaded */}
            {!loading && data && (
                <>
                    <TeamupTemplateSummaryCard data={data} />
                    <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "white" }}>
                        Project Goals
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {data.goals?.map((goal: TeamupGoal) => (
                            <ProjectGoalAccordion key={goal.id} goal={goal} />
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}
