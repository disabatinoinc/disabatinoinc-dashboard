'use client';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Box,
    IconButton,
    Tooltip,
    Divider,
    Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { TeamupGoal } from "@/types/TeamupTemplate";
import ProposalNotesDrawer from "./TeamupTemplateProposalNotesDrawer";
import { formatCurrency } from "@/utils/formatters";

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
                    <IconButton size="small" onClick={handleCopy} sx={{ color: "#9ca3af" }}>
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}

export function ProjectGoalAccordion({ goal }: { goal: TeamupGoal }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <>
            <Accordion
                sx={{ backgroundColor: "#111827", border: "1px solid #374151", color: "white" }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#9ca3af" }} />}>
                    <Typography sx={{ fontWeight: 500 }}>{goal.name}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    {/* ——— Core Info ——— */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <CopyBlock label="Project Number" value={goal.projectNumber} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <CopyBlock label="PG Number" value={goal.pgNumber} />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <CopyBlock
                                label="Total Labor Hours"
                                value={goal.totalLaborHours?.toString()}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'flex-start',
                            }}
                        >
                            {/* Proposal Notes trigger */}
                            {goal.proposalNotes && (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setDrawerOpen(true)}
                                        sx={{
                                            color: '#d1d5db',
                                            borderColor: '#374151',
                                            textTransform: 'none',
                                            '&:hover': { backgroundColor: '#1f2937', borderColor: '#6b7280' },
                                        }}
                                    >
                                        Open Proposal Notes
                                    </Button>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {/* ——— Crews Section ——— */}
                    {(goal.projectGoalCrews?.length ||
                        goal.teamupCrewEventSuggestions ||
                        goal.laborOpportunityItems?.length) && (
                            <Box sx={{ mt: 2 }}>
                                <Divider sx={{ mb: 1.5, borderColor: "#374151" }} />
                                <Typography variant="subtitle2" sx={{ color: "#d1d5db", mb: 1 }}>
                                    Crews
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 1 }}>
                                    {goal.projectGoalCrews?.length ? (
                                        <Grid item xs={12}>
                                            <CopyBlock
                                                label="Assigned Crews"
                                                value={goal.projectGoalCrews.join(", ")}
                                            />
                                        </Grid>
                                    ) : null}

                                    {goal.teamupCrewEventSuggestions ? (
                                        <Grid item xs={12}>
                                            <CopyBlock
                                                label="Teamup Crew Suggestion"
                                                value={goal.teamupCrewEventSuggestions}
                                            />
                                        </Grid>
                                    ) : null}
                                </Grid>

                                {/* Labor Breakdown Table */}
                                {goal.laborOpportunityItems?.length ? (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ color: "#d1d5db", mb: 1 }}
                                        >
                                            Labor Breakdown
                                        </Typography>

                                        <Box
                                            sx={{
                                                border: "1px solid #374151",
                                                borderRadius: 1,
                                                overflow: "hidden",
                                                backgroundColor: "#0f172a",
                                            }}
                                        >
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr
                                                        style={{
                                                            background: "#111827",
                                                            color: "#9ca3af",
                                                            textAlign: "left",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        <th style={{ padding: "10px 12px", width: "55%" }}>Product</th>
                                                        <th style={{ padding: "10px 12px", width: "25%" }}>Crews</th>
                                                        <th style={{ padding: "10px 12px", width: "10%" }}>Qty</th>
                                                        <th style={{ padding: "10px 12px", width: "10%" }}>Unit</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(goal.laborOpportunityItems ?? []).map((item) => {
                                                        const unit = item.orderUnit || item.estimatedByUnit || "";
                                                        return (
                                                            <tr
                                                                key={item.id}
                                                                style={{
                                                                    borderTop: "1px solid #1f2937",
                                                                    color: "#e5e7eb",
                                                                    fontSize: 13,
                                                                }}
                                                            >
                                                                <td style={{ padding: "10px 12px" }}>
                                                                    {item.productName || item.name || "—"}
                                                                </td>
                                                                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                                                                    {item.crews?.length ? item.crews.join(", ") : "—"}
                                                                </td>
                                                                <td style={{ padding: "10px 12px" }}>
                                                                    {typeof item.orderQty === "number" ? item.orderQty : "—"}
                                                                </td>
                                                                <td style={{ padding: "10px 12px" }}>{unit || "—"}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </Box>
                                    </Box>
                                ) : null}
                            </Box>
                        )}


                    {/* ——— Subcontractors Section ——— */}
                    {((goal.projectGoalSubs?.length ?? 0) > 0 ||
                        (goal.teamupSubEventSuggestions?.length ?? 0) > 0 ||
                        (goal.subcontractorOpportunityItems?.length ?? 0) > 0) && (
                            <Box sx={{ mt: 2 }}>
                                <Divider sx={{ mb: 1.5, borderColor: "#374151" }} />
                                <Typography variant="subtitle2" sx={{ color: "#d1d5db", mb: 1 }}>
                                    Subcontractors
                                </Typography>

                                <Grid container spacing={2}>
                                    {(goal.projectGoalSubs?.length ?? 0) > 0 && (
                                        <Grid item xs={12}>
                                            <CopyBlock
                                                label="Assigned Subs"
                                                value={(goal.projectGoalSubs ?? []).join(", ")}
                                            />
                                        </Grid>
                                    )}

                                    {(goal.teamupSubEventSuggestions?.length ?? 0) > 0 &&
                                        (goal.teamupSubEventSuggestions ?? []).map((sub, idx) => (
                                            <Grid item xs={12} key={idx}>
                                                <CopyBlock
                                                    label={`Teamup Sub Suggestion ${idx + 1}`}
                                                    value={sub}
                                                />
                                            </Grid>
                                        ))}
                                </Grid>

                                {/* Subcontractor Breakdown Table */}
                                {(goal.subcontractorOpportunityItems?.length ?? 0 > 0) && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            border: "1px solid #374151",
                                            borderRadius: 1,
                                            overflowX: "auto",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 150px 150px",
                                                px: 2,
                                                py: 1,
                                                backgroundColor: "#1f2937",
                                                borderBottom: "1px solid #374151",
                                            }}
                                        >
                                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                                Product
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                                Proposed Cost
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                                                Proposed Price
                                            </Typography>
                                        </Box>

                                        {(goal.subcontractorOpportunityItems ?? []).map((item, idx) => (
                                            <Box
                                                key={idx}
                                                sx={{
                                                    display: "grid",
                                                    gridTemplateColumns: "1fr 150px 150px",
                                                    px: 2,
                                                    py: 1,
                                                    borderBottom: "1px solid #374151",
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ color: "white" }}>
                                                    {item.productName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "white" }}>
                                                    {formatCurrency(item.totalProposedMaterialCost ?? 0)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "white" }}>
                                                    {formatCurrency(item.proposedPrice ?? 0)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}
                </AccordionDetails>
            </Accordion>
            {/* Drawer */}
            <ProposalNotesDrawer
                open={!!drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={`Proposal Notes — ${goal.name}`}
                html={goal.proposalNotes || ''}
            />
        </>
    );
}
