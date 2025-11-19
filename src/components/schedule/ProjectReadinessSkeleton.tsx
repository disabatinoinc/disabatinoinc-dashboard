"use client";

import {
    Card,
    CardContent,
    Grid,
    Divider,
    Typography,
    Skeleton,
    Box,
} from "@mui/material";

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

function AccordionBarSkeleton() {
    return (
        <Card
            sx={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                color: "white",
                borderRadius: 2,
            }}
        >
            <CardContent sx={{ py: 1.25 }}>
                <Skeleton
                    variant="text"
                    width="40%"
                    height={22}
                    sx={{ bgcolor: "#1f2937" }}
                />
            </CardContent>
        </Card>
    );
}

export default function ProjectReadinessSkeleton() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "1200px" }}>

            {/* PROJECT SUMMARY ACCORDION */}
            <Card
                sx={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    color: "white",
                    borderRadius: 2,
                }}
            >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    {/* Accordion Bar Placeholder */}
                    <Skeleton
                        variant="text"
                        height={28}
                        sx={{ bgcolor: "#1f2937" }}
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <LabelSkeleton />
                                <FieldSkeleton />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Address */}
                    <Divider sx={{ borderColor: "#374151", my: 1.5 }} />
                    <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>
                        <Skeleton variant="text" width={160} height={24} sx={{ bgcolor: "#1f2937" }} />
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                <LabelSkeleton />
                                <FieldSkeleton />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Contacts */}
                    <Divider sx={{ borderColor: "#374151", my: 1.5 }} />
                    <Typography variant="subtitle1" sx={{ color: "#d1d5db" }}>
                        <Skeleton variant="text" width={200} height={24} sx={{ bgcolor: "#1f2937" }} />
                    </Typography>

                    <Grid container spacing={2}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Grid key={`contacts-${i}`} item xs={12} md={4}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <LabelSkeleton />
                                    <FieldSkeleton />
                                    <Box mt={1}>
                                        <FieldSkeleton />
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* READINESS SCORE SECTION */}
            <Card sx={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 2 }}>
                <CardContent>
                    <Skeleton variant="text" width={180} height={26} sx={{ bgcolor: "#1f2937" }} />

                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" height={28} sx={{ bgcolor: "#1f2937" }} />
                        <Skeleton
                            variant="text"
                            width={130}
                            height={20}
                            sx={{ bgcolor: "#1f2937", mt: 1 }}
                        />
                    </Box>
                </CardContent>
            </Card>

            {/* MISSING ITEMS SECTION */}
            <Card sx={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 2 }}>
                <CardContent>
                    <Skeleton variant="text" width={220} height={24} sx={{ bgcolor: "#1f2937" }} />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                            key={`missing-${i}`}
                            variant="text"
                            width={180}
                            height={18}
                            sx={{ bgcolor: "#1f2937", mt: 1 }}
                        />
                    ))}
                </CardContent>
            </Card>

            {/* DOCUMENT ACCORDIONS */}
            <Typography variant="h6" sx={{ mt: 2, color: "white" }}>
                <Skeleton variant="text" width={200} height={28} sx={{ bgcolor: "#1f2937" }} />
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <AccordionBarSkeleton key={`doc-${i}`} />
                ))}
            </Box>
        </Box>
    );
}
