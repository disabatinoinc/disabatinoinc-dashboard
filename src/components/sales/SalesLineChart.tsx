"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Dot,
    DotProps,
} from "recharts";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    CircularProgress,
} from "@mui/material";
import SalesLineChartTooltip from "./SalesLineChartTooltip";
import { getStartEndFromBucket } from "@/utils/getStartEndFromBucket";
import { api } from "@/utils/apiClient";

// Toggleable periods
type Period = "weekly" | "monthly" | "quarterly";

// Raw API types
interface WeeklyRecord {
    weekNumber: number;
    weekStartDate: string;
    weekEndDate: string;
    targetAmount: number;
    actualsSummary: { totalAmount: number };
}
interface MonthlyRecord {
    month: string;
    targetAmount: number;
    actualsSummary: { totalAmount: number };
}
interface QuarterlyRecord {
    quarter: string;            // e.g. "Q1 (Apr-Jun)"
    targetAmount: number;
    actualsSummary: { totalAmount: number };
}

interface ApiResponse {
    weekly: WeeklyRecord[];
    monthly: MonthlyRecord[];
    quarterly: QuarterlyRecord[];
}

// Unified chart point
type ChartPoint =
    | (WeeklyRecord & { label: string; bucketName: string; bucketType: Period })
    | (MonthlyRecord & { label: string; bucketName: string; bucketType: Period })
    | (QuarterlyRecord & { label: string; bucketName: string; bucketType: Period });

export default function SalesLineChartAllPeriods({
    fiscalYear,
}: {
    fiscalYear: string;
}) {
    const router = useRouter();
    const [period, setPeriod] = useState<Period>("weekly");
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);

    // fetch all periods once
    useEffect(() => {
        setLoading(true);
        api
            .get<{ data: ApiResponse }>("/sales-targets/all", {
                params: { fiscalYear, skipCache: true },
            })
            .then((res) => setData(res.data.data))
            .catch((err) => console.error("Error loading targets:", err))
            .finally(() => setTimeout(() => setLoading(false), 300));
    }, [fiscalYear]);

    // build chart data by narrowing on period
    let chartData: ChartPoint[] = [];
    if (data) {
        if (period === "weekly") {
            chartData = data.weekly.map((item) => ({
                ...item,
                label: `W${item.weekNumber}`,
                bucketName: item.weekStartDate,
                bucketType: "weekly",
            }));
        } else if (period === "monthly") {
            chartData = data.monthly.map((item) => ({
                ...item,
                label: item.month,
                bucketName: item.month,
                bucketType: "monthly",
            }));
        } else {
            chartData = data.quarterly.map((item) => ({
                ...item,
                label: item.quarter,
                bucketName: item.quarter,
                bucketType: "quarterly",
            }));
        }
    }

    // drilldown handler with logging and guard
    const handlePointClick = (payload: ChartPoint) => {
        const { bucketName, bucketType } = payload;
        try {
            const { startDate, endDate } = getStartEndFromBucket(
                { bucketName, bucketType },
                fiscalYear
            );
            router.push(`/sales/details?startDate=${startDate}&endDate=${endDate}`);
        } catch (err) {
            console.error("Error computing start/end dates:", err);
        }
    };

    return (
        <Card
            sx={{
                background:
                    "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "12px",
                p: 2,
                mt: 3,
            }}
        >
            <CardContent>
                <Box
                    sx={{
                        mb: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ textTransform: "uppercase", color: "#d1d5db" }}
                    >
                        YTD Sales vs Targets
                    </Typography>
                    <Box>
                        {(["weekly", "monthly", "quarterly"] as Period[]).map((p) => (
                            <Button
                                key={p}
                                size="small"
                                variant={period === p ? "contained" : "outlined"}
                                sx={{
                                    ml: p === "weekly" ? 0 : 1,
                                    color: period === p ? "white" : "#d1d5db",
                                    borderColor: "#374151",
                                }}
                                onClick={() => setPeriod(p)}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </Button>
                        ))}
                    </Box>
                </Box>

                {loading ? (
                    <Box textAlign="center" py={4}>
                        <CircularProgress color="inherit" />
                    </Box>
                ) : (
                    <Box sx={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="label" stroke="#d1d5db" />
                                <YAxis stroke="#d1d5db" />
                                <Tooltip
                                    content={<SalesLineChartTooltip />}
                                    cursor={{ stroke: "#374151", strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="actualsSummary.totalAmount"
                                    name="Actual Sales"
                                    stroke="#10b981"
                                    dot={(dotProps: DotProps & { payload?: ChartPoint }) => {
                                        const point = dotProps.payload as ChartPoint;
                                        return (
                                            <Dot
                                                {...dotProps}
                                                r={4}
                                                cursor="pointer"
                                                onClick={() => point && handlePointClick(point)}
                                            />
                                        );
                                    }}
                                    activeDot={(dotProps: DotProps & { payload?: ChartPoint }) => {
                                        const point = dotProps.payload as ChartPoint;
                                        return (
                                            <Dot
                                                {...dotProps}
                                                r={6}
                                                cursor="pointer"
                                                onClick={() => point && handlePointClick(point)}
                                            />
                                        );
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="targetAmount"
                                    name="Target"
                                    stroke="#6366f1"
                                    dot={(dotProps: DotProps & { payload?: ChartPoint }) => {
                                        const point = dotProps.payload as ChartPoint;
                                        return (
                                            <Dot
                                                {...dotProps}
                                                r={4}
                                                cursor="pointer"
                                                onClick={() => point && handlePointClick(point)}
                                            />
                                        );
                                    }}
                                    activeDot={(dotProps: DotProps & { payload?: ChartPoint }) => {
                                        const point = dotProps.payload as ChartPoint;
                                        return (
                                            <Dot
                                                {...dotProps}
                                                r={6}
                                                cursor="pointer"
                                                onClick={() => point && handlePointClick(point)}
                                            />
                                        );
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
