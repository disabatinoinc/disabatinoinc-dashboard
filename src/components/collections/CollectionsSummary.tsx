"use client";

import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import {
    findCurrentWeeklyTarget,
    findCurrentMonthlyTarget,
    findCurrentQuarterlyTarget,
    findCurrentYearlyTarget
} from "@/utils/selectCurrentRevenueTarget";
import { DonutSkeleton } from "../shared/DonutSkeleton";
import CollectionsBarChartSkeleton from "../collections/CollectionsBarChartSkeleton";
import { RevenueTargetSummary, RevenueTargetWithActuals, TargetPeriodKey } from "@/types/collections";
import { api } from "@/utils/apiClient";

// Lazy load charts
const DonutChartTile = dynamic(() => import("@/components/shared/DonutChartTile"), {
    ssr: false,
});
const CollectionsBarChart = dynamic(() => import("@/components/collections/CollectionsBarChart"), {
    ssr: false,
});

const CollectionsSummary = () => {
    const [loading, setLoading] = useState(true);
    const [targetData, setTargetData] = useState<RevenueTargetSummary | null>(null);

    const fiscalYear = "2025"; // You can make this dynamic later

    useEffect(() => {
        setLoading(true);

        api.get(`/revenue-targets/all?fiscalYear=${fiscalYear}`)
            .then((response) => {
                const data = response.data;
                setTargetData(data.data); // normalized structure: { weekly, monthly, quarterly, yearly }
                setTimeout(() => {
                    setLoading(false);
                }, 800); // optional delay for animation/setup
            })
            .catch((error) => {
                console.error("Error fetching revenue target data:", error);
                setLoading(false);
            });
    }, []);

    const tiles: { label: string; key: TargetPeriodKey }[] = [
        { label: "Week to Date", key: "weekly" },
        { label: "Month to Date", key: "monthly" },
        { label: "Quarter to Date", key: "quarterly" },
        { label: "Year to Date", key: "yearly" },
    ];

    return (
        <Box>
            <Typography variant="h4" sx={{ color: "white" }}>Collections Summary</Typography>

            <Grid maxWidth="100%" container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <DonutSkeleton />
                        </Grid>
                    ))
                    : tiles.map(({ label, key }) => {
                        let data: RevenueTargetWithActuals | undefined;

                        switch (key) {
                            case "weekly":
                                data = targetData?.weekly && findCurrentWeeklyTarget(targetData.weekly);
                                break;
                            case "monthly":
                                data = targetData?.monthly && findCurrentMonthlyTarget(targetData.monthly);
                                break;
                            case "quarterly":
                                data = targetData?.quarterly && findCurrentQuarterlyTarget(targetData.quarterly);
                                break;
                            case "yearly":
                                data = targetData?.yearly && findCurrentYearlyTarget(targetData.yearly);
                                break;
                        }

                        if (!data) return null;

                        return (
                            <Grid key={label}>
                                <DonutChartTile
                                    label={label}
                                    actual={data.actualsSummary?.totalAmount || 0}
                                    target={data.targetAmount || 0}
                                    paidLabelOverride="Collected"
                                    unpaidLabelOverride="Remaining"
                                />
                            </Grid>
                        );
                    })}
            </Grid>

            {loading ? (
                <CollectionsBarChartSkeleton />
            ) : (
                <CollectionsBarChart
                    data={{
                        WTD: targetData?.weekly && findCurrentWeeklyTarget(targetData?.weekly)?.buckets || [],
                        MTD: targetData?.monthly && findCurrentMonthlyTarget(targetData?.monthly)?.buckets || [],
                        QTD: targetData?.quarterly && findCurrentQuarterlyTarget(targetData?.quarterly)?.buckets || [],
                        YTD: targetData?.yearly && findCurrentYearlyTarget(targetData?.yearly)?.buckets || [],
                    }}
                />
            )}
        </Box>
    );
};

export default CollectionsSummary;
