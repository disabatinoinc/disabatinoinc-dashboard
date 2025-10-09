// TeamupTemplateSkeleton.tsx
"use client";

import { Card, CardContent, Grid, Divider, Typography, Skeleton, Box } from "@mui/material";

function LabelSkeleton() {
    return <Skeleton variant="text" width={110} height={16} sx={{ bgcolor: "#1f2937" }} />;
}

function FieldSkeleton() {
    return (
        <Skeleton
            variant="rounded"
            height={40}
            sx={{ bgcolor: "#1f2937", border: "1px solid #374151", borderRadius: 1 }}
        />
    );
}

function SectionHeaderSkeleton({ width = 180 }: { width?: number }) {
    return <Skeleton variant="text" width={width} height={28} sx={{ bgcolor: "#1f2937" }} />;
}

function AccordionBarSkeleton() {
    return (
        <Card
            sx={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                color: "white",
            }}
        >
            <CardContent sx={{ py: 1.25 }}>
                <Skeleton variant="text" width="35%" height={20} sx={{ bgcolor: "#1f2937" }} />
            </CardContent>
        </Card>
    );
}

export default function TeamupTemplateSkeleton() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Summary Card */}
            <Card sx={{ backgroundColor: "#111827", border: "1px solid #374151", color: "white" }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <SectionHeaderSkeleton width={220} />

                    {/* Top summary grid (4 per row) */}
                    <Grid container spacing={2}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Grid key={`top-${i}`} item xs={12} md={3}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <LabelSkeleton />
                                    <FieldSkeleton />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2, borderColor: "#374151" }} />

                    {/* Sales Rep & PM */}
                    <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>
                        <Skeleton variant="text" width={230} height={24} sx={{ bgcolor: "#1f2937" }} />
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Grid key={`pm-${i}`} item xs={12} md={3}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <LabelSkeleton />
                                    <FieldSkeleton />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>

                    <Divider sx={{ my: 2, borderColor: "#374151" }} />

                    {/* Job Address */}
                    <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>
                        <Skeleton variant="text" width={140} height={24} sx={{ bgcolor: "#1f2937" }} />
                    </Typography>
                    <Grid container spacing={2}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Grid key={`addr-${i}`} item xs={12} md={3}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <LabelSkeleton />
                                    <FieldSkeleton />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Project Goals header */}
            <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
                <Skeleton variant="text" width={180} height={28} sx={{ bgcolor: "#1f2937" }} />
            </Typography>

            {/* Collapsible rows (accordion bars) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <AccordionBarSkeleton key={`goal-${i}`} />
                ))}
            </Box>
        </Box>
    );
}
