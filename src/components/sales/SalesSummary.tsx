"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid2';
import { Typography, Box, Button } from "@mui/material";
import dynamic from "next/dynamic";
import { api } from "@/utils/apiClient";
import { DonutSkeleton } from "../shared/DonutSkeleton";
import SalesBarChartSkeleton from "./SalesBarChartSkeleton";
import { SalesTargetSummary, SalesTargetWithActuals } from "@/types/sales";
import {
    findCurrentWeeklyTarget,
    findCurrentMonthlyTarget,
    findCurrentQuarterlyTarget,
    findCurrentYearlyTarget
} from "@/utils/selectCurrentSalesTarget";
import { getStartEndFromTarget } from "@/utils/getStartEndFromTarget";
import { TargetPeriodKey } from "@/types/shared";

const DonutChartTile = dynamic(() => import("@/components/shared/DonutChartTile"), {
    ssr: false,
});

const SalesBarChart = dynamic(() => import("@/components/sales/SalesBarChart"), {
    ssr: false,
});

const SalesSummary = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [targetData, setTargetData] = useState<SalesTargetSummary | null>(null);
    const fiscalYear = "2025"; // You can make this dynamic later

    const fetchData = () => {
        setLoading(true);

        api.get(`/sales-targets/all`, {
            params: {
                fiscalYear,
                skipCache: true
            }
        })
            .then((response) => {
                const data = response.data;
                setTargetData(data.data);
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const tiles: { label: string; key: TargetPeriodKey }[] = [
        { label: "Week to Date", key: "weekly" },
        { label: "Month to Date", key: "monthly" },
        { label: "Quarter to Date", key: "quarterly" },
        { label: "Year to Date", key: "yearly" },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" sx={{ color: "white" }}>
                    Sales Summary
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={fetchData}
                    sx={{
                        color: "#d1d5db",
                        borderColor: "#374151",
                        '&:hover': { borderColor: "#6b7280", backgroundColor: "#1f2937" },
                        textTransform: "none",
                        fontSize: "0.75rem",
                        display: {
                            xs: "none",
                            sm: "inline-flex",
                        },
                    }}
                >
                    Refresh
                </Button>
            </Box>

            <Grid maxWidth="100%" container spacing={2} marginTop={2} justifyContent="space-between">
                {loading
                    ? Array.from({ length: 4 }).map((_, idx) => (
                        <Grid key={idx}>
                            <DonutSkeleton />
                        </Grid>
                    ))
                    : tiles.map(({ label, key }) => {
                        let data: SalesTargetWithActuals | undefined;

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
                                    actualOnClick={() => {
                                        const { startDate, endDate } = getStartEndFromTarget(data, fiscalYear); // your helper
                                        router.push(`/sales/details?startDate=${startDate}&endDate=${endDate}`);
                                    }}
                                />
                            </Grid>
                        );
                    })}
            </Grid>
            {loading ? <SalesBarChartSkeleton />
                :
                <SalesBarChart

                    data={{
                        WTD: targetData?.weekly && findCurrentWeeklyTarget(targetData?.weekly)?.buckets || [],
                        MTD: targetData?.monthly && findCurrentMonthlyTarget(targetData?.monthly)?.buckets || [],
                        QTD: targetData?.quarterly && findCurrentQuarterlyTarget(targetData?.quarterly)?.buckets || [],
                        YTD: targetData?.yearly && findCurrentYearlyTarget(targetData?.yearly)?.buckets || [],
                    }} />}

        </Box>
    );
};

export default SalesSummary;
