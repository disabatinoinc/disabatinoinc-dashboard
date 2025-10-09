import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Box,
    IconButton,
    Tooltip,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

function CopyBlock({ label, value }: { label: string; value?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (value) {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {label}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#1f2937",
                    borderRadius: 1,
                    px: 1.5,
                    py: 0.75,
                    border: "1px solid #374151",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ color: "white", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {value || "—"}
                </Typography>
                <Tooltip title={copied ? "Copied" : "Copy"} arrow>
                    <IconButton
                        size="small"
                        onClick={handleCopy}
                        sx={{ color: "#9ca3af" }}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

export function ProjectGoalAccordion({ goal }: { goal: any }) {
    return (
        <Accordion
            sx={{ backgroundColor: "#111827", border: "1px solid #374151", color: "white" }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#9ca3af" }} />}>
                <Typography sx={{ fontWeight: 500 }}>{goal.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="PG Number" value={goal.pgNumber} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <CopyBlock label="Total Labor Hours" value={goal.totalLaborHours?.toString()} />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <CopyBlock label="Teamup Crew Suggestion" value={goal.teamupCrewEventSuggestions} />
                    </Grid>
                    {goal.teamupSubEventSuggestions?.map((sub: string, idx: number) => (
                        <Grid item xs={12} key={idx}>
                            <CopyBlock label={`Teamup Sub Suggestion ${idx + 1}`} value={sub} />
                        </Grid>
                    ))}
                </Grid>
            </AccordionDetails>
        </Accordion>
    );
}

function LabelValue({ label, value }: { label: string; value: string }) {
    return (
        <Box>
            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
                {value || "—"}
            </Typography>
        </Box>
    );
}
