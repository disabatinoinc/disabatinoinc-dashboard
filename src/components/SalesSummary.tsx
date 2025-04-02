"use client";

import React from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";

const DonutChartTile = dynamic(() => import("@/components/DonutChartTile"), {
    ssr: false,
});

const SalesBarChart = dynamic(() => import("@/components/SalesBarChart"), {
    ssr: false,
});

const salesData = [
    { label: "Week to Date", actual: 25000, target: 50000 },
    { label: "Month to Date", actual: 110000, target: 200000 },
    { label: "Quarter to Date", actual: 320000, target: 500000 },
    { label: "Year to Date", actual: 870000, target: 1200000 },
];

const SalesSummary = () => {
    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white" }}>Sales Summary</Typography>

            <Grid maxWidth="100%" container spacing={2} marginTop={2} justifyContent="space-between">
                {salesData.map((item) => (
                    <Grid key={item.label}>
                        <DonutChartTile {...item} />
                    </Grid>
                ))}
            </Grid>
            <SalesBarChart />
        </Box>
    );
};

export default SalesSummary;
