"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { TargetBucket } from "@/types/sales";

type CustomTooltipProps = {
    active?: boolean;
    payload?: {
        payload: TargetBucket;
    }[];
    label?: string;
};

const SalesBarChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const { totalAmount, recordCount } = payload[0].payload;

    return (
        <Box
            sx={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: 1,
                p: 1.5,
                color: "white",
            }}
        >
            <Typography variant="subtitle2" sx={{ color: "#d1d5db" }}>
                {label}
            </Typography>
            <Typography variant="body2">
                {recordCount} {recordCount === 1 ? "contract" : "contracts"}
            </Typography>
            <Typography variant="body2">
                ${totalAmount.toLocaleString()}
            </Typography>
        </Box>
    );
};

export default SalesBarChartTooltip;
