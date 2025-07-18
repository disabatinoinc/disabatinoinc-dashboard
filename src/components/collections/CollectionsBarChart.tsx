"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import {
    Card,
    CardContent,
    Typography,
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { fillWeeklyBuckets } from "@/utils/fillBuckets/fillWeeklyBuckets";
import { fillMonthlyBuckets } from "@/utils/fillBuckets/fillMonthlyBuckets";
import { fillQuarterlyBuckets } from "@/utils/fillBuckets/fillQuarterlyBuckets";
import { getFiscalQuarterLabel } from "@/utils/getFiscalQuarterLabel";
import { RevenueTargetBucket } from "@/types/collections";
import { fillYearlyBuckets } from "@/utils/fillBuckets/fillYearlyBuckets";
import CollectionsBarChartTooltip from "./CollectionsBarChartTooltip";
import { getStartEndFromBucket } from "@/utils/getStartEndFromBucket";

type CollectionsBarChartProps = {
    data: {
        WTD: RevenueTargetBucket[];
        MTD: RevenueTargetBucket[];
        QTD: RevenueTargetBucket[];
        YTD: RevenueTargetBucket[];
    };
};

const periods = [
    { label: "Week to Date", value: "WTD" },
    { label: "Month to Date", value: "MTD" },
    { label: "Quarter to Date", value: "QTD" },
    { label: "Year to Date", value: "YTD" },
];

const CollectionsBarChart: React.FC<CollectionsBarChartProps> = ({ data }) => {
    const router = useRouter();
    const [period, setPeriod] = useState<keyof typeof data>("WTD");

    const handleChange = (event: SelectChangeEvent) => {
        setPeriod(event.target.value as keyof typeof data);
    };

    const selectedData = data[period];
    const filledData = (() => {
        if (period === "WTD") {
            return fillWeeklyBuckets(selectedData);
        }

        if (period === "MTD") {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startDate = firstDayOfMonth.toISOString().split("T")[0];
            return fillMonthlyBuckets(selectedData, startDate);
        }

        if (period === "QTD") {
            const firstMonth = selectedData[0]?.bucketName;
            const quarterLabel = firstMonth ? getFiscalQuarterLabel(firstMonth) : "";
            if (quarterLabel) {
                return fillQuarterlyBuckets(selectedData, quarterLabel);
            }
        }

        if (period === "YTD") {
            return fillYearlyBuckets(selectedData);
        }

        return selectedData;
    })();

    const handleBarClick = (bucket: RevenueTargetBucket) => {
        if (!bucket.bucketName || !bucket.bucketType) return;

        const { startDate, endDate } = getStartEndFromBucket(bucket, "2025");
        router.push(`/collections/details?startDate=${startDate}&endDate=${endDate}&type=Payment`);
    };

    return (
        <Card
            sx={{
                background: "linear-gradient(to bottom right, #121929 0%, #0c111c 50%, #000000 100%)",
                color: "white",
                border: "1px solid #374151",
                borderRadius: "12px",
                padding: 2,
                mt: 3,
            }}
        >
            <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ textTransform: "uppercase", color: "#d1d5db" }}>
                        Collections by Period
                    </Typography>
                    <Select
                        value={period}
                        onChange={handleChange}
                        size="small"
                        sx={{
                            color: "#d1d5db",
                            minWidth: 180,
                            ".MuiOutlinedInput-notchedOutline": {
                                borderColor: "#374151",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "white",
                            },
                            "& .MuiSvgIcon-root": {
                                color: "#d1d5db",
                            },
                        }}
                    >
                        {periods.map((p) => (
                            <MenuItem key={p.value} value={p.value}>
                                {p.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>

                <Box sx={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filledData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="label" stroke="#d1d5db" />
                            <YAxis stroke="#d1d5db" />
                            <Tooltip
                                content={<CollectionsBarChartTooltip />}
                                cursor={{ fill: "#374151" }}
                            />
                            <Bar
                                dataKey="totalAmount"
                                fill="#10b981"
                                radius={[4, 4, 0, 0]}
                                onClick={({ payload }) => handleBarClick(payload)}
                                cursor="pointer"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CollectionsBarChart;
