'use client';

import { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Paper,
    Box,
    LinearProgress,
    Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Upload, CheckCircle, XCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { oneDriveApi } from "@/utils/apiClient";
import { DocumentEntry, FileEntry, ReadinessDetail, DocumentType } from "@/types/productionReadiness";
import { FolderOpen } from "lucide-react";

const DOCUMENT_LABELS: Record<DocumentType, string> = {
    signedContract: "Contract",
    photos: "Photos",
    designsRenders: "Designs & Renders",
    selectionsSheet: "Selections Sheet",
    approvedPermit: "Permit",
    finalStamped: "Final Stamped Plans",
    productionTickets: "Production Tickets",
};

export default function DocumentAccordion({
    detail,
    doc,
    projectNo,
    onUploaded,
}: {
    detail: ReadinessDetail;
    doc: DocumentEntry;
    projectNo: string;
    onUploaded: () => void;
}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadFileName, setUploadFileName] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    async function uploadDocument({
        projectNo,
        type,
        file,
        version = "0",
        language = "EN",
    }: {
        projectNo: string;
        type: DocumentType;
        file: File;
        version?: string;
        language?: string;
    }) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("version", version);
        formData.append("language", language);
        formData.append("useOriginalName", "true");

        const res = await oneDriveApi.post(
            `/projects/${projectNo}/documents/${type}/upload`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (evt) => {
                    if (evt.total) {
                        const percent = Math.round((evt.loaded / evt.total) * 100);
                        setProgress(percent);
                    }
                },
            }
        );

        return res.data;
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploadFileName(file.name);
        setUploading(true);
        setUploadSuccess(false);
        setProgress(0);

        try {
            await uploadDocument({
                projectNo,
                type: detail.type,
                file,
            });

            setUploadSuccess(true);

            // Refresh readiness metadata
            onUploaded();

            // Success indicator fades out after 2s
            setTimeout(() => setUploadSuccess(false), 2000);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    const isRequired = detail.required;
    const isDone = detail.exists;
    const fileCount = doc?.count ?? 0;

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

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Accordion
                disableGutters
                sx={{
                    bgcolor: "#0f172a",
                    border: uploading
                        ? "2px solid rgba(59,130,246,0.6)" // blue while uploading
                        : isDone && isRequired
                            ? "1px solid rgba(34,197,94,0.4)"
                            : isRequired
                                ? "1px solid #b91c1c"
                                : "1px solid #475569",
                    borderRadius: 3,
                    "&:before": { display: "none" },
                    overflow: "hidden",
                    opacity: uploading ? 1 : (!isRequired && !isDone ? 0.55 : 1),
                    mb: 2
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#94a3b8" }} />}
                    sx={{
                        "& .MuiAccordionSummary-content": {
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            color: "white",
                        },
                    }}
                >
                    {statusIcon}

                    <Typography
                        variant="h6"
                        sx={{ color: isRequired ? "white" : "#9ca3af" }}
                    >
                        {DOCUMENT_LABELS[detail.type]}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "grey.400", ml: 2 }}>
                        {fileCount} file{fileCount === 1 ? "" : "s"} found
                    </Typography>

                    {!isRequired && (
                        <Typography
                            variant="caption"
                            sx={{ color: "#6b7280", textTransform: "uppercase" }}
                        >
                            Optional
                        </Typography>
                    )}

                    {/* RIGHT ACTION BUTTONS */}
                    <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", marginRight: 2 }}>
                        {doc.folderLink && (
                            <Tooltip title="Open folder in OneDrive" arrow placement="top">
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(doc.folderLink, "_blank");
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        "&:hover": { opacity: 0.8 }
                                    }}
                                >
                                    <FolderOpen size={20} color="#eab308" />
                                </Box>
                            </Tooltip>
                        )}
                    </Box>

                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        bgcolor: "#1e293b",
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    {/* FILE LIST */}
                    {doc?.files?.length > 0 ? (
                        <Paper
                            sx={{
                                bgcolor: "#0f172a",
                                p: 2,
                                maxHeight: 200,
                                overflowY: "auto",
                                mb: 2,
                            }}
                        >
                            {doc.files.map((f: FileEntry) => (
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
                        <Typography color="grey.400" mb={2}>
                            No files uploaded yet.
                        </Typography>
                    )}

                    {/* 📤 LIVE UPLOAD STATUS */}
                    {uploading && (
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{ color: "#93c5fd", mb: 1 }}
                            >
                                Uploading {uploadFileName}… ({progress}%)
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: "#334155",
                                    "& .MuiLinearProgress-bar": {
                                        bgcolor: "#3b82f6",
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {/* ✔ SUCCESS MESSAGE */}
                    {uploadSuccess && !uploading && (
                        <Typography
                            variant="body2"
                            sx={{ color: "rgb(34,197,94)", mb: 2 }}
                        >
                            Upload complete!
                        </Typography>
                    )}

                    {/* UPLOAD BUTTON */}
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Upload size={18} />}
                        component="label"
                        disabled={uploading}
                        sx={{
                            borderRadius: 2,
                            borderColor: isDone
                                ? "rgba(34,197,94,0.6)"
                                : "rgba(148,163,184,0.4)",
                            bgcolor: isDone
                                ? "rgba(34,197,94,0.1)"
                                : "#0f172a",
                            color: "white",
                            textTransform: "none",
                        }}
                    >
                        {uploading ? "Uploading…" : "Upload File"}

                        <input
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                        />
                    </Button>
                </AccordionDetails>
            </Accordion>
        </motion.div>
    );
}
