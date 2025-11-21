'use client';

import {
    Box,
    Typography,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    IconButton,
    Tooltip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CheckCircle, XCircle, Circle, FolderOpen } from "lucide-react";
import { DocumentEntry } from "@/types/productionReadiness";

export function PicturesCard({
    photos,
    isRequired,
}: {
    photos: DocumentEntry;
    isRequired: boolean;
}) {
    const fileCount = photos.count ?? 0;
    const isDone = photos.exists && fileCount > 0;

    // ---- STATUS ICON LOGIC ----
    let statusIcon;
    if (isDone && isRequired) {
        statusIcon = <CheckCircle color="rgb(34,197,94)" size={22} />;
    } else if (!isDone && isRequired) {
        statusIcon = <XCircle color="rgb(239,68,68)" size={22} />;
    } else if (isDone && !isRequired) {
        statusIcon = <CheckCircle color="#475569" size={22} />;
    } else {
        statusIcon = <Circle color="#475569" size={18} />;
    }

    const missingRequiredCount = isRequired && !isDone ? 1 : 0;
    const completionPct = isDone ? 100 : 0;

    return (
        <Box sx={{ p: 2, mb: 3, borderRadius: 2, background: "#111827" }}>

            {/* HEADER WITH STATUS + TITLE + ONEDRIVE ICON */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1
                }}
            >
                {/* LEFT SIDE */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 1 }}>{statusIcon}</Box>
                    <Typography variant="h5">Photos</Typography>
                </Box>

                {/* RIGHT SIDE: ONE DRIVE ICON */}
                {photos.folderLink && (
                    <Tooltip title="Open in OneDrive">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(photos.folderLink ?? undefined, "_blank");
                            }}
                            sx={{
                                color: "#FACC15",
                                "&:hover": { color: "#FDE047" }
                            }}
                        >
                            <FolderOpen size={20} />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* PROGRESS BAR */}
            <LinearProgress
                variant="determinate"
                value={completionPct}
                sx={{ height: 10, borderRadius: 2, mb: 1 }}
            />

            {/* STATUS MESSAGE */}
            <Typography sx={{ mb: 2, fontSize: 14, color: "#9ca3af" }}>
                {isDone
                    ? "All required items completed"
                    : isRequired
                        ? "1 required item missing"
                        : "Optional"}
            </Typography>

            {/* MISSING REQUIRED BOX */}
            {missingRequiredCount > 0 && (
                <Box
                    sx={{
                        background: "rgba(127,29,29,0.35)",
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        border: "1px solid #b91c1c",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1, color: "#fca5a5" }}>
                        Missing Required Items
                    </Typography>

                    <Typography sx={{ color: "#fecaca" }}>• Photos</Typography>
                </Box>
            )}

            {/* ACCORDION LIST OF FILES */}
            <Accordion sx={{ background: "#0f172a", color: "#e5e7eb", mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#e5e7eb" }} />}>
                    <Typography sx={{ fontWeight: 600 }}>
                        Photos ({fileCount} file{fileCount === 1 ? "" : "s"})
                    </Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {photos.files.length > 0 ? (
                        <Paper
                            sx={{
                                bgcolor: "#0f172a",
                                p: 2,
                                maxHeight: 200,
                                overflowY: "auto",
                                mb: 2,
                            }}
                        >
                            {photos.files.map((f) => (
                                <Typography
                                    key={f.name}
                                    component="a"
                                    href={f.webUrl}
                                    target="_blank"
                                    sx={{
                                        display: "block",
                                        color: "#60a5fa",
                                        textDecoration: "none",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        mb: 1,
                                        "&:hover": { textDecoration: "underline" },
                                    }}
                                >
                                    {f.name}
                                </Typography>
                            ))}
                        </Paper>
                    ) : (
                        <Typography sx={{ color: "#94a3b8" }}>
                            No photos uploaded yet.
                        </Typography>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
