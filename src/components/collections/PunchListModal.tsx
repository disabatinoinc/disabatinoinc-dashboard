"use client";

import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Divider, TextField, Button, CircularProgress } from "@mui/material";
import { CollectionSummary } from "@/types/CollectionSummary";
import { useSnackbar } from 'notistack';
import api from "@/utils/apiClient";

interface PunchListModalProps {
    open: boolean;
    onClose: () => void;
    project: CollectionSummary | null;
    onRefetch?: () => void;
}

const PunchListModal: React.FC<PunchListModalProps> = ({ open, onClose, project, onRefetch }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [mode, setMode] = useState<"view" | "create">("view");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (project) {
            if (project.hasPunchList) {
                setMode("view");
            } else {
                setMode("create");
            }
        }
    }, [project]);

    // Form fields
    const [notes, setNotes] = useState("");
    const [dueDate, setDueDate] = useState("");

    if (!project) return null;

    const punchListExists = project.hasPunchList; // 🆕 Use real project.hasPunchList


    const handleSubmit = async () => {
        if (!project?.opportunityId) {
            enqueueSnackbar("Missing Opportunity ID. Cannot create Punch List.", { variant: 'error' });
            return;
        }

        try {
            setIsSubmitting(true);

            const res = await api.post("/buildertrend/create-punchlist", {
                notes,
                dueDate,
                opportunityId: project.opportunityId,
            });

            const { shareableLink } = res.data;

            if (shareableLink) {
                enqueueSnackbar(
                    <span>
                        Punch List created!&nbsp;
                        <a
                            href={shareableLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#3b82f6",
                                textDecoration: "underline",
                                fontWeight: 500,
                            }}
                        >
                            View Punch List
                        </a>
                    </span>,
                    { variant: 'success' }
                );
            } else {
                enqueueSnackbar("Punch List created successfully!", { variant: 'success' });
            }

            if (onRefetch) {
                await onRefetch();
            }

            handleClose();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } } }; // safe cast
            const errorMessage = err?.response?.data?.error || "Unexpected error creating Punch List.";
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetForm = () => {
        setNotes("");
        setDueDate("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: '#0c111c',
                borderRadius: 3,
                border: "1px solid #374151",
                boxShadow: 24,
                p: 4,
                color: 'white',
            }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                    {project.projectNumber} Punch List
                </Typography>

                <Divider sx={{ mb: 2, borderColor: "#374151" }} />

                {/* 🆕 View Existing Punch List Info */}
                {punchListExists && mode === "view" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                                Link
                            </Typography>
                            {project.punchListLink ? (
                                <a
                                    href={project.punchListLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        color: "#3b82f6",
                                        textDecoration: "underline",
                                        fontWeight: 400,
                                    }}
                                >
                                    View Punch List
                                </a>
                            ) : (
                                <Typography variant="body2" sx={{ color: "white" }}>
                                    N/A
                                </Typography>
                            )}
                        </Box>
                        <TextField
                            label="Assignee"
                            value={project.punchListAssignee || "N/A"}
                            fullWidth
                            disabled
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    style: { color: 'white' },
                                },
                                inputLabel: {
                                    style: { color: 'white' }
                                }
                            }}
                            sx={{
                                border: "1px solid #374151",
                                "& .MuiInputBase-input.Mui-disabled": {
                                    color: "white",
                                    WebkitTextFillColor: "white", // Fix for Safari
                                    opacity: 1, // 🛠 Force full visibility
                                },
                                "& .MuiInputLabel-root.Mui-disabled": {
                                    color: "#9ca3af", // Label color for disabled fields
                                    opacity: 1, // Make sure label is visible too
                                },
                            }}
                        />
                        <TextField
                            label="Due Date"
                            value={project.punchListDueDate ? new Date(project.punchListDueDate).toLocaleDateString() : "N/A"}
                            fullWidth
                            disabled
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    style: { color: 'white' },
                                },
                                inputLabel: {
                                    style: { color: 'white' }
                                }
                            }}
                            sx={{
                                border: "1px solid #374151",
                                "& .MuiInputBase-input.Mui-disabled": {
                                    color: "white",
                                    WebkitTextFillColor: "white", // Fix for Safari
                                    opacity: 1, // 🛠 Force full visibility
                                },
                                "& .MuiInputLabel-root.Mui-disabled": {
                                    color: "#9ca3af", // Label color for disabled fields
                                    opacity: 1, // Make sure label is visible too
                                },
                            }}
                        />
                        <TextField
                            label="Notes"
                            value={project.punchListNotes || "N/A"}
                            fullWidth
                            multiline
                            rows={3}
                            disabled
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    style: { color: 'white' },
                                },
                                inputLabel: {
                                    style: { color: 'white' }
                                }

                            }}
                            sx={{
                                border: "1px solid #374151",
                                "& .MuiInputBase-input.Mui-disabled": {
                                    color: "white",
                                    WebkitTextFillColor: "white", // Fix for Safari
                                    opacity: 1, // 🛠 Force full visibility
                                },
                                "& .MuiInputLabel-root.Mui-disabled": {
                                    color: "#9ca3af", // Label color for disabled fields
                                    opacity: 1, // Make sure label is visible too
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Create Form Mode */}
                {mode === "create" && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Notes"
                            multiline
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            fullWidth
                            slotProps={{
                                input: {
                                    style: { color: 'white' },
                                },
                                inputLabel: {
                                    style: { color: '#9ca3af' }
                                }
                            }}
                            sx={{ border: "1px solid #374151" }}
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            fullWidth
                            slotProps={{
                                input: {
                                    style: { color: 'white' },
                                    onClick: (e: React.MouseEvent<HTMLInputElement>) => {
                                        (e.currentTarget as HTMLInputElement).showPicker?.();
                                    }
                                },
                                inputLabel: {
                                    shrink: true,
                                    style: { color: '#9ca3af' },
                                }
                            }}
                            sx={{
                                border: "1px solid #374151",
                                "& input[type='date']::-webkit-calendar-picker-indicator": {
                                    filter: "invert(1)", // 🛠 Invert the color: black → white
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !notes || !dueDate} // 🛠 disable if submitting or incomplete form
                            sx={{
                                backgroundColor: "#22c55e",
                                color: "white",
                                '&:hover': { backgroundColor: "#16a34a" },
                                textTransform: "none",
                                mt: 2,
                                opacity: isSubmitting ? 0.7 : 1, // little fade effect
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Punch List"
                            )}
                        </Button>
                    </Box>
                )}
            </Box>
        </Modal>
    );
};

export default PunchListModal;
