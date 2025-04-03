"use client";

import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import api from "@/utils/apiClient";
import { DonutSkeleton } from "./DonutSkeleton";
import SalesBarChartSkeleton from "./SalesBarChartSkeleton";

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
    const [loading, setLoading] = useState(true);
    const [targetData, setTargetData] = useState<any | null>(null);
    const fiscalYear = "2025"; // You can make this dynamic later

    useEffect(() => {
        setLoading(true);

        api.get(`/sales-targets/all?fiscalYear=${fiscalYear}`)
            .then((response) => {
                const data = response.data;
                setTargetData(data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const tiles = [
        { label: "Week to Date", key: "weekly" },
        { label: "Month to Date", key: "monthly" },
        { label: "Quarter to Date", key: "quarterly" },
        { label: "Year to Date", key: "yearly" },
    ];
    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white" }}>Sales Summary</Typography>
            <Typography variant="h6" sx={{ color: "#d1d5db" }}>Live sales data coming soon!</Typography>

            <Grid maxWidth="100%" container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <DonutSkeleton />
                        </Grid>
                    ))
                    : tiles.map(({ label, key }) => {
                        const data = targetData?.[key]?.[0]; // just use first target for now

                        if (!data) return null;

                        return (
                            <Grid key={label}>
                                <DonutChartTile
                                    label={label}
                                    actual={data.actualsSummary?.totalAmount || 0}
                                    target={data.targetAmount || 0}
                                />
                            </Grid>
                        );
                    })}
            </Grid>
            {loading ? <SalesBarChartSkeleton />
                :
                <SalesBarChart

                    data={{
                        WTD: targetData?.weekly?.[0]?.buckets || [],
                        MTD: targetData?.monthly?.[0]?.buckets || [],
                        QTD: targetData?.quarterly?.[0]?.buckets || [],
                        YTD: targetData?.yearly?.[0]?.buckets || [],
                    }} />}

        </Box>
    );
};

export default SalesSummary;
